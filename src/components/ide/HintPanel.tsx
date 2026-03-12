"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, ChevronRight, X } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface HintPanelProps {
  hint: string;
  level: 1 | 2 | 3;
  isLoading: boolean;
  onNextHint: () => void;
  onClose: () => void;
}

export default function HintPanel({ hint, level, isLoading, onNextHint, onClose }: HintPanelProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="border-t border-amber-500/10 bg-amber-500/[0.04]"
      >
        <div className="px-3 py-2">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                Hint {level}/3
              </span>
              {/* Dots indicator */}
              <div className="flex gap-1 ml-1">
                {[1, 2, 3].map((l) => (
                  <div
                    key={l}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      l <= level ? "bg-amber-400" : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1">
              {level < 3 && (
                <button
                  onClick={onNextHint}
                  disabled={isLoading}
                  className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium rounded-md bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors disabled:opacity-50"
                >
                  More help
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-md text-[var(--muted-foreground)] hover:bg-white/[0.06] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Hint Content */}
          {isLoading ? (
            <div className="flex items-center gap-2 py-2 text-amber-400/60 text-xs">
              <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Thinking...
            </div>
          ) : (
            <div className="text-[12px] leading-relaxed text-[var(--foreground)]/90 prose prose-sm prose-invert max-w-none [&_p]:my-1 [&_code]:text-amber-300 [&_code]:bg-amber-500/10 [&_code]:px-1 [&_code]:rounded">
              <ReactMarkdown>{hint}</ReactMarkdown>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
