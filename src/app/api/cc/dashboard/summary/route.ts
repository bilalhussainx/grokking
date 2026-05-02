import { NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../helpers";
import { chatOnce } from "@/lib/cc/openrouter";
import { KAIROS_VOICE } from "@/lib/brand-voice";
import { selectVariant, type VariantKey, type StatusTone } from "@/app/cc/dashboard/variants";
import { priorityWidgetsFor, footerWidgetsFor } from "@/lib/cc/dashboard-priority-widgets";
import type {
  CourseRow,
  WhyTransferEssay,
  PriorityWidget,
  WidgetItem,
} from "@/components/cc/dashboard/sections/types";

interface SchoolRow {
  id: string;
  chancing_band: string | null;
  application_status: string | null;
  application_plan: string | null;
  added_at: string;
  cc_schools: {
    id: string;
    name: string;
    school_type: string | null;
    acceptance_rate: number | null;
    regular_deadline: string | null;
    early_deadline: string | null;
    website: string | null;
  } | null;
}

interface EssayRow {
  id: string;
  essay_type: string | null;
  phase: string | null;
  word_count: number | null;
  school_id: string | null;
  supplement_id: string | null;
  revision_comments: unknown;
  current_draft: string | null;
  updated_at: string;
}

interface SupplementRow {
  id: string;
  school_id: string;
  prompt_text: string;
  word_limit: number | null;
  is_required: boolean | null;
  supplement_type: string | null;
}

type EssayStatus = "missing" | "draft" | "review" | "revised";

interface SchoolProgress {
  studentSchoolId: string;
  schoolId: string;
  name: string;
  website: string | null;
  acceptanceRate: number | null;
  chancingBand: string | null;
  applicationPlan: string | null;
  isEarlyRound: boolean;
  regularDeadline: string | null;
  earlyDeadline: string | null;
  daysToDeadline: number | null;
  nearestDeadlineLabel: string | null;
  supplements: {
    total: number;
    drafted: number;
    reviewed: number;
    missing: number;
    items: {
      supplementId: string;
      promptSnippet: string;
      wordLimit: number | null;
      status: EssayStatus;
      essayId: string | null;
    }[];
  };
  overallCompletion: number; // 0..1
  nextAction: string;
}

// Roll a stored month/day forward so it is never in the past. Schools store last
// cycle's dates (e.g. 2025-11-01); a student in April should see the Nov date for
// the next admission cycle.
function rollForward(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return null;
  const now = new Date();
  // Bump year until strictly in the future
  while (parsed.getTime() < now.getTime()) {
    parsed.setFullYear(parsed.getFullYear() + 1);
  }
  return parsed.toISOString().slice(0, 10);
}

function daysBetween(target: string | null): number | null {
  if (!target) return null;
  const t = new Date(target).getTime();
  if (isNaN(t)) return null;
  const now = Date.now();
  return Math.ceil((t - now) / 86_400_000);
}

function nearestDeadline(early: string | null, regular: string | null): { label: string; date: string } | null {
  const opts = [
    early ? { label: "ED/EA", date: early } : null,
    regular ? { label: "RD", date: regular } : null,
  ].filter((x): x is { label: string; date: string } => Boolean(x));
  if (!opts.length) return null;
  return opts.reduce((a, b) => (new Date(a.date) < new Date(b.date) ? a : b));
}

const EARLY_PLANS = new Set(["ED", "ED1", "ED2", "EA", "REA", "SCEA"]);
function isEarlyRoundPlan(plan: string | null): boolean {
  if (!plan) return false;
  return EARLY_PLANS.has(plan.toUpperCase());
}

function essayStatusFor(essay: EssayRow | undefined): EssayStatus {
  if (!essay) return "missing";
  if (essay.revision_comments) return "review";
  if (essay.phase === "revise") return "revised";
  if (essay.current_draft && essay.current_draft.trim().length > 0) return "draft";
  return "missing";
}

function shortSnippet(s: string, n = 80): string {
  const trimmed = s.trim();
  return trimmed.length > n ? `${trimmed.slice(0, n)}…` : trimmed;
}

async function generateBrief(payload: {
  schools: SchoolProgress[];
  hasPS: boolean;
  psReviewLanded: boolean;
  activitiesLogged: number;
  activitiesOptimized: number;
}): Promise<string | null> {
  const { schools, hasPS, psReviewLanded, activitiesLogged, activitiesOptimized } = payload;
  if (!schools.length && !hasPS) return null;

  const schoolsBlock = schools
    .map((s) => {
      const dl =
        s.nearestDeadlineLabel && s.daysToDeadline !== null
          ? `${s.nearestDeadlineLabel} in ${s.daysToDeadline}d`
          : "no deadline";
      const plan = s.applicationPlan ? `${s.applicationPlan}${s.isEarlyRound ? ", EARLY" : ""}` : "plan TBD";
      const sup = `${s.supplements.drafted}/${s.supplements.total} supplements drafted, ${s.supplements.reviewed} reviewed`;
      return `- ${s.name} (${s.chancingBand || "?"}, ${plan}, ${dl}) — ${sup}`;
    })
    .join("\n");

  const earlySchoolCount = schools.filter((s) => s.isEarlyRound).length;

  const prompt = `You are a senior college counselor. Write ONE sentence — max two — naming the single highest-priority move for this week. Be specific (school + what to do). Start directly with the recommendation — NEVER open with "Welcome back", "Hi", "Hello", "Hey", or any other greeting, salutation, or acknowledgement. No lists, no hedging, no caveats about data.

Context:
- Personal statement: ${hasPS ? (psReviewLanded ? "drafted, review landed" : "drafted, awaiting review") : "not started"}
- Activities logged: ${activitiesLogged} (${activitiesOptimized} with impact score)
- Early-round schools flagged: ${earlySchoolCount}
- Schools (${schools.length}):
${schoolsBlock || "(none added)"}

Priority order (pick ONE):
1. Any school tagged EARLY with missing supplements → draft those first.
2. Deadline <21 days away → lead with that school.
3. PS review landed → revise the PS first.
4. Reach school with the most missing supplements → start drafting there.
5. Nothing urgent → "You're in a good rhythm — keep drafting."

Do not invent facts. Under 40 words.`;

  try {
    const text = await chatOnce([
      { role: "system", content: `${KAIROS_VOICE}\n\nYou are a pragmatic, warm senior college counselor.` },
      { role: "user", content: prompt },
    ]);
    return stripGreetings(text).trim() || null;
  } catch (err) {
    console.error("[dashboard/summary] brief generation failed:", err);
    return null;
  }
}

// Drop any leading greeting the model slipped in despite the prompt rules
// (Welcome back / Hi / Hey / Hello / Good morning, etc.), so the brief never
// echoes the page header.
function stripGreetings(text: string): string {
  let out = text.trim();
  const greetingPattern = /^(welcome back|hi|hey|hello|good (morning|afternoon|evening)|howdy)\b[^.?!]*[.!?\s,-]+/i;
  for (let i = 0; i < 3; i++) {
    const next = out.replace(greetingPattern, "").trim();
    if (next === out) break;
    out = next;
  }
  return out;
}

// Inline copy of variants.ts:statusToneFor (which is private). Inlining here
// keeps Task 15 scoped to a single file.
function statusToneFor(key: VariantKey): StatusTone {
  switch (key) {
    case "g9": return "leaf";
    case "g10": return "sky";
    case "junior": return "gold";
    case "senior_writing": return "gold";
    case "senior_post_submit": return "leaf";
    case "senior_decisions": return "leaf";
    case "transfer": return "sky";
    default: return "gold";
  }
}

// Days until next Common App opens (Aug 1). Lifted from
// src/app/cc/dashboard/page.tsx:63 (private there).
function daysUntilCommonAppOpen(): number {
  const now = new Date();
  const year = now.getFullYear();
  // Common App opens Aug 1 each cycle.
  let target = new Date(year, 7, 1);
  if (now > target) target = new Date(year + 1, 7, 1);
  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / 86_400_000));
}

