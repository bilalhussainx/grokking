// PATCH /api/cc/applications/update — partial-update of a single
// cc_student_schools row (deadlines, components, status, plan, notes).
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../helpers";

const ALLOWED_FIELDS = new Set([
  "application_plan",
  "application_status",
  "deadline_ea",
  "deadline_ed",
  "deadline_edii",
  "deadline_rea",
  "deadline_rd",
  "deadline_financial_aid",
  "deadline_css_profile",
  "deadline_fafsa",
  "common_app_filled",
  "essays_complete",
  "supplements_complete",
  "recs_submitted",
  "transcript_submitted",
  "test_scores_submitted",
  "financial_aid_filed",
  "portal_url",
  "portal_login_note",
  "notes",
]);

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as {
    id?: string;
    updates?: Record<string, unknown>;
  };
  if (!body.id || typeof body.id !== "string") {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  if (!body.updates || typeof body.updates !== "object") {
    return NextResponse.json({ error: "Missing updates" }, { status: 400 });
  }

  const db = createAdminSupabase();

  // Verify row belongs to this user via student_id -> profile.user_id.
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .maybeSingle();
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const { data: row } = await db
    .from("cc_student_schools")
    .select("id, student_id")
    .eq("id", body.id)
    .maybeSingle();
  if (!row || row.student_id !== profile.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const cleaned: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(body.updates)) {
    if (ALLOWED_FIELDS.has(k)) cleaned[k] = v;
  }
  if (Object.keys(cleaned).length === 0) {
    return NextResponse.json({ error: "No valid fields" }, { status: 400 });
  }

  const { error } = await db.from("cc_student_schools").update(cleaned).eq("id", body.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, updated: Object.keys(cleaned) });
}
