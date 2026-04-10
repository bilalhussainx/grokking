// src/lib/interview-question-planner.ts
// Builds an adaptive interview question plan using:
// - User's weak areas from knowledge graph
// - Company persona's session structure
// - Problem bank for live coding phases
// - Previous interview performance trends

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

  // Select problems for coding phases
  const selectedProblems = await selectProblems(persona, weakTopics);

  return { weakTopics, strongTopics, trend, recentScores, selectedProblems };
}

/**
 * Select problems from the bank that match the company persona
 * and target the user's weak areas.
 */
async function selectProblems(
  persona: CompanyPersona,
  weakTopics: string[]
): Promise<InterviewProblem[]> {
  const admin = createAdminSupabase();

  // Count coding phases to know how many problems we need
  const codingPhases = (persona.sessionStructure?.phases || []).filter(
    (p) => p.format === "live_coding"
  );
  const problemCount = codingPhases.reduce((s, p) => s + p.questionCount, 0);
  if (problemCount === 0) return [];

  // Try to find problems tagged for this company first
  const { data: companyProblems } = await admin
    .from("interview_problems")
    .select("*")
    .contains("company_tags", [persona.id])
    .limit(problemCount * 3);

  let pool = companyProblems || [];

  // If not enough company-specific problems, fetch by topics
  if (pool.length < problemCount) {
    const { data: topicProblems } = await admin
      .from("interview_problems")
      .select("*")
      .limit(20);

    const existingIds = new Set(pool.map((p) => p.id));
    for (const p of topicProblems || []) {
      if (!existingIds.has(p.id)) pool.push(p);
    }
  }

  // Prioritize: problems that target weak topics
  const scored = pool.map((p) => {
    const raw = p as Record<string, unknown>;
    const topics = (raw.topics as string[]) || [];
    const weakOverlap = topics.filter((t) => weakTopics.includes(t)).length;
    return { problem: mapDbProblem(raw), weakScore: weakOverlap };
  });

  scored.sort((a, b) => b.weakScore - a.weakScore);

  // Pick the right difficulty based on session structure
  const selected: InterviewProblem[] = [];
  let phaseIdx = 0;
  for (const phase of codingPhases) {
    const difficulty =
      phase.difficultyProgression === "escalating"
        ? phaseIdx === 0
          ? "medium"
          : "hard"
        : undefined;

    for (let i = 0; i < phase.questionCount && scored.length > 0; i++) {
      const idx = difficulty
        ? scored.findIndex((s) => s.problem.difficulty === difficulty)
        : 0;
      const pick = idx >= 0 ? scored.splice(idx, 1)[0] : scored.shift();
      if (pick) selected.push(pick.problem);
    }
    phaseIdx++;
  }

  return selected;
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
    starterCodePython: (raw.starter_code_python as string) || null,
    starterCodeJava: (raw.starter_code_java as string) || null,
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
      `## SELECTED CODING PROBLEMS\nUse these exact problems for the live coding phases:\n${ctx.selectedProblems
        .map(
          (p, i) =>
            `${i + 1}. [${p.difficulty}] ${p.title} — ${p.description.slice(0, 100)}...`
        )
        .join("\n")}`
    );
  }

  return parts.join("\n\n");
}
