// src/components/cc/dashboard/sections/Greeting.tsx
// Top of the dashboard: time-aware greeting + name + tinted status pill.
// Glass aesthetic — no Cormorant italic, no inline-styled dark panels.
"use client";
import { motion } from "framer-motion";
import type { DashboardSummary } from "./types";

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

export default function Greeting({ summary }: { summary: DashboardSummary }) {
  const name = summary.firstName ? `Hi, ${summary.firstName}.` : "Welcome.";
  const toneClass = TONE_PALETTE[summary.statusTone];
  return (
    <motion.div
      className="flex items-end justify-between gap-4 px-1"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div>
        <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-white/55">
          {timeAwareGreeting()}
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mt-1">
          {name}
        </h1>
      </div>
      <span
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11.5px] font-medium ${toneClass}`}
      >
        <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_6px_currentColor]" />
        {summary.statusLabel}
      </span>
    </motion.div>
  );
}
