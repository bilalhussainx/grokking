import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "../../helpers";

const ALLOWED_FIELDS = [
  "gpa_unweighted", "gpa_weighted", "gpa_scale", "gpa_raw_value", "gpa_raw_display",
  "class_rank", "class_size", "courses", "ap_ib_courses", "test_strategy",
  "sat_total", "sat_math", "sat_erw", "act_composite", "act_subscores",
  "toefl_score", "ielts_score", "duolingo_english_score",
];

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { supabase, user } = auth;
  const body = await req.json();

  const { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const fields: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of ALLOWED_FIELDS) {
    if (key in body) fields[key] = body[key];
  }

  const { data: existing } = await supabase
    .from("cc_academic_profiles")
    .select("id")
    .eq("student_id", profile.id)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("cc_academic_profiles")
      .update(fields)
      .eq("id", existing.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    const { error } = await supabase
      .from("cc_academic_profiles")
      .insert({ student_id: profile.id, ...fields });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ updated: true });
}
