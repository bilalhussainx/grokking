import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "../../helpers";

const ALLOWED_FIELDS = [
  "legal_first_name", "preferred_name", "grade_level", "graduation_year",
  "high_school_name", "high_school_ceeb_code", "state_province", "country",
  "home_language", "is_first_gen", "is_international", "citizenship_status",
  "race_ethnicity", "gender",
];

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { supabase, user } = auth;
  const body = await req.json();

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of ALLOWED_FIELDS) {
    if (key in body) updates[key] = body[key];
  }

  const { data, error } = await supabase
    .from("cc_student_profiles")
    .update(updates)
    .eq("user_id", user.id)
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ updated: true, id: data.id });
}
