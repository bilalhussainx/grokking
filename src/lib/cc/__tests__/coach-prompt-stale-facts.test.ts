import { it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

// Facts the Coach states must be checked or absent (Oct 3 review). These were
// wrong or outdated: Saïd Foundation scholarships are not for Pakistani
// undergraduates, and COPA/SAQ are retired Cambridge forms.
it("the Coach prompt carries none of the removed stale facts", () => {
  const src = fs.readFileSync(path.join(__dirname, "..", "coach-prompt-builder.ts"), "utf8");
  for (const stale of ["Saïd", "SAÏD", "COPA", "Self-Assessment Questionnaire", "£28.50", "101/105"]) {
    expect(src).not.toContain(stale);
  }
});
