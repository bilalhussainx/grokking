"use client";

// Student-facing view of counselor review on one essay (SP3). Shows the
// counselor's SHIPPED comments + the current review state, and — when the
// counselor has requested changes — a "Submit for re-review" button that
// flips the essay state to 'resubmitted' so the counselor sees it's back.
//
// Renders nothing if the student has no counselor link / no review activity,
// so it's safe to mount unconditionally on the essay page.

import { useCallback, useEffect, useState } from "react";

interface FeedbackComment {
  id: string;
  body: string;
  createdAt: string;
}
type ReviewState = "in_review" | "changes_requested" | "resubmitted" | "approved" | null;

const STATE_UI: Record<string, { label: string; cls: string }> = {
  in_review: { label: "Your counselor is reviewing this", cls: "text-sky-300 border-sky-500/30 bg-sky-500/10" },
  changes_requested: { label: "Your counselor requested changes", cls: "text-amber-300 border-amber-500/30 bg-amber-500/10" },
  resubmitted: { label: "Resubmitted — awaiting your counselor", cls: "text-violet-300 border-violet-500/30 bg-violet-500/10" },
  approved: { label: "Approved by your counselor", cls: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10" },
};

export default function CounselorFeedbackPanel({ essayId }: { essayId: string }) {
  const [reviewState, setReviewState] = useState<ReviewState>(null);
  const [comments, setComments] = useState<FeedbackComment[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await fetch(`/api/cc/essays/${essayId}/counselor-feedback`);
      if (r.ok) {
        const d = await r.json();
        setReviewState(d.reviewState ?? null);
        setComments(
          (d.comments ?? []).map((c: { id: string; body: string; createdAt: string }) => ({
            id: c.id,
            body: c.body,
            createdAt: c.createdAt,
          })),
        );
      }
    } finally {
      setLoaded(true);
    }
  }, [essayId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function resubmit() {
    setBusy(true);
    await fetch(`/api/cc/essays/${essayId}/counselor-feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "resubmit" }),
    });
    await load();
    setBusy(false);
  }

  // Nothing to show: no review state and no shipped comments → render nothing.
  if (!loaded) return null;
  if (!reviewState && comments.length === 0) return null;

  const state = reviewState ? STATE_UI[reviewState] : null;

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#141414] p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] uppercase tracking-[0.10em] text-white/40 font-medium">
          Counselor review
        </span>
        {state && (
          <span className={"text-[11px] px-2 py-0.5 rounded-xl border " + state.cls}>{state.label}</span>
        )}
      </div>

      {comments.length === 0 ? (
        <p className="text-sm text-white/40">No written feedback yet.</p>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="border-b border-white/5 pb-2 last:border-0 last:pb-0">
              <div className="text-[11px] text-white/40 tabular-nums mb-0.5">
                {new Date(c.createdAt).toLocaleDateString()}
              </div>
              <p className="text-sm text-white/85 whitespace-pre-wrap">{c.body}</p>
            </div>
          ))}
        </div>
      )}

      {reviewState === "changes_requested" && (
        <button
          onClick={resubmit}
          disabled={busy}
          className="w-full mt-1 text-sm px-4 py-2 rounded-md bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/15 disabled:opacity-50"
        >
          {busy ? "Submitting…" : "I've addressed the feedback — submit for re-review"}
        </button>
      )}
    </div>
  );
}
