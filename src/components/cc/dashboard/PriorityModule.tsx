// Priority module — full card with icon-tile + title + subtitle + content
// + footer CTA. Ports the handoff <PriorityModule>.
//
// The content area takes a number / text value from variants.ts plus a meta
// caption. Future iterations can swap the `<div>` content for richer
// per-variant widgets (SAT bar charts, "Coach noticed" callouts, decision
// tracker mini-charts) — the structure already accepts ReactNode children
// so that work doesn't require a redesign.
"use client";

import Link from "next/link";
import {
  ArrowRight,
  Activity, ArrowLeftRight, BookOpen, Calendar, ChartNoAxesColumn,
  Compass, DollarSign, FileText, GraduationCap, Hourglass, Mail, MapPin,
  MessageSquare, Sparkles, Sun,
} from "lucide-react";
import type { PriorityCard, IconName, PriorityExtra } from "@/app/cc/dashboard/variants";

const ICONS: Record<IconName, typeof Sparkles> = {
  activity: Activity, arrowLeftRight: ArrowLeftRight, book: BookOpen,
  calendar: Calendar, chart: ChartNoAxesColumn, compass: Compass,
  dollar: DollarSign, fileText: FileText, grad: GraduationCap,
  hourglass: Hourglass, mail: Mail, mapPin: MapPin,
  message: MessageSquare, sparkles: Sparkles, sun: Sun,
};

