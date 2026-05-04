// Canonical confirmation block the coach LLM is instructed to emit at the
// END of any assistant turn that performs an action (e.g. adding schools).
// The block is parsed authoritatively by the extraction pipeline; the
// rendered assistant message has the block stripped so the user only sees
// natural-language confirmation.
//
// Canonical format:
//
//   <<actions>>
//   {"add_schools": ["Stanford University", "MIT"]}
//   <</actions>>
//
// In practice the LLM frequently deviates — observed in production logs:
//   - Closer hallucinated as <<actions>> instead of <</actions>>
//   - Field name "schools" instead of "add_schools"
//   - Array of objects [{name: "Stanford"}, ...] instead of strings
// All three of these surfaced together and produced an unparsed block
// leaking into the visible chat. The parser below is lenient enough to
// recover all three variants. The prompt still teaches the canonical
// shape so the strict path stays the fast path.
//
// We deliberately choose a fenced block instead of OpenRouter tool-calling
// for now (Phase 2): tool-calling requires per-provider differences and
// breaks streaming UX. A fenced block survives the existing streaming +
// extraction pipeline with a one-line prompt change.

export interface CoachSchoolAdd {
  name: string;
  // Optional admit-likelihood tier the LLM tags each add with so the school
  // lands in the right group on /schools (Reach / Match / Safety) instead of
  // collapsing everything into "unknown" — which renders as "—" via
  // tierFromBand("unknown") in ChanceBadge.
  band?: "reach" | "match" | "safety";
}

export interface CoachActions {
  add_schools?: CoachSchoolAdd[];
}

// Match the opening tag, then non-greedy any content, then either the
// canonical closer <</actions>> OR a hallucinated repeat of the opener
// <<actions>>. The non-greedy capture ensures we stop at the first
// closer found.
const BLOCK_RE = /<<actions>>([\s\S]*?)(?:<<\/actions>>|<<actions>>)/g;

// Permissive normalizer that accepts the deviations observed in
// production. Returns CoachSchoolAdd[] regardless of input shape:
//   ["Stanford"]                              → [{name: "Stanford"}]
//   [{name: "Stanford"}]                      → [{name: "Stanford"}]
//   [{name: "Stanford", band: "reach"}]       → [{name: "Stanford", band: "reach"}]
//   [{name: "Stanford"}, "MIT"]               → [{name: "Stanford"}, {name: "MIT"}]
function normalizeSchoolList(value: unknown): CoachSchoolAdd[] | null {
  if (!Array.isArray(value)) return null;
  const out: CoachSchoolAdd[] = [];
  for (const item of value) {
    if (typeof item === "string" && item.trim()) {
      out.push({ name: item.trim() });
    } else if (item && typeof item === "object") {
      const obj = item as { name?: unknown; band?: unknown };
      if (typeof obj.name === "string" && obj.name.trim()) {
        const entry: CoachSchoolAdd = { name: obj.name.trim() };
        if (typeof obj.band === "string") {
          const b = obj.band.toLowerCase();
          if (b === "reach" || b === "match" || b === "safety") entry.band = b;
        }
        out.push(entry);
      }
    }
  }
  return out.length > 0 ? out : null;
}

export function parseActionsBlock(text: string): CoachActions | null {
  const matches = [...text.matchAll(BLOCK_RE)];
  if (matches.length === 0) return null;
  // Last match wins — the model occasionally emits multiple blocks; the
  // last one is its final commitment.
  const inner = matches[matches.length - 1][1].trim();
  if (!inner) return null;

  // Try strict JSON first; if that fails, try a JSON5-ish pass that
  // tolerates unquoted keys + single-quoted strings (which the LLM also
  // emits sometimes — e.g. `{ schools: ['Stanford'] }`).
  let parsed: unknown = null;
  try {
    parsed = JSON.parse(inner);
  } catch {
    parsed = relaxedJsonParse(inner);
    if (!parsed) return null;
  }
  if (typeof parsed !== "object" || parsed === null) return null;

  const obj = parsed as Record<string, unknown>;

  // Accept either `add_schools` (canonical) or `schools` (observed
  // hallucination) as the field name for the school list.
  const rawList = obj.add_schools ?? obj.schools;
  const schools = normalizeSchoolList(rawList);
  if (!schools) return null;

  return { add_schools: schools };
}

export function stripActionsBlock(text: string): string {
  return text.replace(BLOCK_RE, "").trimEnd();
}

// Best-effort relaxed parse for LLM-emitted near-JSON. Handles:
//   - Unquoted keys:   {schools: [...]}    →  {"schools":[...]}
//   - Single quotes:   ['Stanford']        →  ["Stanford"]
// Returns null on hard failure.
function relaxedJsonParse(input: string): unknown {
  let s = input;
  // Quote unquoted keys: `{key:` or `, key:` → `"key":`
  s = s.replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:/g, '$1"$2":');
  // Convert single-quoted strings to double-quoted. Doesn't try to handle
  // escaped quotes inside — the LLM doesn't generate those in this block.
  s = s.replace(/'([^'\\]*)'/g, '"$1"');
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}
