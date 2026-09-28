// UCAS: "Applications for all 2027 entry undergraduate courses, except those
// with a 15 October deadline, should arrive at UCAS by 18:00 (UK time) on
// 13 January 2027" (ucas.com event page, checked 2026-09-27). The coach prompt
// must not name Oxford tests that were retired for 2027 entry.
import { describe, it, expect } from "vitest";
import fs from "node:fs";

describe("UK 2026-27 dates and tests", () => {
  it("the UCAS equal-consideration date is 13 January 2027", () => {
    const s = fs.readFileSync("src/data/uk/uk-school-deadlines-2026.json", "utf8");
    expect(s).not.toMatch(/2027-01-14|Jan 14/);
    expect(s).toMatch(/2027-01-13/);
  });
  it("nothing names the retired Oxford MAT/TSA", () => {
    for (const f of ["src/lib/cc/coach-prompt-builder.ts", "src/data/uk/uk-school-deadlines-2026.json"]) {
      expect(fs.readFileSync(f, "utf8")).not.toMatch(/\bMAT\b|\bTSA\b/);
    }
  });
});
