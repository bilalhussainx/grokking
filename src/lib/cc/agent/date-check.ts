// src/lib/cc/agent/date-check.ts
import type { Candidate, CheckContext, Json, OutputCheck } from "./contracts";

const MONTHS = "(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)";
const ORDINAL_WORDS = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth",
  "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth", "nineteenth", "twentieth"];
const ORDINAL = `(?:(?:twenty|thirty)[-\\s](?:${ORDINAL_WORDS.slice(0, 9).join("|")})|thirtieth|${ORDINAL_WORDS.join("|")})`;
const NUM_DAY = "\\d{1,2}(?:st|nd|rd|th)?";
const YEAR = "(?:,?\\s+\\d{4})?(?!\\d)";
// \s covers NBSP, tabs and newlines. Each form carries its own boundaries.
const DATE_SRC = [
  "(?<!\\d)\\d{4}-\\d{2}-\\d{2}(?!\\d)",
  // Nov 1 · nov. 1 · Nov.1 · November 1st, 2026 · November first · November the 1st
  `\\b${MONTHS}(?:\\.\\s*|\\s+)(?:the\\s+)?(?:${NUM_DAY}|${ORDINAL})\\b${YEAR}`,
  // 1 November · the 1st of November · the first of November
  `\\b(?:the\\s+)?(?:${NUM_DAY}\\s+(?:of\\s+)?|${ORDINAL}\\s+of\\s+)${MONTHS}\\b\\.?${YEAR}`,
  // 11/1 · 01/11/2026 · 11/1/26 (not decimals like 3.8/4.0, not fractions like "3/4 of")
  "(?<![\\d./])\\d{1,2}/\\d{1,2}(?:/(?:\\d{4}|\\d{2}))?(?![\\d/]|\\.\\d)(?!\\s+of\\b)",
].join("|");
const dateRe = () => new RegExp(DATE_SRC, "gi");
const REPLACEMENT = "I don't have a verified date for that yet — I can check.";

// Sentence ends, except after a month abbreviation ("Nov. 1" is one sentence).
// The capturing group keeps each separator (odd indexes), so line breaks survive.
const SENTENCE_BREAK = /(?<=[.!?])(?<!\b(?:Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.)(\s+)/i;

type Ymd = { m: number; d: number; y?: number };

const monthNum = (name: string) => ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].indexOf(name.slice(0, 3).toLowerCase()) + 1;
const ordinalNum = (w: string) => {
  const [tens, unit] = w.toLowerCase().split(/[-\s]/);
  if (unit) return (tens === "twenty" ? 20 : 30) + ORDINAL_WORDS.indexOf(unit) + 1;
  return tens === "thirtieth" ? 30 : ORDINAL_WORDS.indexOf(tens) + 1;
};
const dayNum = (s: string) => (/^\d/.test(s) ? parseInt(s, 10) : ordinalNum(s));
const valid = (x: Ymd) => x.m >= 1 && x.m <= 12 && x.d >= 1 && x.d <= 31;
const yearNum = (s: string | undefined) => (s ? (s.length === 2 ? 2000 + +s : +s) : undefined);

/** month/day(/year), the same shape as golden/score.ts canon(); null when it isn't a date. */
function canon(raw: string): Ymd | null {
  const s = raw.replace(/\s+/g, " ").replace(/^the /i, "");
  let m: RegExpMatchArray | null;
  if ((m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/))) return { y: +m[1], m: +m[2], d: +m[3] };
  if ((m = s.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/))) {
    const y = yearNum(m[3]);
    const us = { m: +m[1], d: +m[2], y };
    // Read US month/day; a day-first reading (13/11/2026) only with a year, so "24/7" is not a date.
    return valid(us) ? us : y !== undefined && valid({ m: +m[2], d: +m[1] }) ? { m: +m[2], d: +m[1], y } : null;
  }
  // Month-first or day-first with a month name. Lowercase "may" is the verb, not the month.
  const month = s.match(new RegExp(MONTHS, "i"))?.[0];
  if (!month || month === "may") return null;
  const day = s.replace(month, " ").match(new RegExp(`\\d{1,2}(?=st|nd|rd|th|\\b)|${ORDINAL}`, "i"))?.[0];
  const year = s.match(/\d{4}$/)?.[0];
  if (!day) return null;
  const out = { m: monthNum(month), d: dayNum(day), y: yearNum(year) };
  return valid(out) ? out : null;
}

const datesIn = (text: string) => (text.match(dateRe()) ?? []).flatMap((raw) => {
  const ymd = canon(raw);
  return ymd ? [{ raw, ymd }] : [];
});

// A whole match only: "Nov 1" is not grounded by "Nov 15".
const inEvidence = (date: string, evidence: string) =>
  new RegExp(`(?<!\\d)${date.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?!\\d)`).test(evidence);

const sameDay = (a: Ymd, b: Ymd) => a.m === b.m && a.d === b.d && (a.y === undefined || b.y === undefined || a.y === b.y);

function grounded(text: string, evidence: string): string {
  const evDates = datesIn(evidence).map((e) => e.ymd);
  return text.split(SENTENCE_BREAK).map((part, i) => {
    if (i % 2) return part;
    return datesIn(part).every((d) => inEvidence(d.raw, evidence) || evDates.some((e) => sameDay(d.ymd, e))) ? part : REPLACEMENT;
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
