import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase, ensureStudentProfile } from "../helpers";

export async function GET() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const db = createAdminSupabase();
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .maybeSingle();
  if (!profile) return NextResponse.json({ visits: [] });
  const { data } = await db
    .from("cc_college_visits")
    .select("*, cc_student_schools(id, cc_schools(name))")
    .eq("student_id", profile.id)
    .order("visit_date", { ascending: false });
  return NextResponse.json({ visits: data ?? [] });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const profile = await ensureStudentProfile(auth.supabase, auth.user);
  const db = createAdminSupabase();
  const { data, error } = await db
    .from("cc_college_visits")
    .insert({
      student_id: profile.id,
      student_school_id: body.studentSchoolId ?? null,
      visit_date: body.visitDate,
      visit_type: body.visitType ?? "in_person",
      notes: body.notes ?? null,
    })
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ visit: data });
}
