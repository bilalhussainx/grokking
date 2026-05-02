// Eyebrow ("Good morning") + Cormorant Garamond name in 34px + right-side
// date + tinted status pill. Ports the handoff dashboard.jsx <Greeting>
// component so the dashboard top-block matches design exactly.
//
// Status tone drives the pill color: gold (default), leaf (green), sky
// (blue), rose (red). Tones map to dashboard variant per
// tokens.json → dashboard.statusToneByGrade.
import type { StatusTone } from "@/app/cc/dashboard/variants";

const TONE_PALETTE: Record<StatusTone, { fg: string; bg: string; edge: string }> = {
  gold: { fg: "#fcd34d", bg: "rgba(212,175,55,.10)", edge: "rgba(212,175,55,.30)" },
  leaf: { fg: "#86efac", bg: "rgba(74,222,128,.10)", edge: "rgba(74,222,128,.30)" },
  sky:  { fg: "#7dd3fc", bg: "rgba(56,189,248,.10)", edge: "rgba(56,189,248,.30)" },
  rose: { fg: "#fca5a5", bg: "rgba(239,68,68,.10)",  edge: "rgba(239,68,68,.30)" },
};

function timeAwareGreeting(): string {
  const h = new Date().getHours();
  return h < 5 ? "Late night" : h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

function dateLabel(): string {
  // "Tue · Apr 21"
  const now = new Date();
  const dow = now.toLocaleDateString("en-US", { weekday: "short" });
  const month = now.toLocaleDateString("en-US", { month: "short" });
  return `${dow} · ${month} ${now.getDate()}`;
}

export default function Greeting({
  preferredName,
  statusLabel,
  statusTone = "gold",
}: {
  preferredName: string | null;
  statusLabel: string;
  statusTone?: StatusTone;
}) {
  const name = preferredName ? `Hi, ${preferredName}.` : "Welcome.";
  const tone = TONE_PALETTE[statusTone];
  return (
    <div
      className="flex items-end justify-between"
      style={{ padding: "24px 32px 0", gap: 16 }}
    >
      <div>
        <div
          className="uppercase"
          style={{
            fontSize: 11, color: "rgba(255,255,255,.55)",
            letterSpacing: ".16em",
            fontFamily: "'DM Sans', sans-serif",
            marginBottom: 6,
          }}
        >
          {timeAwareGreeting()}
        </div>
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 400, fontSize: 34, lineHeight: 1,
            color: "#f2ede3", letterSpacing: "-.01em",
          }}
        >
          {name}
        </div>
      </div>
      <div className="flex flex-col items-end" style={{ gap: 6, textAlign: "right" }}>
        <div
          style={{
            fontSize: 11, color: "rgba(255,255,255,.40)",
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: ".04em",
          }}
        >
          {dateLabel()}
        </div>
        <div
          className="inline-flex items-center"
          style={{
            gap: 8, padding: "6px 12px", borderRadius: 999,
            background: tone.bg,
            border: `1px solid ${tone.edge}`,
            color: tone.fg,
            fontSize: 11.5, fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          }}
        >
          <span
            aria-hidden
            style={{
              width: 6, height: 6, borderRadius: 999,
              background: "currentColor",
              boxShadow: "0 0 6px currentColor",
            }}
          />
          {statusLabel}
        </div>
      </div>
    </div>
  );
}
