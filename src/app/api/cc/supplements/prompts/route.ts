// GET /api/cc/supplements/prompts?school=Yale — returns the seed prompts for
// a school + which prompts the student has already started.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../helpers";
import promptsSeed from "@/data/supplement-prompts-2026.json";

type SeedEntry = {
  school_name: string;
  prompts: { type: string; text: string; word_limit: number; required: boolean }[];
};
const SEED = promptsSeed as SeedEntry[];

export async function GET(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const url = new URL(req.url);
  const school = url.searchParams.get("school")?.trim();
  if (!school) {
    return NextResponse.json({ error: "Missing ?school=" }, { status: 400 });
  }

  const seed = SEED.find((e) => e.school_name.toLowerCase() === school.toLowerCase());
  if (!seed) {
    return NextResponse.json({ schoolName: school, prompts: [], hasSeed: false });
  }

  const db = createAdminSupabase();
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  // Find existing supplement essays for this school + student.
  let existing: { id: string; prompt_text: string; phase: string; current_draft: string | null }[] = [];
  if (profile) {
    const { data: schoolMatch } = await db
      .from("cc_schools")
      .select("id")
      .ilike("name", school)
      .maybeSingle();
    if (schoolMatch) {
      const { data: rows } = await db
        .from("cc_essays")
        .select("id, prompt_text, phase, current_draft")
        .eq("student_id", profile.id)
        .eq("school_id", schoolMatch.id)
        .like("essay_type", "supplement%");
      existing = (rows ?? []) as typeof existing;
    }
  }

  const prompts = seed.prompts.map((p, idx) => {
    const match = existing.find(
      (e) => e.prompt_text && p.text.startsWith(e.prompt_text.slice(0, 80)),
    );
    const draftLen = match?.current_draft?.trim().split(/\s+/).filter(Boolean).length ?? 0;
    return {
      seedIndex: idx,
      type: p.type,
      text: p.text,
      wordLimit: p.word_limit,
      required: p.required,
      essayId: match?.id ?? null,
      phase: match?.phase ?? null,
      currentWordCount: draftLen,
    };
  });

  return NextResponse.json({ schoolName: seed.school_name, prompts, hasSeed: true });
}