// Per-variant status label for the Greeting pill.
function statusLabelFor(key: VariantKey): string {
  switch (key) {
    case "g9": return "Grade 9 · Building foundation";
    case "g10": return "Grade 10 · Adding depth";
    case "junior": return "Junior · runway to senior year";
    case "senior_writing": return "Senior · writing phase";
    case "senior_post_submit": return "Senior · submitted, waiting";
    case "senior_decisions": return "Senior · decisions in";
    case "transfer": return "Transfer applicant";
    case "unknown":
    default: return "Welcome";
  }
}

export async function GET() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const db = createAdminSupabase();
  const userId = auth.user.id;

  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id, profile_completion_pct, intake_completed_at, preferred_name, legal_first_name, grade_level, is_transfer_student, dashboard_observations_enabled")
    .eq("user_id", userId)
    .maybeSingle();

  const studentId = profile?.id;

  if (!studentId) {
    return NextResponse.json({
      setup: {
        hasIntakeCompleted: false,
        hasSchools: false,
        hasPersonalStatement: false,
        hasActivities: false,
        hasSupplementsStarted: false,
        profileCompletion: 0,
        firstName: null,
        hasGPA: false,
      },
      schools: [],
      personalStatement: null,
      activities: { logged: 0, optimized: 0, topThree: [] },
      brief: null,
      hasMetCoach: false,
      // ─── new fields, additive defaults ───
      firstName: null,
      variantKey: "unknown" as VariantKey,
      statusLabel: "Welcome",
      statusTone: "gold" as StatusTone,
      courses: null,
      psatPlan: null,
      whyTransferEssay: null,
      priorityWidgets: [],
      footerWidgets: [],
      observations: {},
    });
  }

  const [
    academicRes,
    schoolsRes,
    essaysRes,
    supplementsRes,
    activitiesRes,
    coachHistoryRes,
  ] = await Promise.all([
    db
      .from("cc_academic_profiles")
      .select("gpa_unweighted, test_strategy")
      .eq("student_id", studentId)
      .maybeSingle(),
    db
      .from("cc_student_schools")
      .select(
        "id, chancing_band, application_status, application_plan, added_at, cc_schools(id, name, school_type, acceptance_rate, regular_deadline, early_deadline, website)"
      )
      .eq("student_id", studentId),
    db
      .from("cc_essays")
      .select("id, essay_type, phase, word_count, school_id, supplement_id, revision_comments, current_draft, updated_at")
      .eq("student_id", studentId),
    db
      .from("cc_school_supplements")
      .select("id, school_id, prompt_text, word_limit, is_required, supplement_type"),
    db
      .from("cc_activities")
      .select("id, organization, role, impact_score, description_150")
      .eq("student_id", studentId)
      .order("impact_score", { ascending: false, nullsFirst: false }),
    db
      .from("cc_coach_conversations")
      .select("id")
      .eq("student_id", studentId)
      .limit(1),
  ]);

  const academic = academicRes.data as { gpa_unweighted: number | null; test_strategy: string | null } | null;
  const studentSchools = (schoolsRes.data as unknown as SchoolRow[]) || [];
  const essays = (essaysRes.data as unknown as EssayRow[]) || [];
  const supplements = (supplementsRes.data as unknown as SupplementRow[]) || [];
  const activities = (activitiesRes.data as { id: string; organization: string | null; role: string | null; impact_score: number | null; description_150: string | null }[]) || [];
  const coachHistory = (coachHistoryRes.data as { id: string }[]) || [];

  // Variant-aware data fetches — additive to the existing legacy fields.
  const [coursesRes, whyTransferRes, observationsRes] = await Promise.all([
    db
      .from("cc_courses")
      .select("id, course_name, level, grade")
      .eq("student_id", studentId),
    db
      .from("cc_essays")
      .select("id, phase, word_count")
      .eq("student_id", studentId)
      .eq("essay_type", "why_transfer")
      .maybeSingle(),
    // Skip the observations query when the user opted out.
    (profile?.dashboard_observations_enabled === false
      ? Promise.resolve({ data: [] as Array<{ module_label: string; observation: string; eyebrow: string }> })
      : db
          .from("cc_dashboard_observations")
          .select("module_label, observation, eyebrow")
          .eq("student_id", studentId)
          .gt("expires_at", new Date().toISOString())
    ),
  ]);

  const courses: CourseRow[] | null = coursesRes.data
    ? (coursesRes.data as Array<{ id: string; course_name: string; level: string | null; grade: string | null }>)
        .map((c) => ({
          id: c.id,
          courseName: c.course_name,
          level: c.level,
          grade: c.grade,
          inProgress: c.grade == null,
        }))
    : null;

  const whyTransferRow = whyTransferRes.data as
    | { id: string; phase: string | null; word_count: number | null }
    | null;
  const whyTransferEssay: WhyTransferEssay | null = whyTransferRow
    ? {
        id: whyTransferRow.id,
        phase: whyTransferRow.phase ?? "brainstorm",
        wordCount: whyTransferRow.word_count ?? 0,
        wordTarget: 650,  // standard transfer essay target
      }
    : null;

  const observations: Record<string, { observation: string; eyebrow: string }> =
    ((observationsRes.data ?? []) as Array<{ module_label: string; observation: string; eyebrow: string }>)
      .reduce((acc, row) => {
        acc[row.module_label] = { observation: row.observation, eyebrow: row.eyebrow };
        return acc;
      }, {} as Record<string, { observation: string; eyebrow: string }>);

  // Personal statement = cc_essays row where essay_type == 'personal_statement' (or no supplement_id)
  const psEssay = essays.find((e) => e.essay_type === "personal_statement" || (e.essay_type === "common_app" && !e.supplement_id));
  const personalStatement = psEssay
    ? {
        id: psEssay.id,
        phase: psEssay.phase,
        wordCount: psEssay.word_count,
        hasReview: !!psEssay.revision_comments,
        updatedAt: psEssay.updated_at,
      }
    : null;

  // Per-school progress
  const supplementsBySchool = new Map<string, SupplementRow[]>();
  for (const s of supplements) {
    const list = supplementsBySchool.get(s.school_id) || [];
    list.push(s);
    supplementsBySchool.set(s.school_id, list);
  }

  const essaysBySupplement = new Map<string, EssayRow>();
  for (const e of essays) {
    if (e.supplement_id) essaysBySupplement.set(e.supplement_id, e);
  }

  const schools: SchoolProgress[] = studentSchools
    .filter((ss) => ss.cc_schools)
    .map((ss) => {
      const school = ss.cc_schools!;
      const sups = supplementsBySchool.get(school.id) || [];
      const items = sups.map((sup) => {
        const essay = essaysBySupplement.get(sup.id);
        return {
          supplementId: sup.id,
          promptSnippet: shortSnippet(sup.prompt_text),
          wordLimit: sup.word_limit,
          status: essayStatusFor(essay),
          essayId: essay?.id || null,
        };
      });
      const drafted = items.filter((i) => i.status !== "missing").length;
      const reviewed = items.filter((i) => i.status === "review" || i.status === "revised").length;
      const missing = items.filter((i) => i.status === "missing").length;
      const rolledEarly = rollForward(school.early_deadline);
      const rolledRegular = rollForward(school.regular_deadline);
      const nearest = nearestDeadline(rolledEarly, rolledRegular);

      const overallCompletion = items.length === 0 ? 0 : drafted / items.length;
      const isEarlyRound = isEarlyRoundPlan(ss.application_plan);

      let nextAction = "Review this school's requirements";
      if (items.length === 0) nextAction = "No supplement prompts tracked yet";
      else if (missing > 0) nextAction = `Draft ${missing} remaining supplement${missing > 1 ? "s" : ""}`;
      else if (reviewed < items.length) nextAction = "Request review on remaining drafts";
      else nextAction = "All supplements in review — polish and submit";

      return {
        studentSchoolId: ss.id,
        schoolId: school.id,
        name: school.name,
        website: school.website,
        acceptanceRate: school.acceptance_rate,
        chancingBand: ss.chancing_band,
        applicationPlan: ss.application_plan,
        isEarlyRound,
        regularDeadline: rolledRegular,
        earlyDeadline: rolledEarly,
        daysToDeadline: nearest ? daysBetween(nearest.date) : null,
        nearestDeadlineLabel: nearest?.label || null,
        supplements: {
          total: items.length,
          drafted,
          reviewed,
          missing,
          items,
        },
        overallCompletion,
        nextAction,
      };
    })
    .sort((a, b) => {
      // Early-round schools first, then by nearest upcoming deadline, then name.
      if (a.isEarlyRound !== b.isEarlyRound) return a.isEarlyRound ? -1 : 1;
      const ad = a.daysToDeadline ?? 9999;
      const bd = b.daysToDeadline ?? 9999;
      if (ad !== bd) return ad - bd;
      return a.name.localeCompare(b.name);
    });

  const topThreeActivities = activities.slice(0, 3).map((a) => ({
    id: a.id,
    label: [a.role, a.organization].filter(Boolean).join(" · ") || "Unnamed activity",
    impactScore: a.impact_score,
  }));

  const hasSupplementsStarted = essays.some((e) => e.supplement_id);

  const setup = {
    hasIntakeCompleted: !!profile?.intake_completed_at,
    hasSchools: studentSchools.length > 0,
    hasPersonalStatement: !!personalStatement,
    hasActivities: activities.length > 0,
    hasSupplementsStarted,
    profileCompletion: profile?.profile_completion_pct ?? 0,
    firstName: profile?.preferred_name || profile?.legal_first_name || null,
    hasGPA: !!academic?.gpa_unweighted,
  };

  const hasMetCoach = coachHistory.length > 0;

  // Only bother the LLM if there's something substantive to talk about
  const shouldGenerateBrief = studentSchools.length > 0 || !!personalStatement;
  const brief = shouldGenerateBrief
    ? await generateBrief({
        schools,
        hasPS: !!personalStatement,
        psReviewLanded: !!personalStatement?.hasReview,
        activitiesLogged: activities.length,
        activitiesOptimized: activities.filter((a) => a.impact_score != null).length,
      })
    : null;

  // Compute variant + widget bundles. Calling selectVariant with the
  // already-fetched profile + studentSchools shape avoids re-querying.
  const variantKey = selectVariant(
    {
      is_transfer_student: profile?.is_transfer_student ?? null,
      grade_level: profile?.grade_level ?? null,
    },
    studentSchools.map((ss) => ({ application_status: ss.application_status })),
  );
  const statusLabel = statusLabelFor(variantKey);
  const statusTone = statusToneFor(variantKey);

  const priorityWidgets: PriorityWidget[] = priorityWidgetsFor(variantKey, observations);
  const footerWidgets: WidgetItem[] = footerWidgetsFor(variantKey, {
    schoolCount: studentSchools.length,
    activitiesCount: activities.length,
    essaysSubmittedCount: essays.filter((e) => e.phase === "revised" || e.phase === "submitted").length,
    daysToCommonApp: daysUntilCommonAppOpen(),
  });

  const firstName = profile?.preferred_name || profile?.legal_first_name || null;

  return NextResponse.json({
    // existing — UNCHANGED
    setup,
    schools,
    personalStatement,
    activities: {
      logged: activities.length,
      optimized: activities.filter((a) => a.impact_score != null).length,
      topThree: topThreeActivities,
    },
    brief,
    hasMetCoach,
    // new — additive
    firstName,
    variantKey,
    statusLabel,
    statusTone,
    courses,
    psatPlan: null,
    whyTransferEssay,
    priorityWidgets,
    footerWidgets,
    observations,
  });
}
