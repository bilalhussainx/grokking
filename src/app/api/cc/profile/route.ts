import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "../helpers";
import { calculateCompletion } from "@/lib/cc/profile-completion";

export async function GET(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { supabase, user } = auth;

  let { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    const { data: newProfile, error } = await supabase
      .from("cc_student_profiles")
      .insert({ user_id: user.id })
      .select("*")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    profile = newProfile;
  }

  const { data: academic } = await supabase
    .from("cc_academic_profiles")
    .select("*")
    .eq("student_id", profile.id)
    .single();

  const { data: activities } = await supabase
    .from("cc_activities")
    .select("*")
    .eq("student_id", profile.id)
    .order("position");

  const { data: honors } = await supabase
    .from("cc_honors")
    .select("*")
    .eq("student_id", profile.id)
    .order("position");

  const { data: financial } = await supabase
    .from("cc_financial_profiles")
    .select("*")
    .eq("student_id", profile.id)
    .single();

  const completion_pct = calculateCompletion(
    profile,
    academic,
    activities || [],
    honors || [],
    financial,
  );

  if (completion_pct !== profile.profile_completion_pct) {
    await supabase
      .from("cc_student_profiles")
      .update({ profile_completion_pct: completion_pct })
      .eq("id", profile.id);
  }

  return NextResponse.json({
    profile,
    academic: academic || null,
    activities: activities || [],
    honors: honors || [],
    financial: financial || null,
    completion_pct,
  });
}
