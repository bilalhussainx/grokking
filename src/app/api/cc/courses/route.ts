import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase, ensureStudentProfile } from "../helpers";
import { getStudentProfileId, isUuid } from "@/lib/cc/ownership";

export async function GET() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const db = createAdminSupabase();
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .maybeSingle();
  if (!profile) return NextResponse.json({ courses: [] });
  const { data } = await db
    .from("cc_courses")
    .select("*")
    .eq("student_id", profile.id)
    .order("grade_level", { ascending: true });
  return NextResponse.json({ courses: data ?? [] });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const profile = await ensureStudentProfile(auth.supabase, auth.user);
  const db = createAdminSupabase();
  const { data, error } = await db
    .from("cc_courses")
    .insert({
      student_id: profile.id,
      curriculum_type: body.curriculumType ?? null,
      course_name: body.courseName,
      level: body.level ?? null,
      grade_level: body.gradeLevel ?? null,
      year_taken: body.yearTaken ?? null,
      grade_received: body.gradeReceived ?? null,
      notes: body.notes ?? null,
    })
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ course: data });
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const notFound = NextResponse.json({ error: "Course not found" }, { status: 404 });
  if (!isUuid(id)) return notFound;

  const db = createAdminSupabase();
  const profileId = await getStudentProfileId(db, auth.user.id);
  if (!profileId) return notFound;

  const { data: deleted, error } = await db
    .from("cc_courses")
    .delete()
    .eq("id", id)
    .eq("student_id", profileId)
    .select("id");
  if (error) return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  if (!deleted || deleted.length === 0) return notFound;
  return NextResponse.json({ ok: true });
}
