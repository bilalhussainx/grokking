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
import type { PriorityCard, IconName } from "@/app/cc/dashboard/variants";

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
        {card.valueKind === "num" ? (
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
        ) : (
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
