"use client";

import { useState } from "react";
import { Sparkles, Loader2, Target, AlertTriangle, Plus } from "lucide-react";

type Narrative = {
  profileType: "spike" | "well_rounded" | "unclear";
  whatAdmissionsSees: string;
  strengths: string[];
  gaps: string[];
  suggestedAdditions: string[];
  schoolFitRecommendation: string;
  culturalContextNotes: string[];
};

const PROFILE_LABEL: Record<Narrative["profileType"], string> = {
  spike: "SPIKE",
  well_rounded: "WELL-ROUNDED",
  unclear: "UNCLEAR",
};

const PROFILE_BADGE_CLASS: Record<Narrative["profileType"], string> = {
  spike: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
  well_rounded: "bg-sky-500/15 text-sky-300 border-sky-500/40",
  unclear: "bg-amber-500/15 text-amber-300 border-amber-500/40 border-dashed",
};

export default function NarrativeReport({ activitiesCount }: { activitiesCount: number }) {
  const [narrative, setNarrative] = useState<Narrative | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cc/activities/narrative", { method: "POST" });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `Status ${res.status}`);
      }
      setNarrative(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  if (activitiesCount < 3) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-[12.5px] text-white/55 italic">
        Add at least 3 activities to unlock the Narrative Diagnosis.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 mt-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <h3 className="text-sm font-semibold text-white">Narrative Diagnosis</h3>
        </div>
        {narrative && (
          <span
            className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border ${PROFILE_BADGE_CLASS[narrative.profileType]}`}
          >
            {PROFILE_LABEL[narrative.profileType]}
          </span>
        )}
      </div>

      {!narrative && (
        <>
          <p className="text-[13px] text-white/65 mb-4">
            Read your activities the way an admissions reader will. The diagnosis names what your
            list is telling them, what&apos;s missing, and what to add.
          </p>
          <button
            type="button"
            onClick={run}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-[#D4AF37] text-black text-[13px] font-medium hover:bg-[#C4A030] disabled:opacity-50 inline-flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            {loading ? "Analyzing your story…" : "Analyze My Story"}
          </button>
          {error && <p className="text-rose-300 text-[12px] mt-3">{error}</p>}
        </>
      )}

      {narrative && (
        <div className="space-y-4">
          <blockquote className="border-l-2 border-[#D4AF37] pl-4 text-[14px] text-white/85 italic leading-relaxed">
            &ldquo;{narrative.whatAdmissionsSees}&rdquo;
          </blockquote>

          {narrative.strengths.length > 0 && (
            <div>
              <h4 className="text-[11px] uppercase tracking-wider text-emerald-400 mb-1.5 font-semibold">
                Strengths
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {narrative.strengths.map((s, i) => (
                  <span
                    key={i}
                    className="text-[12px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-200 border border-emerald-500/30"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {narrative.gaps.length > 0 && (
            <div>
              <h4 className="text-[11px] uppercase tracking-wider text-amber-400 mb-1.5 font-semibold inline-flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Gaps
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {narrative.gaps.map((g, i) => (
                  <span
                    key={i}
                    className="text-[12px] px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-200 border border-amber-500/30"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          )}

          {narrative.suggestedAdditions.length > 0 && (
            <div>
              <h4 className="text-[11px] uppercase tracking-wider text-sky-400 mb-1.5 font-semibold inline-flex items-center gap-1">
                <Plus className="w-3 h-3" /> Suggested additions
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {narrative.suggestedAdditions.map((s, i) => (
                  <span
                    key={i}
                    className="text-[12px] px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-200 border border-sky-500/30"
                  >
                    + {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-lg bg-white/[0.04] p-3 border border-white/5">
            <h4 className="text-[11px] uppercase tracking-wider text-white/55 mb-1.5 font-semibold inline-flex items-center gap-1">
              <Target className="w-3 h-3" /> For your school list
            </h4>
            <p className="text-[13px] text-white/80">{narrative.schoolFitRecommendation}</p>
          </div>

          {narrative.culturalContextNotes.length > 0 && (
            <div>
              <h4 className="text-[11px] uppercase tracking-wider text-white/55 mb-1.5 font-semibold">
                Cultural context (so admissions reads correctly)
              </h4>
              <ul className="space-y-1">
                {narrative.culturalContextNotes.map((n, i) => (
                  <li key={i} className="text-[12.5px] text-white/70">· {n}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="button"
            onClick={run}
            disabled={loading}
            className="text-[11.5px] text-white/55 hover:text-white/80 underline"
          >
            Re-analyze
          </button>
        </div>
      )}
    </div>
  );
}
