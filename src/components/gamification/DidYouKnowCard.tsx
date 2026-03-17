"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useXP } from "@/contexts/XPContext";

interface DidYouKnowCardProps {
  fact: string;
  lessonSlug: string;
  onDismiss: () => void;
}

export default function DidYouKnowCard({
  fact,
  lessonSlug,
  onDismiss,
}: DidYouKnowCardProps) {
  const { earnXP } = useXP();
  const [secondsLeft, setSecondsLeft] = useState(3);
  const [xpReady, setXpReady] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setXpReady(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleDismiss = async () => {
    if (xpReady) {
      await earnXP("did_you_know", lessonSlug);
    }
    onDismiss();
  };

  // Countdown ring dimensions
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const progress = ((3 - secondsLeft) / 3) * circumference;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={handleDismiss}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="relative max-w-md w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Glowing border */}
          <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 opacity-80 blur-sm" />
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

          {/* Card body */}
          <div className="relative rounded-2xl bg-slate-900 p-6">
            {/* Lightbulb icon */}
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400/20 to-yellow-500/20 flex items-center justify-center text-2xl">
                <span role="img" aria-label="lightbulb">
                  💡
                </span>
              </div>
            </div>

            {/* Header */}
            <h3 className="text-center text-lg font-bold text-white mb-3">
              Did You Know?
            </h3>

            {/* Fact */}
            <p className="text-center text-white/80 text-sm leading-relaxed mb-5">
              {fact}
            </p>

            {/* XP indicator + countdown */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative w-9 h-9 flex items-center justify-center">
                <svg className="w-9 h-9 -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r={radius}
                    fill="none"
                    stroke={xpReady ? "#FFD700" : "#a78bfa"}
                    strokeWidth="3"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - progress}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                {!xpReady && (
                  <span className="absolute text-[10px] font-bold text-white/60">
                    {secondsLeft}
                  </span>
                )}
                {xpReady && (
                  <span className="absolute text-[10px] font-bold text-yellow-400">
                    ✓
                  </span>
                )}
              </div>
              <span
                className={`text-sm font-semibold transition-colors ${
                  xpReady ? "text-yellow-400" : "text-white/40"
                }`}
              >
                +5 XP
              </span>
            </div>

            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${
                xpReady
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-violet-500/20"
                  : "bg-white/10 text-white/50 cursor-default"
              }`}
            >
              {xpReady ? "Got it!" : "Reading..."}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
