// src/lib/interview-question-planner.ts
// Builds an adaptive interview question plan using:
// - User's weak areas from knowledge graph
// - Company persona's session structure
// - Problem bank for live coding phases (266+ problems)
// - Previous interview performance trends
// - History exclusion (never repeat problems from recent sessions)
// - Fisher-Yates randomized selection weighted by company frequency

import { createAdminSupabase } from "@/lib/supabase-auth";
import { getCurrentFacts } from "@/lib/knowledge-graph";
import { getPerformanceTrend } from "@/lib/interview-session";
import type { InterviewProblem } from "@/types/interview";
import type { CompanyPersona } from "@/data/interview-personas";

interface QuestionPlannerInput {
  userId: string;
  persona: CompanyPersona;
  interviewType: string;
  language?: string;
}

interface AdaptiveContext {
  weakTopics: string[];
  strongTopics: string[];
  trend: string;
  recentScores: number[];
  selectedProblems: InterviewProblem[];
}

/**
 * Build adaptive context for the question planner by reading
 * the user's knowledge graph and performance history.
 */
export async function buildAdaptiveContext(
  input: QuestionPlannerInput
): Promise<AdaptiveContext> {
  const { userId, persona } = input;

  // Get weak/strong facts from knowledge graph
  const facts = await getCurrentFacts(userId, { limit: 30 });
  const weakTopics = facts
    .filter((f) => f.predicate === "weak_at" && f.sourceAgent === "interviewer")
    .map((f) => f.object);
  const strongTopics = facts
    .filter((f) => f.predicate === "strong_at" && f.sourceAgent === "interviewer")
    .map((f) => f.object);

  // Get performance trend
  const { trend, sessions } = await getPerformanceTrend(userId, persona.id, 5);
  const recentScores = sessions.map((s) => s.overall);

  // Select problems for coding phases (with history exclusion + randomization)
  const selectedProblems = await selectProblems(userId, persona, weakTopics);

  return { weakTopics, strongTopics, trend, recentScores, selectedProblems };
}

// ─── Fisher-Yates shuffle ────────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ─── Problem selection ───────────────────────────────────────────────────────

/**
 * Select problems from the bank that:
 * 1. Match the company persona's tags
 * 2. Target the user's weak areas
 * 3. Exclude recently-seen problems
 * 4. Randomize within priority tiers
 */
async function selectProblems(
  userId: string,
  persona: CompanyPersona,
  weakTopics: string[]
): Promise<InterviewProblem[]> {
  let admin;
  try {
    admin = createAdminSupabase();
  } catch {
    return [];
  }

  // Count coding phases to know how many problems we need
  const codingPhases = (persona.sessionStructure?.phases || []).filter(
    (p) => p.format === "live_coding"
  );
  const problemCount = codingPhases.reduce((s, p) => s + p.questionCount, 0);
  if (problemCount === 0) return [];

  // Get recently-used problem IDs from the user's last 10 sessions
  const recentProblemIds = await getRecentlyUsedProblems(admin, userId, 10);

  // Fetch company-tagged problems (exclude recently used)
  const { data: companyProblems } = await admin
    .from("interview_problems")
    .select("*")
    .contains("company_tags", [persona.id])
    .limit(problemCount * 5); // Fetch more than needed for selection pool

  let pool = (companyProblems || []).filter(
    (p) => !recentProblemIds.has(p.id as string)
  );

  // If not enough company-specific problems, fetch broader set
  if (pool.length < problemCount * 2) {
    const { data: broadProblems } = await admin
      .from("interview_problems")
      .select("*")
      .limit(50);

    const existingIds = new Set(pool.map((p) => p.id));
    for (const p of broadProblems || []) {
      if (
        !existingIds.has(p.id) &&
        !recentProblemIds.has(p.id as string)
      ) {
        pool.push(p);
      }
    }
  }

  // If STILL not enough (user has seen everything), allow repeats from oldest
  if (pool.length < problemCount) {
    const { data: anyProblems } = await admin
      .from("interview_problems")
      .select("*")
      .limit(problemCount * 3);

    const existingIds = new Set(pool.map((p) => p.id));
    for (const p of anyProblems || []) {
      if (!existingIds.has(p.id)) pool.push(p);
    }
  }

  // Score each problem by relevance
  const scored = pool.map((p) => {
    const raw = p as Record<string, unknown>;
    const topics = (raw.topics as string[]) || [];
    const companyTags = (raw.company_tags as string[]) || [];

    // Score components:
    let score = 0;

    // +3 per weak topic overlap (prioritize improvement areas)
    score += topics.filter((t) => weakTopics.includes(t)).length * 3;

    // +2 if tagged for this specific company
    if (companyTags.includes(persona.id)) score += 2;

    // +1 for having test cases (better interview experience)
    const testCases = raw.test_cases_visible as unknown[];
    if (testCases && testCases.length > 0) score += 1;

    return { problem: mapDbProblem(raw), score };
  });

  // Sort by score descending, then randomize within same-score tiers
  scored.sort((a, b) => b.score - a.score);

  // Group by score tier and shuffle within each tier
  const tiers = new Map<number, typeof scored>();
  for (const s of scored) {
    const tier = tiers.get(s.score) || [];
    tier.push(s);
    tiers.set(s.score, tier);
  }

  const randomizedPool: typeof scored = [];
  for (const [, tier] of [...tiers.entries()].sort((a, b) => b[0] - a[0])) {
    randomizedPool.push(...shuffleArray(tier));
  }

  // Pick problems matching difficulty progression per phase
  const selected: InterviewProblem[] = [];
  let phaseIdx = 0;
  const usedSlugs = new Set<string>();

  for (const phase of codingPhases) {
    const targetDifficulty =
      phase.difficultyProgression === "escalating"
        ? phaseIdx === 0
          ? "medium"
          : "hard"
        : phase.difficultyProgression === "adaptive"
          ? "medium" // Adaptive adjusts at runtime
          : undefined;

    for (let i = 0; i < phase.questionCount; i++) {
      const pick = targetDifficulty
        ? randomizedPool.find(
            (s) =>
              s.problem.difficulty === targetDifficulty &&
              !usedSlugs.has(s.problem.slug)
          ) ||
          randomizedPool.find((s) => !usedSlugs.has(s.problem.slug))
        : randomizedPool.find((s) => !usedSlugs.has(s.problem.slug));

      if (pick) {
        selected.push(pick.problem);
        usedSlugs.add(pick.problem.slug);
      }
    }
    phaseIdx++;
  }

  return selected;
}

