import { describe, it, expect } from "vitest";
import { INTAKE_QUESTIONS, nextAskableIndex, parseInternationalStatus } from "../intake-questions";

describe("INTAKE_QUESTIONS", () => {
  it("has the expected question ids in order", () => {
    const ids = INTAKE_QUESTIONS.map((q) => q.id);
    expect(ids).toEqual([
      "name_grade",
      "location",
      "home_language",
      "first_gen",
      "parents_education",
      "international_status",
      "citizenship_status",
      "worries",
      "schools_interest",
    ]);
  });

  it("parents_education is optional and has 5 options", () => {
    const q = INTAKE_QUESTIONS.find((x) => x.id === "parents_education")!;
    expect(q.required).toBe(false);
    expect(q.options).toHaveLength(5);
  });

  it("citizenship_status uses the shared citizenship option set", () => {
    const q = INTAKE_QUESTIONS.find((x) => x.id === "citizenship_status")!;
    expect(q.options).toContain("US Citizen");
    expect(q.options).toContain("International");
  });
});

describe("nextAskableIndex", () => {
  it("skips parents_education when first_gen is no", () => {
    const fields = { first_gen: "No" };
    const next = nextAskableIndex(3, fields);
    // after first_gen (index 3), skip parents_education (4), land on international_status (5)
    expect(next).toBe(5);
  });

  it("asks parents_education when first_gen is yes", () => {
    const fields = { first_gen: "Yes" };
    expect(nextAskableIndex(3, fields)).toBe(4);
  });

  it("asks parents_education when first_gen is not sure", () => {
    const fields = { first_gen: "Not sure" };
    expect(nextAskableIndex(3, fields)).toBe(4);
  });

  it("skips international_status + citizenship_status when country is US", () => {
    const fields = { first_gen: "No", location: "Boston, MA" };
    // from parents_education (4), skip intl (5), skip citizenship (6), land on worries (7)
    expect(nextAskableIndex(4, fields)).toBe(7);
  });

  it("skips international_status + citizenship_status when country is CA", () => {
    const fields = { first_gen: "No", location: "Toronto, Canada" };
    expect(nextAskableIndex(4, fields)).toBe(7);
  });

  it("asks international_status when country is not US/CA", () => {
    const fields = { first_gen: "Yes", location: "Lahore, Pakistan" };
    // from parents_education (4), ask international_status (5)
    expect(nextAskableIndex(4, fields)).toBe(5);
  });

  it("skips citizenship_status when international_status is no", () => {
    const fields = { location: "Lahore, Pakistan", international_status: "No" };
    // from international_status (5), skip citizenship_status (6), land on worries (7)
    expect(nextAskableIndex(5, fields)).toBe(7);
  });

  it("asks citizenship_status when international_status is yes", () => {
    const fields = { location: "Lahore, Pakistan", international_status: "Yes" };
    expect(nextAskableIndex(5, fields)).toBe(6);
  });

  it("returns -1 when there are no more askable questions", () => {
    const fields = { first_gen: "No", location: "Boston, MA" };
    expect(nextAskableIndex(8, fields)).toBe(-1); // past schools_interest
  });
});

describe("parseInternationalStatus", () => {
  it("returns true for yes", () => {
    expect(parseInternationalStatus("Yes")).toBe(true);
    expect(parseInternationalStatus("yes I am")).toBe(true);
  });
  it("returns false for no", () => {
    expect(parseInternationalStatus("No")).toBe(false);
    expect(parseInternationalStatus("no, not international")).toBe(false);
  });
  it("returns null for unknown", () => {
    expect(parseInternationalStatus("uh idk")).toBeNull();
  });
});
