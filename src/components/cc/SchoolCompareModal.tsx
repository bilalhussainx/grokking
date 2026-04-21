"use client";

import { useState } from "react";
import { X, GitCompare, Loader2 } from "lucide-react";

interface SchoolOption {
  id: string;
  name: string;
}

interface CompareResult {
  schoolA: { label: string; defining: string[] };
  schoolB: { label: string; defining: string[] };
  similarities: string[];
  differences: string[];
  bestFor: { schoolA: string; schoolB: string };
  recommendation: string;
}

interface Props {
  schools: SchoolOption[];
  onClose: () => void;
}

export default function SchoolCompareModal({ schools, onClose }: Props) {
  const [aId, setAId] = useState<string>(schools[0]?.id || "");
  const [bId, setBId] = useState<string>(schools[1]?.id || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompareResult | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const canCompare = aId && bId && aId !== bId;

  const run = async () => {
    setLoading(true);
    setErr(null);
    setResult(null);
    try {
      const res = await fetch("/api/cc/schools/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ school_a: aId, school_b: bId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error || `Compare failed (${res.status})`);
        return;
      }
      setResult(data.comparison);
    } catch {
      setErr("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0b0b0b] border border-white/15 rounded-xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="text-sm font-semibold text-white">Compare schools</h3>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white/80">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-4 py-3 border-b border-white/10 flex flex-wrap items-center gap-2">
          <select
            value={aId}
            onChange={(e) => setAId(e.target.value)}
            className="flex-1 min-w-[180px] px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
          >
            <option value="">Select school A</option>
            {schools.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <span className="text-white/30 text-xs">vs</span>
          <select
            value={bId}
            onChange={(e) => setBId(e.target.value)}
            className="flex-1 min-w-[180px] px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
          >
            <option value="">Select school B</option>
            {schools.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <button
            onClick={run}
            disabled={!canCompare || loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-medium hover:bg-[#D4AF37]/25 disabled:opacity-40"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <GitCompare className="w-3.5 h-3.5" />
            )}
            {loading ? "Comparing..." : "Compare"}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 text-xs text-white/75 leading-relaxed">
          {err && (
            <p className="text-red-300 text-xs mb-2">{err}</p>
          )}
          {!result && !loading && !err && (
            <p className="text-white/30 text-center py-10">
              Pick two schools and hit compare to see the side-by-side.
            </p>
          )}
          {result && (
            <div className="space-y-5">
              <section>
                <h4 className="text-[11px] font-semibold text-[#D4AF37] uppercase tracking-wide mb-2">
                  Recommendation
                </h4>
                <div className="p-3 rounded-lg bg-[#D4AF37]/5 border border-[#D4AF37]/20 text-white/80">
                  {result.recommendation}
                </div>
              </section>

              <section className="grid md:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10">
                  <p className="text-[11px] font-medium text-white mb-2">{result.schoolA.label}</p>
                  <ul className="list-disc ml-4 space-y-1">
                    {result.schoolA.defining.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                  <p className="text-[10px] text-white/40 mt-2 italic">
                    Best for: {result.bestFor.schoolA}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10">
                  <p className="text-[11px] font-medium text-white mb-2">{result.schoolB.label}</p>
                  <ul className="list-disc ml-4 space-y-1">
                    {result.schoolB.defining.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                  <p className="text-[10px] text-white/40 mt-2 italic">
                    Best for: {result.bestFor.schoolB}
                  </p>
                </div>
              </section>

              <section>
                <h4 className="text-[11px] font-semibold text-[#D4AF37] uppercase tracking-wide mb-2">
                  What&rsquo;s similar
                </h4>
                <ul className="list-disc ml-5 space-y-1.5">
                  {result.similarities.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </section>

              <section>
                <h4 className="text-[11px] font-semibold text-[#D4AF37] uppercase tracking-wide mb-2">
                  What&rsquo;s different
                </h4>
                <ul className="list-disc ml-5 space-y-1.5">
                  {result.differences.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