/**
 * Get problem IDs used in the user's recent interview sessions.
 */
async function getRecentlyUsedProblems(
  admin: ReturnType<typeof createAdminSupabase>,
  userId: string,
  sessionCount: number
): Promise<Set<string>> {
  try {
    const { data: sessions } = await admin
      .from("interview_sessions")
      .select("code_submissions, question_plan")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(sessionCount);

    const usedIds = new Set<string>();

    for (const session of sessions || []) {
      // Extract from code_submissions
      const submissions = session.code_submissions as Array<{
        problemId?: string;
      }> | null;
      if (submissions) {
        for (const sub of submissions) {
          if (sub.problemId) usedIds.add(sub.problemId);
        }
      }

      // Extract from question_plan
      const plan = session.question_plan as {
        problems?: Array<{ id?: string; slug?: string }>;
      } | null;
      if (plan?.problems) {
        for (const p of plan.problems) {
          if (p.id) usedIds.add(p.id);
          if (p.slug) usedIds.add(p.slug);
        }
      }
    }

    return usedIds;
  } catch {
    return new Set();
  }
}

function mapDbProblem(raw: Record<string, unknown>): InterviewProblem {
  return {
    id: raw.id as string,
    slug: raw.slug as string,
    title: raw.title as string,
    difficulty: raw.difficulty as "easy" | "medium" | "hard",
    description: raw.description as string,
    constraints: (raw.constraints as string) || null,
    examples:
      (raw.examples as Array<{
        input: string;
        output: string;
        explanation?: string;
      }>) || [],
    functionName: (raw.function_name as string) || null,
    starterCodePython: (raw.starter_code_python as string) || null,
    starterCodeJava: (raw.starter_code_java as string) || null,
    starterCodeJs: (raw.starter_code_js as string) || null,
    solutionCodePython: (raw.solution_code_python as string) || null,
    solutionCodeJava: (raw.solution_code_java as string) || null,
    topics: (raw.topics as string[]) || [],
    companyTags: (raw.company_tags as string[]) || [],
    pattern: (raw.pattern as string) || null,
    testCasesVisible:
      (raw.test_cases_visible as Array<{
        input: string;
        expected_output: string;
      }>) || [],
    testCasesHidden:
      (raw.test_cases_hidden as Array<{
        input: string;
        expected_output: string;
      }>) || [],
  };
}

/**
 * Build a prompt extension for the LLM that includes adaptive context.
 */
export function buildAdaptivePromptExtension(ctx: AdaptiveContext): string {
  const parts: string[] = [];

  if (ctx.weakTopics.length > 0) {
    parts.push(
      `## CANDIDATE WEAK AREAS (from previous sessions)\nThe candidate has struggled with: ${ctx.weakTopics.join(", ")}.\nWeight questions toward these topics to help them improve.`
    );
  }

  if (ctx.strongTopics.length > 0) {
    parts.push(
      `## CANDIDATE STRENGTHS\nThe candidate is strong at: ${ctx.strongTopics.join(", ")}.\nDo not avoid these — but push harder on them to confirm mastery.`
    );
  }

  if (ctx.trend !== "insufficient_data") {
    parts.push(
      `## PERFORMANCE TREND: ${ctx.trend.toUpperCase()}\nRecent scores: ${ctx.recentScores.join(", ")}.${
        ctx.trend === "improving"
          ? " The candidate is getting better — increase difficulty slightly."
          : ctx.trend === "declining"
            ? " The candidate is struggling — mix in some confidence-building questions."
            : ""
      }`
    );
  }

  if (ctx.selectedProblems.length > 0) {
    parts.push(
      `## SELECTED CODING PROBLEMS\nUse these exact problems for the live coding phases. Present the problem description, then let the candidate code.\n${ctx.selectedProblems
        .map(
          (p, i) =>
            `${i + 1}. [${p.difficulty.toUpperCase()}] "${p.title}" (${p.pattern || "general"})\n   ${p.description.slice(0, 150)}...\n   Function: ${p.functionName || "N/A"}\n   Test cases: ${p.testCasesVisible.length} visible, ${p.testCasesHidden.length} hidden`
        )
        .join("\n")}`
    );
  }

  return parts.join("\n\n");
}
