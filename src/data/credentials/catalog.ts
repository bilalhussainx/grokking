// src/data/credentials/catalog.ts
// V1 hardcoded catalog. Coding courses + tech interviews ONLY.
// Spec: 2026-04-11-verifiable-credentials-design.md §4.5

import type {
  DiplomaDefinition,
  DiplomaCriteriaContext,
  EligibilityResult,
  MockInterviewRow,
} from "./types";

// ─── Helpers ──────────────────────────────────────────────────────────────
function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function mocksMatchingAny(
  ctx: DiplomaCriteriaContext,
  fragments: string[],
): MockInterviewRow[] {
  return ctx.mocks.filter((m) => {
    const s = m.problem_slug.toLowerCase();
    return fragments.some((f) => s.includes(f));
  });
}

function evalCompanyMastery(
  ctx: DiplomaCriteriaContext,
  company: string,
): EligibilityResult {
  const mocks = mocksMatchingAny(ctx, [company]);
  const a = avg(mocks.map((m) => m.score));
  const eligible = mocks.length >= 10 && a >= 80;
  const matchedSlugs = mocks.map((m) => m.problem_slug);
  return {
    eligible,
    reason: eligible
      ? `${mocks.length} ${company} mocks completed, avg ${a.toFixed(1)}`
      : `Need ≥10 ${company} mocks with avg ≥80; have ${mocks.length} mocks avg ${a.toFixed(1)}`,
    evidence: {
      company,
      count: mocks.length,
      averageScore: a,
      threshold: 80,
      matchedSlugs,
      rows: mocks,
    },
  };
}

function evalCourse(
  ctx: DiplomaCriteriaContext,
  courseId: string,
  courseTitle: string,
): EligibilityResult {
  const completion = ctx.courseCompletions.find((c) => c.ref_id === courseId);
  const eligible = !!completion;
  return {
    eligible,
    reason: eligible
      ? `Completed ${courseTitle} (${courseId}) on ${completion!.created_at.slice(0, 10)}`
      : `Complete the ${courseTitle} course to unlock (no completion row found for ${courseId})`,
    evidence: {
      courseId,
      completedAt: completion?.created_at,
      row: completion,
    },
  };
}

