"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Sparkles } from "lucide-react";
import { useAI } from "@/contexts/AIContext";
import AIAgentHeader from "./AIAgentHeader";
import AIMessageList from "./AIMessageList";
import AIAgentInput from "./AIAgentInput";

export default function AITeachingAgent() {
  const { isPanelOpen, togglePanel, lessonContext } = useAI();
  const [hasUnread, setHasUnread] = useState(false);

  if (!lessonContext) return null;

  return (
    <>
      {/* Floating Toggle Button */}
      <AnimatePresence>
        {!isPanelOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => {
              togglePanel();
              setHasUnread(false);
            }}
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200"
          >
            <Sparkles className="w-6 h-6" />
            {hasUnread && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-[var(--background)] animate-pulse" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] h-[560px] flex flex-col rounded-2xl overflow-hidden border border-white/[0.1] bg-[#0a0e1a]/90 backdrop-blur-2xl shadow-2xl shadow-black/40"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-white/[0.03]">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--foreground)]">AI Tutor</h3>
                  <p className="text-[10px] text-[var(--muted-foreground)]">
                    {lessonContext.lessonTitle}
                  </p>
                </div>
              </div>
              <button
                onClick={togglePanel}
                className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:bg-white/[0.06] hover:text-[var(--foreground)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Selector */}
            <AIAgentHeader />

            {/* Messages */}
            <AIMessageList />

            {/* Input */}
            <AIAgentInput />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
