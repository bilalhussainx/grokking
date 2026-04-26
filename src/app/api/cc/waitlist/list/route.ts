// GET /api/cc/waitlist/list — returns all waitlisted schools (auto-derived
// from cc_student_schools.application_status='waitlisted') joined with
// any waitlist_management notes the student has saved.
// PATCH — update decision / loci_draft / loci_sent flags.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase, ensureStudentProfile } from "../../helpers";

export async function GET() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const db = createAdminSupabase();
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .maybeSingle();
  if (!profile) return NextResponse.json({ rows: [] });

  const { data: waitlisted } = await db
    .from("cc_student_schools")
    .select("id, application_status, cc_schools(name)")
    .eq("student_id", profile.id)
    .eq("application_status", "waitlisted");

  type SS = { id: string; cc_schools?: { name?: string } | { name?: string }[] | null };
  const list = ((waitlisted ?? []) as SS[]).map((s) => {
    const sch = Array.isArray(s.cc_schools) ? s.cc_schools[0] : s.cc_schools;
    return { studentSchoolId: s.id, schoolName: sch?.name ?? "Unknown" };
  });

  if (list.length === 0) return NextResponse.json({ rows: [] });

  const { data: managed } = await db
    .from("waitlist_management")
    .select("*")
    .eq("student_id", profile.id);

  type W = { student_school_id: string | null; [k: string]: unknown };
  const byId = new Map<string, W>();
  for (const m of (managed ?? []) as W[]) {
    if (m.student_school_id) byId.set(m.student_school_id, m);
  }

  const rows = list.map((l) => ({
    ...l,
    management: byId.get(l.studentSchoolId) ?? null,
  }));

  return NextResponse.json({ rows });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as {
    studentSchoolId?: string;
    schoolName?: string;
    updates?: Record<string, unknown>;
  };
  if (!body.studentSchoolId || !body.schoolName) {
    return NextResponse.json({ error: "Missing studentSchoolId/schoolName" }, { status: 400 });
  }
  const updates = body.updates ?? {};

  const profile = await ensureStudentProfile(auth.supabase, auth.user);
  const db = createAdminSupabase();

  // Upsert (insert if missing).
  const ALLOWED = new Set([
    "decision",
    "decision_reason",
    "loci_draft",
    "loci_sent",
    "loci_sent_date",
    "expected_decision_date",
    "historical_acceptance_rate",
  ]);
  const cleaned: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(updates)) {
    if (ALLOWED.has(k)) cleaned[k] = v;
  }

  const { data: existing } = await db
    .from("waitlist_management")
    .select("id")
    .eq("student_id", profile.id)
    .eq("student_school_id", body.studentSchoolId)
    .maybeSingle();

  if (existing) {
    const { error } = await db
      .from("waitlist_management")
      .update({ ...cleaned, updated_at: new Date().toISOString() })
      .eq("id", existing.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, id: existing.id });
  }

  const { data, error } = await db
    .from("waitlist_management")
    .insert({
      student_id: profile.id,
      student_school_id: body.studentSchoolId,
      school_name: body.schoolName,
      ...cleaned,
    })
    .select("id")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, id: data.id });
}
