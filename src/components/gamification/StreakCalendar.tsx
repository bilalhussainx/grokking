"use client";

// Streak Calendar widget — last 30 days as a visual grid.
// Per audit: "Streak calendar missing: No visual calendar showing last 30 days"
// Spec: 2026-04-07 retention quick wins.

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flame, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface DayState {
  date: string;     // YYYY-MM-DD
  active: boolean;  // had any activity that day
  isToday: boolean;
}

export default function StreakCalendar() {
  const { user, profile } = useAuth();
  const [days, setDays] = useState<DayState[]>([]);

  useEffect(() => {
    if (!user) return;

    // Build last 30 days
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const result: DayState[] = [];

    // Pull active dates from localStorage cache (best-effort).
    // Real source of truth is xp_transactions in DB; we'd query it via
    // /api/xp/streak-calendar in a follow-up. For now this gives users
    // a visible calendar even before that endpoint exists.
    let activeDates: Set<string>;
    try {
      const cached = localStorage.getItem("active-dates");
      activeDates = new Set(cached ? JSON.parse(cached) : []);
    } catch {
      activeDates = new Set();
    }

    // The streak count from profile is the source of truth for RECENT days
    const streak = profile?.login_streak || 0;
    for (let i = 0; i < streak; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      activeDates.add(d.toISOString().slice(0, 10));
    }

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      result.push({
        date: dateStr,
        active: activeDates.has(dateStr),
        isToday: i === 0,
      });
    }
    setDays(result);

    // Mark today as active when this widget renders (since the user is here)
    activeDates.add(today.toISOString().slice(0, 10));
    try {
      localStorage.setItem("active-dates", JSON.stringify(Array.from(activeDates)));
    } catch {}
  }, [user, profile?.login_streak]);

  if (!user) return null;
  const streak = profile?.login_streak || 0;
  const activeCount = days.filter((d) => d.active).length;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#141414] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Last 30 days</h3>
            <p className="text-[10px] text-white/40">
              {activeCount} active &middot; {streak}-day streak
            </p>
          </div>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
            <Flame className="w-3 h-3 text-orange-400" />
            <span className="text-xs font-bold text-orange-400">{streak}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-10 gap-1.5">
        {days.map((day, i) => (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.012, duration: 0.2 }}
            className={`aspect-square rounded-md transition-all ${
              day.isToday
                ? "ring-2 ring-orange-400 bg-orange-500/30"
                : day.active
                  ? "bg-orange-500/40 hover:bg-orange-500/60"
                  : "bg-white/[0.04] hover:bg-white/[0.08]"
            }`}
            title={`${day.date}${day.active ? " · active" : ""}${day.isToday ? " · today" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
