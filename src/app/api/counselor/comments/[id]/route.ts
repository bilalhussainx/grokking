// PATCH /api/counselor/comments/[id] — { status: "shipped" | "resolved" | "draft" }
//
// Used by a head to ship a requires_review counselor's draft comment, or to
// resolve a comment. Head-only (the approval gate). Verifies the comment
// belongs to the head's agency before mutating.
import { NextResponse } from "next/server";
import { getAuthUser, createAdminSupabase } from "@/lib/supabase-auth";
import { getAnyAgencyMembership } from "@/lib/cc/agency-membership";
import { setCommentStatus } from "@/lib/cc/counselor-comments";

export const runtime = "nodejs";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  const m = await getAnyAgencyMembership(user.id);
  if (!m || m.role !== "head") return NextResponse.json({ error: "head only" }, { status: 403 });

  const { id } = await params;
  let body: { status?: "shipped" | "resolved" | "draft" };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (body.status !== "shipped" && body.status !== "resolved" && body.status !== "draft") {
    return NextResponse.json({ error: "invalid status" }, { status: 400 });
  }

  // Verify the comment is in the head's agency.
  const db = createAdminSupabase();
  const { data: row } = await db
    .from("cc_counselor_comments")
    .select("agency_id")
    .eq("id", id)
    .maybeSingle<{ agency_id: string }>();
  if (!row || row.agency_id !== m.agencyId) {
    return NextResponse.json({ error: "comment not found" }, { status: 404 });
  }

  try {
    await setCommentStatus(id, body.status);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[comment status] failed:", e);
    return NextResponse.json({ error: "could not update comment" }, { status: 500 });
  }
}
