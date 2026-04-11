// src/data/credentials/catalog.ts
// V1 hardcoded catalog. Coding courses + tech interviews ONLY.
// Spec: 2026-04-11-verifiable-credentials-design.md §4.5

import type { DiplomaDefinition, DiplomaCriteriaContext, EligibilityResult } from "./types";

// ─── Helpers ──────────────────────────────────────────────────────────────
function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function mocksMatching(ctx: DiplomaCriteriaContext, slugFragment: string) {
  return ctx.mockInterviews.filter((m) =>
    m.problemSlug.toLowerCase().includes(slugFragment.toLowerCase())
  );
}

function evalCompanyMastery(
  ctx: DiplomaCriteriaContext,
  company: string,
): EligibilityResult {
  const mocks = mocksMatching(ctx, company);
  const a = avg(mocks.map((m) => m.score));
  const eligible = mocks.length >= 10 && a >= 80;
  return {
    eligible,
    reason: eligible
      ? `${mocks.length} ${company} mocks completed, average ${a.toFixed(1)}`
      : `Need 10+ ${company} mocks with average score ≥80 (have ${mocks.length}, avg ${a.toFixed(1)})`,
    evidence: { mockCount: mocks.length, averageScore: a, threshold: 80 },
  };
}

function evalCourse(
  ctx: DiplomaCriteriaContext,
  courseId: string,
  courseTitle: string,
): EligibilityResult {
  const completion = ctx.courseCompletions.find((c) => c.courseId === courseId);
  const eligible = !!completion;
  return {
    eligible,
    reason: eligible
      ? `Completed ${courseTitle} on ${completion!.completedAt.slice(0, 10)}`
      : `Complete the ${courseTitle} course to unlock`,
    evidence: { courseId, completedAt: completion?.completedAt },
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
    imageUrl: "/credentials/diplomas/coding-interview-foundations.svg",
    rubricSummary:
      "Complete the 16-patterns course AND pass 5+ mock interviews with average score ≥75.",
    evaluate: (ctx) => {
      const courseDone = ctx.courseCompletions.some((c) => c.courseId === "coding-interview");
      const mocks = ctx.mockInterviews;
      const a = avg(mocks.map((m) => m.score));
      const eligible = courseDone && mocks.length >= 5 && a >= 75;
      return {
        eligible,
        reason: eligible
          ? `Course done, ${mocks.length} mocks, avg ${a.toFixed(1)}`
          : `Need course + 5 mocks ≥75 avg (course=${courseDone}, mocks=${mocks.length}, avg=${a.toFixed(1)})`,
        evidence: { courseDone, mockCount: mocks.length, averageScore: a },
      };
    },
  },
  {
    id: "google-swe-mock-mastery",
    title: "Google SWE Mock Interview Mastery",
    category: "tech-interview",
    description: "Repeatedly excelled in Google-style mock interviews.",
    imageUrl: "/credentials/diplomas/google-swe-mock-mastery.svg",
    rubricSummary: "10+ Google-persona mock interviews with average score ≥80.",
    evaluate: (ctx) => evalCompanyMastery(ctx, "google"),
  },
  {
    id: "meta-swe-mock-mastery",
    title: "Meta SWE Mock Interview Mastery",
    category: "tech-interview",
    description: "Repeatedly excelled in Meta-style mock interviews.",
    imageUrl: "/credentials/diplomas/meta-swe-mock-mastery.svg",
    rubricSummary: "10+ Meta-persona mock interviews with average score ≥80.",
    evaluate: (ctx) => evalCompanyMastery(ctx, "meta"),
  },
  {
    id: "amazon-swe-mock-mastery",
    title: "Amazon SWE Mock Interview Mastery",
    category: "tech-interview",
    description: "Repeatedly excelled in Amazon-style mock interviews.",
    imageUrl: "/credentials/diplomas/amazon-swe-mock-mastery.svg",
    rubricSummary: "10+ Amazon-persona mock interviews with average score ≥80.",
    evaluate: (ctx) => evalCompanyMastery(ctx, "amazon"),
  },
  {
    id: "system-design-fundamentals",
    title: "System Design Fundamentals",
    category: "tech-interview",
    description: "Foundational understanding of distributed system design.",
    imageUrl: "/credentials/diplomas/system-design-fundamentals.svg",
    rubricSummary: "Complete System Design course AND pass 3+ system design mocks ≥75.",
    evaluate: (ctx) => {
      const courseDone = ctx.courseCompletions.some((c) => c.courseId === "system-design");
      const sdMocks = mocksMatching(ctx, "system-design");
      const a = avg(sdMocks.map((m) => m.score));
      const eligible = courseDone && sdMocks.length >= 3 && a >= 75;
      return {
        eligible,
        reason: eligible
          ? `Course done, ${sdMocks.length} system design mocks avg ${a.toFixed(1)}`
          : `Need course + 3 system design mocks ≥75 avg`,
        evidence: { courseDone, sdMockCount: sdMocks.length, averageScore: a },
      };
    },
  },
  {
    id: "data-structures-mastery",
    title: "Data Structures Mastery",
    category: "coding-course",
    description: "Completed the comprehensive data structures and algorithms curriculum.",
    imageUrl: "/credentials/diplomas/data-structures-mastery.svg",
    rubricSummary: "Complete the Data Structures & Algorithms course end-to-end.",
    evaluate: (ctx) => evalCourse(ctx, "dsa-fundamentals", "Data Structures & Algorithms"),
  },
  {
    id: "dynamic-programming-mastery",
    title: "Dynamic Programming Mastery",
    category: "tech-interview",
    description: "Strong DP problem-solving across mock interviews.",
    imageUrl: "/credentials/diplomas/dynamic-programming-mastery.svg",
    rubricSummary: "5+ DP-tagged mock interviews with average score ≥75.",
    evaluate: (ctx) => {
      const dp = mocksMatching(ctx, "dynamic-programming");
      const a = avg(dp.map((m) => m.score));
      const eligible = dp.length >= 5 && a >= 75;
      return {
        eligible,
        reason: eligible
          ? `${dp.length} DP mocks, avg ${a.toFixed(1)}`
          : `Need 5+ DP mocks ≥75 avg`,
        evidence: { dpMockCount: dp.length, averageScore: a },
      };
    },
  },
  {
    id: "python-fundamentals",
    title: "Python Fundamentals",
    category: "coding-course",
    description: "Completed the Python fundamentals course.",
    imageUrl: "/credentials/diplomas/python-fundamentals.svg",
    rubricSummary: "Complete the Python course end-to-end.",
    evaluate: (ctx) => evalCourse(ctx, "python-fundamentals", "Python Fundamentals"),
  },
  {
    id: "javascript-fundamentals",
    title: "JavaScript Fundamentals",
    category: "coding-course",
    description: "Completed the JavaScript fundamentals course.",
    imageUrl: "/credentials/diplomas/javascript-fundamentals.svg",
    rubricSummary: "Complete the JavaScript course end-to-end.",
    evaluate: (ctx) => evalCourse(ctx, "javascript-fundamentals", "JavaScript Fundamentals"),
  },
  {
    id: "react-developer",
    title: "React Developer",
    category: "coding-course",
    description: "Completed the React development course.",
    imageUrl: "/credentials/diplomas/react-developer.svg",
    rubricSummary: "Complete the React Development course end-to-end.",
    evaluate: (ctx) => evalCourse(ctx, "react-development", "React Development"),
  },
  {
    id: "behavioral-interview-pro",
    title: "Behavioral Interview Pro",
    category: "tech-interview",
    description: "Strong behavioral interview performance across multiple companies.",
    imageUrl: "/credentials/diplomas/behavioral-interview-pro.svg",
    rubricSummary: "8+ behavioral mocks across 3+ company personas, average score ≥80.",
    evaluate: (ctx) => {
      const beh = mocksMatching(ctx, "behavioral");
      const personas = new Set(beh.map((m) => m.problemSlug.split("-")[0]));
      const a = avg(beh.map((m) => m.score));
      const eligible = beh.length >= 8 && personas.size >= 3 && a >= 80;
      return {
        eligible,
        reason: eligible
          ? `${beh.length} behavioral mocks across ${personas.size} personas, avg ${a.toFixed(1)}`
          : `Need 8+ behavioral mocks across 3+ personas, avg ≥80`,
        evidence: { behMockCount: beh.length, personaCount: personas.size, averageScore: a },
      };
    },
  },
];

export function getDiplomaById(id: string): DiplomaDefinition | undefined {
  return CREDENTIAL_CATALOG.find((d) => d.id === id);
}