// ─── Catalog ──────────────────────────────────────────────────────────────
export const CREDENTIAL_CATALOG: DiplomaDefinition[] = [
  {
    id: "coding-interview-foundations",
    title: "Coding Interview Foundations",
    category: "tech-interview",
    description:
      "Mastery of the 16 essential coding interview patterns with consistent mock performance.",
    imagePath: "/credentials/diplomas/coding-interview-foundations.svg",
    evaluate: (ctx) => {
      const courseDone = ctx.courseCompletions.some(
        (c) => c.ref_id === "coding-interview-patterns",
      );
      const mocks = mocksMatchingAny(ctx, ["coding-interview", "pattern"]);
      const a = avg(mocks.map((m) => m.score));
      const eligible = courseDone && mocks.length >= 5 && a >= 75;
      const matchedSlugs = mocks.map((m) => m.problem_slug);
      return {
        eligible,
        reason: eligible
          ? `Course complete + ${mocks.length} pattern mocks avg ${a.toFixed(1)}`
          : `Need coding-interview-patterns course + ≥5 pattern mocks avg ≥75; have course=${courseDone}, ${mocks.length} mocks avg ${a.toFixed(1)}`,
        evidence: {
          courseDone,
          courseId: "coding-interview-patterns",
          count: mocks.length,
          averageScore: a,
          threshold: 75,
          matchedSlugs,
          rows: mocks,
        },
      };
    },
  },
  {
    id: "google-swe-mock-mastery",
    title: "Google SWE Mock Interview Mastery",
    category: "tech-interview",
    description: "Repeatedly excelled in Google-style mock interviews.",
    imagePath: "/credentials/diplomas/google-swe-mock-mastery.svg",
    evaluate: (ctx) => evalCompanyMastery(ctx, "google"),
  },
  {
    id: "meta-swe-mock-mastery",
    title: "Meta SWE Mock Interview Mastery",
    category: "tech-interview",
    description: "Repeatedly excelled in Meta-style mock interviews.",
    imagePath: "/credentials/diplomas/meta-swe-mock-mastery.svg",
    evaluate: (ctx) => evalCompanyMastery(ctx, "meta"),
  },
  {
    id: "amazon-swe-mock-mastery",
    title: "Amazon SWE Mock Interview Mastery",
    category: "tech-interview",
    description: "Repeatedly excelled in Amazon-style mock interviews.",
    imagePath: "/credentials/diplomas/amazon-swe-mock-mastery.svg",
    evaluate: (ctx) => evalCompanyMastery(ctx, "amazon"),
  },
  {
    id: "system-design-fundamentals",
    title: "System Design Fundamentals",
    category: "tech-interview",
    description: "Foundational understanding of distributed system design.",
    imagePath: "/credentials/diplomas/system-design-fundamentals.svg",
    evaluate: (ctx) => {
      const courseDone = ctx.courseCompletions.some(
        (c) => c.ref_id === "system-design",
      );
      const sdMocks = mocksMatchingAny(ctx, ["system-design"]);
      const a = avg(sdMocks.map((m) => m.score));
      const eligible = courseDone && sdMocks.length >= 3 && a >= 75;
      const matchedSlugs = sdMocks.map((m) => m.problem_slug);
      return {
        eligible,
        reason: eligible
          ? `Course complete + ${sdMocks.length} system design mocks avg ${a.toFixed(1)}`
          : `Need system-design course + ≥3 system design mocks avg ≥75; have course=${courseDone}, ${sdMocks.length} mocks avg ${a.toFixed(1)}`,
        evidence: {
          courseDone,
          courseId: "system-design",
          count: sdMocks.length,
          averageScore: a,
          threshold: 75,
          matchedSlugs,
          rows: sdMocks,
        },
      };
    },
  },
  {
    id: "data-structures-mastery",
    title: "Data Structures Mastery",
    category: "coding-course",
    description: "Completed the comprehensive data structures and algorithms curriculum.",
    imagePath: "/credentials/diplomas/data-structures-mastery.svg",
    evaluate: (ctx) => evalCourse(ctx, "dsa-fundamentals", "Data Structures & Algorithms"),
  },
  {
    id: "dynamic-programming-mastery",
    title: "Dynamic Programming Mastery",
    category: "tech-interview",
    description: "Strong DP problem-solving across mock interviews.",
    imagePath: "/credentials/diplomas/dynamic-programming-mastery.svg",
    evaluate: (ctx) => {
      const dp = mocksMatchingAny(ctx, ["dp", "dynamic"]);
      const a = avg(dp.map((m) => m.score));
      const eligible = dp.length >= 5 && a >= 75;
      const matchedSlugs = dp.map((m) => m.problem_slug);
      return {
        eligible,
        reason: eligible
          ? `${dp.length} DP mocks, avg ${a.toFixed(1)}`
          : `Need ≥5 DP mocks with avg ≥75; have ${dp.length} mocks avg ${a.toFixed(1)}`,
        evidence: {
          count: dp.length,
          averageScore: a,
          threshold: 75,
          matchedSlugs,
          rows: dp,
        },
      };
    },
  },
  {
    id: "python-fundamentals",
    title: "Python Fundamentals",
    category: "coding-course",
    description: "Completed the Python fundamentals course.",
    imagePath: "/credentials/diplomas/python-fundamentals.svg",
    evaluate: (ctx) => evalCourse(ctx, "python-fundamentals", "Python Fundamentals"),
  },
  {
    id: "javascript-fundamentals",
    title: "JavaScript Fundamentals",
    category: "coding-course",
    description: "Completed the JavaScript fundamentals course.",
    imagePath: "/credentials/diplomas/javascript-fundamentals.svg",
    evaluate: (ctx) => evalCourse(ctx, "javascript-fundamentals", "JavaScript Fundamentals"),
  },
  {
    id: "react-developer",
    title: "React Developer",
    category: "coding-course",
    description: "Completed the React development course.",
    imagePath: "/credentials/diplomas/react-developer.svg",
    evaluate: (ctx) => evalCourse(ctx, "react-development", "React Development"),
  },
  {
    id: "behavioral-interview-pro",
    title: "Behavioral Interview Pro",
    category: "tech-interview",
    description: "Strong behavioral interview performance across multiple companies.",
    imagePath: "/credentials/diplomas/behavioral-interview-pro.svg",
    evaluate: (ctx) => {
      const beh = ctx.mocks.filter((m) =>
        m.problem_slug.toLowerCase().startsWith("behavioral-"),
      );
      const personas = new Set(
        beh.map((m) => m.problem_slug.toLowerCase().split("-")[1]).filter(Boolean),
      );
      const a = avg(beh.map((m) => m.score));
      const eligible = beh.length >= 8 && personas.size >= 3 && a >= 80;
      const matchedSlugs = beh.map((m) => m.problem_slug);
      return {
        eligible,
        reason: eligible
          ? `${beh.length} behavioral mocks across ${personas.size} personas, avg ${a.toFixed(1)}`
          : `Need ≥8 behavioral mocks across ≥3 personas with avg ≥80; have ${beh.length} mocks, ${personas.size} personas, avg ${a.toFixed(1)}`,
        evidence: {
          count: beh.length,
          personaCount: personas.size,
          personas: Array.from(personas),
          averageScore: a,
          threshold: 80,
          matchedSlugs,
          rows: beh,
        },
      };
    },
  },
];

export function getDiplomaById(id: string): DiplomaDefinition | undefined {
  return CREDENTIAL_CATALOG.find((d) => d.id === id);
}
