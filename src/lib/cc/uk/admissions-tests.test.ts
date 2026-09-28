// 2027-entry (2026-27 cycle) facts, from Oxford's admissions-tests page fetched
// 2026-09-27 (https://www.ox.ac.uk/admissions/undergraduate/applying/guide-for-applicants/admissions-tests):
// Oxford now uses UAT-UK tests (ESAT, TARA, TMUA) plus UCAT (Medicine) and
// LNAT (Law). The MAT, PAT, TSA, HAT and MLAT are no longer used. UAT-UK
// October booking closes 28 Sep 2026 18:00 UK; tests run 12-16 Oct 2026.
import { describe, it, expect } from "vitest";
import {
  getAdmissionsTest,
  testsForSchoolCourse,
  ALL_TEST_CODES,
} from "./admissions-tests";

describe("getAdmissionsTest", () => {
  it("returns TMUA metadata with the UAT-UK October booking deadline", () => {
    const t = getAdmissionsTest("TMUA");
    expect(t?.name).toBe("Test of Mathematics for University Admission");
    expect(t?.registration_deadline).toBe("2026-09-28");
  });
  it("returns null for unknown code", () => {
    expect(getAdmissionsTest("FAKE")).toBeNull();
  });
});

describe("testsForSchoolCourse", () => {
  it("Oxford Maths requires TMUA (not the retired MAT)", () => {
    const codes = testsForSchoolCourse("University of Oxford", "Mathematics").map((t) => t.code);
    expect(codes).toContain("TMUA");
    expect(codes).not.toContain("MAT");
  });
  it("Oxford Physics requires ESAT", () => {
    expect(testsForSchoolCourse("University of Oxford", "Physics").map((t) => t.code)).toContain("ESAT");
  });
  it("Oxford PPE requires TARA", () => {
    expect(testsForSchoolCourse("University of Oxford", "Philosophy, Politics and Economics").map((t) => t.code)).toContain("TARA");
  });
  it("Oxford Law requires LNAT", () => {
    const tests = testsForSchoolCourse("University of Oxford", "Law");
    expect(tests.map((t) => t.code)).toContain("LNAT");
  });
  it("Oxford Medicine requires UCAT", () => {
    expect(testsForSchoolCourse("University of Oxford", "Medicine").map((t) => t.code)).toContain("UCAT");
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
  it("lists the tests in use and none of the retired Oxford tests", () => {
    expect(ALL_TEST_CODES).toEqual(expect.arrayContaining(["LNAT", "TMUA", "ESAT", "TARA", "UCAT"]));
    for (const retired of ["MAT", "PAT", "TSA", "HAT", "MLAT"]) expect(ALL_TEST_CODES).not.toContain(retired);
  });
});
