// Guards around the AI essay review (POST /api/cc/essays/[id]/review).
//
// - A draft under 60% of its word limit is too early to score: the student
//   gets what to develop, with no number, and no model call.
// - Every "what's working" point must quote the student's own words. A
//   strength whose quote is not in the draft (praise for dialogue that isn't
//   there) is dropped.
// - Application fit is only scored when the student has schools on their list.
export const MIN_SCORABLE_FRACTION = 0.6;

export function countWords(text: string | null | undefined): number {
  return (text ?? "").split(/\s+/).filter(Boolean).length;
}

export function isTooEarlyToScore(wordCount: number, wordLimit: number): boolean {
  return wordLimit > 0 && wordCount < wordLimit * MIN_SCORABLE_FRACTION;
}

// Gate only a real word limit. UCAS personal statement answers ("ucas_ps_*")
// store a character limit in word_limit, and an essay with no limit of its own
// only has the 650 fallback; neither can say a draft is "too early".
export function shouldGateEarlyDraft(i: { essayType: string; wordLimit: number; wordLimitIsSet: boolean; draftWords: number }): boolean {
  if (!i.wordLimitIsSet || i.essayType.startsWith("ucas_ps_")) return false;
  return isTooEarlyToScore(i.draftWords, i.wordLimit);
}

export interface EarlyDraftReview {
  tooEarlyToScore: true;
  wordCount: number;
  wordLimit: number;
  minWordsToScore: number;
  overallNotes: string;
  whatToDevelop: string[];
  comments: never[];
}

export function earlyDraftReview(wordCount: number, wordLimit: number): EarlyDraftReview {
  const minWordsToScore = Math.ceil(wordLimit * MIN_SCORABLE_FRACTION);
  return {
    tooEarlyToScore: true,
    wordCount,
    wordLimit,
    minWordsToScore,
    overallNotes:
      `Too early to score. Your draft has ${wordCount} words against a ${wordLimit}-word limit. ` +
      `A score means more once the draft reaches about ${minWordsToScore} words (60% of the limit), so keep writing first.`,
    whatToDevelop: [
      "One specific moment: where you were, what you saw, heard or did. Put the reader inside it.",
      "What you were thinking or deciding in that moment, in your own words.",
      "What changed afterwards, and what it shows about who you are now.",
      "How the essay answers the prompt's actual question. Reread the prompt and check.",
    ],
    comments: [],
  };
}

const normalize = (s: string) =>
  s.toLowerCase().replace(/[‘’]/g, "'").replace(/[^a-z0-9'\s]/g, " ").replace(/\s+/g, " ").trim();

// Text inside straight or curly double quotes.
const quotedSpans = (s: string) => [...s.matchAll(/["“]([^"“”]+)["”]/g)].map((m) => normalize(m[1])).filter(Boolean);

export function keepQuotedStrengths(strengths: string[], draft: string): string[] {
  const body = normalize(draft);
  return strengths.filter((s) => {
    const quotes = quotedSpans(s);
    return quotes.length > 0 && quotes.every((q) => body.includes(q));
  });
}

type ScoredReview = {
  scoreBreakdown?: Record<string, number>;
  strengths?: string[];
};

export function finalizeReview<T extends ScoredReview>(review: T, opts: { draft: string; hasSchools: boolean }): T {
  const out: T = { ...review };
  if (review.strengths) out.strengths = keepQuotedStrengths(review.strengths, opts.draft);
  if (review.scoreBreakdown && !opts.hasSchools) {
    const rest = { ...review.scoreBreakdown };
    delete rest.applicationFit;
    out.scoreBreakdown = rest;
  }
  return out;
}
