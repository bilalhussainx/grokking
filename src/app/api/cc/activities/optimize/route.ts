import { NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../helpers";
import { callLLMJSON, type ChatMessage } from "@/lib/cc/llm-stream";
import { deductCredits, CREDIT_COSTS } from "@/lib/credits";

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

  const ok = await deductCredits(auth.user.id, CREDIT_COSTS.coach_text, "activities_optimize");
  if (!ok) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
  }

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

  const systemPrompt = `You are a college admissions activities optimizer for ${profile.preferred_name || profile.legal_first_name || "a student"}.

Rules:
1. Suggested descriptions MUST respect character limits: 150 chars for activities, 100 chars for honors. Count characters carefully.
2. Use active verbs and quantifiable results in suggestions.
3. Impact scores 1-5: 1=filler, 2=average, 3=solid, 4=strong, 5=exceptional.
4. Recommended order: strongest/most unique first, declining impact.
5. Be specific in gap analysis — name the missing category and suggest a concrete fix.
6. Flag implausible time commitments (>25 hrs/week per activity, >80 total hrs/week across all).
7. If STAR fields are provided, use them to craft better descriptions.

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
