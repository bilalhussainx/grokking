// Essay review honesty (Oct 3 audit): a 130-word draft against a 650-word
// limit was scored 85 "STRONG", and the review praised dialogue that was not
// in the draft.
import { describe, it, expect } from "vitest";
import {
  countWords, isTooEarlyToScore, earlyDraftReview, keepQuotedStrengths, finalizeReview,
} from "../essay-review-gate";
import { shouldGateEarlyDraft } from "../essay-review-gate";

const DRAFT = `The kitchen smelled like burnt cumin the night my grandmother stopped remembering my name.
I kept cooking anyway, because the recipe was the only map we still shared.`;

describe("isTooEarlyToScore", () => {
  it("is true below 60% of the word limit", () => {
    expect(isTooEarlyToScore(130, 650)).toBe(true);
    expect(isTooEarlyToScore(389, 650)).toBe(true);
  });
  it("is false at or above 60%", () => {
    expect(isTooEarlyToScore(390, 650)).toBe(false);
    expect(isTooEarlyToScore(640, 650)).toBe(false);
  });
});

describe("countWords", () => {
  it("counts whitespace-separated words and ignores blank space", () => {
    expect(countWords("  one two\n\nthree  ")).toBe(3);
    expect(countWords("")).toBe(0);
  });
});

describe("earlyDraftReview", () => {
  const r = earlyDraftReview(130, 650);
  it("carries no numeric score of any kind", () => {
    expect(r.tooEarlyToScore).toBe(true);
    expect(r).not.toHaveProperty("overallScore");
    expect(r).not.toHaveProperty("scoreBreakdown");
    expect(r).not.toHaveProperty("promptFitScore");
  });
  it("says it's too early and how far to go", () => {
    expect(r.overallNotes).toMatch(/too early to score/i);
    expect(r.overallNotes).toContain("130");
    expect(r.overallNotes).toContain("390");
    expect(r.overallNotes).toContain("650");
    expect(r.minWordsToScore).toBe(390);
  });
  it("lists what to develop, and praises nothing", () => {
    expect(r.whatToDevelop.length).toBeGreaterThanOrEqual(3);
    expect(r.comments).toEqual([]);
    expect(r).not.toHaveProperty("strengths");
  });
});

describe("keepQuotedStrengths", () => {
  it("keeps a strength that quotes the student's words", () => {
    const s = 'Your opening, "the night my grandmother stopped remembering my name", lands the stakes fast.';
    expect(keepQuotedStrengths([s], DRAFT)).toEqual([s]);
  });
  it("matches curly quotes and ignores case and spacing", () => {
    const s = "“I kept cooking  anyway” shows what you did next.";
    expect(keepQuotedStrengths([s], DRAFT)).toEqual([s]);
  });
  it("drops praise for words that are not in the draft", () => {
    expect(keepQuotedStrengths(['The dialogue "Nani, it\'s me" is vivid.'], DRAFT)).toEqual([]);
  });
  it("drops a strength with no quote at all", () => {
    expect(keepQuotedStrengths(["Great use of dialogue throughout."], DRAFT)).toEqual([]);
  });
});

describe("finalizeReview", () => {
  const review = {
    overallScore: 72,
    scoreBreakdown: { promptFit: 70, voiceAuthenticity: 75, specificity: 70, reflectionDepth: 65, structuralCraft: 70, applicationFit: 70 },
    strengths: ['"burnt cumin" is a specific sensory detail.', "Strong dialogue."],
    comments: [],
    overallNotes: "Solid start.",
    wordCount: 30,
    promptFitScore: 0.7,
  };
  it("drops application fit when the student has no schools", () => {
    const out = finalizeReview(review, { draft: DRAFT, hasSchools: false });
    expect(out.scoreBreakdown).not.toHaveProperty("applicationFit");
    expect(out.scoreBreakdown?.promptFit).toBe(70);
  });
  it("keeps application fit when the student has schools", () => {
    expect(finalizeReview(review, { draft: DRAFT, hasSchools: true }).scoreBreakdown?.applicationFit).toBe(70);
  });
  it("keeps only strengths that quote the draft", () => {
    expect(finalizeReview(review, { draft: DRAFT, hasSchools: true }).strengths).toEqual(['"burnt cumin" is a specific sensory detail.']);
  });
});

describe("shouldGateEarlyDraft", () => {
  it("never gates UCAS personal statement answers, whose limit is in characters", () => {
    expect(shouldGateEarlyDraft({ essayType: "ucas_ps_q1", wordLimit: 1500, wordLimitIsSet: true, draftWords: 250 })).toBe(false);
  });
  it("never gates when the essay has no limit of its own (the 650 is only a fallback)", () => {
    expect(shouldGateEarlyDraft({ essayType: "supplement_why", wordLimit: 650, wordLimitIsSet: false, draftWords: 120 })).toBe(false);
  });
  it("gates a real word-limited draft under 60%, and not one at exactly 60%", () => {
    expect(shouldGateEarlyDraft({ essayType: "personal_statement", wordLimit: 650, wordLimitIsSet: true, draftWords: 130 })).toBe(true);
    expect(shouldGateEarlyDraft({ essayType: "personal_statement", wordLimit: 650, wordLimitIsSet: true, draftWords: 390 })).toBe(false);
  });
});
