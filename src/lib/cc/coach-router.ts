import type { AgentType, CoachContext } from "./coach-agents";

const SCHOOL_KEYWORDS = [
  "find schools", "find colleges", "recommend schools", "recommend colleges",
  "school list", "college list", "reach school", "safety school", "match school",
  "compare schools", "add school", "remove school", "acceptance rate", "net price",
  "which schools", "what schools", "best schools", "good schools",
  "how many schools", "school suggestions", "college suggestions",
];

const SCHOOL_PAGE_PREFIXES = ["/my-schools", "/schools"];
const INTAKE_PAGE_PREFIXES = ["/intake"];

export function routeMessage(
  message: string,
  ctx: CoachContext,
  page?: string,
): AgentType | null {
  // Rule 1: No profile or very incomplete → intake
  if (!ctx.hasProfile || ctx.profileCompletionPct < 30) {
    return "intake";
  }

  // Rule 2: User is on intake page → intake
  if (page && INTAKE_PAGE_PREFIXES.some((p) => page.startsWith(p))) {
    return "intake";
  }

  // Rule 3: User is on school pages → list-builder
  if (page && SCHOOL_PAGE_PREFIXES.some((p) => page.startsWith(p))) {
    return "list-builder";
  }

  // Rule 4: Message contains school-intent keywords → list-builder
  const lower = message.toLowerCase();
  if (SCHOOL_KEYWORDS.some((kw) => lower.includes(kw))) {
    return "list-builder";
  }

  // Rule 5: If profile is incomplete (30-70%) and message is vague, nudge to intake
  if (ctx.profileCompletionPct < 70 && ctx.missingFields.length >= 3) {
    const vaguePatterns = ["help", "what should i do", "where do i start", "i don't know", "confused"];
    if (vaguePatterns.some((p) => lower.includes(p))) {
      return "intake";
    }
  }

  // No strong signal → return null for LLM classification
  return null;
}

export function buildClassificationPrompt(message: string, profilePct: number): string {
  return `Classify this college counseling message into exactly one category.
Categories: intake (profile/onboarding questions), list-builder (school search/comparison), general (essays, aid, deadlines, process, other)
Student profile completion: ${profilePct}%
Message: "${message.slice(0, 300)}"
Reply with only the category name.`;
}

export function parseClassification(response: string): AgentType {
  const cleaned = response.trim().toLowerCase().replace(/[^a-z-]/g, "");
  if (cleaned.includes("intake")) return "intake";
  if (cleaned.includes("list") || cleaned.includes("builder")) return "list-builder";
  return "general";
}
