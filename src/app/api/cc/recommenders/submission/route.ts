// PATCH /api/cc/recommenders/submission — set submitted=true|false for a
// (recommender, school) pair. Used by the teacher tracker UI.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../helpers";

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as {
    recommenderId?: string;
    studentSchoolId?: string;
    submitted?: boolean;
  };
  if (!body.recommenderId || !body.studentSchoolId) {
    return NextResponse.json({ error: "Missing recommenderId or studentSchoolId" }, { status: 400 });
  }
  const submitted = Boolean(body.submitted);

  const db = createAdminSupabase();

  // Verify the recommender belongs to this user.
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .maybeSingle();
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const { data: rec } = await db
    .from("cc_recommenders")
    .select("id, student_id")
    .eq("id", body.recommenderId)
    .maybeSingle();
  if (!rec || rec.student_id !== profile.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: existing } = await db
    .from("cc_recommender_submissions")
    .select("id")
    .eq("recommender_id", body.recommenderId)
    .eq("student_school_id", body.studentSchoolId)
    .maybeSingle();

  const submitted_at = submitted ? new Date().toISOString() : null;

  if (existing) {
    await db.from("cc_recommender_submissions")
      .update({ submitted, submitted_at })
      .eq("id", existing.id);
  } else {
    await db.from("cc_recommender_submissions").insert({
      recommender_id: body.recommenderId,
      student_school_id: body.studentSchoolId,
      submitted,
      submitted_at,
    });
  }

  return NextResponse.json({ ok: true });
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
  if (!profile) return NextResponse.json({ submissions: [] });

  // All submissions for all of the student's recommenders.
  const { data: recs } = await db
    .from("cc_recommenders")
    .select("id")
    .eq("student_id", profile.id);
  const recIds = (recs ?? []).map((r) => r.id);
  if (recIds.length === 0) return NextResponse.json({ submissions: [] });

  const { data } = await db
    .from("cc_recommender_submissions")
    .select("recommender_id, student_school_id, submitted, submitted_at")
    .in("recommender_id", recIds);
  return NextResponse.json({ submissions: data ?? [] });
}
