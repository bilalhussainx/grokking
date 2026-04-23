import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../helpers";
import { financialNeedFromAffordability, type AffordabilityValue } from "@/lib/cc/affordability";

const ALLOWED_FIELDS = [
  "legal_first_name", "preferred_name", "grade_level", "graduation_year",
  "high_school_name", "high_school_ceeb_code", "state_province", "country",
  "home_language", "preferred_language", "is_first_gen", "is_international", "citizenship_status",
  "race_ethnicity", "gender",
  "affordability_value",
];

const VALID_AFFORDABILITY: ReadonlySet<string> = new Set([
  "zero", "under_10k", "10k_20k", "20k_30k", "30k_50k", "50k_plus",
]);

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { supabase, user } = auth;
  const body = await req.json();

  if ("affordability_value" in body && body.affordability_value != null && !VALID_AFFORDABILITY.has(body.affordability_value)) {
    return NextResponse.json({ error: "invalid affordability_value" }, { status: 400 });
  }

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

  if ("affordability_value" in body && body.affordability_value) {
    const derived = financialNeedFromAffordability(body.affordability_value as AffordabilityValue);
    const admin = createAdminSupabase();
    await admin
      .from("cc_school_preferences")
      .upsert(
        { student_id: data.id, financial_need: derived, updated_at: new Date().toISOString() },
        { onConflict: "student_id" },
      );
  }

  return NextResponse.json({ updated: true, id: data.id });
}
