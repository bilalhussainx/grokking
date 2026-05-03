import { describe, it, expect } from "vitest";
import {
  relevantScholarships,
  getScholarship,
  ALL_SCHOLARSHIP_NAMES,
} from "./scholarships";

describe("relevantScholarships", () => {
  it("Pakistani student applying to Oxford gets Saïd + Reach Oxford + HEC", () => {
    const scholarships = relevantScholarships({
      country: "PK",
      schoolsApplying: ["University of Oxford"],
      level: "undergraduate",
    });
    const names = scholarships.map((s) => s.name);
    expect(names).toContain("Saïd Foundation Scholarships");
    expect(names).toContain("Reach Oxford Scholarship");
    expect(names).toContain("Pakistan HEC Need-Based Scholarship");
  });

  it("non-Pakistani student does NOT get pakistani-only awards (Saïd, HEC)", () => {
    const scholarships = relevantScholarships({
      country: "IN",
      schoolsApplying: ["University of Oxford"],
      level: "undergraduate",
    });
    const names = scholarships.map((s) => s.name);
    expect(names).not.toContain("Saïd Foundation Scholarships");
    expect(names).not.toContain("Pakistan HEC Need-Based Scholarship");
  });

  it("undergraduate student does NOT get graduate-only awards (Chevening, Commonwealth Shared)", () => {
    const scholarships = relevantScholarships({
      country: "PK",
      schoolsApplying: ["University of Cambridge"],
      level: "undergraduate",
    });
    const names = scholarships.map((s) => s.name);
    expect(names).not.toContain("Chevening Scholarship");
    expect(names).not.toContain("Commonwealth Shared Scholarship");
  });

  it("filters by school — student applying only to LSE doesn't get Oxford-only awards", () => {
    const scholarships = relevantScholarships({
      country: "PK",
      schoolsApplying: ["London School of Economics and Political Science"],
      level: "undergraduate",
    });
    const names = scholarships.map((s) => s.name);
    expect(names).not.toContain("Reach Oxford Scholarship");
    expect(names).toContain("LSE Undergraduate Support Scheme");
  });
});

describe("getScholarship", () => {
  it("returns Saïd Foundation by name", () => {
    expect(getScholarship("Saïd Foundation Scholarships")?.coverage).toContain("Full tuition");
  });
  it("returns null for unknown name", () => {
    expect(getScholarship("Imaginary Award")).toBeNull();
  });
});

describe("ALL_SCHOLARSHIP_NAMES", () => {
  it("includes the headline awards", () => {
    expect(ALL_SCHOLARSHIP_NAMES).toContain("Saïd Foundation Scholarships");
    expect(ALL_SCHOLARSHIP_NAMES).toContain("Reach Oxford Scholarship");
  });
});
