"use client";

// Per-student review surface (SP2/SP3). Two panes:
//  left  — student header (+ grant pilot Pro for heads) and essay list
//  right — selected essay: read-only draft + comment composer + comment list
//          + review actions (request changes / approve)
// Async review model (no live co-editing). Matches DESIGN.md app surface.

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCounselorRole } from "@/hooks/useCounselorRole";
import { essayTypeLabel } from "@/lib/cc/essay-type-label";

interface EssaySummary {
  id: string;
  essayType: string | null;
  promptText: string | null;
  phase: string | null;
  wordCount: number | null;
  updatedAt: string;
  reviewState: "in_review" | "changes_requested" | "resubmitted" | "approved" | null;
  shippedCommentCount: number;
  openCommentCount: number;
}
interface StudentHeader {
  userId: string;
  preferredName: string | null;
  legalFirstName: string | null;
  gradeLevel: number | null;
  graduationYear: number | null;
  highSchoolName: string | null;
  stateProvince: string | null;
  profileCompletionPct: number | null;
  isTransfer: boolean;
  isPro: boolean;
}
interface Comment {
  id: string;
  authorUserId: string;
  body: string;
  status: "draft" | "shipped" | "resolved";
  createdAt: string;
}
interface EssayDetail {
  id: string;
  essayType: string | null;
  promptText: string | null;
  currentDraft: string | null;
  wordCount: number | null;
  reviewState: EssaySummary["reviewState"];
  comments: Comment[];
}

const STATE_LABEL: Record<string, string> = {
  in_review: "In review",
  changes_requested: "Changes requested",
  resubmitted: "Resubmitted",
  approved: "Approved",
};
const STATE_CLASS: Record<string, string> = {
  in_review: "text-sky-300 bg-sky-500/15 border-sky-500/30",
  changes_requested: "text-amber-300 bg-amber-500/15 border-amber-500/30",
  resubmitted: "text-violet-300 bg-violet-500/15 border-violet-500/30",
  approved: "text-emerald-300 bg-emerald-500/15 border-emerald-500/30",
};

