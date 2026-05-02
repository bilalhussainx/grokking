// Returns the same Coach Kairos system prompt that POST /api/cc/coach/message
// builds, so voice-mode sessions get the same intake -> school list -> activity
// list -> essay-aware behaviour as text mode. Trimmed: omits focus-essay deep
// context (voice mode doesn't navigate into specific essays).
import { NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../helpers";
import { detectMode } from "@/lib/cc/coach-mode-detector";
import { buildSystemPrompt, type CoachContext } from "@/lib/cc/coach-prompt-builder";
import { buildLanguageInstruction } from "@/lib/cc/detect-language";
import { pickCoachLanguage } from "@/lib/cc/language-fallback";

const VOICE_TAIL = `

## VOICE MODE GUARDRAILS (CRITICAL)
You are speaking aloud. Keep replies to 1-2 short sentences. Never use markdown
(no **bold**, no bullet lists, no headings, no backticks). Plain spoken English
only. If you'd normally show a list, pick the single most useful item and ask
which they want to dive into.

## STAY ON THE PROCESS
You guide the student through this fixed flow: intake -> school list ->
activity list -> essays (personal statement -> supplements) -> interviews ->
financial aid. If the student wanders, gently bring them back to the next
unfinished step in their setup.`;

export async function GET() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const supabase = createAdminSupabase();

  let { data: profile } = await supabase
    .from("cc_student_profiles")
    .select(
      "id, preferred_name, grade_level, country, state_province, is_first_gen, is_international, intake_completed_at, affordability_value, needs_full_aid, preferred_language, home_language",
    )
    .eq("user_id", auth.user.id)
    .maybeSingle();

  if (!profile) {
    const { data: newProfile } = await supabase
      .from("cc_student_profiles")
      .insert({ user_id: auth.user.id })
      .select(
        "id, preferred_name, grade_level, country, state_province, is_first_gen, is_international, intake_completed_at, affordability_value, needs_full_aid, preferred_language, home_language",
      )
      .single();
    profile = newProfile;
  }
  if (!profile) {
    return NextResponse.json({ error: "Could not create profile" }, { status: 500 });
  }

  const { data: academic } = await supabase
    .from("cc_academic_profiles")
    .select("gpa_unweighted, gpa_raw_display, test_strategy, sat_total, act_composite")
    .eq("student_id", profile.id)
    .maybeSingle();

  const { data: preferences } = await supabase
    .from("cc_school_preferences")
    .select("*")
    .eq("student_id", profile.id)
    .maybeSingle();

  const { data: schools } = await supabase
    .from("cc_student_schools")
    .select("chancing_band")
    .eq("student_id", profile.id);

  type SchoolRow = { chancing_band: string | null };
  const schoolList = (schools ?? []) as SchoolRow[];
  const schoolCount = schoolList.length;
  const reach = schoolList.filter((s) => s.chancing_band === "reach").length;
  const match = schoolList.filter((s) => s.chancing_band === "match").length;
  const safety = schoolList.filter((s) => s.chancing_band === "safety").length;
  const schoolSummary =
    schoolCount > 0 ? `${reach} reach, ${match} match, ${safety} safety` : "none yet";

  const { data: essayCheck } = await supabase
    .from("cc_essays")
    .select("id, revision_comments, supplement_id, phase")
    .eq("student_id", profile.id);
  const { data: interviewCheck } = await supabase
    .from("interview_sessions")
    .select("id")
    .eq("user_id", auth.user.id)
    .limit(1);
  const { data: optimizedActivities } = await supabase
    .from("cc_activities")
    .select("id")
    .eq("student_id", profile.id)
    .not("impact_score", "is", null)
    .limit(1);

  type EssayRow = { id: string; revision_comments: unknown; supplement_id: string | null; phase: string | null };
  const essayList = (essayCheck ?? []) as EssayRow[];
  const reviewedEssays = essayList.filter((e) => e.revision_comments !== null);
  const supplementEssays = essayList.filter((e) => e.supplement_id !== null);

  const progress = {
    hasIntakeCompleted: !!profile.intake_completed_at,
    hasGPA: !!academic?.gpa_unweighted,
    hasSchools: schoolCount > 0,
    hasEssays: essayList.length > 0,
    hasEssayReviewed: reviewedEssays.length > 0,
    hasActivitiesOptimized: (optimizedActivities?.length ?? 0) > 0,
    hasSupplementsStarted: supplementEssays.length > 0,
    hasInterviewSessions: (interviewCheck?.length ?? 0) > 0,
  };

  const mode = detectMode(progress, "/", "voice session start", { focusEssayHasReview: false });

  const coachContext: CoachContext = {
    mode,
    studentName: profile.preferred_name,
    grade: profile.grade_level,
    country: profile.country,
    state: profile.state_province,
    isInternational: profile.is_international ?? false,
    isFirstGen: profile.is_first_gen ?? false,
    gpaUnweighted: academic?.gpa_unweighted ?? null,
    gpaRawDisplay: academic?.gpa_raw_display ?? null,
    testStrategy: academic?.test_strategy ?? null,
    satTotal: academic?.sat_total ?? null,
    actComposite: academic?.act_composite ?? null,
    schoolCount,
    schoolSummary,
    hasIntakeCompleted: progress.hasIntakeCompleted,
    hasGPA: progress.hasGPA,
    hasSchools: progress.hasSchools,
    hasEssays: progress.hasEssays,
    hasEssayReviewed: progress.hasEssayReviewed,
    hasActivitiesOptimized: progress.hasActivitiesOptimized,
    hasSupplementsStarted: progress.hasSupplementsStarted,
    hasInterviewSessions: progress.hasInterviewSessions,
    latestEssayReview: null, // omit deep review notes for voice mode
    preferences: preferences ?? null,
    focusEssay: null,
    applicationSnapshot: null,
    affordabilityValue:
      ((profile as { affordability_value?: string | null }).affordability_value as never) ?? null,
    needsFullAid: !!(profile as { needs_full_aid?: boolean | null }).needs_full_aid,
    // Voice prompt is built once at session start before the variant is
    // known. Leaving null is fine — the variant block is additive guidance,
    // and grade context is still surfaced via ctx.grade.
    variantKey: null,
  };

  // Voice mode prefers the user's chosen language over message-detection
  // (no message yet to detect from). pickCoachLanguage encapsulates the
  // preferred_language → home_language fallback so the same logic runs
  // here and in the text-coach path.
  const preferredLang = pickCoachLanguage(profile as {
    preferred_language?: string | null;
    home_language?: string | null;
  });
  const languageInstruction = buildLanguageInstruction("unknown", preferredLang);

  const systemPrompt = buildSystemPrompt(coachContext) + languageInstruction + VOICE_TAIL;

  return NextResponse.json({ systemPrompt, mode });
}
