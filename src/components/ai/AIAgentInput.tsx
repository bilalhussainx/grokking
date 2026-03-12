"use client";

import { useState, useRef, useCallback } from "react";
import { Send, Loader2, Trash2 } from "lucide-react";
import { useAIChat } from "@/hooks/useAIChat";

export default function AIAgentInput() {
  const [input, setInput] = useState("");
  const { sendMessage, clearMessages, isStreaming } = useAIChat();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text || isStreaming) return;
    setInput("");
    sendMessage(text);
    if (inputRef.current) {
      inputRef.current.style.height = "40px";
    }
  }, [input, isStreaming, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "40px";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  return (
    <div className="border-t border-white/[0.06] bg-white/[0.02] p-3">
      <div className="flex items-end gap-2">
        <button
          onClick={clearMessages}
          className="flex-shrink-0 p-2 rounded-lg text-[var(--muted-foreground)] hover:bg-white/[0.06] hover:text-[var(--foreground)] transition-colors"
          title="Clear chat"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <textarea
          ref={inputRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about this lesson..."
          rows={1}
          className="flex-1 resize-none bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2.5 text-[13px] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/60 focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-all"
          style={{ height: "40px" }}
        />

        <button
          onClick={handleSend}
          disabled={!input.trim() || isStreaming}
          className={`flex-shrink-0 p-2 rounded-xl transition-all duration-200 ${
            input.trim() && !isStreaming
              ? "bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-md shadow-blue-500/20 hover:shadow-blue-500/30"
              : "bg-white/[0.05] text-[var(--muted-foreground)] cursor-not-allowed"
          }`}
        >
          {isStreaming ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