export default function StudentFilePage() {
  const { studentId } = useParams<{ studentId: string }>();
  const role = useCounselorRole();
  const [student, setStudent] = useState<StudentHeader | null>(null);
  const [essays, setEssays] = useState<EssaySummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<EssayDetail | null>(null);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStudent = useCallback(async () => {
    const r = await fetch(`/api/counselor/students/${studentId}`);
    if (!r.ok) {
      setError((await r.json().catch(() => ({}))).error ?? "could not load student");
      setLoading(false);
      return;
    }
    const data = await r.json();
    setStudent(data.student);
    setEssays(data.essays ?? []);
    setLoading(false);
  }, [studentId]);

  useEffect(() => {
    if (role.loading) return;
    if (!role.isMember) {
      window.location.assign("/counselor/dashboard");
      return;
    }
    void loadStudent();
  }, [role.loading, role.isMember, loadStudent]);

  async function openEssay(id: string) {
    setSelectedId(id);
    setDetail(null);
    const r = await fetch(`/api/counselor/students/${studentId}/essays/${id}`);
    if (r.ok) setDetail((await r.json()).essay);
  }

  async function postComment() {
    if (!comment.trim() || !selectedId) return;
    setBusy(true);
    setError(null);
    const r = await fetch(`/api/counselor/students/${studentId}/essays/${selectedId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "comment", body: comment.trim() }),
    });
    if (!r.ok) setError((await r.json().catch(() => ({}))).error ?? "could not save comment");
    else {
      setComment("");
      await openEssay(selectedId);
      await loadStudent();
    }
    setBusy(false);
  }

  async function setReview(state: "changes_requested" | "approved") {
    if (!selectedId) return;
    setBusy(true);
    setError(null);
    const r = await fetch(`/api/counselor/students/${studentId}/essays/${selectedId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "review", state }),
    });
    // e.g. 403 for a supervised counselor: say so instead of silently
    // reloading an unchanged status.
    if (!r.ok) setError((await r.json().catch(() => ({}))).error ?? "could not update the review status");
    else {
      await openEssay(selectedId);
      await loadStudent();
    }
    setBusy(false);
  }

  async function publishComment(commentId: string) {
    if (!selectedId) return;
    setBusy(true);
    await fetch(`/api/counselor/comments/${commentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "shipped" }),
    });
    await openEssay(selectedId);
    await loadStudent();
    setBusy(false);
  }

  async function grantPro() {
    setBusy(true);
    setError(null);
    const r = await fetch(`/api/counselor/students/${studentId}/grant-pro`, { method: "POST" });
    if (!r.ok) setError((await r.json().catch(() => ({}))).error ?? "could not grant Pro");
    else await loadStudent();
    setBusy(false);
  }

  if (role.loading || loading) return <main className="p-8 text-white/60">Loading…</main>;
  if (!student) {
    return (
      <main className="p-8">
        <p className="text-rose-300">{error ?? "Student not found."}</p>
        <a href="/counselor/students" className="text-[#D4AF37] text-sm hover:underline">← Back to roster</a>
      </main>
    );
  }

  const knownName = student.preferredName || student.legalFirstName;
  const name = knownName || "Unnamed student";
  const firstName = knownName ? knownName.split(" ")[0] : "this student";
  const gradeLabel = student.isTransfer ? "Transfer" : student.gradeLevel ? `Grade ${student.gradeLevel}` : "—";

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <a href="/counselor/students" className="text-xs text-white/40 hover:text-[#D4AF37]">← Roster</a>

      {/* Header */}
      <header className="mt-3 mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="kl-h1">{name}</h1>
          <p className="kl-sm mt-1 tabular-nums">
            {gradeLabel}
            {student.highSchoolName ? ` · ${student.highSchoolName}` : ""}
            {student.stateProvince ? ` · ${student.stateProvince}` : ""}
            {student.graduationYear ? ` · Class of ${student.graduationYear}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {student.isPro ? (
            <span className="text-xs px-2.5 py-1 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37]">
              Pro active
            </span>
          ) : role.isHead ? (
            <button
              onClick={grantPro}
              disabled={busy}
              className="text-xs px-3 py-1.5 rounded-md bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/15 disabled:opacity-50"
            >
              Grant pilot Pro
            </button>
          ) : (
            <span className="text-xs text-white/40">Free plan</span>
          )}
        </div>
      </header>

      {error && (
        <div className="mb-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm text-rose-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Essay list */}
        <aside className="space-y-2">
          <div className="kl-kbd mb-2">Essays</div>
          {essays.length === 0 && (
            <p className="text-sm text-white/40">
              No essays yet. They&apos;ll appear here once {firstName} starts drafting.
            </p>
          )}
          {essays.map((e) => (
            <button
              key={e.id}
              onClick={() => openEssay(e.id)}
              className={
                "w-full text-left rounded-xl border p-3 transition-colors " +
                (selectedId === e.id
                  ? "bg-[#1a1a1a] border-[#D4AF37]/40"
                  : "bg-[#141414] border-white/[0.08] hover:bg-[#1a1a1a]")
              }
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-white/90 truncate">
                  {essayTypeLabel(e.essayType)}
                </span>
                {e.reviewState && (
                  <span className={"text-[10px] px-1.5 py-0.5 rounded border shrink-0 " + (STATE_CLASS[e.reviewState] ?? "")}>
                    {STATE_LABEL[e.reviewState]}
                  </span>
                )}
              </div>
              {e.promptText && <p className="text-xs text-white/45 mt-1 line-clamp-2">{e.promptText}</p>}
              <div className="flex gap-3 mt-2 text-[11px] text-white/40 tabular-nums">
                <span>{e.wordCount ?? 0} words</span>
                {e.shippedCommentCount > 0 && <span>{e.shippedCommentCount} shipped</span>}
                {e.openCommentCount > 0 && <span>{e.openCommentCount} notes</span>}
              </div>
            </button>
          ))}
        </aside>

        {/* Review pane */}
        <section>
          {!detail ? (
            <div className="rounded-2xl border border-white/[0.08] bg-[#141414] p-10 text-center text-white/40">
              Select an essay to review.
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="kl-h2">{essayTypeLabel(detail.essayType)}</h2>
                {detail.reviewState && (
                  <span className={"text-xs px-2.5 py-1 rounded-xl border " + (STATE_CLASS[detail.reviewState] ?? "")}>
                    {STATE_LABEL[detail.reviewState]}
                  </span>
                )}
              </div>
              {detail.promptText && (
                <p className="text-sm text-white/55 italic border-l-2 border-white/10 pl-3">{detail.promptText}</p>
              )}

              {/* Read-only draft */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#141414] p-5">
                <div className="kl-kbd mb-2">Current draft · {detail.wordCount ?? 0} words</div>
                <div className="kl-body whitespace-pre-wrap leading-relaxed">
                  {detail.currentDraft?.trim()
                    ? detail.currentDraft
                    : <span className="text-white/35">No draft written yet.</span>}
                </div>
              </div>

              {/* Review actions: supervised counselors comment; the head decides */}
              {role.requiresReview ? (
                <p className="text-xs text-white/45">
                  Your head counselor sets the review status. Leave comments below; they go to them for approval.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setReview("changes_requested")}
                    disabled={busy}
                    className="text-sm px-4 py-2 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/15 disabled:opacity-50"
                  >
                    Request changes
                  </button>
                  <button
                    onClick={() => setReview("approved")}
                    disabled={busy}
                    className="text-sm px-4 py-2 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/15 disabled:opacity-50"
                  >
                    Approve
                  </button>
                </div>
              )}

              {/* Comments */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#141414] p-5 space-y-4">
                <div className="kl-kbd">Feedback</div>
                {detail.comments.length === 0 && (
                  <p className="text-sm text-white/40">No comments yet. Leave the first note below.</p>
                )}
                {detail.comments.map((c) => (
                  <div key={c.id} className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] text-white/40 tabular-nums">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                      {c.status === "draft" && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/40 border border-white/10">
                          draft — awaiting head approval
                        </span>
                      )}
                      {c.status === "draft" && role.isHead && (
                        <button
                          onClick={() => publishComment(c.id)}
                          disabled={busy}
                          className="text-[10px] px-2 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/15 disabled:opacity-50"
                        >
                          Publish to student
                        </button>
                      )}
                      {c.status === "resolved" && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300/70 border border-emerald-500/20">
                          resolved
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white/85 whitespace-pre-wrap">{c.body}</p>
                  </div>
                ))}

                <div className="pt-1">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    placeholder="Leave feedback on this draft…"
                    className="w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#D4AF37]/40 focus:outline-none"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={postComment}
                      disabled={busy || !comment.trim()}
                      className="text-sm px-4 py-1.5 rounded-md bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/15 disabled:opacity-50"
                    >
                      {role.requiresReview ? "Submit for head approval" : "Send feedback"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
