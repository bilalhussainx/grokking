// src/components/cc/dashboard/sections/PriorityBrief.tsx
// Counselor-brief gold-edged card. LIFTED from CounselorDashboard's first
// section (lines ~122-175). Glass + gold aesthetic preserved exactly.
"use client";
import { motion } from "framer-motion";
import { Sparkles, Building2, BookOpen, Target, MessageSquare, ArrowRight } from "lucide-react";
import { useCoachKairos } from "@/contexts/CoachKairosContext";
import type { DashboardSummary } from "./types";

export default function PriorityBrief({ summary }: { summary: DashboardSummary }) {
  const coach = useCoachKairos();
  const { brief, schools, personalStatement, activities } = summary;
  const briefLoading = brief === null;
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="rounded-2xl border border-[#D4AF37]/25 bg-gradient-to-br from-[#1a1610]/70 via-[#141414]/60 to-[#141414]/60 backdrop-blur-md p-6 sm:p-7">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-[#D4AF37]">
            Priority this week
          </span>
          <span className="text-[10px] text-white/25">·</span>
          <div className="flex items-center gap-3 text-[10px] text-white/40">
            <span className="flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              {schools.length} {schools.length === 1 ? "school" : "schools"}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              PS {personalStatement ? (personalStatement.hasReview ? "reviewed" : "drafted") : "not started"}
            </span>
            <span className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              {activities.logged} {activities.logged === 1 ? "activity" : "activities"}
            </span>
          </div>
        </div>
        {briefLoading ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-5 w-[90%] bg-white/5 rounded" />
            <div className="h-5 w-[75%] bg-white/5 rounded" />
            <div className="h-5 w-[55%] bg-white/5 rounded" />
          </div>
        ) : brief ? (
          <p className="text-lg sm:text-xl leading-[1.5] text-white font-medium tracking-tight">
            {brief}
          </p>
        ) : (
          <p className="text-lg leading-[1.5] text-white/60">
            Add more schools or draft an essay and I&apos;ll give you a read on what to work on next.
          </p>
        )}
        <button
          onClick={() => coach.openWithVariant(summary.variantKey)}
          className="mt-5 flex items-center gap-2 text-xs font-semibold text-[#D4AF37] hover:text-[#F4D03F] transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Ask Coach Kairos a follow-up
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.section>
  );
}