export default function PriorityModule({
  card,
  onClick,
}: {
  card: PriorityCard;
  // When the href is a coach-open URL, the parent intercepts and provides
  // an onClick that opens the drawer in-place instead of navigating.
  onClick?: () => void;
}) {
  const Ic = ICONS[card.icon] ?? Sparkles;
  const isUrgent = Boolean(card.urgent);
  const wrapperStyle: React.CSSProperties = {
    padding: "18px 18px 14px",
    borderRadius: 14,
    border: "1px solid " + (isUrgent ? "rgba(239,68,68,.30)" : "rgba(255,255,255,.08)"),
    background: isUrgent ? "rgba(239,68,68,.04)" : "rgba(255,255,255,.025)",
    display: "flex", flexDirection: "column", gap: 12, minHeight: 200,
    color: "inherit", textDecoration: "none", cursor: "pointer",
    transition: "border-color .18s ease, background .18s ease",
  };
  const inner = (
    <>
      <div className="flex items-center" style={{ gap: 10 }}>
        <div
          className="grid place-items-center shrink-0"
          style={{
            width: 28, height: 28, borderRadius: 8,
            background: "rgba(212,175,55,.10)",
            border: "1px solid rgba(212,175,55,.25)",
            color: "#d4a84b",
          }}
        >
          <Ic size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", letterSpacing: "-.005em" }}>
            {card.label}
          </div>
          {card.meta && (
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.50)", marginTop: 1 }}>
              {card.meta}
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center" style={{ gap: 6 }}>
        {renderContent(card, isUrgent)}
        {card.nudge && (
          <CoachNudge eyebrow={card.nudge.eyebrow} observation={card.nudge.observation} />
        )}
      </div>
      <div
        className="flex items-center justify-between"
        style={{
          paddingTop: 10,
          borderTop: "1px dashed rgba(255,255,255,.08)",
          fontSize: 12, color: "#d4a84b",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <span>Open</span>
        <ArrowRight size={12} />
      </div>
    </>
  );
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        style={wrapperStyle}
        className="text-left hover:!bg-[rgba(212,175,55,.04)] hover:!border-[rgba(212,175,55,.30)]"
      >
        {inner}
      </button>
    );
  }
  return (
    <Link
      href={card.href}
      style={wrapperStyle}
      className="hover:!bg-[rgba(212,175,55,.04)] hover:!border-[rgba(212,175,55,.30)]"
    >
      {inner}
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Content slot — switches on card.extra.kind. Without an `extra`, falls
// back to the simple num/text value treatment that the Phase 2 dashboard
// shipped with.
// ─────────────────────────────────────────────────────────────────────────
function renderContent(card: PriorityCard, isUrgent: boolean) {
  if (!card.extra) {
    if (card.valueKind === "num") {
      return (
        <div className="flex items-baseline" style={{ gap: 8 }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 32, fontWeight: 500,
              color: isUrgent ? "#fca5a5" : "#d4af37",
              letterSpacing: "-.02em", lineHeight: 1,
            }}
          >
            {card.valueNum}
          </span>
          {card.valueSuffix && (
            <span style={{ fontSize: 12, color: "rgba(255,255,255,.55)" }}>
              {card.valueSuffix}
            </span>
          )}
        </div>
      );
    }
    return (
      <div
        style={{
          fontSize: 18,
          fontWeight: 500,
          color: isUrgent ? "#fca5a5" : "#f2ede3",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {card.valueText}
      </div>
    );
  }
  return renderExtra(card.extra);
}

function renderExtra(extra: PriorityExtra) {
  switch (extra.kind) {
    case "phaseBar":
      return <PhaseBar phases={extra.phases} current={extra.current} />;
    case "progressBar":
      return <ProgressBar current={extra.current} total={extra.total} tone={extra.tone} />;
    case "decisionCounts":
      return <DecisionCounts {...extra} />;
    case "satBars":
      return <SatBars reading={extra.reading} math={extra.math} target={extra.target} />;
  }
}

// ─── PhaseBar — 4-segment progress, current=gold, completed=green ───────
function PhaseBar({ phases, current }: { phases: string[]; current: string | null }) {
  const currentIdx = current ? phases.findIndex((p) => p.toLowerCase() === current.toLowerCase()) : -1;
  return (
    <div className="flex flex-col" style={{ gap: 8 }}>
      <div className="flex items-center" style={{ gap: 4 }}>
        {phases.map((phase, i) => {
          const done = currentIdx >= 0 && i < currentIdx;
          const active = i === currentIdx;
          return (
            <span
              key={phase}
              aria-label={`${phase}${active ? " (current)" : done ? " (done)" : ""}`}
              className="flex-1"
              style={{
                height: 4, borderRadius: 2,
                background: active ? "#d4af37" : done ? "#4ade80" : "rgba(255,255,255,.10)",
              }}
            />
          );
        })}
      </div>
      <div
        className="flex items-center justify-between"
        style={{ fontSize: 11, color: "rgba(255,255,255,.55)", fontFamily: "'DM Sans', sans-serif" }}
      >
        {phases.map((phase, i) => (
          <span
            key={phase}
            style={{
              color: i === currentIdx ? "#d4af37" : i < currentIdx ? "#86efac" : "rgba(255,255,255,.40)",
              fontWeight: i === currentIdx ? 500 : 400,
            }}
          >
            {phase}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── ProgressBar — single-line "X of Y · 60%" ───────────────────────────
function ProgressBar({
  current, total, tone,
}: {
  current: number; total: number; tone?: "gold" | "leaf";
}) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  const color = tone === "leaf" ? "#4ade80" : "#d4af37";
  return (
    <div className="flex flex-col" style={{ gap: 8 }}>
      <div className="flex items-baseline" style={{ gap: 8 }}>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 24, fontWeight: 500, color,
            letterSpacing: "-.02em", lineHeight: 1,
          }}
        >
          {current}
        </span>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,.55)" }}>of {total}</span>
        <span
          className="ml-auto"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11, color, letterSpacing: ".02em",
          }}
        >
          {pct}%
        </span>
      </div>
      <div
        style={{
          height: 4, borderRadius: 4,
          background: "rgba(255,255,255,.06)", overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`, height: "100%", background: color,
            transition: "width .3s ease",
          }}
        />
      </div>
    </div>
  );
}

// ─── DecisionCounts — 4-row breakdown for senior_decisions ──────────────
function DecisionCounts({
  admitted, waitlisted, denied, pending,
}: {
  admitted: number; waitlisted: number; denied: number; pending: number;
}) {
  const rows: { label: string; n: number; color: string }[] = [
    { label: "Admitted",   n: admitted,   color: "#4ade80" },
    { label: "Waitlisted", n: waitlisted, color: "#7dd3fc" },
    { label: "Denied",     n: denied,     color: "#f87171" },
    { label: "Pending",    n: pending,    color: "rgba(255,255,255,.40)" },
  ];
  return (
    <div className="flex flex-col" style={{ gap: 6 }}>
      {rows.map((r) => (
        <div
          key={r.label}
          className="flex items-center"
          style={{ gap: 10, fontSize: 12, color: "rgba(255,255,255,.75)", fontFamily: "'DM Sans', sans-serif" }}
        >
          <span
            aria-hidden
            style={{
              display: "inline-flex", width: 8, height: 8, borderRadius: 999,
              background: r.color,
            }}
          />
          <span style={{ flex: 1 }}>{r.label}</span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12, color: r.color, letterSpacing: ".02em",
            }}
          >
            {r.n}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── CoachNudge — Phase 2.7 AI-generated observation in gold callout ────
// Rendered below the main widget when card.nudge is populated. Voice +
// styling lift directly from the handoff dashboard.jsx "Coach's nudge"
// pattern — italic Cormorant Garamond inside a gold-tinted box with a
// small uppercase eyebrow.
function CoachNudge({ eyebrow, observation }: { eyebrow: string; observation: string }) {
  return (
    <div
      style={{
        padding: 10,
        borderRadius: 8,
        background: "rgba(212,175,55,.06)",
        border: "1px solid rgba(212,175,55,.25)",
        marginTop: 8,
      }}
    >
      <div
        className="uppercase"
        style={{
          fontSize: 11, color: "#d4a84b",
          letterSpacing: ".10em",
          marginBottom: 4,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          fontSize: 12, color: "#f2ede3",
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic", lineHeight: 1.4,
        }}
      >
        &ldquo;{observation}&rdquo;
      </div>
    </div>
  );
}

// ─── SatBars — Reading / Math / Target stacked bars for junior ──────────
function SatBars({
  reading, math, target,
}: {
  reading: number | null; math: number | null; target: number;
}) {
  if (reading === null && math === null) {
    return (
      <div
        style={{
          padding: "8px 10px", borderRadius: 8,
          background: "rgba(212,175,55,.06)",
          border: "1px solid rgba(212,175,55,.22)",
          fontSize: 11.5, color: "#fcd34d", lineHeight: 1.5,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        Take a diagnostic SAT or ACT this fall to set your baseline.
      </div>
    );
  }
  const rows: { label: string; v: number | null; pct: number; tone: "gold" | "leaf" }[] = [
    { label: "Reading", v: reading, pct: reading != null ? (reading / 800) * 100 : 0, tone: "gold" },
    { label: "Math",    v: math,    pct: math    != null ? (math    / 800) * 100 : 0, tone: "gold" },
    { label: "Target",  v: target,  pct: (target / 1600) * 100, tone: "leaf" },
  ];
  return (
    <div className="flex flex-col" style={{ gap: 8 }}>
      {rows.map((r) => (
        <div
          key={r.label}
          className="flex items-center"
          style={{ gap: 10, fontSize: 12, color: "rgba(255,255,255,.75)", fontFamily: "'DM Sans', sans-serif" }}
        >
          <span style={{ flex: "0 0 60px" }}>{r.label}</span>
          <div
            style={{
              flex: 1, height: 4, borderRadius: 4,
              background: "rgba(255,255,255,.06)", overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${Math.min(r.pct, 100)}%`, height: "100%",
                background: r.tone === "leaf" ? "#4ade80" : "#d4af37",
                transition: "width .3s ease",
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: r.tone === "leaf" ? "#86efac" : "#fff",
              letterSpacing: ".02em",
              minWidth: 40, textAlign: "right",
            }}
          >
            {r.v ?? "—"}
          </span>
        </div>
      ))}
    </div>
  );
}
