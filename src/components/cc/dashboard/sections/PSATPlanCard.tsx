// src/components/cc/dashboard/sections/PSATPlanCard.tsx
// PSAT 10 study plan featured card for g10 students. Mirrors
// PersonalStatementCard's featured-block shape.
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChartBar, ArrowRight, Calendar } from "lucide-react";
import type { DashboardSummary } from "./types";

export default function PSATPlanCard({ summary }: { summary: DashboardSummary }) {
  const plan = summary.psatPlan;
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      <Link
        href="/cc/test-strategy"
        className="group block rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-500/[0.05] to-[#141414]/60 backdrop-blur-sm p-5 hover:border-sky-500/40 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="shrink-0 w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
            <ChartBar className="w-5 h-5 text-sky-300" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-sky-300">
                PSAT 10 plan
              </span>
              {plan && (
                <span className="text-[10px] text-white/40 tabular-nums">
                  {plan.weeksRemaining}w to test
                </span>
              )}
            </div>
            <h3 className="text-base font-semibold text-white mb-0.5">
              {plan ? `Test on ${new Date(plan.testDateIso).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : "Schedule your PSAT 10"}
            </h3>
            <p className="text-xs text-white/50">
              {plan
                ? `${plan.studyHoursLogged}h logged · aim for ${plan.recommendedHoursPerWeek}h/week`
                : "PSAT 10 in October — your dress rehearsal for junior-year SAT/ACT"}
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-sky-300 group-hover:translate-x-1 transition-all" />
        </div>
        {plan && plan.recommendedHoursPerWeek > 0 && (
          <div className="mt-4 flex items-center gap-3 text-[11px] text-white/55">
            <Calendar className="w-3.5 h-3.5 text-sky-300/70" />
            <div className="flex-1 h-1 rounded bg-white/5 overflow-hidden">
              <div
                className="h-full bg-sky-400/70"
                style={{ width: `${Math.min(100, (plan.studyHoursLogged / (plan.weeksRemaining * plan.recommendedHoursPerWeek)) * 100)}%` }}
              />
            </div>
            <span className="tabular-nums">{plan.studyHoursLogged}h</span>
          </div>
        )}
      </Link>
    </motion.section>
  );
}
