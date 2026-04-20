export type CoachMode =
  | "intake"
  | "academic"
  | "school-builder"
  | "school-browse"
  | "essay"
  | "interview"
  | "general";

export interface ProfileProgress {
  hasIntakeCompleted: boolean;
  hasGPA: boolean;
  hasSchools: boolean;
  hasEssays: boolean;
  hasInterviewSessions: boolean;
}

const INTENT_PATTERNS: Array<{ pattern: RegExp; mode: CoachMode }> = [
  { pattern: /\b(find|build|recommend|suggest)\b.*\bschool/i, mode: "school-builder" },
  { pattern: /\bschool list\b/i, mode: "school-builder" },
  { pattern: /\b(essay|personal statement|supplemental)\b/i, mode: "essay" },
  { pattern: /\b(interviews?|mock interview|practice interview)\b/i, mode: "interview" },
  { pattern: /\b(gpa|grades?|test score|sat|act)\b/i, mode: "academic" },
];

const PAGE_MODES: Array<{ pattern: RegExp; mode: CoachMode }> = [
  { pattern: /^\/(schools|my-schools)/, mode: "school-browse" },
  { pattern: /^\/cc\/essays/, mode: "essay" },
  { pattern: /^\/college-interviews/, mode: "interview" },
];

export function detectMode(
  progress: ProfileProgress,
  currentPage: string,
  userMessage: string
): CoachMode {
  if (!progress.hasIntakeCompleted) return "intake";

  if (userMessage) {
    for (const { pattern, mode } of INTENT_PATTERNS) {
      if (pattern.test(userMessage)) return mode;
    }
  }

  for (const { pattern, mode } of PAGE_MODES) {
    if (pattern.test(currentPage)) return mode;
  }

  if (!progress.hasGPA) return "academic";

  return "general";
}
