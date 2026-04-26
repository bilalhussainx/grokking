// GET/POST /api/cc/test-attempts — log SAT/ACT/PSAT attempts
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
  if (!profile) return NextResponse.json({ attempts: [] });
  const { data } = await db
    .from("cc_test_attempts")
    .select("*")
    .eq("student_id", profile.id)
    .order("test_date", { ascending: true });
  return NextResponse.json({ attempts: data ?? [] });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as {
    testType?: string;
    testDate?: string;
    totalScore?: number;
    satReadingWriting?: number;
    satMath?: number;
    actEnglish?: number;
    actMath?: number;
    actReading?: number;
    actScience?: number;
    notes?: string;
  };
  if (!body.testType || !["SAT", "ACT", "PSAT", "AP", "IB"].includes(body.testType)) {
    return NextResponse.json({ error: "Invalid testType" }, { status: 400 });
  }

  const profile = await ensureStudentProfile(auth.supabase, auth.user);
  const db = createAdminSupabase();
  const { data, error } = await db
    .from("cc_test_attempts")
    .insert({
      student_id: profile.id,
      test_type: body.testType,
      test_date: body.testDate ?? null,
      total_score: body.totalScore ?? null,
      sat_reading_writing: body.satReadingWriting ?? null,
      sat_math: body.satMath ?? null,
      act_english: body.actEnglish ?? null,
      act_math: body.actMath ?? null,
      act_reading: body.actReading ?? null,
      act_science: body.actScience ?? null,
      notes: body.notes ?? null,
    })
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ attempt: data });
}
