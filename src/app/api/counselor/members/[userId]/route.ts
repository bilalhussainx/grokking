import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-auth";
import {
  getAnyAgencyMembership,
  removeAgencyMember,
  setMemberRole,
  setRequiresReview,
} from "@/lib/cc/agency-membership";

export const runtime = "nodejs";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  const m = await getAnyAgencyMembership(user.id);
  if (!m || m.role !== "head") {
    return NextResponse.json({ error: "head only" }, { status: 403 });
  }

  const { userId } = await params;
  let body: { role?: "head" | "counselor"; requiresReview?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (body.role && body.role !== "head" && body.role !== "counselor") {
    return NextResponse.json({ error: "role must be head or counselor" }, { status: 400 });
  }

  // Guard: don't let the head demote themselves to counselor if they're the
  // only head — that would orphan the agency with no admin.
  if (userId === user.id && body.role === "counselor") {
    return NextResponse.json(
      { error: "you cannot demote yourself; promote another head first" },
      { status: 400 },
    );
  }

  try {
    if (body.role) await setMemberRole(m.agencyId, userId, body.role);
    if (typeof body.requiresReview === "boolean") {
      await setRequiresReview(m.agencyId, userId, body.requiresReview);
    }
  } catch (e) {
    console.error("[PATCH /api/counselor/members/[userId]] failed:", e);
    return NextResponse.json({ error: "update failed; please retry" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  const m = await getAnyAgencyMembership(user.id);
  if (!m || m.role !== "head") {
    return NextResponse.json({ error: "head only" }, { status: 403 });
  }
  const { userId } = await params;
  if (userId === user.id) {
    return NextResponse.json({ error: "cannot remove yourself" }, { status: 400 });
  }
  try {
    await removeAgencyMember(m.agencyId, userId);
  } catch (e) {
    console.error("[DELETE /api/counselor/members/[userId]] failed:", e);
    return NextResponse.json({ error: "remove failed; please retry" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
