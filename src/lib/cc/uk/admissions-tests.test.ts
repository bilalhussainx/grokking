import { describe, it, expect } from "vitest";
import {
  getAdmissionsTest,
  testsForSchoolCourse,
  ALL_TEST_CODES,
} from "./admissions-tests";

describe("getAdmissionsTest", () => {
  it("returns MAT metadata", () => {
    const t = getAdmissionsTest("MAT");
    expect(t?.name).toBe("Mathematics Admissions Test");
    expect(t?.applies_to.length).toBeGreaterThan(0);
  });
  it("returns null for unknown code", () => {
    expect(getAdmissionsTest("FAKE")).toBeNull();
  });
});

describe("testsForSchoolCourse", () => {
  it("Oxford Maths requires MAT", () => {
    const tests = testsForSchoolCourse("University of Oxford", "Maths");
    expect(tests.map((t) => t.code)).toContain("MAT");
  });
  it("Oxford Law requires LNAT", () => {
    const tests = testsForSchoolCourse("University of Oxford", "Law");
    expect(tests.map((t) => t.code)).toContain("LNAT");
  });
  it("Cambridge Engineering requires ESAT", () => {
    const tests = testsForSchoolCourse("University of Cambridge", "Engineering");
    expect(tests.map((t) => t.code)).toContain("ESAT");
  });
  it("Cambridge Medicine requires UCAT", () => {
    const tests = testsForSchoolCourse("University of Cambridge", "Medicine");
    expect(tests.map((t) => t.code)).toContain("UCAT");
  });
  it("Edinburgh History requires no test", () => {
    expect(testsForSchoolCourse("University of Edinburgh", "History")).toEqual([]);
  });
});

describe("ALL_TEST_CODES", () => {
  it("includes the 9 known tests", () => {
    expect(ALL_TEST_CODES).toEqual(
      expect.arrayContaining(["MAT", "PAT", "LNAT", "TMUA", "ESAT", "TSA", "HAT", "UCAT", "MLAT"]),
    );
  });
});
