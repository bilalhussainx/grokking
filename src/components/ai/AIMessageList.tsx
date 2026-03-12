"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAIChat } from "@/hooks/useAIChat";

export default function AIMessageList() {
  const { messages, isStreaming } = useAIChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Deduplicate: keep only last message per ID
  const deduped = messages.reduce((acc, msg) => {
    const idx = acc.findIndex((m) => m.id === msg.id);
    if (idx >= 0) {
      acc[idx] = msg;
    } else {
      acc.push(msg);
    }
    return acc;
  }, [] as typeof messages);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 min-h-0">
      {deduped.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center mb-3">
            <Sparkles className="w-6 h-6 text-blue-400" />
          </div>
          <h4 className="text-sm font-medium text-[var(--foreground)] mb-1">
            How can I help?
          </h4>
          <p className="text-xs text-[var(--muted-foreground)] max-w-[240px]">
            Ask me about this lesson, request hints, or discuss concepts. I&apos;m here to help you learn.
          </p>
        </div>
      ) : (
        deduped.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {/* Avatar */}
            <div
              className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${
                msg.role === "assistant"
                  ? "bg-gradient-to-br from-blue-500/20 to-violet-500/20"
                  : "bg-white/[0.08]"
              }`}
            >
              {msg.role === "assistant" ? (
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              ) : (
                <User className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-[80%] rounded-xl px-3 py-2 text-[13px] leading-relaxed ${
                msg.role === "user"
                  ? "bg-blue-500/15 text-blue-50 rounded-tr-sm"
                  : "bg-white/[0.05] text-[var(--foreground)] rounded-tl-sm border border-white/[0.06]"
              }`}
            >
              {msg.role === "assistant" ? (
                <div className="prose prose-sm prose-invert max-w-none [&_p]:my-1 [&_code]:text-blue-300 [&_code]:bg-white/[0.08] [&_code]:px-1 [&_code]:rounded [&_pre]:bg-black/30 [&_pre]:rounded-lg [&_pre]:p-2 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content || "..."}
                  </ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </motion.div>
        ))
      )}

      {/* Streaming Indicator */}
      {isStreaming && (
        <div className="flex items-center gap-1 px-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse [animation-delay:150ms]" />
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse [animation-delay:300ms]" />
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
