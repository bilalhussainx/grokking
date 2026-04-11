// src/lib/career-coach.ts
// Career coach: aggregates skill-gap data, knowledge-graph facts, and interview
// performance into a single context blob, then exposes pathway CRUD + chat helpers.

import { createAdminSupabase } from "@/lib/supabase-auth";
import { getUserSkills, getRecommendedRoles, getCareerGap } from "@/lib/skills-radar";
import { getCurrentFacts } from "@/lib/knowledge-graph";

export interface CareerPathway {
  id: string;
  userId: string;
  targetRole: string;
  targetCompanies: string[];
  targetTimeline: string | null;
  requiredSkills: { skillId: string; skillName?: string; status?: "have" | "missing" }[];
  recommendedCourses: string[];
  completedMilestones: string[];
  nextAction: string | null;
  status: "active" | "paused" | "achieved" | "abandoned";
  createdAt: string;
  updatedAt: string;
}

export interface CareerContext {
  pathway: CareerPathway | null;
  topRoles: { roleId: string; title: string; matchPercentage: number; avgSalary: number }[];
  skillsHave: string[];
  skillsMissing: string[];
  recentInterviewScores: { problem: string; score: number; date: string }[];
  goalFacts: string[];
  weakAreaFacts: string[];
}

// ─── Pathway CRUD ────────────────────────────────────────────────────────────

export async function getActivePathway(userId: string): Promise<CareerPathway | null> {
  const db = createAdminSupabase();
  const { data, error } = await db
    .from("career_pathways")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return rowToPathway(data);
}

export async function listPathways(userId: string): Promise<CareerPathway[]> {
  const db = createAdminSupabase();
  const { data, error } = await db
    .from("career_pathways")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error || !data) return [];
  return data.map(rowToPathway);
}

export async function createPathway(
  userId: string,
  input: {
    targetRole: string;
    targetCompanies?: string[];
    targetTimeline?: string;
    requiredSkills?: CareerPathway["requiredSkills"];
    recommendedCourses?: string[];
    nextAction?: string;
  }
): Promise<CareerPathway | null> {
  const db = createAdminSupabase();
  const { data, error } = await db
    .from("career_pathways")
    .insert({
      user_id: userId,
      target_role: input.targetRole,
      target_companies: input.targetCompanies || [],
      target_timeline: input.targetTimeline || null,
      required_skills: input.requiredSkills || [],
      recommended_courses: input.recommendedCourses || [],
      next_action: input.nextAction || null,
      status: "active",
    })
    .select("*")
    .single();

  if (error || !data) {
    console.error("[career-coach] createPathway error:", error);
    return null;
  }
  return rowToPathway(data);
}

export async function updatePathway(
  userId: string,
  pathwayId: string,
  patch: Partial<{
    targetRole: string;
    targetCompanies: string[];
    targetTimeline: string;
    requiredSkills: CareerPathway["requiredSkills"];
    recommendedCourses: string[];
    completedMilestones: string[];
    nextAction: string;
    status: CareerPathway["status"];
  }>
): Promise<CareerPathway | null> {
  const db = createAdminSupabase();
  const update: Record<string, unknown> = {};
  if (patch.targetRole !== undefined) update.target_role = patch.targetRole;
  if (patch.targetCompanies !== undefined) update.target_companies = patch.targetCompanies;
  if (patch.targetTimeline !== undefined) update.target_timeline = patch.targetTimeline;
  if (patch.requiredSkills !== undefined) update.required_skills = patch.requiredSkills;
  if (patch.recommendedCourses !== undefined) update.recommended_courses = patch.recommendedCourses;
  if (patch.completedMilestones !== undefined) update.completed_milestones = patch.completedMilestones;
  if (patch.nextAction !== undefined) update.next_action = patch.nextAction;
  if (patch.status !== undefined) update.status = patch.status;

  const { data, error } = await db
    .from("career_pathways")
    .update(update)
    .eq("id", pathwayId)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error || !data) {
    console.error("[career-coach] updatePathway error:", error);
    return null;
  }
  return rowToPathway(data);
}

export async function deletePathway(userId: string, pathwayId: string): Promise<boolean> {
  const db = createAdminSupabase();
  const { error } = await db
    .from("career_pathways")
    .delete()
    .eq("id", pathwayId)
    .eq("user_id", userId);

  if (error) {
    console.error("[career-coach] deletePathway error:", error);
    return false;
  }
  return true;
}

// ─── Context aggregation ─────────────────────────────────────────────────────

/**
 * Aggregates everything the career coach needs to give a personalized response:
 * the active pathway, top role matches, skill gap, recent interview scores, and
 * relevant knowledge-graph facts (goals + weak areas).
 */
