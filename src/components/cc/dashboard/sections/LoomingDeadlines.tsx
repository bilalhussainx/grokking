// src/components/cc/dashboard/sections/LoomingDeadlines.tsx
// Amber deadline strip — schools with deadline ≤ 21 days. Returns null
// when there are no urgent schools, so callers can include it
// unconditionally in SECTION_ORDER. LIFTED from CounselorDashboard.
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Flag, ArrowRight, CalendarDays } from "lucide-react";
import { deadlineTone } from "./SchoolCard";
import type { DashboardSummary } from "./types";

export default function LoomingDeadlines({ summary }: { summary: DashboardSummary }) {
  const urgent = summary.schools.filter(
    (s) => s.daysToDeadline !== null && s.daysToDeadline <= 21 && s.daysToDeadline >= 0,
  );
  if (urgent.length === 0) return null;
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Flag className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-400">
          Looming deadlines
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {urgent.map((s) => {
          const tone = deadlineTone(s.daysToDeadline);
          return (
            <Link
              key={s.studentSchoolId}
              href={`/schools/${s.schoolId}`}
              className="group rounded-xl border border-white/10 bg-[#141414]/60 backdrop-blur-sm p-4 hover:border-amber-500/30 transition-all flex items-center gap-3"
            >
              <div className="shrink-0 w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <CalendarDays className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{s.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-xs ${tone.tone}`}>{tone.text}</span>
                  <span className="text-[10px] text-white/30">·</span>
                  <span className="text-[10px] text-white/50">{s.nearestDeadlineLabel}</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-amber-400 transition-colors" />
            </Link>
          );
        })}
      </div>
    </motion.section>
  );
}
