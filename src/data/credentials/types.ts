// src/data/credentials/types.ts
// Type definitions for the verifiable credential catalog.
// Spec: 2026-04-11-verifiable-credentials-design.md

export type DiplomaCategory = "coding-course" | "tech-interview";

export interface MockInterviewRow {
  problemSlug: string;
  score: number;
  createdAt: string;
}

export interface CourseCompletionRow {
  courseId: string;
  completedAt: string;
}

export interface DiplomaCriteriaContext {
  userId: string;
  mockInterviews: MockInterviewRow[];
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
  category: DiplomaCategory;
  description: string;
  imageUrl: string;           // /credentials/diplomas/<id>.svg
  rubricSummary: string;
  evaluate: (ctx: DiplomaCriteriaContext) => EligibilityResult;
}
