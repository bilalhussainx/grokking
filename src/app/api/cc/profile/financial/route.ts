import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "../../helpers";

const ALLOWED_FIELDS = [
  "household_income_bracket", "household_size", "dependents_in_college",
  "parents_marital_status", "pell_eligible_estimate", "sai_estimate",
  "free_reduced_lunch", "willing_to_take_loans", "max_loans_comfortable",
  "fafsa_submitted", "fafsa_ed", "css_profile_submitted",
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
    .from("cc_financial_profiles")
    .select("id")
    .eq("student_id", profile.id)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("cc_financial_profiles")
      .update(fields)
      .eq("id", existing.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    const { error } = await supabase
      .from("cc_financial_profiles")
      .insert({ student_id: profile.id, ...fields });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ updated: true });
}
