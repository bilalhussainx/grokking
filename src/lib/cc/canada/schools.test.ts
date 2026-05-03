import { describe, it, expect } from "vitest";
import {
  getCanadianSchools,
  getCanadianDeadline,
  getCanadianApplicationPlan,
  getCanadianSupplementPrompts,
  CANADIAN_SCHOOL_NAMES,
} from "./schools";

describe("getCanadianSchools", () => {
  it("returns 12 schools", () => {
    expect(getCanadianSchools().length).toBe(12);
  });
  it("includes UofT, UBC, McGill, Waterloo by name", () => {
    const names = getCanadianSchools().map((s) => s.name);
    expect(names).toContain("University of Toronto");
    expect(names).toContain("University of British Columbia");
    expect(names).toContain("McGill University");
    expect(names).toContain("University of Waterloo");
  });
});

describe("getCanadianDeadline", () => {
  it("returns deadline + portal info for UofT", () => {
    const d = getCanadianDeadline("University of Toronto");
    expect(d).toBeTruthy();
    expect(d?.deadline_application).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(d?.portal_url).toContain("utoronto");
  });
  it("returns null for unknown school", () => {
    expect(getCanadianDeadline("Hogwarts")).toBeNull();
  });
});

describe("getCanadianApplicationPlan", () => {
  it("returns rolling for Waterloo", () => {
    const p = getCanadianApplicationPlan("University of Waterloo");
    expect(p?.plans).toContain("rolling");
  });
  it("marks every Canadian school need-aware-for-internationals", () => {
    for (const school of CANADIAN_SCHOOL_NAMES) {
      const p = getCanadianApplicationPlan(school);
      expect(p?.need_aware_for_internationals).toBe(true);
    }
  });
});

describe("getCanadianSupplementPrompts", () => {
  it("returns prompts for UBC, Waterloo, Queen's, UofT", () => {
    expect(getCanadianSupplementPrompts("University of British Columbia")?.length).toBeGreaterThan(0);
    expect(getCanadianSupplementPrompts("University of Waterloo")?.length).toBeGreaterThan(0);
    expect(getCanadianSupplementPrompts("Queen's University")?.length).toBeGreaterThan(0);
    expect(getCanadianSupplementPrompts("University of Toronto")?.length).toBeGreaterThan(0);
  });
  it("returns null for grades-only schools (McGill)", () => {
    expect(getCanadianSupplementPrompts("McGill University")).toBeNull();
  });
});
