import { describe, it, expect } from "vitest";
import { estimateEDCost } from "../ed-strategy";

describe("estimateEDCost", () => {
  it("zero affordability + full-need school = 0 out of pocket", () => {
    const e = estimateEDCost({ schoolName: "Harvard", affordabilityValue: "zero" });
    expect(e.estimatedOutOfPocket).toBe(0);
    expect(e.coa).toBeGreaterThan(80000);
    expect(e.meetsFullNeed).toBe(true);
  });

  it("non-full-need school applies 75% haircut", () => {
    const e = estimateEDCost({ schoolName: "Some Random College", affordabilityValue: "zero" });
    expect(e.estimatedOutOfPocket).toBeGreaterThan(10000);
    expect(e.meetsFullNeed).toBe(false);
  });

  it("50k_plus bracket = student covers most of COA", () => {
    const e = estimateEDCost({ schoolName: "Harvard", affordabilityValue: "50k_plus" });
    expect(e.estimatedOutOfPocket).toBeGreaterThan(50000);
  });

  it("null affordability defaults to mid-bracket EFC", () => {
    const e = estimateEDCost({ schoolName: "Harvard", affordabilityValue: null });
    expect(e.expectedFamilyContribution).toBe(25000);
  });

  it("public OOS school uses lower COA tier", () => {
    const e = estimateEDCost({ schoolName: "University of Michigan", affordabilityValue: "zero" });
    expect(e.coa).toBe(65000);
  });

  it("methodology line names the school", () => {
    const e = estimateEDCost({ schoolName: "Yale", affordabilityValue: "zero" });
    expect(e.methodology).toContain("Yale");
  });
});
