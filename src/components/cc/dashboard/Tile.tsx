// Secondary tile — small rounded discovery card. Ports handoff <Tile>.
//
// 14-radius card, 26×26 icon tile, label + caption, optional locked state
// (opacity .5, lock icon top-right, cursor not-allowed). Hover transitions
// border + background to gold tints.
"use client";

import Link from "next/link";
import {
  Lock,
  Activity, ArrowLeftRight, BookOpen, Calendar, ChartNoAxesColumn,
  Compass, DollarSign, FileText, GraduationCap, Hourglass, Mail, MapPin,
  MessageSquare, Sparkles, Sun,
} from "lucide-react";
import type { Tile as TileData, IconName } from "@/app/cc/dashboard/variants";

const ICONS: Record<IconName, typeof Sparkles> = {
  activity: Activity, arrowLeftRight: ArrowLeftRight, book: BookOpen,
  calendar: Calendar, chart: ChartNoAxesColumn, compass: Compass,
  dollar: DollarSign, fileText: FileText, grad: GraduationCap,
  hourglass: Hourglass, mail: Mail, mapPin: MapPin,
  message: MessageSquare, sparkles: Sparkles, sun: Sun,
};

export default function Tile({
  tile,
  onClick,
}: {
  tile: TileData;
  // Coach-open hrefs intercept here.
  onClick?: () => void;
}) {
  const Ic = ICONS[tile.icon] ?? Sparkles;
  const locked = Boolean(tile.locked);
  const baseStyle: React.CSSProperties = {
    padding: "14px 14px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,.07)",
    background: locked ? "rgba(255,255,255,.015)" : "rgba(255,255,255,.025)",
    cursor: locked ? "not-allowed" : "pointer",
    opacity: locked ? 0.5 : 1,
    transition: "all .15s ease",
    display: "flex", flexDirection: "column", gap: 8,
    minHeight: 84,
    textDecoration: "none", color: "inherit",
    textAlign: "left",
  };
  const inner = (
    <>
      <div className="flex items-center justify-between">
        <div
          className="grid place-items-center"
          style={{
            width: 26, height: 26, borderRadius: 7,
            background: "rgba(212,175,55,.10)",
            color: "#d4a84b",
            border: "1px solid rgba(212,175,55,.18)",
          }}
        >
          <Ic size={13} />
        </div>
        {locked && (
          <span
            className="inline-flex items-center uppercase"
            style={{
              gap: 4, fontSize: 9,
              color: "rgba(255,255,255,.50)",
              letterSpacing: ".10em",
            }}
          >
            <Lock size={10} />
          </span>
        )}
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: "#fff", letterSpacing: "-.005em" }}>
        {tile.label}
      </div>
      {tile.cap && (
        <div style={{ fontSize: 10.5, color: "rgba(255,255,255,.50)", lineHeight: 1.45 }}>
          {tile.cap}
        </div>
      )}
    </>
  );
  if (locked) {
    return <div style={baseStyle} aria-disabled>{inner}</div>;
  }
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        style={baseStyle}
        className="hover:!border-[rgba(212,175,55,.30)] hover:!bg-[rgba(212,175,55,.04)]"
      >
        {inner}
      </button>
    );
  }
  return (
    <Link
      href={tile.href}
      style={baseStyle}
      className="hover:!border-[rgba(212,175,55,.30)] hover:!bg-[rgba(212,175,55,.04)]"
    >
      {inner}
    </Link>
  );
}
