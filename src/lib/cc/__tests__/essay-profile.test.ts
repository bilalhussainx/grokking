import { describe, it, expect } from "vitest";
import { getEssayProfile } from "../essay-profile";

describe("getEssayProfile", () => {
  it("returns null for the US default (personal_statement)", () => {
    expect(getEssayProfile("personal_statement", "US")).toBeNull();
  });
  it("returns null for US supplements (default framing applies)", () => {
    expect(getEssayProfile("supplement_intellectual", "US")).toBeNull();
  });
  it("returns null when essayType is missing", () => {
    expect(getEssayProfile(null, null)).toBeNull();
    expect(getEssayProfile(undefined, null)).toBeNull();
  });

  describe("UCAS PS questions", () => {
    it("Q1 = subject fit; suppresses US expert tips", () => {
      const p = getEssayProfile("ucas_ps_q1");
      expect(p).not.toBeNull();
      expect(p!.country).toBe("UK");
      expect(p!.brainstormFraming).toContain("SUBJECT FIT");
      expect(p!.brainstormFraming).toContain("NOT PERSONAL NARRATIVE");
      expect(p!.suppressUSExpertTips).toBe(true);
    });
    it("Q2 = academic preparation; suppresses US expert tips", () => {
      const p = getEssayProfile("ucas_ps_q2");
      expect(p!.brainstormFraming).toContain("ACADEMIC PREPARATION");
      expect(p!.brainstormFraming).toContain("SPECIFIC TOPICS");
      expect(p!.suppressUSExpertTips).toBe(true);
    });
    it("Q3 = super-curriculars (NOT extracurriculars)", () => {
      const p = getEssayProfile("ucas_ps_q3");
      expect(p!.brainstormFraming).toContain("SUPER-CURRICULARS");
      expect(p!.brainstormFraming).toContain("NOT EXTRACURRICULARS");
      // The whole point is that sports/debate captaincy don't count for Q3.
      expect(p!.brainstormFraming.toLowerCase()).toContain("captaincy");
      expect(p!.suppressUSExpertTips).toBe(true);
    });
    it("UCAS profile is school-country-agnostic (school_id is null for UCAS)", () => {
      // UCAS PS rows have school_id=null, so schoolCountry will be null at
      // call time. The profile must still resolve from the essay_type alone.
      expect(getEssayProfile("ucas_ps_q1", null)?.country).toBe("UK");
      expect(getEssayProfile("ucas_ps_q2", null)?.country).toBe("UK");
      expect(getEssayProfile("ucas_ps_q3", null)?.country).toBe("UK");
    });
  });

  describe("Canadian supplements", () => {
    it("supplement_* + schoolCountry=CA → academic-leaning Canadian profile", () => {
      const p = getEssayProfile("supplement_intellectual", "CA");
      expect(p).not.toBeNull();
      expect(p!.country).toBe("CA");
      expect(p!.brainstormFraming).toContain("ACADEMIC-LEANING");
      expect(p!.brainstormFraming).toContain("Waterloo");
      // Canadian supplements still reuse the US tips (genres are similar).
      expect(p!.suppressUSExpertTips).toBe(false);
    });
    it("supplement_* + schoolCountry=US still returns null (default US framing)", () => {
      expect(getEssayProfile("supplement_intellectual", "US")).toBeNull();
    });
    it("Canadian school country is required — supplement_* without country = US default", () => {
      // Defensive: if the school_id lookup fails and we don't know the country,
      // we don't want to mistakenly apply Canadian framing.
      expect(getEssayProfile("supplement_intellectual", null)).toBeNull();
    });
  });
});
