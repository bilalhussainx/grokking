"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Sparkles, X } from "lucide-react";

type Course = {
  id: string;
  course_name: string;
  level: string | null;
  grade_level: number | null;
  year_taken: string | null;
  grade_received: string | null;
  curriculum_type: string | null;
};

type Rigor = {
  rigorScore: string;
  summary: string;
  strengths: string[];
  gaps: string[];
  internationalNote?: string;
};

const CURRICULA = ["US (AP)", "IB", "A-Levels", "FSc / Pakistan", "CBSE / India", "Other"];
const LEVELS = ["", "Regular", "Honors", "AP", "IB HL", "IB SL", "A-Level", "Dual enrollment"];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  // Default the grade from the student's profile; 11 only if it has none.
  const [gradeLevel, setGradeLevel] = useState<number | null>(null);
  const [curriculumType, setCurriculumType] = useState("US (AP)");
  const [rigor, setRigor] = useState<Rigor | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const r = await fetch("/api/cc/courses");
    setCourses((await r.json()).courses ?? []);
  };
  useEffect(() => { refresh().finally(() => setLoading(false)); }, []);
  useEffect(() => {
    fetch("/api/cc/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { profile?: { grade_level?: number | null } | null } | null) => {
        const g = d?.profile?.grade_level;
        setGradeLevel((cur) => cur ?? (typeof g === "number" && g >= 9 && g <= 12 ? g : 11));
      })
      .catch(() => setGradeLevel((cur) => cur ?? 11));
  }, []);

  const add = async () => {
    if (!name.trim()) return;
    await fetch("/api/cc/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseName: name, level: level || null, gradeLevel: gradeLevel ?? 11, curriculumType }),
    });
    setName("");
    setLevel("");
    await refresh();
  };

  const remove = async (id: string) => {
    await fetch(`/api/cc/courses?id=${id}`, { method: "DELETE" });
    await refresh();
  };

  const analyze = async () => {
    setAnalyzing(true);
    setRigor(null);
    try {
      const r = await fetch("/api/cc/courses/rigor", { method: "POST" });
      if (r.ok) setRigor(await r.json());
    } finally { setAnalyzing(false); }
  };

  if (loading) return <div className="flex items-center justify-center p-12"><Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" /></div>;

  return (
    <div className="px-6 py-6 max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-white mb-1">Course rigor</h1>
        <p className="text-[13px] text-white/60">Log your course load (US AP, IB, A-Levels, FSc, etc.) and get a rigor analysis tailored to U.S. admissions.</p>
      </div>

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_140px_140px_120px_auto] gap-2">
          <input placeholder="Course (e.g. AP Calculus BC)" value={name} onChange={(e) => setName(e.target.value)} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/85" />
          <select value={level} onChange={(e) => setLevel(e.target.value)} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/85">
            {LEVELS.map((l) => <option key={l} value={l}>{l || "Level"}</option>)}
          </select>
          <select value={curriculumType} onChange={(e) => setCurriculumType(e.target.value)} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/85">
            {CURRICULA.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={gradeLevel ?? 11} onChange={(e) => setGradeLevel(Number(e.target.value))} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/85">
            {[9, 10, 11, 12].map((g) => <option key={g} value={g}>Grade {g}</option>)}
          </select>
          <button type="button" onClick={add} disabled={!name.trim()} className="px-3 py-2 rounded-lg bg-[#D4AF37] text-black text-[13px] font-medium hover:bg-[#C4A030] disabled:opacity-40 inline-flex items-center gap-1.5">
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>

        {courses.length > 0 && (
          <ul className="mt-4 space-y-1.5">
            {courses.map((c) => (
              <li key={c.id} className="flex justify-between items-center text-[12.5px] text-white/80 border-b border-white/5 pb-1.5">
                <span>
                  {c.course_name}
                  {c.level && <span className="text-white/45 ml-2">{c.level}</span>}
                  <span className="text-white/45 ml-2">G{c.grade_level}</span>
                </span>
                <button onClick={() => remove(c.id)} className="text-white/30 hover:text-rose-300"><X className="w-3 h-3" /></button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <button type="button" onClick={analyze} disabled={courses.length === 0 || analyzing} className="px-3 py-2 rounded-lg bg-[#D4AF37] text-black text-[13px] font-medium hover:bg-[#C4A030] disabled:opacity-40 inline-flex items-center gap-2">
        {analyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
        {analyzing ? "Analyzing rigor…" : "Analyze rigor"}
      </button>

      {rigor && (
        <section className="rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/5 p-4 space-y-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold">{rigor.rigorScore.replace(/_/g, " ")}</span>
            <p className="text-[13.5px] text-white/85 mt-1">{rigor.summary}</p>
          </div>
          {rigor.strengths.length > 0 && (
            <div>
              <h3 className="text-[11px] uppercase tracking-wider text-emerald-400 mb-1">Strengths</h3>
              <ul className="text-[12.5px] text-white/75 list-disc pl-4 space-y-0.5">
                {rigor.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
          {rigor.gaps.length > 0 && (
            <div>
              <h3 className="text-[11px] uppercase tracking-wider text-amber-400 mb-1">Gaps</h3>
              <ul className="text-[12.5px] text-white/75 list-disc pl-4 space-y-0.5">
                {rigor.gaps.map((g, i) => <li key={i}>{g}</li>)}
              </ul>
            </div>
          )}
          {rigor.internationalNote && (
            <p className="text-[12px] text-white/65 italic border-l-2 border-[#D4AF37]/40 pl-3">{rigor.internationalNote}</p>
          )}
        </section>
      )}
    </div>
  );
}
