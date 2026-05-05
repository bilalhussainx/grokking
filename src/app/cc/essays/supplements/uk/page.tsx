"use client";

// /cc/essays/supplements/uk — UCAS Personal Statement workspace.
//
// Distinct from the per-school US/CA supplements dashboard at
// /cc/essays/supplements because the UCAS PS is shared across all UK choices.
// One set of three answers per student, no school_id, reused for up to 5
// university choices.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowRight, AlertCircle, BookOpen } from "lucide-react";

interface UcasQuestionRow {
  questionId: number;
  essayType: string;
  title: string;
  guidance: string;
  charMin: number;
  charMaxRecommended: number;
  required: boolean;
  essayId: string | null;
  phase: string | null;
  currentCharCount: number;
}
interface UcasResponse {
  formatVersion: string;
  formatChangeNote: string;
  totalCombinedCharMax: number;
  sharedAcrossChoices: boolean;
  notes: string;
  questions: UcasQuestionRow[];
}

export default function UcasPsPage() {
  const router = useRouter();
  const [data, setData] = useState<UcasResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/cc/supplements/ucas-ps")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`Status ${r.status}`))))
      .then(setData)
      .catch((e) => setError(String(e)));
  }, []);

  // Either route the user into an existing draft or POST to create one and
  // then route. Idempotent on the server side, so a double-click can't
  // create two rows.
  async function openOrCreate(q: UcasQuestionRow) {
    if (q.essayId) {
      router.push(`/cc/essays/${q.essayId}`);
      return;
    }
    setCreating(q.questionId);
    try {
      const res = await fetch("/api/cc/supplements/ucas-ps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: q.questionId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err.error ?? `Status ${res.status}`);
        return;
      }
      const json = (await res.json()) as { id: string };
      router.push(`/cc/essays/${json.id}`);
    } finally {
      setCreating(null);
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

  const totalChars = data.questions.reduce((s, q) => s + q.currentCharCount, 0);
  const completedCount = data.questions.filter(
    (q) => q.currentCharCount >= q.charMin,
  ).length;

  return (
    <div className="px-6 py-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-semibold text-white">UCAS Personal Statement</h1>
        <Link href="/cc/essays/supplements" className="text-[12px] text-[#D4AF37] hover:underline">
          US / Canada supplements →
        </Link>
      </div>
      <p className="text-[13px] text-white/60 mb-4">
        Three structured answers shared across all your UK university choices (up to 5).
        Combined cap: <strong className="text-white/85">{data.totalCombinedCharMax.toLocaleString()}</strong> characters.
        You&apos;ve drafted <strong className="text-white/85">{totalChars.toLocaleString()}</strong> so far —{" "}
        <strong className="text-white/85">{completedCount}/3</strong> answers past minimum length.
      </p>

      <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 flex gap-2 text-[12px] text-amber-200/90">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <span>
          <strong>2026 cycle change:</strong> {data.formatChangeNote}
        </span>
      </div>

      <div className="space-y-3">
        {data.questions.map((q) => {
          const pct = Math.min(
            100,
            Math.round((q.currentCharCount / q.charMaxRecommended) * 100),
          );
          const meetsMin = q.currentCharCount >= q.charMin;
          const status =
            q.currentCharCount === 0
              ? "not_started"
              : meetsMin
                ? "complete"
                : "in_progress";

          return (
            <button
              key={q.questionId}
              onClick={() => openOrCreate(q)}
              disabled={creating === q.questionId}
              className={`group w-full text-left rounded-xl border p-4 transition-colors ${
                status === "complete"
                  ? "border-emerald-500/40 bg-emerald-500/5"
                  : status === "in_progress"
                    ? "border-amber-500/30 bg-amber-500/5"
                    : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10.5px] font-mono text-[#D4AF37] shrink-0">
                    Q{q.questionId}
                  </span>
                  <h3 className="text-[14px] font-medium text-white truncate">
                    {q.title}
                  </h3>
                </div>
                <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white/70 shrink-0" />
              </div>
              <p className="text-[12px] text-white/55 mb-3 leading-relaxed line-clamp-2">
                {q.guidance}
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
                <span className="text-[10.5px] text-white/45 font-mono shrink-0">
                  {q.currentCharCount.toLocaleString()} / {q.charMaxRecommended.toLocaleString()} chars
                </span>
              </div>
              {!meetsMin && q.currentCharCount > 0 && (
                <p className="mt-2 text-[10.5px] text-amber-300/80">
                  Below the {q.charMin}-character minimum.
                </p>
              )}
              {creating === q.questionId && (
                <p className="mt-2 text-[10.5px] text-white/50 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> Creating draft…
                </p>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02] p-3 flex gap-2 text-[11.5px] text-white/55">
        <BookOpen className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#D4AF37]" />
        <span>{data.notes}</span>
      </div>
    </div>
  );
}
