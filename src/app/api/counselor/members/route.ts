import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-auth";
import { createAdminSupabase } from "@/lib/supabase-server";
import {
  getAnyAgencyMembership,
  listAgencyMembers,
  addAgencyMember,
} from "@/lib/cc/agency-membership";
import { ensureCounselorProfile } from "@/lib/cc/counselor-helpers";

export const runtime = "nodejs";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  const m = await getAnyAgencyMembership(user.id);
  if (!m) return NextResponse.json({ error: "not in an agency" }, { status: 403 });
  const members = await listAgencyMembers(m.agencyId);
  return NextResponse.json({ members, viewerRole: m.role });
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  const m = await getAnyAgencyMembership(user.id);
  if (!m || m.role !== "head") {
    return NextResponse.json({ error: "head only" }, { status: 403 });
  }

  let body: { email?: string; displayName?: string; role?: "head" | "counselor"; requiresReview?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (!body.email || !body.displayName) {
    return NextResponse.json({ error: "email + displayName required" }, { status: 400 });
  }
  if (body.role && body.role !== "head" && body.role !== "counselor") {
    return NextResponse.json({ error: "role must be head or counselor" }, { status: 400 });
  }

  // Find the user by email. They must already be a registered user — invite-
  // by-email for non-existent users is a future feature.
  const db = createAdminSupabase();
  const targetEmail = body.email.trim().toLowerCase();
  const { data: list, error: listErr } = await db.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (listErr) {
    console.error("[POST /api/counselor/members] listUsers failed:", listErr);
    return NextResponse.json({ error: "lookup failed; please retry" }, { status: 500 });
  }
  const target = list?.users.find((u) => u.email?.toLowerCase() === targetEmail);
  if (!target) {
    return NextResponse.json(
      { error: "user not found — they need to sign up first, then you can add them by email" },
      { status: 404 },
    );
  }

  // Already a member? Idempotent-friendly: report conflict.
  const existing = await getAnyAgencyMembership(target.id);
  if (existing && existing.agencyId === m.agencyId) {
    return NextResponse.json({ error: "user is already a member of this agency" }, { status: 409 });
  }

  try {
    await ensureCounselorProfile(target.id, { displayName: body.displayName });
    await addAgencyMember(m.agencyId, target.id, body.role ?? "counselor", body.requiresReview ?? false);
  } catch (e) {
    console.error("[POST /api/counselor/members] add failed:", e);
    return NextResponse.json({ error: "could not add member; please retry" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, userId: target.id }, { status: 201 });
}
