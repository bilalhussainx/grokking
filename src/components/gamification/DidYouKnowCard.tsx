"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, X, Sparkles } from "lucide-react";
import { useXP } from "@/contexts/XPContext";

interface DidYouKnowCardProps {
  fact: string;
  lessonSlug: string;
  onDismiss: () => void;
}

/**
 * Non-blocking "Did You Know?" banner — shows as an inline card
 * at the top of the lesson, NOT a full-screen modal.
 * Auto-awards XP after 3 seconds of reading.
 */
export default function DidYouKnowCard({
  fact,
  lessonSlug,
  onDismiss,
}: DidYouKnowCardProps) {
  const { earnXP } = useXP();
  const [xpReady, setXpReady] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setXpReady(true);
    }, 3000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleDismiss = async () => {
    if (xpReady && !xpAwarded) {
      setXpAwarded(true);
      await earnXP("did_you_know", lessonSlug);
    }
    onDismiss();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="mb-6 overflow-hidden"
      >
        <div className="relative rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-yellow-500/5 p-4">
          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-1 rounded-md text-amber-500/40 hover:text-amber-400 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              <Lightbulb className="w-4.5 h-4.5 text-amber-400" />
            </div>

            <div className="flex-1 min-w-0 pr-6">
              <p className="text-xs font-semibold text-amber-400 mb-1">
                Did You Know?
              </p>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                {fact}
              </p>

              {/* XP reward */}
              <AnimatePresence>
                {xpReady && !xpAwarded && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1.5 mt-2"
                  >
                    <Sparkles className="w-3 h-3 text-yellow-400" />
                    <span className="text-[11px] font-semibold text-yellow-400">
                      +5 XP earned!
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
