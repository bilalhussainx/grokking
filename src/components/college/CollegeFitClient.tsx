"use client";

// SP-7 — holistic fit evaluator client.
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Compass, Loader2, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { COLLEGE_PERSONAS } from "@/data/college-interviewer-personas";

interface FitReport {
  schoolId: string;
  schoolName: string;
  overallScore: number;
  oneLineRead: string;
  strengths: Array<{ title: string; evidence: string }>;
  gaps: Array<{ title: string; why: string; suggestion: string }>;
  nextMoves: string[];
  cached?: boolean;
}

export default function CollegeFitClient() {
  const [schoolId, setSchoolId] = useState(COLLEGE_PERSONAS[0]?.id || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<FitReport | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      const res = await fetch("/api/college-fit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolId }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || `HTTP ${res.status}`);
      setReport(j.report);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  const scoreColor =
    !report ? "" :
    report.overallScore >= 80 ? "text-emerald-400" :
    report.overallScore >= 60 ? "text-yellow-400" :
    report.overallScore >= 40 ? "text-orange-400" :
    "text-rose-400";

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Link href="/college-interviews" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to college interviews
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Compass className="w-7 h-7 text-sky-400" />
          <h1 className="text-3xl font-semibold">School-fit evaluator</h1>
        </div>
        <p className="text-white/70 max-w-2xl">
          Honest read of how your current profile + activities + essays line up with what
          a specific school distinctively values. Not a prediction — a map of strengths and gaps.
        </p>
      </header>

      <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-8">
        <div className="flex items-end gap-3 flex-wrap">
          <div className="flex-1 min-w-[240px]">
            <label className="block text-xs uppercase tracking-wide text-white/50 mb-1.5">Target school</label>
            <select
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-sm"
            >
              {COLLEGE_PERSONAS.map((p) => (
                <option key={p.id} value={p.id}>{p.fullName || p.school}</option>
              ))}
            </select>
          </div>
          <button
            onClick={run}
            disabled={loading || !schoolId}
            className="bg-sky-500 hover:bg-sky-400 disabled:bg-sky-500/40 px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? "Evaluating…" : "Evaluate fit"}
          </button>
        </div>
        {error && <p className="text-rose-400 text-sm mt-3">{error}</p>}
      </div>

      {report && (
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-baseline gap-4 mb-2">
              <span className={`text-5xl font-bold ${scoreColor}`}>{report.overallScore}</span>
              <span className="text-white/50 text-sm">/ 100 fit for {report.schoolName}</span>
              {report.cached && <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-white/60">cached</span>}
            </div>
            <p className="text-white/80">{report.oneLineRead}</p>
          </div>

          {report.strengths.length > 0 && (
            <section className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-5">
              <h2 className="flex items-center gap-2 text-emerald-300 font-medium mb-3">
                <CheckCircle2 className="w-5 h-5" /> Strengths
              </h2>
              <ul className="space-y-2">
                {report.strengths.map((s, i) => (
                  <li key={i} className="text-sm">
                    <span className="font-medium text-white">{s.title}</span>
                    <span className="text-white/60 block mt-0.5 pl-3 border-l border-white/10">{s.evidence}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {report.gaps.length > 0 && (
            <section className="bg-orange-950/20 border border-orange-500/20 rounded-xl p-5">
              <h2 className="flex items-center gap-2 text-orange-300 font-medium mb-3">
                <AlertCircle className="w-5 h-5" /> Gaps
              </h2>
              <ul className="space-y-3">
                {report.gaps.map((g, i) => (
                  <li key={i} className="text-sm">
                    <span className="font-medium text-white">{g.title}</span>
                    <span className="text-white/60 block mt-0.5">{g.why}</span>
                    <span className="text-orange-300/90 block mt-1 text-xs">→ {g.suggestion}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {report.nextMoves.length > 0 && (
            <section className="bg-sky-950/20 border border-sky-500/20 rounded-xl p-5">
              <h2 className="flex items-center gap-2 text-sky-300 font-medium mb-3">
                <Sparkles className="w-5 h-5" /> Next moves
              </h2>
              <ol className="space-y-2 list-decimal list-inside text-sm text-white/80">
                {report.nextMoves.map((m, i) => <li key={i}>{m}</li>)}
              </ol>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
