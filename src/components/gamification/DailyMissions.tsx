"use client";

// Daily Missions widget — the audit's #1 retention recommendation.
// Three simple daily missions that create a habit hook. Resets at local
// midnight. Stored in localStorage (so it works for guests and logged-in
// users without a DB call). XP awarded via the existing useXP hook.
//
// Spec: P0 retention fix per KAIROSLEARN_COMPREHENSIVE_AUDIT.md (2026-04-07)

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Mic, BookOpen, CheckCircle2, Flame, Trophy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useXP } from "@/contexts/XPContext";

interface Mission {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: typeof Target;
  xp: number;
}

const DAILY_MISSIONS: Mission[] = [
  {
    id: "essay-work",
    title: "Work on an essay",
    description: "Brainstorm, outline, or draft a personal statement or supplemental",
    href: "/cc/essays",
    icon: BookOpen,
    xp: 50,
  },
  {
    id: "school-list",
    title: "Build your school list",
    description: "Add or research schools for your reach/match/safety list",
    href: "/schools",
    icon: Target,
    xp: 30,
  },
  {
    id: "interview-prep",
    title: "Practice an interview",
    description: "Do a mock interview with an AI alumni interviewer",
    href: "/college-interviews",
    icon: Mic,
    xp: 40,
  },
];

const STORAGE_KEY = "daily-missions";
const STORAGE_DATE_KEY = "daily-missions-date";

function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export default function DailyMissions() {
  const { user } = useAuth();
  const { earnXP } = useXP();
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);

  // Load + reset daily — and listen for auto-completion events from
  // anywhere in the app (lib/dailyMissions.markMissionComplete).
  const reload = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const storedDate = localStorage.getItem(STORAGE_DATE_KEY);
      const today = todayString();
      if (storedDate !== today) {
        localStorage.setItem(STORAGE_DATE_KEY, today);
        localStorage.setItem(STORAGE_KEY, "[]");
        setCompleted(new Set());
        return;
      }
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const next = new Set<string>(JSON.parse(stored));
          setCompleted(next);
          if (next.size === DAILY_MISSIONS.length) {
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 4000);
          }
        } catch {}
      }
    } catch {}
  }, []);

  useEffect(() => {
    reload();
    if (typeof window === "undefined") return;
    const handler = () => reload();
    window.addEventListener("daily-mission-complete", handler);
    return () => window.removeEventListener("daily-mission-complete", handler);
  }, [reload]);

  const markComplete = (mission: Mission) => {
    if (completed.has(mission.id)) return;
    const next = new Set(completed);
    next.add(mission.id);
    setCompleted(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
    } catch {}
    if (user) {
      // earnXP(action, refId?) — server-side resolves the XP amount per action
      earnXP("daily_mission", mission.id).catch(() => {
        // Silently fail — UX shouldn't break if XP write fails
      });
    }
    if (next.size === DAILY_MISSIONS.length) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 4000);
    }
  };

  const allComplete = completed.size === DAILY_MISSIONS.length;
  const completedCount = completed.size;
  const progressPct = (completedCount / DAILY_MISSIONS.length) * 100;

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a1610] to-[#141414] p-6 relative overflow-hidden">
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#D4AF37]/8 rounded-full blur-3xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center">
              <Flame className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Today's Missions</h3>
              <p className="text-[10px] text-white/40">
                {allComplete
                  ? "All done! See you tomorrow."
                  : `${completedCount}/${DAILY_MISSIONS.length} complete · resets at midnight`}
              </p>
            </div>
          </div>
          {allComplete && (
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              className="px-2 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider"
            >
              <Trophy className="w-3 h-3 inline mr-1" />
              Done
            </motion.div>
          )}
        </div>

        {/* Progress bar */}
        <div className="mb-4 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>

        {/* Missions list */}
        <div className="space-y-2">
          {DAILY_MISSIONS.map((mission) => {
            const isComplete = completed.has(mission.id);
            const Icon = mission.icon;
            return (
              <Link
                key={mission.id}
                href={mission.href}
                onClick={() => markComplete(mission)}
                className={`group flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  isComplete
                    ? "bg-emerald-500/[0.04] border-emerald-500/20 opacity-60"
                    : "bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.04] hover:border-[#D4AF37]/30"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    isComplete ? "bg-emerald-500/15" : "bg-[#D4AF37]/10"
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Icon className="w-4 h-4 text-[#D4AF37]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-semibold ${
                      isComplete ? "text-white/50 line-through" : "text-white"
                    }`}
                  >
                    {mission.title}
                  </p>
                  <p className="text-[11px] text-white/40">{mission.description}</p>
                </div>
                <div
                  className={`text-xs font-bold shrink-0 ${
                    isComplete ? "text-emerald-400" : "text-[#D4AF37]"
                  }`}
                >
                  +{mission.xp} XP
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Celebration overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#D4AF37]/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl"
          >
            <div className="text-center">
              <Trophy className="w-12 h-12 text-[#D4AF37] mx-auto mb-2" />
              <p className="text-lg font-bold text-white">All missions complete!</p>
              <p className="text-xs text-white/60">+100 XP bonus &middot; streak protected</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
