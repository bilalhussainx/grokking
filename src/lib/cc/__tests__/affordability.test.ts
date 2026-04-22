import { describe, it, expect } from "vitest";
import {
  AFFORDABILITY_OPTIONS,
  financialNeedFromAffordability,
  NEED_BLIND_INTERNATIONAL_IPEDS,
} from "../affordability";

describe("AFFORDABILITY_OPTIONS", () => {
  it("places $0 first so it surfaces prominently", () => {
    expect(AFFORDABILITY_OPTIONS[0].value).toBe("zero");
    expect(AFFORDABILITY_OPTIONS[0].label).toContain("$0");
  });

  it("has exactly 6 options", () => {
    expect(AFFORDABILITY_OPTIONS).toHaveLength(6);
  });

  it("has monotonically increasing maxAnnual values", () => {
    for (let i = 1; i < AFFORDABILITY_OPTIONS.length; i++) {
      expect(AFFORDABILITY_OPTIONS[i].maxAnnual).toBeGreaterThan(AFFORDABILITY_OPTIONS[i - 1].maxAnnual);
    }
  });
});

describe("financialNeedFromAffordability", () => {
  it("maps zero and under_10k to essential", () => {
    expect(financialNeedFromAffordability("zero")).toBe("essential");
    expect(financialNeedFromAffordability("under_10k")).toBe("essential");
  });

  it("maps 10k_20k and 20k_30k to important", () => {
    expect(financialNeedFromAffordability("10k_20k")).toBe("important");
    expect(financialNeedFromAffordability("20k_30k")).toBe("important");
  });

  it("maps 30k_50k to nice-to-have", () => {
    expect(financialNeedFromAffordability("30k_50k")).toBe("nice-to-have");
  });

  it("maps 50k_plus to not-a-concern", () => {
    expect(financialNeedFromAffordability("50k_plus")).toBe("not-a-concern");
  });
});

describe("NEED_BLIND_INTERNATIONAL_IPEDS", () => {
  it("contains exactly the 8 spec-named schools", () => {
    expect(NEED_BLIND_INTERNATIONAL_IPEDS.size).toBe(8);
    expect(NEED_BLIND_INTERNATIONAL_IPEDS.has(166027)).toBe(true); // Harvard
    expect(NEED_BLIND_INTERNATIONAL_IPEDS.has(166683)).toBe(true); // MIT
    expect(NEED_BLIND_INTERNATIONAL_IPEDS.has(130794)).toBe(true); // Yale
    expect(NEED_BLIND_INTERNATIONAL_IPEDS.has(186131)).toBe(true); // Princeton
    expect(NEED_BLIND_INTERNATIONAL_IPEDS.has(182670)).toBe(true); // Dartmouth
    expect(NEED_BLIND_INTERNATIONAL_IPEDS.has(164465)).toBe(true); // Amherst
    expect(NEED_BLIND_INTERNATIONAL_IPEDS.has(168342)).toBe(true); // Williams
    expect(NEED_BLIND_INTERNATIONAL_IPEDS.has(160977)).toBe(true); // Bowdoin
  });
});
