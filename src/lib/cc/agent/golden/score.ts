// src/lib/cc/agent/golden/score.ts
export type GoldenCase = { id: string; question: string; task_family: string; expected_tools: string[]; must_abstain: boolean; forbidden_patterns: string[]; required_phrases_any?: string[] };
export type Observed = { toolsCalled: string[]; text: string; evidenceValues: string[] };
export type Score = { id: string; pass: boolean; failures: string[] };

const MONTHS = "(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)";
const DATE_RE = new RegExp(`\\b(?:\\d{4}-\\d{2}-\\d{2}|${MONTHS}\\.? \\d{1,2}(?:st|nd|rd|th)?(?:,? \\d{4})?)\\b`, "g");
const ABSTAIN_MARKERS = /\b(can't predict|cannot predict|not yet published|don't have a verified|I can check|not able to|can't do that|You write every word)\b/i;

export function scoreCase(c: GoldenCase, o: Observed): Score {
  const failures: string[] = [];
  for (const t of c.expected_tools) if (!o.toolsCalled.includes(t)) failures.push(`missing_tool:${t}`);
  for (const p of c.forbidden_patterns) if (new RegExp(p, "i").test(o.text)) failures.push(`forbidden:${p}`);
  for (const d of o.text.match(DATE_RE) ?? []) if (!o.evidenceValues.some((v) => v.includes(d))) failures.push(`ungrounded_date:${d}`);
  if (c.must_abstain && !ABSTAIN_MARKERS.test(o.text)) failures.push("missing_abstention");
  if (c.required_phrases_any && !c.required_phrases_any.some((p) => o.text.toLowerCase().includes(p.toLowerCase()))) failures.push("missing_required_phrase");
  return { id: c.id, pass: failures.length === 0, failures };
}
