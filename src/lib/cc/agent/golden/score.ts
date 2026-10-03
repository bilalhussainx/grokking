// src/lib/cc/agent/golden/score.ts
export type GoldenCase = { id: string; question: string; task_family: string; expected_tools: string[]; must_abstain: boolean; forbidden_patterns: string[]; required_phrases_any?: string[] };
export type Observed = { toolsCalled: string[]; text: string; evidenceValues: string[] };
export type Score = { id: string; pass: boolean; failures: string[]; warnings: string[] };

/** Tools the S1 loop actually exposes (read, journey and proposal tools). */
export const S1_AVAILABLE_TOOLS: ReadonlySet<string> = new Set([
  "read_context", "read_essay", "read_published_feedback",
  "get_journey_state", "list_my_schools", "check_plan_conflicts", "get_essay_status",
  "propose_task", "propose_calendar_hold", "propose_add_schools",
]);

const MONTHS = "(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)";
const DATE_SRC = [
  "\\d{4}-\\d{2}-\\d{2}",
  `${MONTHS}\\.? \\d{1,2}(?:st|nd|rd|th)?(?:,? \\d{4})?`,
  `\\d{1,2}(?:st|nd|rd|th)? (?:of )?${MONTHS}\\.?(?:,? \\d{4})?`,
  "(?:0?[1-9]|1[0-2])/(?:0?[1-9]|[12]\\d|3[01])(?:/\\d{2,4})?",
].join("|");
const dateRe = () => new RegExp(`\\b(?:${DATE_SRC})\\b`, "gi");

const NEGATOR = /\b(?:can't|cannot|can not|won't|will not|don't|do not|doesn't|does not|isn't|is not|aren't|are not|shouldn't|should not|wouldn't|not|no|never|without)\b/i;
// Adjacent negation only: bare "no" is handled separately as "no <noun> is/are" so "no doubt" does not excuse.
const NEGATOR_ADJ = /\b(?:can't|cannot|can not|won't|will not|don't|do not|doesn't|does not|isn't|is not|aren't|are not|shouldn't|should not|wouldn't|not|never|without)\b/i;
const NO_SUBJECT = /\bno \w+ (?:is|are|will be)\s*$/i;
const NEGATION_WORDS = 3;
const STRONG_ABSTAIN = /\b(?:can't predict|cannot predict|not yet published|haven't been published|have not been published|don't have a verified|not able to|can't do that|can't say|don't know|(?:won't|will not)(?: \w+){0,2} (?:predict|guess|say|write|log in|access|share|promise|do that)|I'm not going to|You write every word)\b/i;
const WEAK_ABSTAIN = /\bI can check\b/i;

type Ymd = { m: number; d: number; y?: number };

const norm = (s: string) => s.replace(/[‘’ʼ]/g, "'");

function monthNum(name: string): number {
  return ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].indexOf(name.slice(0, 3).toLowerCase()) + 1;
}

function canon(raw: string): Ymd | null {
  let m: RegExpMatchArray | null;
  if ((m = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/))) return { y: +m[1], m: +m[2], d: +m[3] };
  if ((m = raw.match(/^([A-Za-z]+)\.? (\d{1,2})(?:st|nd|rd|th)?(?:,? (\d{4}))?$/))) return { m: monthNum(m[1]), d: +m[2], y: m[3] ? +m[3] : undefined };
  if ((m = raw.match(/^(\d{1,2})(?:st|nd|rd|th)? (?:of )?([A-Za-z]+)\.?(?:,? (\d{4}))?$/))) return { m: monthNum(m[2]), d: +m[1], y: m[3] ? +m[3] : undefined };
  if ((m = raw.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/))) {
    const y = m[3] ? (m[3].length === 2 ? 2000 + +m[3] : +m[3]) : undefined;
    return { m: +m[1], d: +m[2], y };
  }
  return null;
}

function datesIn(text: string): { raw: string; ymd: Ymd | null }[] {
  return (text.match(dateRe()) ?? []).map((raw) => ({ raw, ymd: canon(raw) }));
}

function grounded(found: { raw: string; ymd: Ymd | null }, evidence: string[]): boolean {
  return evidence.some((v) => {
    if (v.includes(found.raw)) return true;
    if (!found.ymd) return false;
    return datesIn(v).some((e) => e.ymd && e.ymd.m === found.ymd!.m && e.ymd.d === found.ymd!.d && (found.ymd!.y === undefined || e.ymd!.y === undefined || e.ymd!.y === found.ymd!.y));
  });
}

/** A forbidden match is excused only by an adjacent negator: within the 3 words before it, or "is/are/was/will be not" after it. */
function negated(text: string, start: number, end: number): boolean {
  const before = text.slice(0, start);
  const sentStart = Math.max(before.lastIndexOf("."), before.lastIndexOf("!"), before.lastIndexOf("?"), before.lastIndexOf("\n")) + 1;
  const pre = before.slice(sentStart);
  const lastWords = pre.trim().split(/\s+/).slice(-NEGATION_WORDS).join(" ");
  if (NEGATOR_ADJ.test(lastWords) || NO_SUBJECT.test(pre)) return true;
  return /\b(?:is|are|was|will be)$/i.test(text.slice(0, end)) && /^\s+not\b/i.test(text.slice(end));
}

function forbiddenHit(p: string, text: string): boolean {
  const re = new RegExp(p, "gi");
  const selfNegating = NEGATOR.test(p.replace(/\\./g, " ")) || /n't/i.test(p);
  for (const m of text.matchAll(re)) {
    if (m[0] === "") continue;
    if (selfNegating || !negated(text, m.index!, m.index! + m[0].length)) return true;
  }
  return false;
}

export function scoreCase(c: GoldenCase, o: Observed, available?: ReadonlySet<string>): Score {
  const failures: string[] = [];
  const warnings: string[] = [];
  const text = norm(o.text);
  if (text.trim() === "") return { id: c.id, pass: false, failures: ["empty_answer"], warnings };
  for (const t of c.expected_tools) {
    if (o.toolsCalled.includes(t)) continue;
    if (available && !available.has(t)) warnings.push(`pending_tool:${t}`);
    else failures.push(`missing_tool:${t}`);
  }
  for (const p of c.forbidden_patterns) if (forbiddenHit(p, text)) failures.push(`forbidden:${p}`);
  const ungrounded = datesIn(text).filter((d) => !grounded(d, o.evidenceValues));
  for (const d of ungrounded) failures.push(`ungrounded_date:${d.raw}`);
  if (c.must_abstain) {
    const abstained = STRONG_ABSTAIN.test(text) || (WEAK_ABSTAIN.test(text) && ungrounded.length === 0);
    if (!abstained) failures.push("missing_abstention");
  }
  if (c.required_phrases_any && !c.required_phrases_any.some((p) => text.toLowerCase().includes(p.toLowerCase()))) failures.push("missing_required_phrase");
  return { id: c.id, pass: failures.length === 0, failures, warnings };
}
