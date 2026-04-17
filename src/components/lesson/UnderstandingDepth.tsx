"use client";

import { useEffect, useState } from "react";

interface ArticulationResult {
  score: number;
  gaps: string[];
  hasData: boolean;
}

interface UnderstandingDepthProps {
  lessonId: string;
  isCompleted: boolean;
}

export default function UnderstandingDepth({
  lessonId,
  isCompleted,
}: UnderstandingDepthProps) {
  const [result, setResult] = useState<ArticulationResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isCompleted) {
      setLoading(false);
      return;
    }

    fetch(`/api/ai/articulation?lessonId=${encodeURIComponent(lessonId)}`)
      .then((res) => res.json())
      .then((data) => setResult(data))
      .catch(() => setResult(null))
      .finally(() => setLoading(false));
  }, [lessonId, isCompleted]);

  if (!isCompleted) return null;

  if (loading) {
    return (
      <div className="mb-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-3 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 rounded-full bg-white/10" />
          <div className="h-3 w-40 rounded bg-white/10" />
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-white/10" />
      </div>
    );
  }

  // No voice data — prompt user
  if (!result || !result.hasData) {
    return (
      <div className="mb-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-3">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4 text-zinc-500 flex-shrink-0"
          >
            <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
            <path d="M5.5 9.643a.75.75 0 00-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-1.5v-1.546A6.001 6.001 0 0016 10v-.357a.75.75 0 00-1.5 0V10a4.5 4.5 0 01-9 0v-.357z" />
          </svg>
          <span>
            Practice explaining this lesson with Coach Kairos to measure your
            understanding
          </span>
        </div>
      </div>
    );
  }

  const score = result.score;
  const pct = Math.round(score * 100);

  let barColor: string;
  let label: string;
  let textColor: string;
  let borderColor: string;

  if (pct >= 80) {
    barColor = "bg-emerald-500";
    textColor = "text-emerald-400";
    borderColor = "border-emerald-500/20";
    label = "Deep understanding \u2014 you can explain this well";
  } else if (pct >= 60) {
    barColor = "bg-blue-500";
    textColor = "text-blue-400";
    borderColor = "border-blue-500/20";
    label = "Good understanding";
  } else {
    barColor = "bg-amber-500";
    textColor = "text-amber-400";
    borderColor = "border-amber-500/20";
    label = "Shallow understanding \u2014 try explaining this concept aloud";
  }

  return (
    <div
      className={`mb-4 rounded-xl border ${borderColor} bg-white/5 backdrop-blur-md p-3`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-xs font-medium ${textColor}`}>
          Understanding Depth
        </span>
        <span className="text-xs font-mono text-zinc-400">{pct}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className={`mt-1.5 text-xs ${textColor}`}>{label}</p>

      {/* Show gaps if shallow */}
      {result.gaps.length > 0 && (
        <div className="mt-2 space-y-1">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Topics to revisit
          </p>
          {result.gaps.map((gap, i) => (
            <p key={i} className="text-xs text-zinc-400 pl-2 border-l border-amber-500/30">
              {gap}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
