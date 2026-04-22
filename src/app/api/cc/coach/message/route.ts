import { NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { createAdminSupabase } from "../../helpers";
import { detectMode } from "@/lib/cc/coach-mode-detector";
import {
  buildSystemPrompt,
  type CoachContext,
  type FocusEssay,
  type ApplicationSnapshot,
} from "@/lib/cc/coach-prompt-builder";
import { streamChat, type ChatMessage } from "@/lib/cc/openrouter";
import { runCoachExtraction } from "@/lib/cc/coach-extract";
import { assertCapacity, blockedResponse } from "@/lib/cc/tier-gate";

function extractEssayIdFromPath(path: string | null | undefined): string | null {
  if (!path) return null;
  const m = path.match(/^\/cc\/essays\/([^/?#]+)/);
  if (!m) return null;
  // Ignore non-UUID segments like "new" or "index"
  if (!/^[0-9a-f-]{10,}$/i.test(m[1])) return null;
  return m[1];
}

function wordCount(s: string | null | undefined): number {
  if (!s) return 0;
  return s.trim().split(/\s+/).filter(Boolean).length;
}

export async function POST(req: NextRequest) {
  const userSupabase = await createServerSupabase();
  const { data: { user } } = await userSupabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { message, page_context, essay_id, source_event } = await req.json();
  if (!message || typeof message !== "string") {
    return new Response(JSON.stringify({ error: "Missing message" }), { status: 400 });
  }

  const supabase = createAdminSupabase();

  // Fetch or create student profile
  let { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("id, preferred_name, grade_level, country, state_province, is_first_gen, is_international, intake_completed_at")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) {
    const { data: newProfile } = await supabase
      .from("cc_student_profiles")
      .insert({ user_id: user.id })
      .select("id, preferred_name, grade_level, country, state_province, is_first_gen, is_international, intake_completed_at")
      .single();
    profile = newProfile;
  }
  if (!profile) {
    return new Response(JSON.stringify({ error: "Could not create profile" }), { status: 500 });
  }

  // Tier gate — count today's user messages (role=user) for this student.
  // Anonymous users have a tighter cap; Pro is unlimited (fast-path).
  const { count: todayMessages } = await supabase
    .from("cc_coach_conversations")
    .select("id", { count: "exact", head: true })
    .eq("student_id", profile.id)
    .eq("role", "user")
    .gte("created_at", new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString());

  const check = await assertCapacity(user.id, "coachMessagesPerDay", todayMessages ?? 0);
  if (!check.ok) return blockedResponse(check);

  // Fetch academic profile
  const { data: academic } = await supabase
    .from("cc_academic_profiles")
    .select("gpa_unweighted, test_strategy, sat_total, act_composite")
    .eq("student_id", profile.id)
    .maybeSingle();

  // Fetch school preferences
  const { data: preferences } = await supabase
    .from("cc_school_preferences")
    .select("*")
    .eq("student_id", profile.id)
    .maybeSingle();

  // Fetch school list summary
  const { data: schools } = await supabase
    .from("cc_student_schools")
    .select("chancing_band")
    .eq("student_id", profile.id);

  const schoolCount = schools?.length ?? 0;
  const reach = schools?.filter((s) => s.chancing_band === "reach").length ?? 0;
  const match = schools?.filter((s) => s.chancing_band === "match").length ?? 0;
  const safety = schools?.filter((s) => s.chancing_band === "safety").length ?? 0;
  const schoolSummary = schoolCount > 0 ? `${reach} reach, ${match} match, ${safety} safety` : "none yet";

  // Check setup progress
  const { data: essayCheck } = await supabase
    .from("cc_essays")
    .select("id, revision_comments, supplement_id, phase, updated_at")
    .eq("student_id", profile.id)
    .order("updated_at", { ascending: false });
  const { data: interviewCheck } = await supabase
    .from("interview_sessions").select("id").eq("user_id", user.id).limit(1);
  // Activities optimizer has been run if any activity has an impact_score set.
  const { data: optimizedActivities } = await supabase
    .from("cc_activities")
    .select("id")
    .eq("student_id", profile.id)
    .not("impact_score", "is", null)
    .limit(1);

  const reviewedEssays = (essayCheck ?? []).filter((e) => e.revision_comments !== null);
  const supplementEssays = (essayCheck ?? []).filter((e) => e.supplement_id !== null);
  const latestReview = reviewedEssays[0]?.revision_comments as
    | { overallNotes?: string; promptFitScore?: number }
    | null
    | undefined;

  const progress = {
    hasIntakeCompleted: !!profile.intake_completed_at,
    hasGPA: !!academic?.gpa_unweighted,
    hasSchools: schoolCount > 0,
    hasEssays: (essayCheck?.length ?? 0) > 0,
    hasEssayReviewed: reviewedEssays.length > 0,
    hasActivitiesOptimized: (optimizedActivities?.length ?? 0) > 0,
    hasSupplementsStarted: supplementEssays.length > 0,
    hasInterviewSessions: (interviewCheck?.length ?? 0) > 0,
  };

  // Focus essay: pin to an explicit essay_id from the client if provided
  // (review-landed CTA, etc.), otherwise fall back to parsing the URL.
  // Explicit ID wins so we never confuse a supplement's review with the PS.
  const explicitEssayId =
    typeof essay_id === "string" && /^[0-9a-f-]{10,}$/i.test(essay_id) ? essay_id : null;
  const focusEssayId = explicitEssayId ?? extractEssayIdFromPath(page_context);
  let focusEssay: FocusEssay | null = null;

  if (focusEssayId) {
    const { data: e } = await supabase
      .from("cc_essays")
      .select(
        "id, essay_type, prompt_text, word_limit, current_draft, revision_comments, supplement_id, school_id, created_at, updated_at",
      )
      .eq("id", focusEssayId)
      .eq("student_id", profile.id)
      .maybeSingle();

    if (e) {
      // Distinct prior draft versions (fresh first draft vs. Nth revision)
      const { data: drafts } = await supabase
        .from("cc_essay_drafts")
        .select("id")
        .eq("essay_id", e.id);
      const priorDraftCount = drafts?.length ?? 0;

      let schoolName: string | null = null;
      let schoolAcceptanceRate: number | null = null;
      let schoolMission: string | null = null;
      let supplementType: string | null = null;

      if (e.school_id) {
        const { data: school } = await supabase
          .from("cc_schools")
          .select("name, acceptance_rate, mission_statement")
          .eq("id", e.school_id)
          .maybeSingle();
        schoolName = school?.name ?? null;
        schoolAcceptanceRate = school?.acceptance_rate ?? null;
        schoolMission = school?.mission_statement ?? null;
      }
      if (e.supplement_id) {
        const { data: supp } = await supabase
          .from("cc_school_supplements")
          .select("supplement_type")
          .eq("id", e.supplement_id)
          .maybeSingle();
        supplementType = supp?.supplement_type ?? null;
      }

      const review = (e.revision_comments ?? null) as
        | {
            comments?: Array<{ paragraphIndex: number; type: string; text: string; severity: string }>;
            overallNotes?: string;
            promptFitScore?: number;
          }
        | null;

      focusEssay = {
        id: e.id as string,
        kind: (e.essay_type as string | null)?.startsWith("supplement") ? "supplement" : "personal_statement",
        supplementType,
        schoolName,
        schoolAcceptanceRate,
        schoolMission,
        promptText: (e.prompt_text as string) ?? "",
        wordLimit: (e.word_limit as number) ?? 0,
        currentDraft: (e.current_draft as string) ?? null,
        draftWordCount: wordCount(e.current_draft as string | null),
        revisionCount: priorDraftCount,
        isFreshDraft: priorDraftCount === 0,
        reviewOverallNotes: review?.overallNotes ?? null,
        reviewPromptFitScore: review?.promptFitScore ?? null,
        reviewTopComments: (review?.comments ?? [])
          .slice()
          .sort((a, b) => {
            const rank = (sev: string) =>
              sev === "high" ? 0 : sev === "medium" ? 1 : sev === "low" ? 2 : 3;
            return rank(a.severity) - rank(b.severity);
          })
          .slice(0, 5),
      };
    }
  }

  // Application snapshot: the coach needs to see all the pieces in flight so
  // it can give holistic feedback (does supplement topic double the PS? does
  // it leverage top activities? what's the school list?).
  const allEssays = essayCheck ?? [];
  const personalStatement = allEssays.find((e) => !e.supplement_id) ?? null;
  const psReview = (personalStatement?.revision_comments ?? null) as
    | { overallNotes?: string }
    | null;

  const { data: psRow } = personalStatement
    ? await supabase
        .from("cc_essays")
        .select("current_draft")
        .eq("id", personalStatement.id)
        .maybeSingle()
    : { data: null };

  const supplementsBySchoolRaw = await Promise.all(
    supplementEssays.slice(0, 8).map(async (supp) => {
      const { data: row } = await supabase
        .from("cc_essays")
        .select("phase, revision_comments, school_id")
        .eq("id", supp.id)
        .maybeSingle();
      if (!row) return null;
      let name = "School";
      if (row.school_id) {
        const { data: school } = await supabase
          .from("cc_schools")
          .select("name")
          .eq("id", row.school_id)
          .maybeSingle();
        name = school?.name ?? name;
      }
      return {
        schoolName: name,
        phase: (row.phase as string) ?? "brainstorm",
        reviewed: row.revision_comments !== null,
      };
    }),
  );
  const supplementsBySchool = supplementsBySchoolRaw.filter((x): x is NonNullable<typeof x> => !!x);

  const { data: activitiesRows } = await supabase
    .from("cc_activities")
    .select("activity_name, role, impact_score")
    .eq("student_id", profile.id)
    .order("impact_score", { ascending: false, nullsFirst: false })
    .limit(3);
  const { data: activitiesAll } = await supabase
    .from("cc_activities")
    .select("id, impact_score")
    .eq("student_id", profile.id);

  const { data: schoolListRows } = await supabase
    .from("cc_student_schools")
    .select("chancing_band, school_id")
    .eq("student_id", profile.id);
  const schoolListNames: Array<{ name: string; band: string | null }> = [];
  for (const row of (schoolListRows ?? []).slice(0, 12)) {
    if (!row.school_id) continue;
    const { data: school } = await supabase
      .from("cc_schools")
      .select("name")
      .eq("id", row.school_id)
      .maybeSingle();
    if (school?.name) schoolListNames.push({ name: school.name, band: (row.chancing_band as string) ?? null });
  }

  const applicationSnapshot: ApplicationSnapshot = {
    personalStatement: personalStatement
      ? {
          hasDraft: !!(psRow?.current_draft),
          hasReview: !!psReview,
          wordCount: wordCount(psRow?.current_draft ?? null),
          reviewSummary: psReview?.overallNotes ?? null,
          themes: null,
        }
      : null,
    supplements: {
      total: supplementEssays.length,
      drafted: supplementsBySchool.filter((s) => s.phase === "draft" || s.phase === "revise").length,
      reviewed: supplementsBySchool.filter((s) => s.reviewed).length,
      bySchool: supplementsBySchool,
    },
    activities: {
      total: activitiesAll?.length ?? 0,
      optimized: activitiesAll?.filter((a) => a.impact_score !== null).length ?? 0,
      topThree: (activitiesRows ?? []).map((a) => ({
        name: (a.activity_name as string) ?? "Activity",
        role: (a.role as string | null) ?? null,
        impact: (a.impact_score as number | null) ?? null,
      })),
    },
    schoolList: schoolListNames,
  };

  // If the client explicitly told us this is a review-landed event, force the
  // post-review mode even if the review just persisted and we didn't race-read
  // the comments in time.
  const reviewLandedSignal = source_event === "review-landed";
  const mode = detectMode(progress, page_context || "/", message, {
    focusEssayHasReview:
      reviewLandedSignal ||
      !!focusEssay?.reviewOverallNotes ||
      (focusEssay?.reviewTopComments.length ?? 0) > 0,
  });

  const coachContext: CoachContext = {
    mode,
    studentName: profile.preferred_name,
    grade: profile.grade_level,
    country: profile.country,
    state: profile.state_province,
    isInternational: profile.is_international ?? false,
    isFirstGen: profile.is_first_gen ?? false,
    gpaUnweighted: academic?.gpa_unweighted ?? null,
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
    latestEssayReview: latestReview?.overallNotes?.slice(0, 400) ?? null,
    preferences: preferences ?? null,
    focusEssay,
    applicationSnapshot,
  };

  const systemPrompt = buildSystemPrompt(coachContext);

  // Fetch recent conversation history
  const { data: history } = await supabase
    .from("cc_coach_conversations")
    .select("role, content")
    .eq("student_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const historyMessages: ChatMessage[] = (history ?? [])
    .reverse()
    .map((h) => ({ role: h.role as "user" | "assistant", content: h.content }));

  const llmMessages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    ...historyMessages,
    { role: "user", content: message },
  ];

  // Save user message
  await supabase.from("cc_coach_conversations").insert({
    student_id: profile.id,
    role: "user",
    content: message,
    mode,
    page_context: page_context || "/",
  });

  // Stream response
  const encoder = new TextEncoder();
  const profileId = profile.id;
  const stream = new ReadableStream({
    async start(controller) {
      let fullResponse = "";
      try {
        await streamChat(llmMessages, (chunk) => {
          fullResponse += chunk;
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk, mode })}\n\n`));
        });

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, mode })}\n\n`));
        controller.close();

        // Save assistant message, then run extraction. Await the whole chain so
        // the route handler doesn't cut off background work when the response closes.
        console.log(`[coach/message] stream done, mode=${mode}, about to save+extract`);
        try {
          const { error: insertErr } = await supabase.from("cc_coach_conversations").insert({
            student_id: profileId,
            role: "assistant",
            content: fullResponse,
            mode,
            page_context: page_context || "/",
          });
          if (insertErr) console.error("[coach/message] assistant insert failed:", insertErr);

          // Always run extraction — the coach may mention schools/activities in
          // any mode (including school-browse while the user is on /schools).
          // runCoachExtraction short-circuits internally when there's nothing to save.
          console.log(`[coach/message] dispatching runCoachExtraction(${profileId}, ${mode})`);
          await runCoachExtraction(profileId, mode);
        } catch (err) {
          console.error("[coach/message] post-stream task failed:", err);
        }
      } catch {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: "Failed to generate response" })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
