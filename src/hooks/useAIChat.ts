"use client";

import { useCallback } from "react";
import { useAI } from "@/contexts/AIContext";
import { AIMessage } from "@/types/ai";

export function useAIChat() {
  const {
    messages, addMessage, clearMessages,
    isStreaming, setIsStreaming,
    mode, lessonContext, currentCode,
  } = useAI();

  const sendMessage = useCallback(async (text: string) => {
    if (!lessonContext || isStreaming) return;

    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: Date.now(),
    };
    addMessage(userMsg);

    const assistantId = `assistant-${Date.now()}`;
    const assistantMsg: AIMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: Date.now(),
    };
    addMessage(assistantMsg);
    setIsStreaming(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          mode,
          lessonTitle: lessonContext.lessonTitle,
          lessonContent: lessonContext.lessonContent,
          moduleTitle: lessonContext.moduleTitle,
          courseTitle: lessonContext.courseTitle,
          currentCode: currentCode || undefined,
          history,
        }),
      });

      if (!res.ok) throw new Error("Chat request failed");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        accumulated += decoder.decode(value, { stream: true });

        // Update the assistant message in place
        addMessage({
          ...assistantMsg,
          content: accumulated,
        });
      }
    } catch (err) {
      addMessage({
        ...assistantMsg,
        content: "Sorry, I encountered an error. Please try again.",
      });
      console.error("AI Chat error:", err);
    } finally {
      setIsStreaming(false);
    }
  }, [messages, addMessage, setIsStreaming, isStreaming, mode, lessonContext, currentCode]);

  return { messages, sendMessage, clearMessages, isStreaming };
}
