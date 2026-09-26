// GET  /api/counselor/students/[studentId]/essays/[essayId]
//   → essay draft + all counselor comments (counselor sees draft + shipped)
// POST /api/counselor/students/[studentId]/essays/[essayId]   (action body)
//   → { action: "comment", body, rangeStart?, rangeEnd?, rangeTextSnapshot? }
//   → { action: "review", state: "changes_requested" | "approved" | "in_review" }
//
// requires_review counselors have their comments forced to status='draft'
// (a head must ship them). Heads + non-review counselors ship immediately.
import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-auth";
import { getStudentVisibility } from "@/lib/cc/student-roster";
import { getAnyAgencyMembership } from "@/lib/cc/agency-membership";
import {
  getEssayForReview,
  addEssayComment,
  setEssayReviewState,
  EssayNotOwnedError,
} from "@/lib/cc/counselor-comments";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ studentId: string; essayId: string }> },
) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  const { studentId, essayId } = await params;
  const vis = await getStudentVisibility(user.id, studentId);
  if (!vis) return NextResponse.json({ error: "student not on your roster" }, { status: 403 });

  const essay = await getEssayForReview(studentId, essayId, { agencyId: vis.agencyId });
  if (!essay) return NextResponse.json({ error: "essay not found" }, { status: 404 });
  return NextResponse.json({ essay });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ studentId: string; essayId: string }> },
) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  const { studentId, essayId } = await params;
  const vis = await getStudentVisibility(user.id, studentId);
  if (!vis) return NextResponse.json({ error: "student not on your roster" }, { status: 403 });

  let body: {
    action?: "comment" | "review";
    body?: string;
    rangeStart?: number | null;
    rangeEnd?: number | null;
    rangeTextSnapshot?: string | null;
    state?: "changes_requested" | "approved" | "in_review";
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (body.action === "comment") {
    if (!body.body || body.body.trim().length === 0) {
      return NextResponse.json({ error: "comment body required" }, { status: 400 });
    }
    // requires_review → draft (head must ship); otherwise shipped immediately.
    const membership = await getAnyAgencyMembership(user.id);
    const status = membership?.requiresReview ? "draft" : "shipped";
    try {
      const id = await addEssayComment({
        agencyId: vis.agencyId,
        studentUserId: studentId,
        authorUserId: user.id,
        essayId,
        body: body.body.trim(),
        rangeStart: body.rangeStart ?? null,
        rangeEnd: body.rangeEnd ?? null,
        rangeTextSnapshot: body.rangeTextSnapshot ?? null,
        status,
      });
      return NextResponse.json({ ok: true, id, status }, { status: 201 });
    } catch (e) {
      if (e instanceof EssayNotOwnedError) {
        return NextResponse.json({ error: "essay not found" }, { status: 404 });
      }
      console.error("[counselor comment] failed:", e);
      return NextResponse.json({ error: "could not save comment" }, { status: 500 });
    }
  }

  if (body.action === "review") {
    const state = body.state;
    if (state !== "changes_requested" && state !== "approved" && state !== "in_review") {
      return NextResponse.json({ error: "invalid review state" }, { status: 400 });
    }
    // Supervised counselors' comments already wait for head approval; their
    // review decisions must too, or the approval gate is a formality.
    const membership = await getAnyAgencyMembership(user.id);
    if (membership?.requiresReview) {
      return NextResponse.json(
        { error: "Review decisions need your head counselor. Leave a comment instead; it goes to them for approval." },
        { status: 403 },
      );
    }
    try {
      const ok = await setEssayReviewState(studentId, essayId, state);
      if (!ok) return NextResponse.json({ error: "essay not found" }, { status: 404 });
      return NextResponse.json({ ok: true, state });
    } catch (e) {
      console.error("[counselor review] failed:", e);
      return NextResponse.json({ error: "could not update review state" }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}
