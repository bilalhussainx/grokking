// GET  /api/cc/essays/[id]/counselor-feedback
//   → the student's view of counselor review: SHIPPED comments only + review
//     state. Draft comments (requires_review, not yet shipped) are hidden.
// POST /api/cc/essays/[id]/counselor-feedback  { action: "resubmit" }
//   → student addressed the feedback and submits for re-review. Flips the
//     essay review state to 'resubmitted' so the counselor sees it's back.
//
// Runs as the authenticated student. getEssayForReview bridges auth-uid →
// cc_student_profiles.id → cc_essays.student_id and verifies ownership, so a
// student can only read/act on their OWN essay.
import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-auth";
import { getEssayForReview, setEssayReviewState } from "@/lib/cc/counselor-comments";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  const { id } = await params;

  const essay = await getEssayForReview(user.id, id, { onlyShipped: true });
  if (!essay) return NextResponse.json({ error: "essay not found" }, { status: 404 });

  return NextResponse.json({
    reviewState: essay.reviewState,
    comments: essay.comments, // already shipped-only
  });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  const { id } = await params;

  let body: { action?: string };
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  if (body.action !== "resubmit") {
    return NextResponse.json({ error: "unknown action" }, { status: 400 });
  }

  try {
    const ok = await setEssayReviewState(user.id, id, "resubmitted");
    if (!ok) return NextResponse.json({ error: "essay not found" }, { status: 404 });
    return NextResponse.json({ ok: true, state: "resubmitted" });
  } catch (e) {
    console.error("[essay resubmit] failed:", e);
    return NextResponse.json({ error: "could not resubmit" }, { status: 500 });
  }
}
