import { describe, it, expect } from "vitest";
import { essayTypeLabel } from "../essay-type-label";

describe("essayTypeLabel", () => {
  it.each([
    ["personal_statement", "Personal Statement"],
    ["supplemental", "School Supplemental"],
    ["scholarship", "Scholarship Essay"],
    ["why_us", "Why Us"],
    [null, "Essay"],
    ["", "Essay"],
  ])("%j → %s", (t, label) => expect(essayTypeLabel(t)).toBe(label));
});
