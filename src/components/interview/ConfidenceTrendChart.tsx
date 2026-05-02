// Plain SVG line chart — no charting dep, ~80 lines. Renders confidence
// 1-10 over time. Empty state for fewer than 2 points (a chart of 1 dot is
// useless).
"use client";

type Point = { interview_date: string | null; school_name: string; confidence_score: number };

export default function ConfidenceTrendChart({ points }: { points: Point[] }) {
  if (points.length < 2) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-[12.5px] text-white/55">
        Log at least two interview reflections to see your confidence trend.
      </div>
    );
  }

  const W = 560, H = 180, P = 28;
  const xs = points.map((_, i) => P + (i * (W - P * 2)) / (points.length - 1));
  const ys = points.map((p) => H - P - ((p.confidence_score - 1) / 9) * (H - P * 2));
  const path = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <h3 className="text-[13px] font-semibold text-white mb-1">Confidence trend</h3>
      <p className="text-[11.5px] text-white/55 mb-3">Self-rated 1-10 after each interview.</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Confidence trend chart">
        {[1, 5, 10].map((v) => {
          const y = H - P - ((v - 1) / 9) * (H - P * 2);
          return (
            <g key={v}>
              <line x1={P} y1={y} x2={W - P} y2={y} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
              <text x={4} y={y + 4} fontSize="10" fill="rgba(255,255,255,0.45)">{v}</text>
            </g>
          );
        })}
        <path d={path} stroke="#D4AF37" strokeWidth="2" fill="none" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={xs[i]} cy={ys[i]} r="3.5" fill="#D4AF37" />
            <title>{p.school_name} · {p.confidence_score}/10{p.interview_date ? ` · ${p.interview_date}` : ""}</title>
          </g>
        ))}
      </svg>
    </div>
  );
}
