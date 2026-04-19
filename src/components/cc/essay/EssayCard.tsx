"use client";

import Link from "next/link";
import { FileText, Clock } from "lucide-react";

const PHASE_LABELS: Record<string, { label: string; color: string }> = {
  brainstorm: { label: "Brainstorm", color: "bg-purple-500/20 text-purple-300" },
  outline: { label: "Outline", color: "bg-blue-500/20 text-blue-300" },
  draft: { label: "Draft", color: "bg-amber-500/20 text-amber-300" },
  revise: { label: "Revise", color: "bg-green-500/20 text-green-300" },
};

const TYPE_LABELS: Record<string, string> = {
  personal_statement: "Personal Statement",
  supplemental: "Supplemental",
  scholarship: "Scholarship",
};

interface EssayCardProps {
  id: string;
  essayType: string;
  promptText: string;
  phase: string;
  wordCount: number | null;
  wordLimit: number;
  updatedAt: string;
}

export default function EssayCard({
  id,
  essayType,
  promptText,
  phase,
  wordCount,
  wordLimit,
  updatedAt,
}: EssayCardProps) {
  const phaseInfo = PHASE_LABELS[phase] || PHASE_LABELS.brainstorm;
  const typeLabel = TYPE_LABELS[essayType] || essayType;
  const timeAgo = getTimeAgo(updatedAt);

  return (
    <Link
      href={`/cc/essays/${id}`}
      className="block p-5 rounded-2xl border border-white/10 bg-[#141414] hover:border-[#D4AF37]/30 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-white/40" />
          <span className="text-xs text-white/40 uppercase tracking-wide">{typeLabel}</span>
        </div>
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${phaseInfo.color}`}>
          {phaseInfo.label}
        </span>
      </div>

      <p className="text-sm text-white/80 line-clamp-2 mb-3 group-hover:text-white transition-colors">
        {promptText}
      </p>

      <div className="flex items-center justify-between text-[11px] text-white/30">
        <span>
          {wordCount ?? 0} / {wordLimit} words
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {timeAgo}
        </span>
      </div>
    </Link>
  );
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
