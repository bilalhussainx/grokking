import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const prefs = await req.json();

  const { error } = await supabase
    .from("user_profiles")
    .update({
      native_language: prefs.native_language,
      instruction_language: prefs.instruction_language,
      english_fluency: prefs.english_fluency,
      learning_interests: prefs.learning_interests,
      learning_style: prefs.learning_style,
      communication_mode: prefs.communication_mode,
      coach_persona: prefs.coach_persona,
      preferred_voice_id: prefs.preferred_voice_id,
      onboarding_completed: prefs.onboarding_completed ?? true,
      personalization_consent: prefs.personalization_consent ?? false,
    })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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
