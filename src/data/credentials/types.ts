// src/data/credentials/types.ts
// Type definitions for the verifiable credential catalog.
// Spec: 2026-04-11-verifiable-credentials-design.md

export type DiplomaCategory = "coding-course" | "tech-interview";

export interface MockInterviewRow {
  problem_slug: string;
  score: number;
  created_at: string;
}

export interface CourseCompletionRow {
  ref_id: string;      // courseId
  created_at: string;
}

export interface DiplomaCriteriaContext {
  userId: string;
  mocks: MockInterviewRow[];
  courseCompletions: CourseCompletionRow[];
}

export interface EligibilityResult {
  eligible: boolean;
  reason: string;             // human-readable, shown in UI on hover
  evidence: Record<string, unknown>;  // frozen at mint time → on-chain metadata
}

export interface DiplomaDefinition {
  id: string;                 // stable kebab-case, lives forever once shipped
  title: string;
  description: string;
  category: DiplomaCategory;
  imagePath: string;          // /credentials/diplomas/<id>.svg
  evaluate: (ctx: DiplomaCriteriaContext) => EligibilityResult;
}
