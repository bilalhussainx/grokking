// Junior Year (grade 11) Dashboard — Feature 15
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Calendar, BookOpen, FileText, Mic, ChartBar, MessageSquare } from "lucide-react";

const PHASE_CHECKLIST = [
  { phase: "Now → Spring", goal: "Build the school list (10-15 schools across reach/match/safety)", href: "/schools" },
  { phase: "Spring", goal: "First SAT or ACT sitting", href: "/cc/test-strategy" },
  { phase: "Summer", goal: "Brainstorm personal statement (no draft yet)", href: "/cc/essays" },
  { phase: "Summer", goal: "Activities optimizer + narrative diagnosis", href: "/cc/activities-optimizer" },
  { phase: "Summer", goal: "1-2 college visits (in-person or virtual)", href: "/cc/visits" },
  { phase: "Fall (senior year)", goal: "Outline + draft + revise PS, then supplements", href: "/cc/essays" },
];

export default function JuniorDashboard() {
  const [grade, setGrade] = useState<number | null>(null);
  const [daysToAug1, setDaysToAug1] = useState<number>(0);

  useEffect(() => {
    fetch("/api/cc/me")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => setGrade(d?.profile?.grade_level ?? null))
      .catch(() => {});

    const aug1 = new Date(new Date().getFullYear() + (new Date().getMonth() >= 7 ? 1 : 0), 7, 1);
    aug1.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setDaysToAug1(Math.round((aug1.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  }, []);

  if (grade === null) {
    return <div className="flex items-center justify-center p-12"><Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" /></div>;
  }
  if (grade !== 11) {
    return (
      <div className="p-12 text-center max-w-md mx-auto text-white">
        <h1 className="text-xl font-semibold mb-2">This dashboard is for grade 11</h1>
        <p className="text-white/55 text-sm mb-4">Your profile says grade {grade}.</p>
        <Link href="/" className="text-[#D4AF37] hover:underline text-sm">← Main dashboard</Link>
      </div>
    );
  }

  return (
    <div className="px-6 py-6 max-w-4xl mx-auto space-y-6">
      <div>
        <p className="text-[12px] text-white/55 uppercase tracking-wider">Junior year</p>
        <h1 className="text-2xl font-semibold text-white">Your runway to applications</h1>
        <p className="text-[13.5px] text-white/65 mt-1">
          <strong className="text-[#D4AF37]">{daysToAug1} days</strong> until Common App opens (August 1). Most ED/EA deadlines hit ~90 days after that.
        </p>
      </div>

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <h2 className="text-[13px] font-semibold text-white mb-3">Phase checklist</h2>
        <ol className="space-y-3">
          {PHASE_CHECKLIST.map((p, i) => (
            <li key={i} className="text-[13.5px]">
              <Link href={p.href} className="block hover:bg-white/[0.03] rounded p-2 -mx-2 transition-colors">
                <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold">{p.phase}</span>
                <p className="text-white/85 mt-0.5">{p.goal} <span className="text-white/40">→</span></p>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Link href="/applications" className="rounded-xl border border-white/10 bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-colors">
          <Calendar className="w-4 h-4 text-[#D4AF37] mb-1" />
          <p className="text-[12.5px] text-white">Applications</p>
        </Link>
        <Link href="/cc/courses" className="rounded-xl border border-white/10 bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-colors">
          <BookOpen className="w-4 h-4 text-[#D4AF37] mb-1" />
          <p className="text-[12.5px] text-white">Course rigor</p>
        </Link>
        <Link href="/cc/test-strategy" className="rounded-xl border border-white/10 bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-colors">
          <ChartBar className="w-4 h-4 text-[#D4AF37] mb-1" />
          <p className="text-[12.5px] text-white">SAT / ACT plan</p>
        </Link>
        <Link href="/cc/essays" className="rounded-xl border border-white/10 bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-colors">
          <FileText className="w-4 h-4 text-[#D4AF37] mb-1" />
          <p className="text-[12.5px] text-white">Brainstorm only</p>
          <p className="text-[10px] text-white/45 mt-0.5">Draft + revise unlock at grade 12</p>
        </Link>
        <Link href="/cc/activities-optimizer" className="rounded-xl border border-white/10 bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-colors">
          <Mic className="w-4 h-4 text-[#D4AF37] mb-1" />
          <p className="text-[12.5px] text-white">Activities</p>
        </Link>
        <Link href="/cc/majors" className="rounded-xl border border-white/10 bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-colors">
          <MessageSquare className="w-4 h-4 text-[#D4AF37] mb-1" />
          <p className="text-[12.5px] text-white">Major exploration</p>
        </Link>
      </section>
    </div>
  );
}
