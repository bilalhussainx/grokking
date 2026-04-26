// Grade 9 Dashboard — Feature 16. Simplified roadmap, NO essay studio,
// NO application tracker, NO SAT/ACT, NO interview prep.
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, BookOpen, Compass, Target, Heart } from "lucide-react";

const FOUR_YEAR_PLAN = [
  { grade: 9, focus: "Build habits, take ONE harder course, join 2 clubs you actually like" },
  { grade: 10, focus: "Add depth in one area, take PSAT 10, log meaningful summer" },
  { grade: 11, focus: "AP / IB load, real testing, school list draft, summer research/program" },
  { grade: 12, focus: "Apply. Essays, supplements, interviews, financial aid" },
];

const WHAT_MATTERS = [
  { thing: "Course rigor + grades", why: "Most heavily weighted by every selective school" },
  { thing: "1-2 deep activities (with leadership)", why: "Beats 10 shallow ones every time" },
  { thing: "Standardized tests (when applicable)", why: "Test-optional ≠ test-blind. Strong scores still help most schools" },
  { thing: "Essays + recommendations", why: "What the rest of your file can't show" },
  { thing: "Demonstrated interest at certain schools", why: "Visit, attend a webinar, follow up — some schools track it" },
];

export default function Grade9Dashboard() {
  const [grade, setGrade] = useState<number | null>(null);
  useEffect(() => {
    fetch("/api/cc/me")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => setGrade(d?.profile?.grade_level ?? null))
      .catch(() => {});
  }, []);

  if (grade === null) {
    return <div className="flex items-center justify-center p-12"><Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" /></div>;
  }
  if (grade !== 9) {
    return (
      <div className="p-12 text-center max-w-md mx-auto text-white">
        <h1 className="text-xl font-semibold mb-2">This dashboard is for grade 9</h1>
        <p className="text-white/55 text-sm mb-4">Your profile says grade {grade}.</p>
        <Link href="/" className="text-[#D4AF37] hover:underline text-sm">← Main dashboard</Link>
      </div>
    );
  }

  return (
    <div className="px-6 py-6 max-w-3xl mx-auto space-y-6">
      <div>
        <p className="text-[12px] text-white/55 uppercase tracking-wider">Grade 9</p>
        <h1 className="text-2xl font-semibold text-white">You have time. Use it on the right things.</h1>
        <p className="text-[13.5px] text-white/65 mt-1">
          Grade 9 isn&apos;t about applying — it&apos;s about laying down the academic foundation and discovering what you actually care about.
        </p>
      </div>

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <h2 className="text-[13px] font-semibold text-white mb-3 inline-flex items-center gap-2">
          <Compass className="w-3.5 h-3.5" /> 4-year game plan
        </h2>
        <ol className="space-y-3">
          {FOUR_YEAR_PLAN.map((y) => (
            <li key={y.grade} className={`text-[13.5px] ${y.grade === 9 ? "text-white" : "text-white/55"}`}>
              <strong className={y.grade === 9 ? "text-[#D4AF37]" : ""}>Grade {y.grade}:</strong> {y.focus}
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <h2 className="text-[13px] font-semibold text-white mb-3 inline-flex items-center gap-2">
          <Target className="w-3.5 h-3.5" /> What actually matters in admissions
        </h2>
        <ul className="space-y-2.5">
          {WHAT_MATTERS.map((w, i) => (
            <li key={i} className="text-[13px]">
              <p className="text-white/90"><strong>{w.thing}</strong></p>
              <p className="text-white/55 text-[12.5px] mt-0.5">{w.why}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Link href="/cc/courses" className="rounded-xl border border-white/10 bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-colors">
          <BookOpen className="w-4 h-4 text-[#D4AF37] mb-1" />
          <p className="text-[12.5px] text-white">Track your courses</p>
        </Link>
        <Link href="/cc/majors" className="rounded-xl border border-white/10 bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-colors">
          <Compass className="w-4 h-4 text-[#D4AF37] mb-1" />
          <p className="text-[12.5px] text-white">Explore majors (low-stakes)</p>
        </Link>
        <Link href="/cc/summer" className="rounded-xl border border-white/10 bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-colors">
          <Heart className="w-4 h-4 text-[#D4AF37] mb-1" />
          <p className="text-[12.5px] text-white">Plan summer</p>
        </Link>
      </section>

      <p className="text-[11.5px] text-white/40 italic text-center">
        Essay Studio, Application Tracker, SAT/ACT Strategy, Interview Prep, and Financial Aid are unlocked at grade 11.
      </p>
    </div>
  );
}
