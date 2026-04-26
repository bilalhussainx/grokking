// GET /api/cc/applications/ical — returns a .ics file with all the student's
// upcoming application deadlines.
import { requireAuth, unauthorized, createAdminSupabase } from "../../helpers";
import { buildICalendar, type SchoolDeadlineRow } from "@/lib/applications/deadlines";

export async function GET() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const db = createAdminSupabase();
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .maybeSingle();
  if (!profile) {
    return new Response("BEGIN:VCALENDAR\r\nEND:VCALENDAR\r\n", {
      headers: { "Content-Type": "text/calendar; charset=utf-8" },
    });
  }

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
    .eq("student_id", profile.id);

  type RawRow = {
    id: string;
    cc_schools?: { name?: string } | { name?: string }[] | null;
    [k: string]: unknown;
  };
  const flat: SchoolDeadlineRow[] = ((rows ?? []) as RawRow[]).map((r) => {
    const sch = Array.isArray(r.cc_schools) ? r.cc_schools[0] : r.cc_schools;
    const { cc_schools: _drop, ...rest } = r;
    void _drop;
    return { ...(rest as Omit<SchoolDeadlineRow, "school_name">), school_name: sch?.name ?? "School" };
  });

  const ics = buildICalendar(flat);
  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="kairoslearn-deadlines.ics"',
    },
  });
}
