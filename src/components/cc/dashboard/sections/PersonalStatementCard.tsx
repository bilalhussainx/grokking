// src/components/cc/dashboard/sections/PersonalStatementCard.tsx
// Featured personal-statement card — phase + word count + status copy.
// Returns null when the student hasn't started a PS. LIFTED from
// CounselorDashboard L218-257.
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import type { DashboardSummary } from "./types";

export default function PersonalStatementCard({ summary }: { summary: DashboardSummary }) {
  const ps = summary.personalStatement;
  if (!ps) return null;
  const statusCopy = ps.hasReview
    ? "Review landed — read notes and revise where needed"
    : ps.phase === "revise"
      ? "In revision"
      : ps.phase === "draft"
        ? "Drafting in progress — request a review when ready"
        : "Brainstorming";
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      <Link
        href={`/cc/essays/${ps.id}`}
        className="group block rounded-2xl border border-white/10 bg-[#141414]/60 backdrop-blur-sm p-5 hover:border-[#D4AF37]/40 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="shrink-0 w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#D4AF37]">
                Personal statement
              </span>
              <span className="text-[10px] text-white/30 tabular-nums">
                {ps.wordCount || 0} words
              </span>
            </div>
            <h3 className="text-base font-semibold text-white mb-0.5">Common App essay</h3>
            <p className="text-xs text-white/50">{statusCopy}</p>
          </div>
          <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />
        </div>
      </Link>
    </motion.section>
  );
}
