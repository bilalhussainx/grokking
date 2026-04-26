// POST /api/cc/parent-invite — student creates an invite token for a parent.
// GET — list current invites. DELETE — revoke.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase, ensureStudentProfile } from "../helpers";

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as {
    parentEmail?: string;
    parentName?: string;
    preferredLanguage?: string;
  };
  if (!body.parentEmail?.trim()) {
    return NextResponse.json({ error: "Missing parentEmail" }, { status: 400 });
  }

  const profile = await ensureStudentProfile(auth.supabase, auth.user);
  const db = createAdminSupabase();

  const { data, error } = await db
    .from("cc_parent_invites")
    .insert({
      student_id: profile.id,
      parent_email: body.parentEmail.trim().toLowerCase(),
      parent_name: body.parentName ?? null,
      preferred_language: body.preferredLanguage ?? "en",
    })
    .select("id, invite_token, parent_email, parent_name, preferred_language, expires_at")
    .single();
  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Already invited" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    invite: data,
    inviteUrl: `${req.nextUrl.origin}/parent/${data.invite_token}`,
  });
}

export async function GET() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const db = createAdminSupabase();
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .maybeSingle();
  if (!profile) return NextResponse.json({ invites: [] });
  const { data } = await db
    .from("cc_parent_invites")
    .select("id, parent_email, parent_name, preferred_language, accepted_at, expires_at, invite_token")
    .eq("student_id", profile.id);
  return NextResponse.json({ invites: data ?? [] });
}
