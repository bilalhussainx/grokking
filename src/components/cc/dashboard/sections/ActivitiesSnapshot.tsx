// src/components/cc/dashboard/sections/ActivitiesSnapshot.tsx
// Compact activities-summary card with link to the optimizer. Returns
// null when no activities are logged — the priority brief already nudges.
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Target, ArrowRight, CheckCircle2 } from "lucide-react";
import type { DashboardSummary } from "./types";

export default function ActivitiesSnapshot({ summary }: { summary: DashboardSummary }) {
  const { logged, optimized } = summary.activities;
  if (logged === 0) return null;
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
    >
      <Link
        href="/cc/activities-optimizer"
        className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-[#141414]/60 backdrop-blur-sm p-5 hover:border-[#D4AF37]/30 transition-all"
      >
        <div className="shrink-0 w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <Target className="w-5 h-5 text-emerald-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-300">
              Activities
            </span>
            <span className="text-[10px] text-white/40 tabular-nums">{logged} logged</span>
            {optimized > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] text-white/45">
                <CheckCircle2 className="w-3 h-3 text-emerald-400/80" />
                {optimized} optimized
              </span>
            )}
          </div>
          <h3 className="text-base font-semibold text-white mb-0.5">Your Common App activity list</h3>
          <p className="text-xs text-white/50">
            Run the narrative diagnosis when you cross 3+ — Coach finds the through-line.
          </p>
        </div>
        <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-emerald-300 group-hover:translate-x-1 transition-all" />
      </Link>
    </motion.section>
  );
}
