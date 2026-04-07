"use client";

// Achievements showcase widget for the dashboard.
// Shows up to 6 most-recent unlocked badges + a "see all" link.
// Reads from /api/xp/profile (which already returns achievements).
//
// Per audit 2026-04-07: "No achievements display: Badges/trophies not visible"

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { RARITY_COLORS, type Achievement } from "@/lib/achievements-types";

export default function AchievementsShowcase() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetch("/api/xp/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.achievements) setAchievements(data.achievements);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [user]);

  if (!user || !loaded) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#141414] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Achievements</h3>
            <p className="text-[10px] text-white/40">
              {achievements.length === 0
                ? "Earn your first badge"
                : `${achievements.length} unlocked`}
            </p>
          </div>
        </div>
        <Link
          href="/achievements"
          className="text-[10px] text-[#D4AF37] hover:text-[#E5C158] font-semibold uppercase tracking-wider"
        >
          See all
        </Link>
      </div>

      {achievements.length === 0 ? (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
          <Lock className="w-4 h-4 text-white/30 shrink-0" />
          <p className="text-xs text-white/40">
            Complete a lesson, voice session, or interview to start earning
            badges.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {achievements.slice(0, 6).map((ach, i) => (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              className={`relative aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-2 ${
                RARITY_COLORS[ach.rarity] || RARITY_COLORS.common
              }`}
              title={`${ach.name} — ${ach.description}`}
            >
              <span className="text-2xl mb-1">{ach.icon}</span>
              <span className="text-[9px] font-semibold text-white/80 text-center leading-tight line-clamp-1">
                {ach.name}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
