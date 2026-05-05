"use client";

// /cc/essays/supplements — supplements dashboard.
//
// Shows every school on the student's list. Each school card expands inline
// to reveal that school's supplement prompts (mirrors the essay studio's
// per-school selector — students wanted to see prompts without an extra
// click). Clicking "Start essay" creates a cc_essays row linked to the
// supplement and routes to the editor.
//
// UCAS PS callout: when the student has any UK schools on their list, a
// banner at the top points to /cc/essays/supplements/uk because UK schools
// don't use US-style per-school supplements — UCAS shares one PS across
// up to 5 choices. Without the banner UK applicants would see "0 supplements"
// for UofL/Oxford/Cambridge and think the system was broken.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  FileText,
  ArrowRight,
  Globe,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
} from "lucide-react";

interface Prompt {
  supplementId: string;
  text: string;
  type: string;
  category: string | null;
  wordLimit: number | null;
  required: boolean;
  essayId: string | null;
  phase: string | null;
  currentWordCount: number;
}

interface SchoolSummary {
  studentSchoolId: string;
  schoolId: string;
  schoolName: string;
  country: string;
  totalPrompts: number;
  requiredCount: number;
  started: number;
  inProgress: number;
  complete: number;
  hasSeed: boolean;
  prompts: Prompt[];
}

interface DashboardResponse {
  schools: SchoolSummary[];
  totalRequired: number;
  totalComplete: number;
  estHours: number;
  hasUKSchools: boolean;
}

