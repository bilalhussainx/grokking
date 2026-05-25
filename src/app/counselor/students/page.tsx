"use client";

// /counselor/students — the roster of students linked to the viewer.
//
// Visibility mirrors the cc_visible_student RLS helper: a HEAD sees every
// active link in their agency; a COUNSELOR sees only the students where they
// are the primary counselor. The server enforces this (listRosterForViewer);
// this page just renders what it's handed.
//
// Gated to agency members — non-members are bounced to /counselor/dashboard.
// Renders inner content only; CounselorLayout → AppShell mounts the sidebar.

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCounselorRole } from "@/hooks/useCounselorRole";

interface RosterStudent {
  linkId: string;
  studentUserId: string;
  primaryCounselorUserId: string;
  linkedViaCode: boolean;
  linkedAt: string;
  preferredName: string | null;
  legalFirstName: string | null;
  gradeLevel: number | null;
  graduationYear: number | null;
  highSchoolName: string | null;
  stateProvince: string | null;
  profileCompletionPct: number | null;
  isTransfer: boolean;
}

function displayName(s: RosterStudent): string {
  return s.preferredName || s.legalFirstName || "Unnamed student";
}

function gradeLabel(s: RosterStudent): string {
  if (s.isTransfer) return "Transfer";
  if (s.gradeLevel != null) return `Grade ${s.gradeLevel}`;
  return "Grade —";
}

export default function StudentsPage() {
  const role = useCounselorRole();
  const router = useRouter();
  const [students, setStudents] = useState<RosterStudent[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setFetching(true);
    setError(null);
    try {
      const res = await fetch("/api/counselor/students");
      if (!res.ok) {
        setError("Could not load your students — please refresh.");
        return;
      }
      const body = await res.json();
      setStudents(body.students ?? []);
    } catch {
      setError("Could not load your students — please refresh.");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (role.loading) return;
    if (!role.isMember) {
      router.replace("/counselor/dashboard");
      return;
    }
    void reload();
  }, [role.loading, role.isMember, router, reload]);

  if (role.loading || fetching) {
    return <div className="max-w-5xl mx-auto px-4 py-8 text-sm text-white/55">Loading…</div>;
  }
  if (!role.isMember) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <header>
        <h1 className="text-xl font-bold text-white">Students</h1>
        <p className="text-[13px] text-white/55 mt-1">
          {role.isHead ? "Everyone you're working with" : "Your assigned students"}
        </p>
      </header>

      {error && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-[13px] text-rose-300">
          {error}
        </div>
      )}

      {students.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] px-6 py-12 text-center">
          <p className="text-[14px] text-white/70">No students yet.</p>
          <p className="text-[13px] text-white/45 mt-1">
            {role.isHead ? (
              <>
                Mint an invite code on the{" "}
                <Link href="/counselor/team" className="text-[#D4AF37] hover:text-[#E4C04A]">
                  Team page
                </Link>{" "}
                and share it.
              </>
            ) : (
              "Students assigned to you will appear here once they join."
            )}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {students.map((s) => {
            const pct = s.profileCompletionPct ?? 0;
            return (
              <div
                key={s.linkId}
                className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-[15px] font-semibold text-white truncate">
                      {displayName(s)}
                    </h3>
                    <p className="font-mono text-[11px] text-white/40">
                      {s.studentUserId.slice(0, 8)}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-2 py-0.5 text-[11px] text-[#D4AF37]">
                    {Math.round(pct)}%
                  </span>
                </div>

                <div className="space-y-1 text-[13px] text-white/70">
                  <div className="flex items-center gap-2">
                    <span>{gradeLabel(s)}</span>
                    {s.graduationYear != null && (
                      <>
                        <span className="text-white/25">·</span>
                        <span className="text-white/55">Class of {s.graduationYear}</span>
                      </>
                    )}
                  </div>
                  <div className="text-white/60">
                    {s.highSchoolName ?? <span className="text-white/35">School not set</span>}
                    {s.stateProvince && (
                      <span className="text-white/40"> · {s.stateProvince}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-2 text-[11px] text-white/45">
                  <span>linked {new Date(s.linkedAt).toLocaleDateString()}</span>
                  {s.linkedViaCode && (
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-white/60">
                      joined via code
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
