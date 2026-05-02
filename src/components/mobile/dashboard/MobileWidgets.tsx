"use client";
import type { WidgetItem } from "@/components/cc/dashboard/sections/types";

export default function MobileWidgets({ items }: { items: WidgetItem[] }) {
  if (!items.length) return null;
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-2"
      style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" } as React.CSSProperties}
      data-testid="mobile-widgets-strip"
    >
      {items.map((it, i) => (
        <div
          key={`${it.label}-${i}`}
          className="shrink-0 rounded-xl p-3 flex flex-col gap-1"
          style={{
            minWidth: 110,
            scrollSnapAlign: "start",
            border: "1px solid rgba(255,255,255,.08)",
            background: "rgba(20,20,20,.6)",
          }}
        >
          <span
            className="tabular-nums text-[18px] font-semibold tracking-tight"
            style={{
              color: it.tone === "gold" ? "#d4af37" : "#fff",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {it.n}
          </span>
          <span className="text-[10px] uppercase tracking-[0.12em] text-white/45 truncate">
            {it.label}
          </span>
          {it.delta && (
            <span
              className="text-[10px] tabular-nums"
              style={{ color: it.delta.startsWith("+") ? "#86efac" : "#fca5a5" }}
            >
              {it.delta}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
