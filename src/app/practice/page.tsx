"use client";

import Link from "next/link";

export default function PracticePage() {
  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-slate-100 mb-4">
          Quick Voice Practice
        </h1>
        <p className="text-slate-400 mb-8">
          Practice speaking with AI tutors
        </p>

        <div className="grid grid-cols-1 gap-4">
          <Link
            href="/course/spanish-beginner/greetings"
            className="p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500 transition-colors"
          >
            <div className="text-3xl mb-2">🇪🇸</div>
            <h2 className="text-lg font-semibold text-slate-100">Spanish</h2>
            <p className="text-sm text-slate-400">Start with Spanish A1</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
