// Feature 4 — cheap text-similarity detector for cross-school essay reuse.
// We don't run pgvector or full embedding similarity here. Instead we look for
// (a) school-name leakage (a "Why MIT" essay that mentions Stanford or vice
// versa), and (b) high token-overlap (>0.55 jaccard) with any other supplement
// the same student has saved. Returns a 0..1 score plus a flag.

const STOP_WORDS = new Set([
  "the", "a", "an", "of", "to", "in", "for", "on", "at", "by", "with", "is",
  "are", "was", "were", "be", "been", "being", "this", "that", "those", "these",
  "i", "my", "me", "we", "our", "you", "your", "they", "them", "their",
  "and", "or", "but", "if", "then", "as", "so", "not", "no",
  "have", "has", "had", "do", "does", "did", "will", "would", "should", "could",
  "from", "into", "out", "up", "down", "about", "more", "most", "very",
]);

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s'-]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP_WORDS.has(w)),
  );
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersect = 0;
  for (const t of a) if (b.has(t)) intersect++;
  const union = a.size + b.size - intersect;
  return union === 0 ? 0 : intersect / union;
}

const SCHOOL_PROPER_NOUNS = [
  "MIT", "Harvard", "Yale", "Princeton", "Stanford", "Columbia", "Penn",
  "Cornell", "Brown", "Dartmouth", "Georgetown", "UCLA", "Michigan", "UNC",
  "NYU", "Northwestern", "Duke", "USC", "Vanderbilt", "Boston University",
  "Caltech", "Chicago", "Northeastern",
];

export type ReuseFinding = {
  reuseScore: number;          // 0..1, max similarity to any other essay
  flagged: boolean;
  topMatchEssayId: string | null;
  // School-leakage: e.g. a Stanford essay mentions "MIT" → flagged regardless
  schoolLeakageDetected: string | null;
};

export function detectReuse(
  draft: string,
  ownSchoolName: string,
  otherEssays: { id: string; school_name: string; current_draft: string | null }[],
): ReuseFinding {
  const draftLower = draft.toLowerCase();
  const ownLower = ownSchoolName.toLowerCase();

  // School-leakage: any OTHER school name mentioned in this draft is suspicious
  let schoolLeakageDetected: string | null = null;
  for (const other of SCHOOL_PROPER_NOUNS) {
    const otherLower = other.toLowerCase();
    if (otherLower === ownLower) continue;
    // Word-boundary match (avoid 'mit' matching 'admit')
    const re = new RegExp(`\\b${other.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    if (re.test(draft)) {
      schoolLeakageDetected = other;
      break;
    }
  }
  void draftLower; // appease unused-warning if regex path covers it

  const draftTokens = tokenize(draft);
  let topMatch: { id: string; score: number } | null = null;
  for (const other of otherEssays) {
    if (!other.current_draft || other.current_draft.length < 30) continue;
    const score = jaccard(draftTokens, tokenize(other.current_draft));
    if (!topMatch || score > topMatch.score) topMatch = { id: other.id, score };
  }

  const reuseScore = topMatch?.score ?? 0;
  const flagged = Boolean(schoolLeakageDetected) || reuseScore > 0.55;

  return {
    reuseScore: Math.round(reuseScore * 100) / 100,
    flagged,
    topMatchEssayId: topMatch?.id ?? null,
    schoolLeakageDetected,
  };
}

export function wordCount(text: string | null | undefined): number {
  if (!text) return 0;
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function wordCountColor(count: number, limit: number | null | undefined): "green" | "amber" | "red" {
  if (!limit) return "green";
  const ratio = count / limit;
  if (ratio > 1.05) return "red";
  if (ratio > 0.95) return "green";
  if (ratio > 0.7) return "amber";
  return "amber"; // under 70% is also amber (too short)
}
