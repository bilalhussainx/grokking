// GET /api/cc/supplements/dashboard — for each school in the student's
// application list, return: school name, total prompts (from seed), required
// prompts, supplements the student has started/completed.
import { NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../helpers";
import promptsSeed from "@/data/supplement-prompts-2026.json";

type SeedEntry = {
  school_name: string;
  prompts: { type: string; text: string; word_limit: number; required: boolean }[];
};

const SEED = promptsSeed as SeedEntry[];

export async function GET() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const db = createAdminSupabase();
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .maybeSingle();
  if (!profile) return NextResponse.json({ schools: [] });

  // Schools the student has on their list (joined to cc_schools.name).
  const { data: studentSchools } = await db
    .from("cc_student_schools")
    .select("id, school_id, cc_schools(name)")
    .eq("student_id", profile.id);

  type SS = { id: string; school_id: string; cc_schools?: { name?: string } | { name?: string }[] | null };
  const schoolList = ((studentSchools ?? []) as SS[]).map((s) => {
    const sch = Array.isArray(s.cc_schools) ? s.cc_schools[0] : s.cc_schools;
    return { id: s.id, schoolId: s.school_id, name: sch?.name ?? "Unknown" };
  });

  // All supplement essays the student has started.
  const { data: studentEssays } = await db
    .from("cc_essays")
    .select("id, prompt_text, word_limit, current_draft, phase, school_id")
    .eq("student_id", profile.id)
    .like("essay_type", "supplement%");

  type EssayRow = {
    id: string;
    prompt_text: string | null;
    word_limit: number | null;
    current_draft: string | null;
    phase: string | null;
    school_id: string | null;
  };
  const essays = (studentEssays ?? []) as EssayRow[];

  const result = schoolList.map((s) => {
    const seed = SEED.find((e) => e.school_name.toLowerCase() === s.name.toLowerCase());
    const totalPrompts = seed?.prompts.length ?? 0;
    const requiredCount = seed?.prompts.filter((p) => p.required).length ?? 0;
    const studentEssaysForSchool = essays.filter((e) => e.school_id === s.schoolId);
    const inProgress = studentEssaysForSchool.filter((e) => e.phase !== "final" && (e.current_draft ?? "").length > 20).length;
    const complete = studentEssaysForSchool.filter((e) => e.phase === "final").length;

    return {
      studentSchoolId: s.id,
      schoolId: s.schoolId,
      schoolName: s.name,
      totalPrompts,
      requiredCount,
      started: studentEssaysForSchool.length,
      inProgress,
      complete,
      hasSeed: Boolean(seed),
    };
  });

  // Aggregate summary
  const totalRequired = result.reduce((sum, r) => sum + r.requiredCount, 0);
  const totalComplete = result.reduce((sum, r) => sum + r.complete, 0);
  const estHours = Math.max(1, Math.round((totalRequired - totalComplete) * 0.5)); // ~30 min/essay

  return NextResponse.json({ schools: result, totalRequired, totalComplete, estHours });
}
