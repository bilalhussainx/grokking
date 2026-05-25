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
    return <div className="max-w-5xl mx-auto px-4 py-8 kl-sm">Loading…</div>;
  }
  if (!role.isMember) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <header>
        <p className="kl-kbd mb-2">Students</p>
        <h1 className="kl-h1">Roster</h1>
        <p className="kl-sm mt-1">
          {role.isHead ? "Everyone you're working with" : "Your assigned students"}
        </p>
      </header>

      {error && (
        <div className="rounded-md border border-rose-500/30 bg-rose-500/10 px-4 py-2 kl-sm !text-rose-300">
          {error}
        </div>
      )}

      {students.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.08] bg-[#141414] px-6 py-12 text-center">
          <p className="kl-body !text-white/70">No students yet.</p>
          <p className="kl-sm mt-1">
            {role.isHead ? (
              <>
                Mint an invite code on the{" "}
                <Link href="/counselor/team" className="text-[#D4AF37] hover:text-[#F4D03F]">
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
                className="rounded-2xl border border-white/[0.08] bg-[#141414] p-4 space-y-3 transition-colors hover:bg-[#1a1a1a]"
              >
                {/* Name row + grade chip */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="kl-h3 truncate">{displayName(s)}</h3>
                    <p className="kl-mono kl-xs">{s.studentUserId.slice(0, 8)}</p>
                  </div>
                  <span className="shrink-0 rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-2 py-0.5 kl-xs !text-[#D4AF37]">
                    {gradeLabel(s)}
                  </span>
                </div>

                {/* Meta row: school · state */}
                <p className="kl-sm">
                  {s.highSchoolName ?? <span className="text-white/35">School not set</span>}
                  {s.stateProvince && <span className="text-white/40"> · {s.stateProvince}</span>}
                  {s.graduationYear != null && (
                    <>
                      <span className="text-white/25"> · </span>
                      <span className="text-white/40">Class of {s.graduationYear}</span>
                    </>
                  )}
                </p>

                {/* Profile-completion progress bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="kl-kbd">Profile</span>
                    <span className="kl-mono kl-xs tabular-nums !text-white/60">
                      {Math.round(pct)}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#D4AF37]"
                      style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                    />
                  </div>
                </div>

                {/* Footer chips */}
                <div className="flex items-center justify-between border-t border-white/[0.08] pt-2">
                  <span className="kl-xs tabular-nums">
                    linked {new Date(s.linkedAt).toLocaleDateString()}
                  </span>
                  {s.linkedViaCode && (
                    <span className="rounded-xl bg-white/10 px-2 py-0.5 kl-xs !text-white/60">
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
