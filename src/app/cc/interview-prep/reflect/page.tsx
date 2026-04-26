"use client";

import { useEffect, useState } from "react";
import { Loader2, MessageSquare, HelpCircle, TrendingUp } from "lucide-react";

type Reflection = {
  id: string;
  school_name: string;
  interview_date: string | null;
  confidence_score: number | null;
  ai_feedback: string | null;
  created_at: string;
};

const COMMON_MISTAKES = [
  { mistake: "Giving rehearsed-sounding answers to 'tell me about yourself'", fix: "Open with one specific moment that explains why you're applying. A scene beats a resume." },
  { mistake: "Saying 'I'm interested in everything' when asked about majors", fix: "Pick one or two specific intersections (e.g. 'biology + history of medicine') — interviewers want a thoughtful answer, not a maximalist one." },
  { mistake: "Asking only logistical questions ('how many students?')", fix: "Ask one question that reveals what you actually care about academically." },
  { mistake: "Not preparing for 'why this school?'", fix: "Have two specific reasons — one program/professor + one community/cultural reason." },
  { mistake: "Forgetting to thank the interviewer afterward", fix: "Send a 4-sentence thank-you email within 24 hours, naming one thing they shared." },
];

export default function InterviewReflectPage() {
  const [reflections, setReflections] = useState<Reflection[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [schoolName, setSchoolName] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [whatWell, setWhatWell] = useState("");
  const [whatHard, setWhatHard] = useState("");
  const [theyAsked, setTheyAsked] = useState("");
  const [iAsked, setIAsked] = useState("");
  const [confidence, setConfidence] = useState(7);
  const [saving, setSaving] = useState(false);

  const [qSchool, setQSchool] = useState("");
  const [qInterests, setQInterests] = useState("");
  const [qLoading, setQLoading] = useState(false);
  const [qResult, setQResult] = useState<{ questions: string[]; rationale: string } | null>(null);

  const refresh = async () => {
    try {
      const res = await fetch("/api/cc/interview-reflection");
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      setReflections(data.reflections ?? []);
    } catch (e) {
      setError(String(e));
    }
  };
  useEffect(() => { refresh(); }, []);

  const submit = async () => {
    if (!schoolName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/cc/interview-reflection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolName,
          interviewDate: interviewDate || undefined,
          whatWentWell: whatWell || undefined,
          whatWasHard: whatHard || undefined,
          questionsTheyAsked: theyAsked || undefined,
          questionsIAsked: iAsked || undefined,
          confidenceScore: confidence,
        }),
      });
      if (res.ok) {
        setSchoolName(""); setInterviewDate(""); setWhatWell("");
        setWhatHard(""); setTheyAsked(""); setIAsked(""); setConfidence(7);
        await refresh();
      }
    } finally { setSaving(false); }
  };

  const generateQuestions = async () => {
    if (!qSchool.trim()) return;
    setQLoading(true); setQResult(null);
    try {
      const res = await fetch("/api/cc/interview-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolName: qSchool, studentInterests: qInterests || undefined }),
      });
      if (res.ok) setQResult(await res.json());
    } finally { setQLoading(false); }
  };

  const trend =
    reflections && reflections.length >= 2
      ? reflections.filter((r) => r.confidence_score != null).slice(0, 5).reverse().map((r) => r.confidence_score!)
      : [];

  return (
    <div className="px-6 py-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white mb-1">Interview reflection + questions</h1>
        <p className="text-[13px] text-white/60">After each interview, reflect. Before each one, prep school-specific questions.</p>
      </div>

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <h2 className="text-[13px] font-semibold text-white mb-1 inline-flex items-center gap-2">
          <HelpCircle className="w-3.5 h-3.5" /> Generate questions to ask the interviewer
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2 mt-3">
          <input placeholder="School (e.g. MIT)" value={qSchool} onChange={(e) => setQSchool(e.target.value)} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/85" />
          <input placeholder="Your interests (optional)" value={qInterests} onChange={(e) => setQInterests(e.target.value)} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/85" />
          <button type="button" onClick={generateQuestions} disabled={!qSchool.trim() || qLoading} className="px-3 py-2 rounded-lg bg-[#D4AF37] text-black text-[13px] font-medium hover:bg-[#C4A030] disabled:opacity-40">
            {qLoading ? "Generating…" : "Generate"}
          </button>
        </div>
        {qResult && (
          <div className="mt-4 space-y-2">
            <ol className="list-decimal pl-5 space-y-1.5 text-[13.5px] text-white/85">
              {qResult.questions.map((q, i) => <li key={i}>{q}</li>)}
            </ol>
            <p className="text-[11.5px] text-white/55 italic">{qResult.rationale}</p>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <h2 className="text-[13px] font-semibold text-white mb-3 inline-flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5" /> After your interview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
          <input placeholder="School" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/85" />
          <input type="date" value={interviewDate} onChange={(e) => setInterviewDate(e.target.value)} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/85" />
        </div>
        <textarea placeholder="What went well?" value={whatWell} onChange={(e) => setWhatWell(e.target.value)} rows={2} className="w-full mb-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/85 placeholder-white/30" />
        <textarea placeholder="What was hard?" value={whatHard} onChange={(e) => setWhatHard(e.target.value)} rows={2} className="w-full mb-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/85 placeholder-white/30" />
        <textarea placeholder="Questions they asked" value={theyAsked} onChange={(e) => setTheyAsked(e.target.value)} rows={2} className="w-full mb-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/85 placeholder-white/30" />
        <textarea placeholder="Questions you asked" value={iAsked} onChange={(e) => setIAsked(e.target.value)} rows={2} className="w-full mb-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/85 placeholder-white/30" />
        <div className="flex items-center gap-3 mb-3">
          <label className="text-[12px] text-white/65">Confidence (1-10):</label>
          <input type="number" min={1} max={10} value={confidence} onChange={(e) => setConfidence(parseInt(e.target.value || "5", 10))} className="w-16 px-2 py-1 rounded bg-white/5 border border-white/10 text-[13px] text-white/85" />
        </div>
        <button type="button" onClick={submit} disabled={!schoolName.trim() || saving} className="px-3 py-2 rounded-lg bg-[#D4AF37] text-black text-[13px] font-medium hover:bg-[#C4A030] disabled:opacity-40 inline-flex items-center gap-2">
          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
          {saving ? "Saving + getting feedback…" : "Save reflection"}
        </button>
      </section>

      {trend.length >= 2 && (
        <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <h2 className="text-[13px] font-semibold text-white mb-2 inline-flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5" /> Confidence trend (last {trend.length})
          </h2>
          <div className="flex items-end gap-1 h-16">
            {trend.map((c, i) => (
              <div key={i} title={`Session ${i + 1}: ${c}/10`} className="bg-[#D4AF37]/40 rounded-t flex-1" style={{ height: `${(c / 10) * 100}%` }} />
            ))}
          </div>
        </section>
      )}

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <h2 className="text-[13px] font-semibold text-white mb-3">Common mistakes</h2>
        <ul className="space-y-3">
          {COMMON_MISTAKES.map((m, i) => (
            <li key={i} className="text-[12.5px]">
              <p className="text-rose-200">✗ {m.mistake}</p>
              <p className="text-emerald-200 mt-1">✓ {m.fix}</p>
            </li>
          ))}
        </ul>
      </section>

      {error && <p className="text-rose-300 text-[12px]">{error}</p>}

      {reflections && reflections.length > 0 && (
        <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <h2 className="text-[13px] font-semibold text-white mb-3">Past reflections</h2>
          <ul className="space-y-3">
            {reflections.map((r) => (
              <li key={r.id} className="border-l-2 border-[#D4AF37]/40 pl-3">
                <p className="text-[12.5px] text-white">
                  <strong>{r.school_name}</strong>
                  {r.interview_date && <span className="text-white/55 ml-2">{r.interview_date}</span>}
                  {r.confidence_score && <span className="text-white/55 ml-2">· confidence {r.confidence_score}/10</span>}
                </p>
                {r.ai_feedback && <p className="text-[12.5px] text-white/70 mt-1 italic">{r.ai_feedback}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
