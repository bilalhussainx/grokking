// Bottom returns-strip: horizontal grid of N widgets, separated by 1px
// right-borders. Each: mono number (gold if tone=gold) + uppercase label
// + optional delta (green if positive, rose if negative).
//
// Ports handoff <WidgetStrip>.
import type { WidgetItem } from "@/app/cc/dashboard/variants";

export default function WidgetStrip({ items }: { items: WidgetItem[] }) {
  if (!items.length) return null;
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${items.length}, 1fr)`,
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,.06)",
        background: "rgba(255,255,255,.015)",
        overflow: "hidden",
      }}
    >
      {items.map((it, i) => (
        <div
          key={`${it.label}-${i}`}
          className="flex items-baseline"
          style={{
            padding: "14px 18px",
            borderRight: i < items.length - 1 ? "1px solid rgba(255,255,255,.05)" : "none",
            gap: 10,
          }}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 20, fontWeight: 500,
              color: it.tone === "gold" ? "#d4af37" : "#fff",
              letterSpacing: "-.02em",
            }}
          >
            {it.n}
          </div>
          <div
            className="uppercase"
            style={{
              fontSize: 10.5, color: "rgba(255,255,255,.50)",
              letterSpacing: ".16em",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {it.label}
          </div>
          {it.delta && (
            <div
              className="ml-auto"
              style={{
                fontSize: 10,
                color: it.delta.startsWith("+") ? "#86efac" : "#fca5a5",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {it.delta}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
