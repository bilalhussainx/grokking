import { NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../helpers";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const { supplement_id } = (await req.json()) as { supplement_id?: string };
  if (!supplement_id) {
    return NextResponse.json({ error: "Missing supplement_id" }, { status: 400 });
  }

  const db = createAdminSupabase();

  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .single();
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const { data: supplement } = await db
    .from("cc_school_supplements")
    .select("id, school_id, prompt_text, word_limit, supplement_type")
    .eq("id", supplement_id)
    .single();
  if (!supplement) {
    return NextResponse.json({ error: "Supplement not found" }, { status: 404 });
  }

  const { data: existing } = await db
    .from("cc_essays")
    .select("id")
    .eq("student_id", profile.id)
    .eq("supplement_id", supplement.id)
    .maybeSingle();
  if (existing) {
    return NextResponse.json({ essay_id: existing.id, created: false });
  }

  const { data: created, error } = await db
    .from("cc_essays")
    .insert({
      student_id: profile.id,
      school_id: supplement.school_id,
      supplement_id: supplement.id,
      essay_type: supplement.supplement_type
        ? `supplement:${supplement.supplement_type}`
        : "supplement",
      prompt_text: supplement.prompt_text,
      word_limit: supplement.word_limit || 250,
      phase: "brainstorm",
    })
    .select("id")
    .single();

  if (error || !created) {
    return NextResponse.json({ error: error?.message || "Failed to create essay" }, { status: 500 });
  }

  return NextResponse.json({ essay_id: created.id, created: true });
}
