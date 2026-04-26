"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { SAT_ACT_QUIZ } from "@/lib/tests/sat-act-quiz";

type Plan = {
  recommended_test: string;
  recommendation_reasons: string[];
  fee_waiver_eligible: boolean | null;
  fee_waiver_reason: string | null;
  next_sitting_date: string | null;
  registration_url: string | null;
};

type Attempt = {
  id: string;
  test_type: string;
  test_date: string | null;
  total_score: number | null;
};

export default function TestStrategyPage() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);

  // Quiz answers
  const [answers, setAnswers] = useState<Array<"SAT" | "ACT" | "NEUTRAL" | null>>([null, null, null, null, null, null]);
  const [reducedLunch, setReducedLunch] = useState(false);
  const [publicAssist, setPublicAssist] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New attempt form
  const [newType, setNewType] = useState<"SAT" | "ACT" | "PSAT">("SAT");
  const [newDate, setNewDate] = useState("");
  const [newTotal, setNewTotal] = useState<number | "">("");

  const refresh = async () => {
    const [pRes, aRes] = await Promise.all([
      fetch("/api/cc/test-strategy"),
      fetch("/api/cc/test-attempts"),
    ]);
    setPlan((await pRes.json()).plan);
    setAttempts((await aRes.json()).attempts ?? []);
  };
  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  const submitQuiz = async () => {
    if (answers.some((a) => a === null)) return;
    setSubmitting(true);
    try {
      await fetch("/api/cc/test-strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          receivesFreeReducedLunch: reducedLunch,
          receivesPublicAssistance: publicAssist,
        }),
      });
      await refresh();
    } finally {
      setSubmitting(false);
    }
  };

  const addAttempt = async () => {
    await fetch("/api/cc/test-attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        testType: newType,
        testDate: newDate || undefined,
        totalScore: newTotal === "" ? undefined : Number(newTotal),
      }),
    });
    setNewDate("");
    setNewTotal("");
    await refresh();
  };

  if (loading) {
    return <div className="flex items-center justify-center p-12"><Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" /></div>;
  }

  return (
    <div className="px-6 py-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white mb-1">SAT / ACT strategy</h1>
        <p className="text-[13px] text-white/60">
          Pick the right test, log your scores, plan your next sitting.
        </p>
      </div>

      {plan && plan.recommended_test !== "UNDECIDED" && (
        <section className="rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/5 p-4">
          <h2 className="text-[13px] font-semibold text-white mb-2">
            Recommended: <span className="text-[#D4AF37]">{plan.recommended_test}</span>
          </h2>
          <ul className="text-[12.5px] text-white/75 space-y-1 list-disc pl-5">
            {plan.recommendation_reasons.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
          {plan.registration_url && (
            <a
              href={plan.registration_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-[12.5px] text-[#D4AF37] hover:underline"
            >
              Register →
            </a>
          )}
          {plan.fee_waiver_reason && (
            <div className={`mt-3 px-3 py-2 rounded-lg text-[12px] ${plan.fee_waiver_eligible ? "bg-emerald-500/10 text-emerald-200 border border-emerald-500/30" : "bg-white/5 text-white/65 border border-white/10"}`}>
              <strong>Fee waiver:</strong> {plan.fee_waiver_reason}
            </div>
          )}
        </section>
      )}

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <h2 className="text-[13px] font-semibold text-white mb-3">Take the SAT vs ACT quiz</h2>
        <ol className="space-y-4">
          {SAT_ACT_QUIZ.map((q, i) => (
            <li key={q.id}>
              <p className="text-[12.5px] text-white/85 mb-2">
                {i + 1}. {q.question}
              </p>
              <div className="space-y-1.5">
                {q.options.map((o, oi) => (
                  <label key={oi} className="flex items-center gap-2 text-[12.5px] text-white/70 cursor-pointer">
                    <input
                      type="radio"
                      name={q.id}
                      checked={answers[i] === o.value}
                      onChange={() => {
                        const next = [...answers];
                        next[i] = o.value;
                        setAnswers(next);
                      }}
                    />
                    {o.label}
                  </label>
                ))}
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-4 space-y-2">
          <label className="flex items-center gap-2 text-[12px] text-white/70 cursor-pointer">
            <input type="checkbox" checked={reducedLunch} onChange={(e) => setReducedLunch(e.target.checked)} />
            I receive free or reduced-price lunch
          </label>
          <label className="flex items-center gap-2 text-[12px] text-white/70 cursor-pointer">
            <input type="checkbox" checked={publicAssist} onChange={(e) => setPublicAssist(e.target.checked)} />
            My family receives public assistance (SNAP, TANF, etc.)
          </label>
        </div>
        <button
          type="button"
          onClick={submitQuiz}
          disabled={answers.some((a) => a === null) || submitting}
          className="mt-4 px-3 py-2 rounded-lg bg-[#D4AF37] text-black text-[13px] font-medium hover:bg-[#C4A030] disabled:opacity-40 inline-flex items-center gap-2"
        >
          {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
          {submitting ? "Computing…" : "Get my recommendation"}
        </button>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <h2 className="text-[13px] font-semibold text-white mb-3">Score history</h2>
        <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_120px_auto] gap-2 mb-3">
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value as "SAT" | "ACT" | "PSAT")}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/85"
          >
            <option value="SAT">SAT</option>
            <option value="ACT">ACT</option>
            <option value="PSAT">PSAT</option>
          </select>
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/85"
          />
          <input
            type="number"
            placeholder="Total score"
            value={newTotal}
            onChange={(e) => setNewTotal(e.target.value === "" ? "" : Number(e.target.value))}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/85"
          />
          <button
            type="button"
            onClick={addAttempt}
            className="px-3 py-2 rounded-lg bg-[#D4AF37] text-black text-[13px] font-medium hover:bg-[#C4A030] inline-flex items-center gap-1.5"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>

        {attempts.length === 0 ? (
          <p className="text-[12px] text-white/40 italic">No attempts logged yet.</p>
        ) : (
          <ul className="space-y-1.5">
            {attempts.map((a) => (
              <li key={a.id} className="text-[12.5px] text-white/80 flex justify-between border-b border-white/5 pb-1.5">
                <span>{a.test_date} · {a.test_type}</span>
                <span className="font-mono">{a.total_score ?? "—"}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
