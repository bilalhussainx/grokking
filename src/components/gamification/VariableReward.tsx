"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { RewardEvent } from "@/lib/rewards";

interface VariableRewardProps {
  reward: RewardEvent | null;
  onDismiss: () => void;
}

export default function VariableReward({ reward, onDismiss }: VariableRewardProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reward && reward.type !== "none") {
      setVisible(true);
      const duration = reward.type === "jackpot" ? 5000 : 3000;
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onDismiss, 400); // wait for exit animation
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [reward, onDismiss]);

  if (!reward || reward.type === "none") return null;

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Jackpot full-screen flash */}
          {reward.type === "jackpot" && (
            <motion.div
              className="fixed inset-0 z-[200] pointer-events-none"
              initial={{ backgroundColor: "rgba(250, 204, 21, 0.3)" }}
              animate={{ backgroundColor: "rgba(250, 204, 21, 0)" }}
              transition={{ duration: 0.6 }}
            />
          )}

          {/* Main reward toast */}
          <motion.div
            className="fixed top-24 left-1/2 z-[201] pointer-events-none"
            initial={{ opacity: 0, y: 20, x: "-50%", scale: 0.8 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={{ opacity: 0, y: -40, x: "-50%", scale: 0.9 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
          >
            <div className={getContainerClass(reward.type)}>
              {/* Particles for jackpot / surprise-achievement */}
              {(reward.type === "jackpot" || reward.type === "surprise-achievement") && (
                <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-1.5 h-1.5 rounded-full ${
                        ["bg-yellow-400", "bg-pink-400", "bg-blue-400", "bg-emerald-400", "bg-violet-400"][i % 5]
                      }`}
                      initial={{
                        x: "50%",
                        y: "50%",
                        opacity: 1,
                      }}
                      animate={{
                        x: `${Math.cos((i * Math.PI * 2) / 12) * 80 + 50}%`,
                        y: `${Math.sin((i * Math.PI * 2) / 12) * 60 + 50}%`,
                        opacity: 0,
                      }}
                      transition={{ duration: 1.2, delay: i * 0.05, ease: "easeOut" }}
                    />
                  ))}
                </div>
              )}

              {/* Icon */}
              <div className="text-2xl mb-1">{getIcon(reward.type)}</div>

              {/* Message */}
              <div
                className={`font-bold text-center ${
                  reward.type === "jackpot" ? "text-xl" : "text-base"
                } ${getTextColor(reward.type)}`}
              >
                {reward.message}
              </div>

              {/* Multiplier badge stays visible */}
              {reward.type === "xp-multiplier" && (
                <motion.div
                  className="mt-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-sm font-bold"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  3x ACTIVE
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function getContainerClass(type: RewardEvent["type"]): string {
  const base =
    "relative px-6 py-4 rounded-2xl backdrop-blur-xl shadow-2xl flex flex-col items-center min-w-[200px]";
  switch (type) {
    case "bonus-xp":
      return `${base} bg-gradient-to-br from-yellow-500/20 to-amber-600/20 border border-yellow-500/40`;
    case "mystery-gem":
      return `${base} bg-gradient-to-br from-purple-500/20 to-violet-600/20 border border-purple-500/40`;
    case "xp-multiplier":
      return `${base} bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/40`;
    case "surprise-achievement":
      return `${base} bg-gradient-to-br from-emerald-500/20 to-cyan-600/20 border border-emerald-500/40`;
    case "jackpot":
      return `${base} bg-gradient-to-br from-yellow-500/30 to-red-500/20 border-2 border-yellow-400/60 shadow-yellow-500/20`;
    default:
      return base;
  }
}

function getIcon(type: RewardEvent["type"]): string {
  switch (type) {
    case "bonus-xp":
      return "\u2728"; // sparkles
    case "mystery-gem":
      return "\uD83D\uDC8E"; // gem
    case "xp-multiplier":
      return "\u26A1"; // lightning
    case "surprise-achievement":
      return "\uD83C\uDF1F"; // star
    case "jackpot":
      return "\uD83C\uDFB0"; // slot machine
    default:
      return "";
  }
}

function getTextColor(type: RewardEvent["type"]): string {
  switch (type) {
    case "bonus-xp":
      return "text-yellow-300";
    case "mystery-gem":
      return "text-purple-300";
    case "xp-multiplier":
      return "text-amber-300";
    case "surprise-achievement":
      return "text-emerald-300";
    case "jackpot":
      return "text-yellow-200";
    default:
      return "text-white";
  }
}
