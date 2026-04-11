"use client";

import { Sparkles } from "lucide-react";

interface ConceptCardProps {
  title: string;
  children: string;
  variant?: "default" | "formula" | "analogy" | "mental-model";
}

const variants = {
  default: {
    border: "border-violet-500/20",
    bg: "bg-gradient-to-br from-violet-500/5 to-purple-500/5",
    accent: "text-violet-400",
    glow: "shadow-violet-500/5",
  },
  formula: {
    border: "border-cyan-500/20",
    bg: "bg-gradient-to-br from-cyan-500/5 to-blue-500/5",
    accent: "text-cyan-400",
    glow: "shadow-cyan-500/5",
  },
  analogy: {
    border: "border-amber-500/20",
    bg: "bg-gradient-to-br from-amber-500/5 to-orange-500/5",
    accent: "text-amber-400",
    glow: "shadow-amber-500/5",
  },
  "mental-model": {
    border: "border-emerald-500/20",
    bg: "bg-gradient-to-br from-emerald-500/5 to-teal-500/5",
    accent: "text-emerald-400",
    glow: "shadow-emerald-500/5",
  },
};

export default function ConceptCard({ title, children, variant = "default" }: ConceptCardProps) {
  const v = variants[variant] || variants.default;

  return (
    <div className={`my-6 rounded-xl border ${v.border} ${v.bg} p-5 shadow-lg ${v.glow} not-prose`}>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className={`w-4 h-4 ${v.accent}`} />
        <h4 className={`text-sm font-bold ${v.accent} uppercase tracking-wide`}>{title}</h4>
      </div>
      <p className="text-base text-white/80 leading-relaxed whitespace-pre-line">{children}</p>
    </div>
  );
}
