import { NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../helpers";
import { callLLMJSON, type ChatMessage } from "@/lib/cc/llm-stream";
import { deductCredits, CREDIT_COSTS } from "@/lib/credits";
import { ACTIVITY_WRITING_RULES, ACTIVITY_EXEMPLARS, ACTIVITY_ACTION_VERBS } from "@/lib/cc/activity-exemplars";
import { assertCapacity, blockedResponse } from "@/lib/cc/tier-gate";

interface ActivityRow {
  position: number;
  activity_type: string | null;
  organization: string | null;
  role: string | null;
  description_150: string | null;
  star_situation: string | null;
  star_task: string | null;
  star_action: string | null;
  star_result: string | null;
  grades_participated: number[] | null;
  hours_per_week: number | null;
  weeks_per_year: number | null;
}

interface HonorRow {
  position: number;
  title: string | null;
  level: string | null;
  grade: number | null;
  description_100: string | null;
}

interface OptimizeResult {
  activities: {
    position: number;
    currentDescription: string;
    suggestedDescription: string;
    impactScore: number;
    impactReason: string;
    suggestions: string[];
  }[];
  honors: {
    position: number;
    currentDescription: string;
    suggestedDescription: string;
    suggestions: string[];
  }[];
  recommendedOrder: number[];
  orderingRationale: string;
  gaps: { category: string; severity: string; suggestion: string }[];
  flags: { type: string; position: number; message: string }[];
  overallStrength: number;
}

export async function POST() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const db = createAdminSupabase();

  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id, preferred_name, legal_first_name")
    .eq("user_id", auth.user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Complete your profile first" }, { status: 400 });
  }

  const { data: activities } = await db
    .from("cc_activities")
    .select("position, activity_type, organization, role, description_150, star_situation, star_task, star_action, star_result, grades_participated, hours_per_week, weeks_per_year")
    .eq("student_id", profile.id)
    .order("position") as { data: ActivityRow[] | null };

  // Tier gate: guests get 3 bullets optimized, free users + pro get up to 10.
  // We enforce by capping the activities list sent to the LLM, not by blocking —
  // this way guests still see real value, just not on all 10 slots.
  const bulletCheck = await assertCapacity(
    auth.user.id,
    "activityBulletsMax",
    activities?.length ?? 0
  );
  if (!bulletCheck.ok) return blockedResponse(bulletCheck);

  const ok = await deductCredits(auth.user.id, CREDIT_COSTS.coach_text, "activities_optimize");
  if (!ok) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
  }

  const { data: honors } = await db
    .from("cc_honors")
    .select("position, title, level, grade, description_100")
    .eq("student_id", profile.id)
    .order("position") as { data: HonorRow[] | null };

  if (!activities?.length && !honors?.length) {
    return NextResponse.json({ error: "Add at least one activity or honor first" }, { status: 400 });
  }

  const activitiesText = (activities || []).map((a) => {
    let text = `Position ${a.position}: ${a.activity_type} — ${a.organization} — Role: ${a.role}\n  Description (150 char max): "${a.description_150 || ""}"`;
    if (a.star_situation) text += `\n  STAR: S="${a.star_situation}" T="${a.star_task}" A="${a.star_action}" R="${a.star_result}"`;
    text += `\n  Grades: ${(a.grades_participated || []).join(",")}, ${a.hours_per_week || 0} hrs/wk, ${a.weeks_per_year || 0} wks/yr`;
    return text;
  }).join("\n\n");

  const honorsText = (honors || []).map((h) =>
    `Position ${h.position}: "${h.title}" — Level: ${h.level}, Grade: ${h.grade}\n  Description (100 char max): "${h.description_100 || ""}"`
  ).join("\n\n");

  const systemPrompt = `You are a college admissions activities optimizer for ${profile.preferred_name || profile.legal_first_name || "a student"}. You write at the level of successful Ivy+ admits and coach the student to do the same.

${ACTIVITY_WRITING_RULES}

${ACTIVITY_ACTION_VERBS}

${ACTIVITY_EXEMPLARS}

Optimizer rules:
1. Suggested descriptions MUST respect character limits: 150 chars for activities, 100 chars for honors. Count characters carefully.
2. Every suggested description must pass the rubric above — lead with a verb from the ACTION VERB BANK (pick the category that matches the activity: Achievement / Help-Teach / Administrative / Lead-Manage / Communication / Plan-Organize / Creative / Research-Analytical / Financial / Technical), pack 3-4 outcomes with semicolons, quantify, cite award levels, no filler openings.
3. Each suggested description must match the STYLE of the exemplars. Soft self-descriptions get rewritten crisp. If current says "Plays the violin and has won a few competitions" → "Violinist; multiple inter-school wins; weekly rehearsals; selected for regional orchestra". If a passion activity has no awards (e.g., Indian Tabla), use the passion template: "Self-taught via YouTube videos; played drums at community meetings for worker rights awareness; helped my sister become proficient."
4. Impact scores 1-5: 1=filler, 2=average, 3=solid, 4=strong, 5=exceptional. A solo-hobby with no output = 2; national award with leadership = 5.
5. Recommended order: strongest/most unique first, declining impact. National/international awards and major-aligned activities go in slots 1-3.
6. Gap analysis: name the missing Common App category by its exact name (Research, Internship, Work (Paid), Family Responsibilities, Social Justice, Community Service, etc.) and suggest a concrete fix.
7. Flag implausible time commitments (>25 hrs/week per activity, >80 total hrs/week across all).
8. If STAR fields are provided, mine them for the strongest outcome phrases. Do NOT invent awards or metrics the student didn't provide — when in doubt, flag "needs quantifying" in suggestions.
9. If the student has fewer than 10 activities, do NOT fabricate or pad. Leave slots empty and surface that gap in gaps[].

Return valid JSON only matching this schema:
{
  "activities": [{ "position": 1, "currentDescription": "...", "suggestedDescription": "...", "impactScore": 4, "impactReason": "...", "suggestions": ["..."] }],
  "honors": [{ "position": 1, "currentDescription": "...", "suggestedDescription": "...", "suggestions": ["..."] }],
  "recommendedOrder": [3, 1, 5, 2],
  "orderingRationale": "...",
  "gaps": [{ "category": "Community Service", "severity": "warning", "suggestion": "..." }],
  "flags": [{ "type": "hours", "position": 2, "message": "..." }],
  "overallStrength": 0.72
}`;

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `ACTIVITIES:\n${activitiesText || "None"}\n\nHONORS:\n${honorsText || "None"}\n\nAnalyze and return the optimization JSON.`,
    },
  ];

  const result = await callLLMJSON<OptimizeResult>(messages, { maxTokens: 3000, temperature: 0.3 });

  if (!result) {
    return NextResponse.json({ error: "Analysis failed — try again" }, { status: 500 });
  }

  // Store impact scores back to DB
  if (result.activities?.length) {
    for (const a of result.activities) {
      if (a.impactScore >= 1 && a.impactScore <= 5) {
        await db
          .from("cc_activities")
          .update({ impact_score: a.impactScore })
          .eq("student_id", profile.id)
          .eq("position", a.position);
      }
    }
  }

  return NextResponse.json(result);
}
