"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface Achievement {
  id: string;
  name: string;
  icon: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  gems: number;
}

interface AchievementToastProps {
  achievements: Achievement[];
  onDismiss: () => void;
}

const RARITY_COLORS: Record<Achievement["rarity"], string> = {
  common: "#9CA3AF",     // gray
  uncommon: "#22C55E",   // green
  rare: "#3B82F6",       // blue
  epic: "#A855F7",       // purple
  legendary: "#FFD700",  // gold
};

const RARITY_BG: Record<Achievement["rarity"], string> = {
  common: "rgba(156, 163, 175, 0.1)",
  uncommon: "rgba(34, 197, 94, 0.1)",
  rare: "rgba(59, 130, 246, 0.1)",
  epic: "rgba(168, 85, 247, 0.1)",
  legendary: "rgba(255, 215, 0, 0.1)",
};

export default function AchievementToast({ achievements, onDismiss }: AchievementToastProps) {
  useEffect(() => {
    if (achievements.length === 0) return;

    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);

    return () => clearTimeout(timer);
  }, [achievements, onDismiss]);

  return (
    <div className="fixed top-4 right-4 z-[110] flex flex-col gap-2 pointer-events-auto">
      <AnimatePresence>
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ duration: 0.4, delay: index * 0.15, ease: "easeOut" }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg border border-white/[0.08] backdrop-blur-md shadow-xl min-w-[280px]"
            style={{
              backgroundColor: RARITY_BG[achievement.rarity],
              borderLeft: `4px solid ${RARITY_COLORS[achievement.rarity]}`,
            }}
          >
            <span className="text-2xl">{achievement.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {achievement.name}
              </p>
              <p className="text-xs text-white/50">
                Achievement Unlocked
              </p>
            </div>
            <span className="text-sm font-medium text-amber-400 whitespace-nowrap">
              +{achievement.gems} 💎
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
