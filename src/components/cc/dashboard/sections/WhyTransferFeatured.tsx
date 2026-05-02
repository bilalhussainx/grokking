// src/components/cc/dashboard/sections/WhyTransferFeatured.tsx
// Featured why-transfer essay card for transfer applicants. The single
// most important essay in their file — 2× weighting vs. personal statement.
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Edit3, ArrowRight } from "lucide-react";
import type { DashboardSummary } from "./types";

const PHASE_TONE: Record<string, string> = {
  brainstorm: "bg-violet-500/10 border-violet-500/25 text-violet-300",
  outline:    "bg-sky-500/10    border-sky-500/25    text-sky-300",
  draft:      "bg-amber-500/10  border-amber-500/25  text-amber-300",
  revise:     "bg-emerald-500/10 border-emerald-500/25 text-emerald-300",
};

export default function WhyTransferFeatured({ summary }: { summary: DashboardSummary }) {
  const essay = summary.whyTransferEssay;
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      <Link
        href={essay ? `/cc/essays/${essay.id}` : "/cc/essays?type=transfer"}
        className="group block rounded-2xl border border-[#D4AF37]/25 bg-gradient-to-br from-[#1a1610]/70 via-[#141414]/60 to-[#141414]/60 backdrop-blur-md p-5 hover:border-[#D4AF37]/45 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="shrink-0 w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center">
            <Edit3 className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#D4AF37]">
                Why-transfer essay
              </span>
              {essay && (
                <span className={`text-[9.5px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${PHASE_TONE[essay.phase] ?? "bg-white/5 border-white/10 text-white/55"}`}>
                  {essay.phase}
                </span>
              )}
            </div>
            <h3 className="text-base font-semibold text-white mb-0.5">
              {essay ? "The heart of your file" : "Start your why-transfer essay"}
            </h3>
            <p className="text-xs text-white/55">
              {essay
                ? `${essay.wordCount} / ${essay.wordTarget} words · committee reads first`
                : "Five honest lines on the why now beats a vague paragraph"}
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />
        </div>
        {essay && (
          <div className="mt-4 h-1 rounded bg-white/5 overflow-hidden">
            <div
              className="h-full bg-[#D4AF37]"
              style={{ width: `${Math.min(100, (essay.wordCount / essay.wordTarget) * 100)}%` }}
            />
          </div>
        )}
      </Link>
    </motion.section>
  );
}
