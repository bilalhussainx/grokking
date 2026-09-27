import { describe, expect, it } from "vitest";
import {
  calculateGap,
  firstPlanningQuestion,
  getNextStep,
  QUICK_CHECK_COPY,
  QUICK_CHECK_LANGUAGES,
  typeQuickCheckLanguage,
} from "./index";

describe("quick check language metadata", () => {
  it("follows the coach-language order and exposes native names", () => {
    expect(QUICK_CHECK_LANGUAGES).toEqual([
      { code: "en", nativeName: "English" },
      { code: "es", nativeName: "Español" },
      { code: "hi", nativeName: "हिन्दी" },
      { code: "pa", nativeName: "ਪੰਜਾਬੀ" },
      { code: "ur", nativeName: "اردو" },
    ]);
  });

  it("types supported codes and safely falls back to English", () => {
    expect(typeQuickCheckLanguage("ur")).toBe("ur");
    expect(typeQuickCheckLanguage("fr")).toBe("en");
    expect(typeQuickCheckLanguage("unknown")).toBe("en");
  });
});

describe("getNextStep", () => {
  it.each([
    ["early", "early"],
    ["junior", "junior"],
    ["applying", "applying"],
    ["submitted", "submitted"],
    ["decisions", "decisions"],
    ["transfer", "transfer"],
  ] as const)("routes school concern at %s to its stage action", (stage, action) => {
    const result = getNextStep(stage, "us", "schools", "en");
    expect(result.action).toBe(QUICK_CHECK_COPY.en.actions[action]);
  });

  it("keeps late application and transfer essay guidance stage-aware", () => {
    expect(getNextStep("submitted", "ca", "essay", "en").action).toBe(
      QUICK_CHECK_COPY.en.actions.essayLate,
    );
    expect(getNextStep("decisions", "ca", "essay", "en").action).toBe(
      QUICK_CHECK_COPY.en.actions.essayLate,
    );
    expect(getNextStep("transfer", "ca", "essay", "en").action).toBe(
      QUICK_CHECK_COPY.en.actions.essayTransfer,
    );
  });

  it("returns localized copy and the chosen destination and concern prompts", () => {
    const result = getNextStep("junior", "exploring", "cost", "es");
    expect(result).toEqual({
      action: QUICK_CHECK_COPY.es.actions.cost,
      hint: QUICK_CHECK_COPY.es.hint[2],
      question: QUICK_CHECK_COPY.es.questions[1],
    });
  });
});

describe("calculateGap", () => {
  it("converts decimal amounts to exact integer cents", () => {
    expect(
      calculateGap({ annualCost: "123.45", grants: "23.4", familyContribution: "50.05" }),
    ).toEqual({
      ok: true,
      gapCents: 5_000,
      annualCostCents: 12_345,
      grantsCents: 2_340,
      familyContributionCents: 5_005,
      overcovered: false,
    });
  });

  it("accepts explicit zeroes, decimal forms, and the inclusive maximum", () => {
    expect(calculateGap({ annualCost: "0", grants: "0.00", familyContribution: "0" })).toEqual({
      ok: true,
      gapCents: 0,
      annualCostCents: 0,
      grantsCents: 0,
      familyContributionCents: 0,
      overcovered: false,
    });
    expect(calculateGap({ annualCost: "10000000.00", grants: "0", familyContribution: "0" })).toMatchObject({
      ok: true,
      annualCostCents: 1_000_000_000,
      gapCents: 1_000_000_000,
    });
    expect(calculateGap({ annualCost: ".50", grants: "0", familyContribution: "0" })).toMatchObject({
      ok: true,
      annualCostCents: 50,
      gapCents: 50,
    });
    expect(calculateGap({ annualCost: "1.", grants: "0", familyContribution: "0" })).toMatchObject({
      ok: true,
      annualCostCents: 100,
      gapCents: 100,
    });
  });

  it.each(["", "   ", ".", "1e2", "NaN", "-1", "1.234", "10000000.01"])(
    "rejects malformed or out-of-range annual cost %j",
    (annualCost) => {
      expect(calculateGap({ annualCost, grants: "0", familyContribution: "0" })).toMatchObject({
        ok: false,
        field: "annualCost",
      });
    },
  );

  it("rejects grants above cost and clamps a negative gap with an overcovered flag", () => {
    expect(calculateGap({ annualCost: "10", grants: "10.01", familyContribution: "0" })).toMatchObject({
      ok: false,
      field: "grants",
    });
    expect(calculateGap({ annualCost: "10", grants: "5", familyContribution: "8" })).toEqual({
      ok: true,
      gapCents: 0,
      annualCostCents: 1_000,
      grantsCents: 500,
      familyContributionCents: 800,
      overcovered: true,
    });
  });

  it("reports the first invalid field in the input order", () => {
    expect(calculateGap({ annualCost: "10", grants: "1.001", familyContribution: "" })).toMatchObject({
      ok: false,
      field: "grants",
    });
    expect(calculateGap({ annualCost: "10", grants: "1", familyContribution: "" })).toMatchObject({
      ok: false,
      field: "familyContribution",
    });
  });
});

describe("firstPlanningQuestion", () => {
  it("returns the first item that is not answered yes", () => {
    expect(firstPlanningQuestion(["yes", "yes", "unsure", "yes"])).toBe(
      "Which annual cost or confirmed funding amount do you still need to find?",
    );
    expect(firstPlanningQuestion(["no", "yes", "yes", "yes"])).toBe(
      "Which school or program would you like to research first?",
    );
    expect(firstPlanningQuestion(["yes", "yes", "yes", ""])).toBe(
      "What is one small task you can take on next?",
    );
  });

  it("does not frame all-known answers as an admissions assessment", () => {
    expect(firstPlanningQuestion(["yes", "yes", "yes", "yes"])).toContain(
      "This is not an admissions assessment.",
    );
  });
});
