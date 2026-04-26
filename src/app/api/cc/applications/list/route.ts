// GET /api/cc/applications/list — returns the student's school list
// joined with cc_schools.name + all the deadline/component fields, suitable
// for the Application Tracker board.
import { NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../helpers";

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

  const { data: rows } = await db
    .from("cc_student_schools")
    .select(
      `id, application_plan, application_status,
       deadline_ea, deadline_ed, deadline_edii, deadline_rea, deadline_rd,
       deadline_financial_aid, deadline_css_profile, deadline_fafsa,
       common_app_filled, essays_complete, supplements_complete, recs_submitted,
       transcript_submitted, test_scores_submitted, financial_aid_filed,
       portal_url, portal_login_note, notes,
       cc_schools(name)`,
    )
    .eq("student_id", profile.id)
    .order("added_at", { ascending: true });

  type Row = {
    id: string;
    cc_schools?: { name?: string } | { name?: string }[] | null;
    [k: string]: unknown;
  };

  const flat = ((rows ?? []) as Row[]).map((r) => {
    const sch = Array.isArray(r.cc_schools) ? r.cc_schools[0] : r.cc_schools;
    const { cc_schools: _drop, ...rest } = r;
    void _drop;
    return { ...rest, school_name: sch?.name ?? "Unknown school" };
  });

  return NextResponse.json({ rows: flat });
}
