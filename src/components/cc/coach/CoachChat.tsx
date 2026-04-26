"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff } from "lucide-react";
import { useCoachKairos } from "@/contexts/CoachKairosContext";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import CoachMessage from "./CoachMessage";

export default function CoachChat() {
  const { messages, sendMessage, isStreaming, isLoading, language } = useCoachKairos();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isListening, interim, supported, start, stop } = useSpeechToText(language);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isListening) stop();
    const text = input.trim();
    if (!text || isStreaming) return;
    setInput("");
    await sendMessage(text);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  function handleMicClick() {
    if (isListening) {
      stop();
      return;
    }
    start((finalText) => {
      // Auto-send when voice input ends so the user doesn't have to press
      // Send after speaking. Combines anything they had typed before tapping
      // mic with the transcript, then dispatches in one go.
      setInput((prev) => {
        const combined = (prev ? `${prev} ${finalText}` : finalText).trim();
        if (combined && !isStreaming) {
          // Defer send by a tick so React commits the cleared input first.
          setTimeout(() => {
            void sendMessage(combined);
          }, 0);
          return "";
        }
        return combined;
      });
    });
  }

  const displayValue = isListening && interim ? (input ? `${input} ${interim}` : interim) : input;

  return (
    <>
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-[#D4AF37]" />
          </div>
        )}

        {!isLoading && messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-white/30 text-sm">Coach Kairos is ready to help.</p>
            <p className="text-white/20 text-xs mt-1">Type or tap the mic to speak.</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <CoachMessage
            key={msg.id}
            role={msg.role}
            content={msg.content}
            isStreaming={isStreaming && i === messages.length - 1 && msg.role === "assistant"}
          />
        ))}
      </div>

      {isListening && (
        <div className="mx-4 mb-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/25 text-[11px] text-rose-300 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
          Listening… tap mic to stop
        </div>
      )}

      <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-white/10 shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            dir="auto"
            value={displayValue}
            onChange={(e) => {
              if (isListening) return;
              setInput(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening…" : "Ask Coach Kairos…"}
            disabled={isStreaming}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
          />

          {supported !== false && (
            <button
              type="button"
              onClick={handleMicClick}
              disabled={isStreaming}
              title={isListening ? "Stop listening" : "Speak to Coach Kairos"}
              className={`px-3 py-2.5 rounded-xl border transition-all disabled:opacity-40 ${
                isListening
                  ? "bg-rose-500/15 border-rose-500/40 text-rose-300 hover:bg-rose-500/20"
                  : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}

          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="px-3 py-2.5 rounded-xl bg-[#D4AF37] text-black disabled:opacity-40 transition-all hover:bg-[#C4A030]"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </>
  );
}
