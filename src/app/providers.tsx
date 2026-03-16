"use client";

import { useState } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { AIProvider, useAI } from "@/contexts/AIContext";
import AICoach from "@/components/ai/AICoach";
import { TranslationBar } from "@/components/language/TranslationBar";
import {
  GraduationCap, X, ChevronDown, ChevronUp,
  Lightbulb, MessageCircle, Trophy, Mic, Send,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Coach Top Bar — replaces the old right-side panel.
 * Sits below TopNav as a thin 44px bar. Expands downward to show full chat.
 */
function CoachTopBar() {
  const { isPanelOpen, closePanel, lessonContext } = useAI();
  const [expanded, setExpanded] = useState(false);

  if (!isPanelOpen) return null;

  return (
    <div className="fixed top-14 left-0 right-0 z-40">
      {/* Collapsed bar — always visible when coach is open */}
      <div className="h-11 bg-[var(--background)]/95 backdrop-blur-xl border-b border-white/[0.06] flex items-center px-3 gap-2">
        {/* Coach identity */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-xs shrink-0 shadow-lg shadow-blue-500/20">
            🎓
          </div>
          <div className="hidden sm:block min-w-0">
            <span className="text-xs font-semibold text-white">Coach Alex</span>
            {lessonContext && (
              <span className="text-[10px] text-white/30 ml-2 truncate">
                {lessonContext.lessonTitle}
              </span>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-white/[0.08] hidden sm:block" />

        {/* Quick actions — always visible in the bar */}
        <div className="flex items-center gap-1">
          <button
            className="px-2.5 py-1 bg-violet-500/15 hover:bg-violet-500/25 text-violet-400 rounded-md flex items-center gap-1 transition-colors text-[11px] font-semibold"
            onClick={() => {
              setExpanded(true);
              // Dispatch hint action — AICoach handles it internally
              window.dispatchEvent(new CustomEvent('coach:hint'));
            }}
          >
            <Lightbulb className="w-3 h-3" />
            <span className="hidden md:inline">Hint</span>
          </button>
          <button
            className="px-2.5 py-1 bg-white/[0.04] hover:bg-white/[0.08] text-white/50 hover:text-white/70 rounded-md flex items-center gap-1 transition-colors text-[11px] font-medium"
            onClick={() => {
              setExpanded(true);
              window.dispatchEvent(new CustomEvent('coach:explain'));
            }}
          >
            <MessageCircle className="w-3 h-3" />
            <span className="hidden md:inline">Explain</span>
          </button>
          <button
            className="px-2.5 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 rounded-md flex items-center gap-1 transition-colors text-[11px] font-semibold"
            onClick={() => {
              setExpanded(true);
              window.dispatchEvent(new CustomEvent('coach:celebrate'));
            }}
          >
            <Trophy className="w-3 h-3" />
            <span className="hidden md:inline">Solved!</span>
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-white/[0.08]" />

        {/* Voice toggle */}
        <button
          className="px-2.5 py-1 bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 rounded-md flex items-center gap-1 transition-colors text-[11px] font-medium"
          onClick={() => {
            setExpanded(true);
            window.dispatchEvent(new CustomEvent('coach:voice'));
          }}
        >
          <Mic className="w-3 h-3" />
          <span className="hidden lg:inline">Voice</span>
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Compact chat input — visible on md+ */}
        <form
          className="hidden md:flex items-center gap-1.5 flex-1 max-w-sm"
          onSubmit={(e) => {
            e.preventDefault();
            const input = e.currentTarget.querySelector('input') as HTMLInputElement;
            if (input?.value.trim()) {
              setExpanded(true);
              window.dispatchEvent(new CustomEvent('coach:message', { detail: input.value }));
              input.value = '';
            }
          }}
        >
          <input
            placeholder="Ask Coach Alex..."
            className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-md px-2.5 py-1 text-[11px] text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/40"
          />
          <button type="submit" className="p-1 text-blue-400 hover:text-blue-300">
            <Send className="w-3 h-3" />
          </button>
        </form>

        {/* Expand/Collapse toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1.5 rounded-md hover:bg-white/[0.06] text-white/40 hover:text-white/60 transition-colors"
          title={expanded ? 'Collapse chat' : 'Expand chat'}
        >
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {/* Close */}
        <button
          onClick={closePanel}
          className="p-1.5 rounded-md hover:bg-white/[0.06] text-white/30 hover:text-white/60 transition-colors"
          title="Close coach"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Expanded panel — drops down below the bar */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'min(60vh, 480px)', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden bg-[var(--background)]/98 backdrop-blur-xl border-b border-white/[0.06] shadow-2xl shadow-black/50"
          >
            <div className="h-full">
              <AICoach />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CoachFAB() {
  const { isPanelOpen, openPanel, lessonContext } = useAI();

  if (isPanelOpen || !lessonContext) return null;

  return (
    <button
      onClick={openPanel}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 px-4 py-3 text-white text-sm font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:scale-105"
    >
      <GraduationCap className="w-5 h-5" />
      Coach Alex
    </button>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AIProvider>
        {children}
        <CoachTopBar />
        <CoachFAB />
        <TranslationBar />
      </AIProvider>
    </AuthProvider>
  );
}
