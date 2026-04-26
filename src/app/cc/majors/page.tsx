"use client";

import { useEffect, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

const COMMON_INTERESTS = [
  "math", "biology", "chemistry", "physics", "computer science", "engineering",
  "business / economics", "history", "philosophy", "psychology", "literature",
  "art / design", "music", "languages", "environment / sustainability",
  "public policy", "medicine / health", "social justice",
];

type SuggestedMajor = { name: string; rationale: string; fitScore: number };
type CareerPath = { career: string; majorPath: string };

export default function MajorsPage() {
  const [interests, setInterests] = useState<string[]>([]);
  const [freeText, setFreeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ suggestedMajors: SuggestedMajor[]; narrativeThread: string; careerPaths: CareerPath[] } | null>(null);

  useEffect(() => {
    fetch("/api/cc/major-quiz")
      .then((r) => r.json())
      .then((d) => {
        if (d.exploration) {
          setInterests(d.exploration.interests ?? []);
          setResult({
            suggestedMajors: d.exploration.suggested_majors ?? [],
            narrativeThread: d.exploration.narrative_thread ?? "",
            careerPaths: d.exploration.career_paths ?? [],
          });
        }
      })
      .catch(() => {});
  }, []);

  const toggle = (i: string) => {
    setInterests((prev) => prev.includes(i) ? prev.filter((p) => p !== i) : [...prev, i]);
  };

  const submit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cc/major-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interests, freeText }),
      });
      if (res.ok) setResult(await res.json());
    } finally { setLoading(false); }
  };

  return (
    <div className="px-6 py-6 max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-white mb-1">Major + career exploration</h1>
        <p className="text-[13px] text-white/60">Pick what excites you. Coach Kairos suggests majors and connects them to careers.</p>
      </div>

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <h2 className="text-[12px] uppercase tracking-wider text-white/55 font-semibold mb-3">Interests</h2>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_INTERESTS.map((i) => {
            const sel = interests.includes(i);
            return (
              <button
                key={i}
                type="button"
                onClick={() => toggle(i)}
                className={`text-[12px] px-3 py-1.5 rounded-full border transition-colors ${sel ? "bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#D4AF37]" : "bg-white/5 border-white/10 text-white/70"}`}
              >
                {i}
              </button>
            );
          })}
        </div>
        <textarea
          placeholder="Anything else you want Coach Kairos to know? (favorite class, topic you can't stop reading about, etc.)"
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
          rows={3}
          className="w-full mt-3 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/85 placeholder-white/30"
        />
        <button type="button" onClick={submit} disabled={loading || (interests.length === 0 && !freeText.trim())} className="mt-3 px-3 py-2 rounded-lg bg-[#D4AF37] text-black text-[13px] font-medium hover:bg-[#C4A030] disabled:opacity-40 inline-flex items-center gap-2">
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
          {loading ? "Generating…" : "Suggest majors"}
        </button>
      </section>

      {result && (
        <>
          {result.narrativeThread && (
            <blockquote className="border-l-2 border-[#D4AF37] pl-4 italic text-[14px] text-white/85">
              {result.narrativeThread}
            </blockquote>
          )}

          {result.suggestedMajors.length > 0 && (
            <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <h2 className="text-[12px] uppercase tracking-wider text-white/55 font-semibold mb-3">Suggested majors</h2>
              <ul className="space-y-3">
                {result.suggestedMajors.map((m, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="text-[10px] uppercase font-semibold text-[#D4AF37] mt-0.5">{m.fitScore}/10</span>
                    <div className="flex-1">
                      <p className="text-[13.5px] text-white">{m.name}</p>
                      <p className="text-[12px] text-white/65 mt-0.5">{m.rationale}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {result.careerPaths.length > 0 && (
            <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <h2 className="text-[12px] uppercase tracking-wider text-white/55 font-semibold mb-3">Career paths</h2>
              <ul className="space-y-1.5">
                {result.careerPaths.map((c, i) => (
                  <li key={i} className="text-[13px] text-white/75">
                    <strong className="text-white/90">{c.career}</strong>{" "}
                    <span className="text-white/50">→</span> {c.majorPath}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
