"use client";

// SP-1 — scorecard block: last 3 college interviews with a sparkline-ish trend.
import { useEffect, useState } from "react";
import Link from "next/link";
import { Mic, ArrowRight } from "lucide-react";

interface Row {
  id: string;
  session_id: string;
  company_persona_id: string | null;
  overall_score: number | null;
  communication_score: number | null;
  technical_depth_score: number | null;
  problem_solving_score: number | null;
  created_at: string;
}

function scoreColor(s: number | null) {
  if (s == null) return "text-white/40";
  if (s >= 8) return "text-emerald-400";
  if (s >= 6) return "text-yellow-400";
  if (s >= 4) return "text-orange-400";
  return "text-rose-400";
}

export default function InterviewScorecardBlock({ category = "college" }: { category?: string }) {
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    let cancel = false;
    fetch(`/api/interviews/recent?category=${category}&limit=3`)
      .then((r) => r.ok ? r.json() : null)
      .then((j) => { if (!cancel && j?.sessions) setRows(j.sessions); });
    return () => { cancel = true; };
  }, [category]);

  if (!rows) return null;
  if (rows.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <Mic className="w-5 h-5 text-sky-400" />
          <h3 className="font-medium">Interview scorecard</h3>
        </div>
        <p className="text-sm text-white/60 mb-3">
          No {category} interviews yet. Reps compound — specificity comes from practice.
        </p>
        <Link href="/college-interviews" className="text-sm text-sky-400 hover:text-sky-300 inline-flex items-center gap-1">
          Start one <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    );
  }

  const avg = rows.reduce((a, b) => a + (b.overall_score || 0), 0) / rows.length;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Mic className="w-5 h-5 text-sky-400" />
          <h3 className="font-medium">Recent interviews</h3>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold leading-none ${scoreColor(avg)}`}>{avg.toFixed(1)}</div>
          <div className="text-xs text-white/40">avg /10</div>
        </div>
      </div>
      <div className="space-y-2">
        {rows.map((r) => (
          <Link
            key={r.id}
            href={`/college-interviews/${r.session_id}/results`}
            className="flex items-center justify-between p-2.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <div>
              <div className="text-sm text-white/90">{r.company_persona_id || "college"}</div>
              <div className="text-xs text-white/40">
                {new Date(r.created_at).toLocaleDateString()}
                {r.communication_score != null && (
                  <> · comm {r.communication_score}/10 · problem-solving {r.problem_solving_score}/10</>
                )}
              </div>
            </div>
            <div className={`text-lg font-semibold tabular-nums ${scoreColor(r.overall_score)}`}>
              {r.overall_score ?? "—"}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
