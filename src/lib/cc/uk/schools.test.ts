import { describe, it, expect } from "vitest";
import {
  getUKSchools,
  getUKDeadline,
  getUKApplicationPlan,
  UK_SCHOOL_NAMES,
  isOxbridgeOrMedical,
} from "./schools";

describe("getUKSchools", () => {
  it("returns 12 schools", () => {
    expect(getUKSchools().length).toBe(12);
  });
  it("includes Oxford, Cambridge, Imperial, LSE, UCL", () => {
    const names = getUKSchools().map((s) => s.name);
    expect(names).toContain("University of Oxford");
    expect(names).toContain("University of Cambridge");
    expect(names).toContain("Imperial College London");
    expect(names).toContain("London School of Economics and Political Science");
    expect(names).toContain("University College London");
  });
});

describe("getUKDeadline", () => {
  it("Oxford has Oct 15 deadline", () => {
    const d = getUKDeadline("University of Oxford");
    expect(d?.deadline_application).toBe("2026-10-15");
    expect(d?.oxbridge_or_medical).toBe(true);
  });
  it("Imperial has Jan 14 deadline", () => {
    const d = getUKDeadline("Imperial College London");
    expect(d?.deadline_application).toBe("2027-01-14");
    expect(d?.oxbridge_or_medical).toBe(false);
  });
  it("returns null for unknown school", () => {
    expect(getUKDeadline("Hogwarts")).toBeNull();
  });
});

describe("getUKApplicationPlan", () => {
  it("every UK school uses UCAS", () => {
    for (const school of UK_SCHOOL_NAMES) {
      const p = getUKApplicationPlan(school);
      expect(p?.plans).toContain("UCAS");
    }
  });
  it("every UK school is need-aware-for-internationals", () => {
    for (const school of UK_SCHOOL_NAMES) {
      const p = getUKApplicationPlan(school);
      expect(p?.need_aware_for_internationals).toBe(true);
    }
  });
});

describe("isOxbridgeOrMedical", () => {
  it("returns true for Oxford and Cambridge", () => {
    expect(isOxbridgeOrMedical("University of Oxford")).toBe(true);
    expect(isOxbridgeOrMedical("University of Cambridge")).toBe(true);
  });
  it("returns false for Imperial, LSE, UCL", () => {
    expect(isOxbridgeOrMedical("Imperial College London")).toBe(false);
    expect(isOxbridgeOrMedical("London School of Economics and Political Science")).toBe(false);
    expect(isOxbridgeOrMedical("University College London")).toBe(false);
  });
});
