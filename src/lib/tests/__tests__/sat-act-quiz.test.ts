import { describe, it, expect } from "vitest";
import { recommendSATorACT, feeWaiverEligibility, SAT_ACT_QUIZ } from "../sat-act-quiz";

describe("recommendSATorACT", () => {
  it("recommends SAT when most answers are SAT", () => {
    const r = recommendSATorACT(["SAT", "SAT", "SAT", "SAT", "NEUTRAL", "NEUTRAL"]);
    expect(r.test).toBe("SAT");
  });
  it("recommends ACT when most answers are ACT", () => {
    const r = recommendSATorACT(["ACT", "ACT", "ACT", "ACT", "ACT", "NEUTRAL"]);
    expect(r.test).toBe("ACT");
  });
  it("recommends BOTH when split evenly", () => {
    const r = recommendSATorACT(["SAT", "ACT", "SAT", "ACT", "SAT", "ACT"]);
    expect(r.test).toBe("BOTH");
  });
  it("warns when most answers are neutral", () => {
    const r = recommendSATorACT(["NEUTRAL", "NEUTRAL", "NEUTRAL", "NEUTRAL", "SAT", "NEUTRAL"]);
    expect(r.reasons.some((s) => s.includes("weak"))).toBe(true);
  });
});

describe("feeWaiverEligibility", () => {
  it("eligible with free lunch", () => {
    const r = feeWaiverEligibility({ isInternational: false, receivesFreeReducedLunch: true });
    expect(r.eligible).toBe(true);
  });
  it("not eligible if international", () => {
    const r = feeWaiverEligibility({ isInternational: true, receivesFreeReducedLunch: true });
    expect(r.eligible).toBe(false);
    expect(r.reason).toContain("International");
  });
  it("eligible (likely) for first-gen", () => {
    const r = feeWaiverEligibility({ isInternational: false, isFirstGen: true });
    expect(r.eligible).toBe(true);
  });
  it("not eligible by default", () => {
    const r = feeWaiverEligibility({ isInternational: false });
    expect(r.eligible).toBe(false);
  });
});

describe("SAT_ACT_QUIZ", () => {
  it("has 6 questions", () => {
    expect(SAT_ACT_QUIZ).toHaveLength(6);
  });
  it("each question has 3 options", () => {
    for (const q of SAT_ACT_QUIZ) {
      expect(q.options).toHaveLength(3);
    }
  });
});
