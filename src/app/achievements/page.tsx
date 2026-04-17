"use client";

// Full achievements page — shows all badges (locked + unlocked).
// Per audit 2026-04-07: "Achievements system. Visual trophy case."

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy, Lock } from "lucide-react";
import { RARITY_COLORS, type Achievement } from "@/lib/achievements-types";
import { useAuth } from "@/contexts/AuthContext";

export default function AchievementsPage() {
  const { user } = useAuth();
  const [unlocked, setUnlocked] = useState<Achievement[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoaded(true);
      return;
    }
    fetch("/api/xp/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.achievements) setUnlocked(data.achievements);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [user]);

  // The 12 starter achievements seeded in 20260316_gamification.sql
  const ALL_ACHIEVEMENTS: Achievement[] = [
    { id: "first-steps", name: "First Steps", description: "Complete your first lesson", rarity: "common", icon: "👣", gemReward: 5 },
    { id: "voice-activated", name: "Voice Activated", description: "Start your first voice session", rarity: "common", icon: "🎤", gemReward: 5 },
    { id: "curious-mind", name: "Curious Mind", description: "Ask Coach Kairos a question", rarity: "common", icon: "🤔", gemReward: 5 },
    { id: "consistent", name: "Consistent", description: "Maintain a 3-day streak", rarity: "uncommon", icon: "📅", gemReward: 10 },
    { id: "module-master", name: "Module Master", description: "Complete an entire module", rarity: "rare", icon: "📚", gemReward: 25 },
    { id: "polyglot", name: "Polyglot", description: "Start courses in 2+ languages", rarity: "rare", icon: "🌍", gemReward: 25 },
    { id: "night-owl", name: "Night Owl", description: "Study after 10pm", rarity: "uncommon", icon: "🦉", gemReward: 10 },
    { id: "early-bird", name: "Early Bird", description: "Study before 7am", rarity: "uncommon", icon: "🐦", gemReward: 10 },
    { id: "course-graduate", name: "Course Graduate", description: "Complete an entire course", rarity: "epic", icon: "🎓", gemReward: 50 },
    { id: "streak-legend", name: "Streak Legend", description: "Maintain a 100-day streak", rarity: "legendary", icon: "🔥", gemReward: 100 },
    { id: "diamond-scholar", name: "Diamond Scholar", description: "Reach Diamond league", rarity: "legendary", icon: "💎", gemReward: 100 },
    { id: "voice-marathon", name: "Voice Marathon", description: "30-minute voice session", rarity: "epic", icon: "🏃", gemReward: 50 },
  ];

  const unlockedIds = new Set(unlocked.map((a) => a.id));

  const groupedByRarity: Record<string, Achievement[]> = {
    legendary: [],
    epic: [],
    rare: [],
    uncommon: [],
    common: [],
  };
  for (const ach of ALL_ACHIEVEMENTS) {
    groupedByRarity[ach.rarity]?.push(ach);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/"
            className="p-2 rounded-lg hover:bg-white/5 transition"
            title="Back to home"
          >
            <ArrowLeft className="w-4 h-4 text-white/40" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Achievements
            </h1>
            <p className="text-xs text-white/40">
              {unlocked.length}/{ALL_ACHIEVEMENTS.length} unlocked
            </p>
          </div>
        </div>

        {loaded && Object.entries(groupedByRarity).map(([rarity, items]) => (
          <div key={rarity} className="mb-8">
            <h2 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
              {rarity}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {items.map((ach, i) => {
                const isUnlocked = unlockedIds.has(ach.id);
                return (
                  <motion.div
                    key={ach.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.03 }}
                    className={`p-4 rounded-xl border-2 ${
                      isUnlocked
                        ? RARITY_COLORS[rarity]
                        : "border-white/[0.05] bg-white/[0.02] opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl">{isUnlocked ? ach.icon : "🔒"}</span>
                      {isUnlocked && (
                        <span className="text-[10px] font-semibold text-emerald-400 uppercase">
                          Unlocked
                        </span>
                      )}
                    </div>
                    <h3 className={`text-sm font-bold mb-1 ${isUnlocked ? "text-white" : "text-white/50"}`}>
                      {ach.name}
                    </h3>
                    <p className="text-[10px] text-white/40 leading-snug mb-2">
                      {ach.description}
                    </p>
                    <p className="text-[10px] text-purple-300 font-semibold">+{ach.gemReward} 💎</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}

        {!user && (
          <div className="text-center py-12">
            <Lock className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <p className="text-sm text-white/50 mb-4">Sign in to start earning achievements</p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold"
            >
              Create free account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
