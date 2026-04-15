// School-specific real-style alumni question study page.
// Spec: CollegeVCareers.md SP-6.

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { getQuestionsForSchool, listQuestionBankSchools } from "@/data/college-common-questions";

export function generateStaticParams() {
  return listQuestionBankSchools().map((s) => ({ schoolId: s.id }));
}

export function generateMetadata({ params }: { params: { schoolId: string } }) {
  const bank = getQuestionsForSchool(params.schoolId);
  if (!bank) return { title: "Questions — KairosLearn" };
  return {
    title: `${bank.schoolName} alumni interview questions — KairosLearn`,
    description: `Real-style ${bank.schoolName} alumni interview questions by theme. Study before your practice session.`,
  };
}

export default function SchoolQuestionsPage({ params }: { params: { schoolId: string } }) {
  const bank = getQuestionsForSchool(params.schoolId);
  if (!bank) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/college-interviews"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to interview setup
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">
          {bank.schoolName} alumni interview questions
        </h1>
        <p className="text-sm text-white/60 mb-6 leading-relaxed">{bank.interviewerMindset}</p>

        <div className="p-4 rounded-xl bg-amber-500/[0.04] border border-amber-500/[0.15] mb-8">
          <p className="text-xs text-amber-200/80 leading-relaxed">
            <strong className="text-amber-300">How to use this page:</strong> read the themes and
            questions, but do <em>not</em> rehearse canned answers. Alumni interviewers are trained
            to catch rehearsal. Use these to build real stories you can tell naturally.
          </p>
        </div>

        <div className="space-y-8 mb-10">
          {bank.groups.map((group) => (
            <div
              key={group.theme}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
            >
              <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">
                {group.theme}
              </h2>
              <ul className="space-y-3">
                {group.questions.map((q, i) => (
                  <li key={i} className="flex gap-3 text-white/80 text-sm leading-relaxed">
                    <MessageCircle className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/college-interviews"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white text-sm font-semibold transition-all"
          >
            Start a practice interview
          </Link>
        </div>
      </div>
    </div>
  );
}