export default function SupplementsDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [creatingPromptId, setCreatingPromptId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/cc/supplements/dashboard")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`Status ${r.status}`))))
      .then(setData)
      .catch((e) => setError(String(e)));
  }, []);

  function toggleExpanded(schoolId: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(schoolId)) next.delete(schoolId);
      else next.add(schoolId);
      return next;
    });
  }

  async function startEssay(schoolName: string, p: Prompt) {
    if (p.essayId) {
      router.push(`/cc/essays/${p.essayId}`);
      return;
    }
    setCreatingPromptId(p.supplementId);
    try {
      // Use the from-supplement route — links cc_essays.supplement_id to
      // the cc_school_supplements row for proper traceability + dedupe.
      const res = await fetch("/api/cc/essays/from-supplement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supplement_id: p.supplementId }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `Status ${res.status}`);
      }
      const { essay_id } = (await res.json()) as { essay_id: string };
      router.push(`/cc/essays/${essay_id}`);
    } catch (e) {
      alert(`Couldn't start essay for ${schoolName}: ${e instanceof Error ? e.message : String(e)}`);
      setCreatingPromptId(null);
    }
  }

  if (error) return <p className="p-6 text-rose-300 text-sm">{error}</p>;
  if (!data) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  const usAndCaSchools = data.schools.filter((s) => s.country !== "UK");
  const ukSchools = data.schools.filter((s) => s.country === "UK");

  return (
    <div className="px-6 py-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-semibold text-white">Supplements</h1>
        <div className="flex items-center gap-3">
          <Link href="/cc/essays/supplements/uk" className="text-[12px] text-[#D4AF37] hover:underline">
            UCAS Personal Statement →
          </Link>
          <Link href="/cc/essays" className="text-[12px] text-[#D4AF37] hover:underline">
            Personal Statement →
          </Link>
        </div>
      </div>
      <p className="text-[13px] text-white/60 mb-6">
        You have <strong className="text-white/85">{data.totalRequired}</strong> required supplements
        across <strong className="text-white/85">{usAndCaSchools.length}</strong> schools.
        {data.totalRequired > 0 && (
          <> Estimated time: ~{data.estHours} hour{data.estHours !== 1 ? "s" : ""}.</>
        )}
      </p>

      {data.hasUKSchools && (
        <Link
          href="/cc/essays/supplements/uk"
          className="mb-6 block rounded-xl border border-[#D4AF37]/30 bg-gradient-to-br from-[#1a1610] to-[#141414] p-4 hover:border-[#D4AF37]/50 transition-colors"
        >
          <div className="flex items-start gap-3">
            <Globe className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white mb-0.5">
                Your UK schools share one UCAS Personal Statement
              </p>
              <p className="text-[12px] text-white/55 leading-relaxed">
                {ukSchools.length} UK school{ukSchools.length !== 1 ? "s" : ""} on your list
                {ukSchools.length > 0 && <> — {ukSchools.map((s) => s.schoolName).slice(0, 3).join(", ")}{ukSchools.length > 3 ? ", …" : ""}</>}.
                UCAS uses three structured short-answer questions instead of per-school supplements.
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" />
          </div>
        </Link>
      )}

      {data.schools.length === 0 ? (
        <p className="text-[13px] text-white/55 italic p-12 text-center border border-white/10 rounded-xl">
          No schools yet. Add some on the <Link href="/schools" className="text-[#D4AF37] underline">School List</Link>.
        </p>
      ) : usAndCaSchools.length === 0 ? null : (
        <div className="space-y-3">
          {usAndCaSchools.map((s) => {
            const isExpanded = expanded.has(s.schoolId);
            const pct =
              s.requiredCount === 0 ? 0 : Math.round((s.complete / s.requiredCount) * 100);
            const status =
              s.complete === s.requiredCount && s.requiredCount > 0
                ? "complete"
                : s.started > 0
                  ? "in_progress"
                  : "not_started";
            const borderClass =
              status === "complete"
                ? "border-emerald-500/40 bg-emerald-500/5"
                : status === "in_progress"
                  ? "border-amber-500/30 bg-amber-500/5"
                  : "border-white/10 bg-white/[0.02]";

            return (
              <div key={s.studentSchoolId} className={`rounded-xl border ${borderClass} overflow-hidden`}>
                {/* Card header — clickable to expand */}
                <button
                  type="button"
                  onClick={() => toggleExpanded(s.schoolId)}
                  disabled={!s.hasSeed}
                  className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover:bg-white/[0.02] disabled:cursor-default disabled:hover:bg-transparent transition-colors"
                  aria-expanded={isExpanded}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[14px] font-medium text-white truncate">
                        {s.schoolName}
                      </span>
                      {s.country && s.country !== "US" && (
                        <span className="px-1.5 py-0.5 rounded text-[9.5px] font-mono uppercase tracking-wider bg-white/5 text-white/50 border border-white/10">
                          {s.country}
                        </span>
                      )}
                    </div>
                    {s.hasSeed ? (
                      <>
                        <p className="text-[11.5px] text-white/55 mb-2">
                          {s.requiredCount} required, {s.totalPrompts - s.requiredCount} optional
                          {s.started > 0 && <> · {s.complete}/{s.requiredCount} complete</>}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1 rounded bg-white/10 overflow-hidden">
                            <div
                              className={`h-full ${
                                status === "complete"
                                  ? "bg-emerald-400"
                                  : status === "in_progress"
                                    ? "bg-amber-400"
                                    : "bg-white/20"
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-[11.5px] text-white/40 italic flex items-center gap-1">
                        <FileText className="w-3 h-3" /> No seed prompts yet for this school
                      </p>
                    )}
                  </div>
                  {s.hasSeed && (
                    isExpanded
                      ? <ChevronDown className="w-4 h-4 text-white/50 shrink-0" />
                      : <ChevronRight className="w-4 h-4 text-white/50 shrink-0" />
                  )}
                </button>

                {/* Expanded prompts list */}
                {isExpanded && s.hasSeed && (
                  <div className="border-t border-white/10 bg-black/20">
                    <ul className="divide-y divide-white/5">
                      {s.prompts.map((p) => {
                        const promptStatus = p.essayId
                          ? p.phase === "final"
                            ? "complete"
                            : "in_progress"
                          : "not_started";
                        const isCreating = creatingPromptId === p.supplementId;
                        return (
                          <li key={p.supplementId} className="px-4 py-3">
                            <div className="flex items-start gap-3">
                              <div className="shrink-0 mt-0.5">
                                {promptStatus === "complete" ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                ) : (
                                  <Circle className={`w-4 h-4 ${promptStatus === "in_progress" ? "text-amber-400" : "text-white/30"}`} />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                  {p.required && (
                                    <span className="px-1.5 py-0.5 rounded-md text-[9.5px] font-mono uppercase tracking-wider bg-rose-500/15 text-rose-300 border border-rose-500/25">
                                      Required
                                    </span>
                                  )}
                                  {p.category && (
                                    <span className="px-1.5 py-0.5 rounded-md text-[9.5px] font-mono uppercase tracking-wider bg-white/5 text-white/55 border border-white/10">
                                      {p.category}
                                    </span>
                                  )}
                                  {p.wordLimit ? (
                                    <span className="text-[10.5px] text-white/45 font-mono">
                                      {p.wordLimit} word{p.wordLimit === 1 ? "" : "s"} max
                                    </span>
                                  ) : null}
                                </div>
                                <p className="text-[12.5px] text-white/75 leading-relaxed mb-2">
                                  {p.text}
                                </p>
                                {p.essayId ? (
                                  <div className="flex items-center gap-3 text-[11px] text-white/55">
                                    <span>
                                      Phase: <span className="text-white/75 capitalize">{p.phase}</span>
                                    </span>
                                    {p.wordLimit ? (
                                      <span>
                                        {p.currentWordCount} / {p.wordLimit} words
                                      </span>
                                    ) : (
                                      <span>{p.currentWordCount} words</span>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => startEssay(s.schoolName, p)}
                                      className="ml-auto text-[#D4AF37] hover:underline"
                                    >
                                      Continue →
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => startEssay(s.schoolName, p)}
                                    disabled={isCreating}
                                    className="text-[11px] text-[#D4AF37] hover:underline disabled:opacity-50"
                                  >
                                    {isCreating ? (
                                      <span className="inline-flex items-center gap-1">
                                        <Loader2 className="w-3 h-3 animate-spin" /> Creating draft…
                                      </span>
                                    ) : (
                                      "Start essay →"
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