export async function buildCareerContext(userId: string): Promise<CareerContext> {
  const db = createAdminSupabase();

  const [pathway, userSkills, topRolesRaw, goalFacts, weakFacts, interviewScores] =
    await Promise.all([
      getActivePathway(userId),
      getUserSkills(userId),
      getRecommendedRoles(userId).catch(() => []),
      getCurrentFacts(userId, { predicate: "financial_goal", limit: 5 }).catch(() => []),
      getCurrentFacts(userId, { predicate: "weak_at", limit: 10 }).catch(() => []),
      db
        .from("interview_session_results")
        .select("problem_slug, score, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5)
        .then(
          (r) => r.data || [],
          () => []
        ),
    ]);

  // Skill gap against active pathway's target role (if any).
  let skillsHave: string[] = userSkills.map((s: { skillName: string }) => s.skillName);
  let skillsMissing: string[] = [];

  if (pathway) {
    const gap = await getCareerGap(userId, pathway.targetRole).catch(() => null);
    if (gap) {
      skillsHave = gap.matchedSkills;
      skillsMissing = gap.missingSkills;
    }
  }

  return {
    pathway,
    topRoles: topRolesRaw.slice(0, 5).map((r: { roleId: string; title: string; matchPercentage: number; avgSalary: number }) => ({
      roleId: r.roleId,
      title: r.title,
      matchPercentage: r.matchPercentage,
      avgSalary: r.avgSalary,
    })),
    skillsHave,
    skillsMissing,
    recentInterviewScores: (interviewScores as Array<Record<string, unknown>>).map((r) => ({
      problem: (r.problem_slug as string) || "unknown",
      score: (r.score as number) || 0,
      date: (r.created_at as string) || "",
    })),
    goalFacts: goalFacts.map((f: { object: string }) => f.object),
    weakAreaFacts: weakFacts.map((f: { object: string }) => f.object),
  };
}

/**
 * Format career context as a system-prompt block for the coach LLM.
 */
export function formatCareerContextForPrompt(ctx: CareerContext): string {
  const lines: string[] = ["## CAREER CONTEXT"];

  if (ctx.pathway) {
    lines.push(`Target role: ${ctx.pathway.targetRole}`);
    if (ctx.pathway.targetCompanies.length) {
      lines.push(`Target companies: ${ctx.pathway.targetCompanies.join(", ")}`);
    }
    if (ctx.pathway.targetTimeline) lines.push(`Timeline: ${ctx.pathway.targetTimeline}`);
    if (ctx.pathway.nextAction) lines.push(`Current next action: ${ctx.pathway.nextAction}`);
    if (ctx.pathway.completedMilestones.length) {
      lines.push(`Completed milestones: ${ctx.pathway.completedMilestones.join(", ")}`);
    }
  } else {
    lines.push("No active pathway yet — help the user define one.");
  }

  if (ctx.skillsHave.length) {
    lines.push(`\nSkills the user has: ${ctx.skillsHave.slice(0, 15).join(", ")}`);
  }
  if (ctx.skillsMissing.length) {
    lines.push(`Skills the user is missing for the target: ${ctx.skillsMissing.slice(0, 15).join(", ")}`);
  }

  if (ctx.topRoles.length) {
    lines.push("\nTop role matches based on current skills:");
    for (const r of ctx.topRoles) {
      lines.push(`  - ${r.title} (${r.matchPercentage}% match, ~$${r.avgSalary.toLocaleString()})`);
    }
  }

  if (ctx.recentInterviewScores.length) {
    const avg =
      ctx.recentInterviewScores.reduce((s, x) => s + x.score, 0) /
      ctx.recentInterviewScores.length;
    lines.push(`\nRecent interview practice avg: ${avg.toFixed(0)}/100 over ${ctx.recentInterviewScores.length} sessions`);
  }

  if (ctx.goalFacts.length) lines.push(`\nStated goals: ${ctx.goalFacts.join("; ")}`);
  if (ctx.weakAreaFacts.length) lines.push(`Known weak areas: ${ctx.weakAreaFacts.join("; ")}`);

  return lines.join("\n");
}

export const CAREER_COACH_DIRECTIVE = `You are the Career Coach — a strategic advisor who has helped hundreds of people land roles at top companies. You're not a cheerleader. You're the friend who tells them their resume needs work but also exactly how to fix it.

HOW YOU TALK:
- Direct, specific, never hedging. "Here's the gap" not "you might consider..."
- Tie every recommendation to the user's actual skills and target role from the context
- Reference their real numbers: match %, missing skills by name, recent interview scores
- 2-4 sentences per turn unless they ask for a deep dive

HOW YOU COACH:
- Always anchor to one concrete next action — what should they do THIS WEEK
- When they're missing critical skills, name the exact courses on this platform
- When they've made progress, acknowledge it specifically (which milestone, what changed)
- Push back when their target is unrealistic for their timeline — but offer an adjusted plan
- For interview prep gaps: tie to specific weak areas from their practice history`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function rowToPathway(row: Record<string, unknown>): CareerPathway {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    targetRole: row.target_role as string,
    targetCompanies: (row.target_companies as string[]) || [],
    targetTimeline: (row.target_timeline as string) || null,
    requiredSkills: (row.required_skills as CareerPathway["requiredSkills"]) || [],
    recommendedCourses: (row.recommended_courses as string[]) || [],
    completedMilestones: (row.completed_milestones as string[]) || [],
    nextAction: (row.next_action as string) || null,
    status: (row.status as CareerPathway["status"]) || "active",
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}
