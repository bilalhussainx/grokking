"use client";
import { motion } from "framer-motion";
import type { DashboardSummary } from "@/components/cc/dashboard/sections/types";

const TONE_PALETTE: Record<DashboardSummary["statusTone"], string> = {
  gold: "border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#fcd34d]",
  leaf: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  sky:  "border-sky-500/30 bg-sky-500/10 text-sky-300",
  rose: "border-rose-500/30 bg-rose-500/10 text-rose-300",
};

function timeAwareGreeting(): string {
  const h = new Date().getHours();
  return h < 5 ? "Late night" : h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

export default function MobileGreeting({ summary }: { summary: DashboardSummary }) {
  const name = summary.firstName ? `Hi, ${summary.firstName}.` : "Welcome.";
  const toneClass = TONE_PALETTE[summary.statusTone];
  return (
    <motion.div
      className="flex items-end justify-between gap-3"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-[0.16em] font-semibold text-white/55">
          {timeAwareGreeting()}
        </p>
        <h1 className="text-xl font-semibold text-white tracking-tight mt-1 truncate">
          {name}
        </h1>
      </div>
      <span
        className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10.5px] font-medium ${toneClass}`}
      >
        <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-current" />
        <span className="truncate max-w-[120px]">{summary.statusLabel}</span>
      </span>
    </motion.div>
  );
}
