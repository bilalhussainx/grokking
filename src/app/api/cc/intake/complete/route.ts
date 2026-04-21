import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "../../helpers";
import { createServerSupabase } from "@/lib/supabase-auth";
import {
  parseNameGrade,
  parseLocation,
  parseFirstGen,
  languageToCode,
} from "@/lib/cc/intake-questions";

export async function POST(req: NextRequest) {
  const { session_token } = await req.json();
  if (!session_token) {
    return NextResponse.json({ error: "Missing session_token" }, { status: 400 });
  }

  let userId: string | null = null;
  try {
    const userSupabase = await createServerSupabase();
    const { data: { user } } = await userSupabase.auth.getUser();
    userId = user?.id ?? null;
  } catch { /* unauthenticated */ }

  const supabase = createAdminSupabase();

  const { data: session, error: fetchErr } = await supabase
    .from("cc_intake_sessions")
    .select("*")
    .eq("session_token", session_token)
    .single();

  if (fetchErr || !session) {
    return NextResponse.json({ error: "Invalid session" }, { status: 404 });
  }

  if (session.completed) {
    return NextResponse.json({ error: "Already completed" }, { status: 400 });
  }

  const fields = session.extracted_fields || {};
  const { name, grade } = parseNameGrade(fields.name_grade || "");
  const { state, country } = parseLocation(fields.location || "");
  const firstGen = parseFirstGen(fields.first_gen || "");
  const langCode = languageToCode(fields.home_language || "English");

  const profileInsert: Record<string, unknown> = {
    preferred_name: name,
    grade_level: grade,
    state_province: state,
    country,
    home_language: langCode,
    is_first_gen: firstGen,
    profile_completion_pct: 15,
    intake_completed_at: new Date().toISOString(),
  };
  if (userId) profileInsert.user_id = userId;

  if (userId) {
    const { data: existing } = await supabase
      .from("cc_student_profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();
    if (existing) {
      await supabase
        .from("cc_student_profiles")
        .update(profileInsert)
        .eq("id", existing.id);
      const profile = existing;

      await supabase
        .from("cc_intake_sessions")
        .update({ completed: true, completed_at: new Date().toISOString(), user_id: userId })
        .eq("id", session.id);

      return NextResponse.json({
        summary: {
          name, grade, state, country,
          language: fields.home_language || "English",
          first_gen: firstGen,
          worries: fields.worries || null,
          interested_schools: fields.schools_interest || null,
        },
        profile_id: profile.id,
      });
    }
  }

  const { data: profile, error: profileErr } = await supabase
    .from("cc_student_profiles")
    .insert(profileInsert)
    .select("id")
    .single();

  if (profileErr) {
    return NextResponse.json({ error: profileErr.message }, { status: 500 });
  }

  await supabase
    .from("cc_intake_sessions")
    .update({
      completed: true,
      completed_at: new Date().toISOString(),
      ...(userId ? { user_id: userId } : {}),
    })
    .eq("id", session.id);

  return NextResponse.json({
    summary: {
      name,
      grade,
      state,
      country,
      language: fields.home_language || "English",
      first_gen: firstGen,
      worries: fields.worries || null,
      interested_schools: fields.schools_interest || null,
    },
    profile_id: profile.id,
  });
}
