import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../helpers";

export async function GET() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const db = createAdminSupabase();
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ essays: [] });
  }

  const { data: essays } = await db
    .from("cc_essays")
    .select("id, essay_type, prompt_text, word_limit, phase, word_count, updated_at, school_id")
    .eq("student_id", profile.id)
    .order("updated_at", { ascending: false });

  return NextResponse.json({ essays: essays || [] });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const db = createAdminSupabase();
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Complete your profile first" }, { status: 400 });
  }

  const body = await req.json();
  const { essay_type, school_id, prompt_text, word_limit } = body as {
    essay_type: string;
    school_id?: string;
    prompt_text: string;
    word_limit: number;
  };

  if (!essay_type || !prompt_text || !word_limit) {
    return NextResponse.json({ error: "essay_type, prompt_text, and word_limit required" }, { status: 400 });
  }

  const { data: essay, error } = await db
    .from("cc_essays")
    .insert({
      student_id: profile.id,
      essay_type,
      school_id: school_id || null,
      prompt_text,
      word_limit,
      phase: "brainstorm",
    })
    .select()
    .single();

  if (error) {
    console.error("[Essays] Create failed:", error);
    return NextResponse.json({ error: "Failed to create essay" }, { status: 500 });
  }

  return NextResponse.json({ essay });
}
