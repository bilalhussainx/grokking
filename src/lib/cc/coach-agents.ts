import { createServerSupabase } from "@/lib/supabase-server";

export interface CoachContext {
  profileContext: string;
  schoolList: string;
  schoolListSummary: string;
  deadlines: string;
  missingFields: string[];
  profileCompletionPct: number;
  hasProfile: boolean;
}

export async function buildCoachContext(userId: string): Promise<CoachContext> {
  const supabase = await createServerSupabase();

  const { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!profile) {
    return {
      profileContext: "No profile yet — student hasn't completed intake.",
      schoolList: "No schools added.",
      schoolListSummary: "Empty list.",
      deadlines: "None.",
      missingFields: ["name", "grade", "location", "gpa", "test_scores", "activities"],
      profileCompletionPct: 0,
      hasProfile: false,
    };
  }

  const missing: string[] = [];
  if (!profile.first_name) missing.push("name");
  if (!profile.grade_level) missing.push("grade level");
  if (!profile.state) missing.push("state/location");

  const { data: academic } = await supabase
    .from("cc_academics")
    .select("*")
    .eq("student_id", profile.id)
    .single();

  if (!academic || !academic.unweighted_gpa) missing.push("GPA");
  if (!academic || (!academic.sat_total && !academic.act_composite)) missing.push("test scores");

  const { data: activities } = await supabase
    .from("cc_activities")
    .select("id")
    .eq("student_id", profile.id);

  if (!activities || activities.length === 0) missing.push("activities");

  const profileLines = [
    `Name: ${profile.first_name || "?"} ${profile.last_name || ""}`.trim(),
    `Grade: ${profile.grade_level || "?"}`,
    `State: ${profile.state || "?"}`,
    `First-gen: ${profile.first_gen ? "Yes" : profile.first_gen === false ? "No" : "?"}`,
    `Home language: ${profile.home_language || "English"}`,
    academic ? `GPA: ${academic.unweighted_gpa || "?"}/${academic.weighted_gpa || "?"} (UW/W)` : "GPA: ?",
    academic?.sat_total ? `SAT: ${academic.sat_total}` : null,
    academic?.act_composite ? `ACT: ${academic.act_composite}` : null,
    `Activities: ${activities?.length || 0}`,
    `Profile completion: ${profile.profile_completion_pct || 0}%`,
  ].filter(Boolean).join("\n");

  const { data: schools } = await supabase
    .from("cc_student_schools")
    .select("chancing_band, cc_schools(name, acceptance_rate, avg_net_price, regular_deadline)")
    .eq("student_id", profile.id);

  let schoolListStr = "No schools added.";
  let schoolSummary = "Empty list.";
  let reachCount = 0, matchCount = 0, safetyCount = 0;

  if (schools && schools.length > 0) {
    const lines: string[] = [];
    for (const s of schools) {
      const school = s.cc_schools as unknown as { name: string; acceptance_rate: number | null; avg_net_price: number | null; regular_deadline: string | null } | null;
      if (!school) continue;
      const band = s.chancing_band || "unknown";
      if (band === "reach") reachCount++;
      else if (band === "match") matchCount++;
      else if (band === "safety") safetyCount++;
      const rate = school.acceptance_rate ? `${Math.round(school.acceptance_rate * 100)}%` : "?";
      const price = school.avg_net_price ? `$${school.avg_net_price.toLocaleString()}` : "?";
      lines.push(`- ${school.name} [${band}] — accept: ${rate}, net: ${price}, deadline: ${school.regular_deadline || "?"}`);
    }
    schoolListStr = lines.join("\n");
    schoolSummary = `${schools.length} schools: ${reachCount} reach, ${matchCount} match, ${safetyCount} safety`;
  }

  const { data: tasks } = await supabase
    .from("cc_tasks")
    .select("title, due_date")
    .eq("student_id", profile.id)
    .neq("status", "completed")
    .order("due_date", { ascending: true })
    .limit(10);

  let deadlinesStr = "None.";
  if (tasks && tasks.length > 0) {
    deadlinesStr = tasks.map((t) => {
      const date = t.due_date || "no date";
      return `- ${t.title} (${date})`;
    }).join("\n");
  }

  return {
    profileContext: profileLines,
    schoolList: schoolListStr,
    schoolListSummary: schoolSummary,
    deadlines: deadlinesStr,
    missingFields: missing,
    profileCompletionPct: profile.profile_completion_pct || 0,
    hasProfile: true,
  };
}

export type AgentType = "intake" | "list-builder" | "general";

export function getAgentPrompt(agent: AgentType, ctx: CoachContext): string {
  switch (agent) {
    case "intake":
      return `You are Coach Kairos — a warm, encouraging college counselor helping a first-generation student build their profile. You ask one question at a time. You explain jargon simply. You never overwhelm.

Your job right now: help the student fill in their profile. Ask about what's missing.

STUDENT PROFILE (what we know so far):
${ctx.profileContext}

WHAT'S MISSING:
${ctx.missingFields.length > 0 ? ctx.missingFields.map((f) => `- ${f}`).join("\n") : "Profile looks complete!"}

Ask about the next missing field naturally. If the student asks about something else, answer briefly, then gently steer back to profile completion. Keep responses to 2-3 sentences max.`;

    case "list-builder":
      return `You are Coach Kairos — a data-savvy college counselor helping a student build a balanced school list. You reference real data: acceptance rates, net prices, test policies, deadlines.

STUDENT PROFILE:
${ctx.profileContext}

CURRENT SCHOOL LIST:
${ctx.schoolList}

BALANCE: ${ctx.schoolListSummary}

When recommending schools:
- Always explain WHY a school fits (connect to student's profile, interests, budget)
- Reference specific data: acceptance rates, net prices, deadlines
- Flag imbalances: too many reaches, no safeties, geographic gaps
- If they ask about a specific school, compare it to their profile
- Keep responses to 2-4 sentences. Be specific, not generic.`;

    case "general":
      return `You are Coach Kairos — a knowledgeable, practical college counselor. You help with essays, financial aid, deadlines, recommendations, activities, and general college process questions.

STUDENT PROFILE:
${ctx.profileContext}

SCHOOL LIST: ${ctx.schoolListSummary}

UPCOMING DEADLINES:
${ctx.deadlines}

Guidelines:
- For essays: ask questions, suggest angles, NEVER write prose for them. Max 15 words of example text.
- For financial aid: explain clearly, reference their specific schools' net prices when relevant
- For deadlines: be specific with dates, flag anything within 30 days
- For activities: help them describe impact, not just list duties
- Keep responses to 2-4 sentences. Be direct and practical.`;
  }
}
