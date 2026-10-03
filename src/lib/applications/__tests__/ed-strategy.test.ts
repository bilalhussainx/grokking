import { describe, it, expect } from "vitest";
import {
  edWarningState,
  checkREAConflict,
  schoolAcceptsPlan,
  getSchoolPlanInfo,
} from "../ed-strategy";

describe("edWarningState", () => {
  it("safe when not aid-dependent and not international", () => {
    const r = edWarningState({
      schoolName: "Cornell",
      affordabilityValue: 70000,
      needsFullAid: false,
      isInternational: false,
    });
    expect(r.state).toBe("safe");
  });
  it("warning when aid-dependent (domestic)", () => {
    const r = edWarningState({
      schoolName: "Cornell",
      affordabilityValue: 0,
      needsFullAid: true,
      isInternational: false,
    });
    expect(r.state).toBe("warning");
    expect(r.alternatives.length).toBeGreaterThan(0);
  });
  it("block when international + need-aware school", () => {
    const r = edWarningState({
      schoolName: "NYU",
      affordabilityValue: 0,
      needsFullAid: true,
      isInternational: true,
    });
    expect(r.state).toBe("block");
  });
  it("safe-ish when international but school is need-blind for internationals", () => {
    const r = edWarningState({
      schoolName: "MIT",
      affordabilityValue: 70000,
      needsFullAid: false,
      isInternational: true,
    });
    expect(r.state).toBe("safe");
  });
});

describe("checkREAConflict", () => {
  it("no conflict when no REA selected", () => {
    const r = checkREAConflict([
      { schoolName: "Cornell", plan: "ED" },
      { schoolName: "MIT", plan: "EA" },
    ]);
    expect(r.conflict).toBe(false);
  });
  it("conflict when REA + EA at private school", () => {
    const r = checkREAConflict([
      { schoolName: "Stanford", plan: "REA" },
      { schoolName: "MIT", plan: "EA" },
    ]);
    expect(r.conflict).toBe(true);
    expect(r.conflictingSchools).toContain("MIT");
  });
  it("no conflict when REA + EA at public school (UMich)", () => {
    const r = checkREAConflict([
      { schoolName: "Yale", plan: "REA" },
      { schoolName: "UMich", plan: "EA" },
    ]);
    expect(r.conflict).toBe(false);
  });
  it("no conflict when REA + RD elsewhere", () => {
    const r = checkREAConflict([
      { schoolName: "Harvard", plan: "REA" },
      { schoolName: "MIT", plan: "RD" },
    ]);
    expect(r.conflict).toBe(false);
  });
});

describe("schoolAcceptsPlan", () => {
  it("MIT accepts EA", () => {
    expect(schoolAcceptsPlan("MIT", "EA")).toBe(true);
  });
  it("MIT does not accept ED (Stanford-style only)", () => {
    expect(schoolAcceptsPlan("MIT", "ED")).toBe(false);
  });
  it("Cornell accepts ED", () => {
    expect(schoolAcceptsPlan("Cornell", "ED")).toBe(true);
  });
  it("unknown school does not block", () => {
    expect(schoolAcceptsPlan("Tiny College", "ED")).toBe(true);
  });
});

describe("getSchoolPlanInfo", () => {
  it("returns info for known school", () => {
    expect(getSchoolPlanInfo("Harvard")?.plans).toContain("REA");
  });
  it("returns null for unknown school", () => {
    expect(getSchoolPlanInfo("ZZ College")).toBeNull();
  });
});

// The school list and Applications board pass catalog names ("Harvard
// University", "University of Michigan-Ann Arbor"), not the short plan keys.
describe("catalog school names", () => {
  it("finds plan info for catalog spellings", () => {
    expect(getSchoolPlanInfo("Harvard University")?.plans).toContain("REA");
    expect(getSchoolPlanInfo("Massachusetts Institute of Technology")).not.toBeNull();
    expect(getSchoolPlanInfo("University of Michigan-Ann Arbor")).not.toBeNull();
    expect(getSchoolPlanInfo("University of Michigan, Ann Arbor")).not.toBeNull();
    expect(getSchoolPlanInfo("University of Pennsylvania")).not.toBeNull();
    expect(getSchoolPlanInfo("Penn State University")).toBeNull();
  });

  it("flags an REA conflict using catalog names and keeps them in the message", () => {
    const r = checkREAConflict([
      { schoolName: "Harvard University", plan: "REA" },
      { schoolName: "Northwestern University", plan: "ED" },
    ]);
    expect(r.conflict).toBe(true);
    expect(r.reaSchool).toBe("Harvard University");
    expect(r.conflictingSchools).toEqual(["Northwestern University"]);
  });

  it("checks plan validity for catalog names", () => {
    expect(schoolAcceptsPlan("Northwestern University", "EA")).toBe(false);
  });
});
