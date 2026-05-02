// Canonical confirmation block the coach LLM is instructed to emit at the
// END of any assistant turn that performs an action (e.g. adding schools).
// The block is parsed authoritatively by the extraction pipeline; the
// rendered assistant message has the block stripped so the user only sees
// natural-language confirmation.
//
// Format:
//
//   <<actions>>
//   {"add_schools": ["Stanford University", "MIT"]}
//   <</actions>>
//
// We deliberately choose a fenced block instead of OpenRouter tool-calling
// for now (Phase 2): tool-calling requires per-provider differences and
// breaks streaming UX. A fenced block survives the existing streaming +
// extraction pipeline with a one-line prompt change.

export interface CoachActions {
  add_schools?: string[];
}

const BLOCK_RE = /<<actions>>([\s\S]*?)<<\/actions>>/g;

export function parseActionsBlock(text: string): CoachActions | null {
  const matches = [...text.matchAll(BLOCK_RE)];
  if (matches.length === 0) return null;
  const last = matches[matches.length - 1][1].trim();
  try {
    const parsed = JSON.parse(last) as unknown;
    if (typeof parsed !== "object" || parsed === null) return null;
    return parsed as CoachActions;
  } catch {
    return null;
  }
}

export function stripActionsBlock(text: string): string {
  return text.replace(BLOCK_RE, "").trimEnd();
}
