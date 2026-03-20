import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase, createAdminSupabase } from "@/lib/supabase-auth";

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const prefs = await req.json();

  // Use admin client to bypass RLS — profile may not exist yet during onboarding
  let admin;
  try {
    admin = createAdminSupabase();
  } catch {
    // Fallback to server client if service key not set
    admin = supabase;
  }

  // Build update payload — only include defined fields
  const updateData: Record<string, unknown> = {
    onboarding_completed: prefs.onboarding_completed ?? false,
    personalization_consent: prefs.personalization_consent ?? false,
  };
  if (prefs.native_language) updateData.native_language = prefs.native_language;
  if (prefs.instruction_language) updateData.instruction_language = prefs.instruction_language;
  if (prefs.english_fluency) updateData.english_fluency = prefs.english_fluency;
  if (prefs.learning_interests) updateData.learning_interests = prefs.learning_interests;
  if (prefs.learning_style) updateData.learning_style = prefs.learning_style;
  if (prefs.communication_mode) updateData.communication_mode = prefs.communication_mode;
  if (prefs.coach_persona) updateData.coach_persona = prefs.coach_persona;
  if (prefs.preferred_voice_id) updateData.preferred_voice_id = prefs.preferred_voice_id;

  // Always upsert — works whether profile exists or not
  const { error: upsertErr } = await admin.from("user_profiles").upsert({
    id: user.id,
    email: user.email || "",
    full_name: user.user_metadata?.full_name || user.user_metadata?.name || "User",
    ...updateData,
  }, { onConflict: "id" });

  if (upsertErr) {
    console.error("[Preferences] Upsert error:", upsertErr);
    return NextResponse.json({ error: upsertErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("user_profiles")
    .select("native_language, instruction_language, english_fluency, learning_interests, learning_style, communication_mode, coach_persona, preferred_voice_id, onboarding_completed")
    .eq("id", user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
