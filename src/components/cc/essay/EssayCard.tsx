"use client";

import Link from "next/link";
import { Clock, MessageSquare, Pencil } from "lucide-react";

const PHASE_KEYS = ["brainstorm", "outline", "draft", "revise"] as const;
type PhaseKey = (typeof PHASE_KEYS)[number];

const TYPE_LABELS: Record<string, string> = {
  personal_statement: "Personal Statement",
  supplemental: "Supplemental",
  scholarship: "Scholarship",
};

// Brand color per school / type, used as the left rail. Falls back to gold.
const RAIL_COLOR: Record<string, string> = {
  personal_statement: "var(--kl-gold-app, #D4AF37)",
  supplemental: "#8A8B8C",
  scholarship: "#4ade80",
};

interface EssayCardProps {
  id: string;
  essayType: string;
  promptText: string;
  phase: string;
  wordCount: number | null;
  wordLimit: number;
  updatedAt: string;
  commentCount?: number;
}

export default function EssayCard({
  id,
  essayType,
  promptText,
  phase,
  wordCount,
  wordLimit,
  updatedAt,
  commentCount = 0,
}: EssayCardProps) {
  const phaseKey = (PHASE_KEYS as readonly string[]).includes(phase)
    ? (phase as PhaseKey)
    : "brainstorm";
  const typeLabel = TYPE_LABELS[essayType] || essayType;
  const timeAgo = getTimeAgo(updatedAt);
  const count = wordCount ?? 0;
  const over = count > wordLimit;
  const rail = RAIL_COLOR[essayType] || "var(--kl-gold-app, #D4AF37)";

  return (
    <Link href={`/cc/essays/${id}`} className="kl-essay-row group" aria-label={`${typeLabel} — ${phaseKey}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <span className="kl-essay-rail" style={{ background: rail }} aria-hidden />
          <div className="min-w-0">
            <div className="kl-essay-kind">{typeLabel}</div>
            <div className="kl-essay-title truncate group-hover:text-[var(--kl-gold-app,#D4AF37)] transition-colors">
              {typeLabel}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`kl-phase-chip ${phaseKey}`}>{phaseKey}</span>
          <span className="inline-flex items-center gap-1 text-[11px] text-white/50 group-hover:text-white/80 transition-colors">
            <Pencil className="w-3 h-3" /> Open
          </span>
        </div>
      </div>

      <p className="kl-essay-preview line-clamp-2">{promptText}</p>

      <div className="kl-essay-foot">
        <div className="flex items-center gap-4">
          <span
            className="font-mono tabular-nums"
            style={{
              color: over ? "var(--kl-state-reach, #f87171)" : "rgba(255,255,255,0.5)",
            }}
          >
            {count} / {wordLimit} words{over ? " · over" : ""}
          </span>
          {commentCount > 0 && (
            <span className="inline-flex items-center gap-1">
              <MessageSquare className="w-2.5 h-2.5" aria-hidden /> {commentCount} comments
            </span>
          )}
        </div>
        <span className="inline-flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" aria-hidden /> {timeAgo}
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
