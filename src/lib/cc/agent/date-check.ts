// src/lib/cc/agent/date-check.ts
import type { Candidate, CheckContext, Json, OutputCheck } from "./contracts";

const MONTHS = "(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)";
const DATE_RE = new RegExp(`\\b(?:\\d{4}-\\d{2}-\\d{2}|${MONTHS}\\.? \\d{1,2}(?:st|nd|rd|th)?(?:,? \\d{4})?|\\d{1,2} ${MONTHS}(?: \\d{4})?)\\b`, "g");
const REPLACEMENT = "I don't have a verified date for that yet — I can check.";

// Sentence ends, except after a month abbreviation ("Nov. 1" is one sentence).
// The capturing group keeps each separator (odd indexes), so line breaks survive.
const SENTENCE_BREAK = /(?<=[.!?])(?<!\b(?:Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.)(\s+)/;

// A whole match only: "Nov 1" is not grounded by "Nov 15".
const inEvidence = (date: string, evidence: string) =>
  new RegExp(`(?<!\\d)${date.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?!\\d)`).test(evidence);

function grounded(text: string, evidence: string): string {
  return text.split(SENTENCE_BREAK).map((part, i) => {
    if (i % 2) return part;
    const dates = part.match(DATE_RE) ?? [];
    return dates.every((d) => inEvidence(d, evidence)) ? part : REPLACEMENT;
  }).join("");
}

function walk(v: Json, evidence: string): Json {
  if (typeof v === "string") return grounded(v, evidence);
  if (Array.isArray(v)) return v.map((x) => walk(x, evidence));
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x as Json, evidence)]));
  return v;
}

// Deterministic, pre-check redaction (A1 Task 6 ruling: the loop releases only
// the candidate it checked, so redaction must happen before the check).
// The student's own message (request_context) is not evidence: a date they typed is unverified.
export function redactUngroundedDates(candidate: Candidate, evidence: Json[]): Candidate {
  const ev = JSON.stringify(evidence.filter((e) => !(e && typeof e === "object" && !Array.isArray(e) && e.kind === "request_context")));
  return { text: grounded(candidate.text, ev), cards: candidate.cards.map((c) => walk(c, ev)) };
}

// S1 turns carry no essay prose, so the check after redaction is a pass-through.
export const echoCheck: OutputCheck = async (candidate: Candidate, _context: CheckContext) =>
  ({ decision: "allow", result: { ...candidate, policyVersion: "s1-date-grounding-1" } });
