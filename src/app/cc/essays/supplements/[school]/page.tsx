"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Loader2, ArrowLeft, ArrowRight, FileText, Check } from "lucide-react";

type Prompt = {
  seedIndex: number;
  type: string;
  text: string;
  wordLimit: number;
  required: boolean;
  essayId: string | null;
  phase: string | null;
  currentWordCount: number;
};

const PROMPT_TYPE_LABEL: Record<string, string> = {
  why_school: "Why this school",
  community: "Community",
  diversity: "Diversity",
  roommate: "Roommate / dear ___",
  activity: "Activity",
  intellectual: "Intellectual",
  challenge: "Challenge",
  additional_info: "Additional info",
  short_answer: "Short answer",
  covid_optional: "COVID (optional)",
  other: "Prompt",
};

export default function PerSchoolSupplements({ params }: { params: Promise<{ school: string }> }) {
  const { school } = use(params);
  const decodedSchool = decodeURIComponent(school);
  const [data, setData] = useState<{ schoolName: string; prompts: Prompt[]; hasSeed: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creatingIdx, setCreatingIdx] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/cc/supplements/prompts?school=${encodeURIComponent(decodedSchool)}`)
      .then((r) => r.ok ? r.json() : Promise.reject(new Error(`Status ${r.status}`)))
      .then(setData)
      .catch((e) => setError(String(e)));
  }, [decodedSchool]);

  const startEssay = async (p: Prompt, idx: number) => {
    setCreatingIdx(idx);
    try {
      const res = await fetch("/api/cc/supplements/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolName: decodedSchool,
          promptText: p.text,
          promptType: p.type,
          wordLimit: p.wordLimit,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `Status ${res.status}`);
      }
      const { id } = await res.json();
      window.location.href = `/cc/essays/${id}`;
    } catch (e) {
      alert(`Couldn't start essay: ${e instanceof Error ? e.message : String(e)}`);
      setCreatingIdx(null);
    }
  };

  if (error) return <p className="p-6 text-rose-300 text-sm">{error}</p>;
  if (!data) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className="px-6 py-6 max-w-3xl mx-auto">
      <Link
        href="/cc/essays/supplements"
        className="text-[12px] text-white/60 hover:text-white/85 inline-flex items-center gap-1 mb-3"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> All schools
      </Link>
      <h1 className="text-xl font-semibold text-white mb-1">{data.schoolName} supplements</h1>
      <p className="text-[12.5px] text-white/55 mb-6">
        {data.hasSeed
          ? `${data.prompts.length} prompt${data.prompts.length !== 1 ? "s" : ""} for the 2026 cycle.`
          : "No seed prompts cataloged yet — you can still create essays manually from the Personal Statement page."}
      </p>

      {data.prompts.length === 0 && (
        <p className="text-[13px] text-white/45 italic p-8 text-center border border-white/10 rounded-xl">
          We don&apos;t have prompts cataloged for this school yet. Check the school&apos;s admissions page.
        </p>
      )}

      <ul className="space-y-3">
        {data.prompts.map((p, i) => {
          const inProgress = p.essayId && p.phase !== "final";
          const complete = p.phase === "final";
          return (
            <li
              key={i}
              className={`rounded-xl border p-4 ${
                complete
                  ? "border-emerald-500/40 bg-emerald-500/5"
                  : inProgress
                    ? "border-amber-500/30 bg-amber-500/5"
                    : "border-white/10 bg-white/[0.02]"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1">
                  <span className="text-[10px] uppercase tracking-wider text-white/45 font-semibold">
                    {PROMPT_TYPE_LABEL[p.type] ?? p.type} · {p.wordLimit} words
                    {p.required && <span className="ml-2 text-rose-300">required</span>}
                  </span>
                </div>
                {complete && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
              </div>
              <p className="text-[13px] text-white/85 mb-3 leading-relaxed">{p.text}</p>
              <div className="flex items-center justify-between">
                {p.essayId ? (
                  <span className="text-[11.5px] text-white/55">
                    {p.currentWordCount} / {p.wordLimit} words ·{" "}
                    {p.phase ?? "outline"} phase
                  </span>
                ) : (
                  <span className="text-[11.5px] text-white/40 italic">Not started</span>
                )}
                {p.essayId ? (
                  <Link
                    href={`/cc/essays/${p.essayId}`}
                    className="inline-flex items-center gap-1 text-[12px] text-[#D4AF37] hover:underline"
                  >
                    Open editor <ArrowRight className="w-3 h-3" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => startEssay(p, i)}
                    disabled={creatingIdx === i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black text-[12px] font-medium hover:bg-[#C4A030] disabled:opacity-40"
                  >
                    {creatingIdx === i ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <FileText className="w-3 h-3" />
                    )}
                    Start
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
