// POST /api/cc/supplements/create — creates a cc_essays row of essay_type
// "supplement_<type>" tied to a school + prompt. Idempotent on
// (student_id, school_id, prompt_text).
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase, ensureStudentProfile } from "../../helpers";

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as {
    schoolName?: string;
    promptText?: string;
    promptType?: string;
    wordLimit?: number;
  };
  const schoolName = body.schoolName?.trim();
  const promptText = body.promptText?.trim();
  const promptType = body.promptType ?? "other";
  const wordLimit = body.wordLimit ?? null;
  if (!schoolName || !promptText) {
    return NextResponse.json({ error: "Missing schoolName or promptText" }, { status: 400 });
  }

  const profile = await ensureStudentProfile(auth.supabase, auth.user);
  const db = createAdminSupabase();

  const { data: school } = await db
    .from("cc_schools")
    .select("id")
    .ilike("name", schoolName)
    .maybeSingle();
  if (!school) {
    return NextResponse.json({ error: `School "${schoolName}" not found` }, { status: 404 });
  }

  // Idempotency: if a supplement with this prompt already exists, return it.
  const { data: existing } = await db
    .from("cc_essays")
    .select("id")
    .eq("student_id", profile.id)
    .eq("school_id", school.id)
    .eq("prompt_text", promptText)
    .maybeSingle();
  if (existing) {
    return NextResponse.json({ id: existing.id, created: false });
  }

  const { data, error } = await db
    .from("cc_essays")
    .insert({
      student_id: profile.id,
      school_id: school.id,
      essay_type: `supplement_${promptType}`,
      prompt_text: promptText,
      word_limit: wordLimit,
      phase: "outline",
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id, created: true });
}
