"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { AIMode, AIMessage, LessonContext } from "@/types/ai";

interface AIContextValue {
  // Chat state
  messages: AIMessage[];
  addMessage: (msg: AIMessage) => void;
  clearMessages: () => void;
  isStreaming: boolean;
  setIsStreaming: (v: boolean) => void;

  // Mode
  mode: AIMode;
  setMode: (m: AIMode) => void;

  // Panel visibility
  isPanelOpen: boolean;
  togglePanel: () => void;
  openPanel: () => void;
  closePanel: () => void;

  // Lesson context
  lessonContext: LessonContext | null;
  setLessonContext: (ctx: LessonContext | null) => void;

  // Current code in IDE
  currentCode: string;
  setCurrentCode: (code: string) => void;
}

const AICtx = createContext<AIContextValue | null>(null);

export function AIProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [mode, setMode] = useState<AIMode>("tutor");
  const [isPanelOpen, setIsPanelOpen] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('coach-panel-open') === 'true';
    return false;
  });
  const [lessonContext, setLessonContext] = useState<LessonContext | null>(null);
  const [currentCode, setCurrentCode] = useState("");

  const addMessage = useCallback((msg: AIMessage) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const clearMessages = useCallback(() => setMessages([]), []);
  const togglePanel = useCallback(() => setIsPanelOpen((p) => {
    const next = !p;
    localStorage.setItem('coach-panel-open', String(next));
    return next;
  }), []);
  const openPanel = useCallback(() => {
    setIsPanelOpen(true);
    localStorage.setItem('coach-panel-open', 'true');
  }, []);
  const closePanel = useCallback(() => {
    setIsPanelOpen(false);
    localStorage.setItem('coach-panel-open', 'false');
  }, []);

  return (
    <AICtx.Provider
      value={{
        messages, addMessage, clearMessages,
        isStreaming, setIsStreaming,
        mode, setMode,
        isPanelOpen, togglePanel, openPanel, closePanel,
        lessonContext, setLessonContext,
        currentCode, setCurrentCode,
      }}
    >
      {children}
    </AICtx.Provider>
  );
}

export function useAI() {
  const ctx = useContext(AICtx);
  if (!ctx) throw new Error("useAI must be used within AIProvider");
  return ctx;
}
