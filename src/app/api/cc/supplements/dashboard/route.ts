// GET /api/cc/supplements/dashboard
//
// For each school on the student's list, return:
//   - school metadata (name, country)
//   - the school's supplement prompts inline (so the UI can expand cards
//     without a second fetch per school)
//   - per-prompt status: which the student has already started + draft phase
//   - aggregate summary (total required, complete, est hours)
//
// History: this used to read from supplement-prompts-2026.json by NAME, which
// silently failed for every US school because the seed used short names
// ("MIT", "Harvard") while cc_schools stores full official names
// ("Massachusetts Institute of Technology", "Harvard University"). Result:
// every card showed "No seed prompts yet" even though the data was there.
// Switched to cc_school_supplements (the same DB table the essay studio
// already uses successfully) — id-based join, no name fuzzing needed, and
// CA schools come along for free once seeded into the table.

import { NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../helpers";

interface SupplementRow {
  id: string;
  school_id: string;
  prompt_text: string;
  word_limit: number | null;
  is_required: boolean;
  supplement_type: string | null;
  category: string | null;
  sort_order: number | null;
}

interface EssayRow {
  id: string;
  prompt_text: string | null;
  word_limit: number | null;
  current_draft: string | null;
  phase: string | null;
  school_id: string | null;
  supplement_id: string | null;
}

export async function GET() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const db = createAdminSupabase();
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .maybeSingle();
  if (!profile) {
    return NextResponse.json({
      schools: [],
      totalRequired: 0,
      totalComplete: 0,
      estHours: 0,
      hasUKSchools: false,
    });
  }

  // Schools the student has on their list. Fetch country too so the UI can
  // surface the UCAS PS callout when the student has UK schools (UK doesn't
  // use US-style per-school supplements — UCAS shares one PS across choices).
  const { data: studentSchools } = await db
    .from("cc_student_schools")
    .select("id, school_id, cc_schools(name, country)")
    .eq("student_id", profile.id);

  type SS = {
    id: string;
    school_id: string;
    cc_schools?:
      | { name?: string; country?: string }
      | { name?: string; country?: string }[]
      | null;
  };
  const schoolList = ((studentSchools ?? []) as SS[]).map((s) => {
    const sch = Array.isArray(s.cc_schools) ? s.cc_schools[0] : s.cc_schools;
    return {
      id: s.id,
      schoolId: s.school_id,
      name: sch?.name ?? "Unknown",
      country: sch?.country ?? "US",
    };
  });

  const schoolIds = schoolList.map((s) => s.schoolId);
  const hasUKSchools = schoolList.some((s) => s.country === "UK");

  // One batch fetch instead of N queries — the dashboard usually loads
  // 5-15 schools so this scales fine.
  const { data: supplementsRaw } = schoolIds.length
    ? await db
        .from("cc_school_supplements")
        .select("id, school_id, prompt_text, word_limit, is_required, supplement_type, category, sort_order")
        .in("school_id", schoolIds)
        .order("sort_order", { ascending: true })
        .order("is_required", { ascending: false })
    : { data: [] };
  const supplements = (supplementsRaw ?? []) as SupplementRow[];

  // All supplement essays the student has started — index by school + by
  // supplement_id so we can match prompts back to existing drafts.
  const { data: studentEssays } = await db
    .from("cc_essays")
    .select("id, prompt_text, word_limit, current_draft, phase, school_id, supplement_id")
    .eq("student_id", profile.id)
    .like("essay_type", "supplement%");
  const essays = (studentEssays ?? []) as EssayRow[];

  const result = schoolList.map((s) => {
    const schoolPrompts = supplements.filter((p) => p.school_id === s.schoolId);
    const studentEssaysForSchool = essays.filter((e) => e.school_id === s.schoolId);

    // Match each prompt to an existing essay row (by supplement_id, then by
    // prompt_text fallback for legacy rows that pre-date the supplement_id
    // link from migration 20260420). Return per-prompt status so the UI
    // doesn't need a second fetch to render the inline expansion.
    const prompts = schoolPrompts.map((p) => {
      const match =
        studentEssaysForSchool.find((e) => e.supplement_id === p.id) ??
        studentEssaysForSchool.find(
          (e) => e.prompt_text && p.prompt_text.startsWith(e.prompt_text.slice(0, 80)),
        );
      const wordCount = match?.current_draft?.trim().split(/\s+/).filter(Boolean).length ?? 0;
      return {
        supplementId: p.id,
        text: p.prompt_text,
        type: p.supplement_type ?? "other",
        category: p.category,
        wordLimit: p.word_limit,
        required: p.is_required,
        essayId: match?.id ?? null,
        phase: match?.phase ?? null,
        currentWordCount: wordCount,
      };
    });

    const requiredCount = schoolPrompts.filter((p) => p.is_required).length;
    const inProgress = studentEssaysForSchool.filter(
      (e) => e.phase !== "final" && (e.current_draft ?? "").length > 20,
    ).length;
    const complete = studentEssaysForSchool.filter((e) => e.phase === "final").length;

    return {
      studentSchoolId: s.id,
      schoolId: s.schoolId,
      schoolName: s.name,
      country: s.country,
      totalPrompts: schoolPrompts.length,
      requiredCount,
      started: studentEssaysForSchool.length,
      inProgress,
      complete,
      hasSeed: schoolPrompts.length > 0,
      prompts,
    };
  });

  const totalRequired = result.reduce((sum, r) => sum + r.requiredCount, 0);
  const totalComplete = result.reduce((sum, r) => sum + r.complete, 0);
  const estHours = Math.max(1, Math.round((totalRequired - totalComplete) * 0.5));

  return NextResponse.json({
    schools: result,
    totalRequired,
    totalComplete,
    estHours,
    hasUKSchools,
  });
}
