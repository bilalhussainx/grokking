import { describe, it, expect } from "vitest";
import fs from "node:fs";

const KEEP = new Set([
  "__tests__", "college-interviewer-personas.ts", "interview-personas.ts", "school-application-plans.json",
  "school-deadlines-2026.json", "supplement-prompts-2026.json", "canadian", "uk", "cc",
]);

describe("src/data holds only admissions data", () => {
  it("nothing outside the keep-set", () => {
    expect(fs.readdirSync("src/data").filter((f) => !KEEP.has(f))).toEqual([]);
  });
  it("the admissions data is all still there", () => {
    expect([...KEEP].filter((f) => !fs.existsSync(`src/data/${f}`))).toEqual([]);
  });
});
