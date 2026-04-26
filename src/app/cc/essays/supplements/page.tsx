"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, FileText, ArrowRight } from "lucide-react";

type SchoolSummary = {
  studentSchoolId: string;
  schoolId: string;
  schoolName: string;
  totalPrompts: number;
  requiredCount: number;
  started: number;
  inProgress: number;
  complete: number;
  hasSeed: boolean;
};

export default function SupplementsDashboardPage() {
  const [data, setData] = useState<{ schools: SchoolSummary[]; totalRequired: number; totalComplete: number; estHours: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/cc/supplements/dashboard")
      .then((r) => r.ok ? r.json() : Promise.reject(new Error(`Status ${r.status}`)))
      .then(setData)
      .catch((e) => setError(String(e)));
  }, []);

  if (error) return <p className="p-6 text-rose-300 text-sm">{error}</p>;
  if (!data) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className="px-6 py-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-semibold text-white">Supplements</h1>
        <Link href="/cc/essays" className="text-[12px] text-[#D4AF37] hover:underline">
          Personal Statement →
        </Link>
      </div>
      <p className="text-[13px] text-white/60 mb-6">
        You have <strong className="text-white/85">{data.totalRequired}</strong> required supplements
        across <strong className="text-white/85">{data.schools.length}</strong> schools.
        {data.totalRequired > 0 && (
          <> Estimated time: ~{data.estHours} hour{data.estHours !== 1 ? "s" : ""}.</>
        )}
      </p>

      {data.schools.length === 0 ? (
        <p className="text-[13px] text-white/55 italic p-12 text-center border border-white/10 rounded-xl">
          No schools yet. Add some on the <Link href="/schools" className="text-[#D4AF37] underline">School List</Link>.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.schools.map((s) => {
            const pct =
              s.requiredCount === 0 ? 0 : Math.round((s.complete / s.requiredCount) * 100);
            const status =
              s.complete === s.requiredCount && s.requiredCount > 0
                ? "complete"
                : s.started > 0
                  ? "in_progress"
                  : "not_started";
            return (
              <Link
                key={s.studentSchoolId}
                href={`/cc/essays/supplements/${encodeURIComponent(s.schoolName)}`}
                className={`group rounded-xl border p-4 transition-colors ${
                  status === "complete"
                    ? "border-emerald-500/40 bg-emerald-500/5"
                    : status === "in_progress"
                      ? "border-amber-500/30 bg-amber-500/5"
                      : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[14px] font-medium text-white truncate">{s.schoolName}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white/70" />
                </div>
                {s.hasSeed ? (
                  <>
                    <p className="text-[11.5px] text-white/55 mb-2">
                      {s.requiredCount} required, {s.totalPrompts - s.requiredCount} optional
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
                      <span className="text-[10.5px] text-white/45">
                        {s.complete}/{s.requiredCount}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-[11.5px] text-white/40 italic flex items-center gap-1">
                    <FileText className="w-3 h-3" /> No seed prompts yet
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
