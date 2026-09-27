// Small places where the UI told the student something untrue (live audit,
// 2026-09-25): a 43% rate shown as 0.43%, a promise that the coach drafts the
// transfer essay, a button that does nothing, a coach forced open over the
// school list, used-up invite codes shown as active, and a course form that
// assumed grade 11 / US.
import { describe, it, expect } from "vitest";
import fs from "node:fs";

const read = (f: string) => fs.readFileSync(f, "utf8");

describe("truthful UI", () => {
  it("interview prep shows acceptance rate as a percentage", () =>
    expect(read("src/app/cc/interview-prep/page.tsx")).not.toMatch(/\$\{school\.cc_schools\.acceptance_rate\}%/));

  it("transfer onboarding never promises the coach will draft the essay", () =>
    expect(read("src/app/onboarding/page.tsx")).not.toMatch(/will draft your transfer essay/i));

  it("Brainstorm has no Attach button that does nothing", () =>
    expect(read("src/components/cc/essay/BrainstormChat.tsx")).not.toMatch(/aria-label="Attach"/));

  it("the school list does not force the coach open on load", () =>
    expect(read("src/app/schools/page.tsx")).not.toMatch(/coachAutoOpened/));

  it("used-up invite codes are not shown as active", () =>
    expect(read("src/app/counselor/team/page.tsx")).toMatch(/usedCount\s*>=\s*c\.maxUses/));

  it("the course form offers a regular level and doesn't hard-code grade 11", () => {
    const s = read("src/app/cc/courses/page.tsx");
    expect(s).toMatch(/"Regular"/);
    expect(s).not.toMatch(/useState\(11\)/);
  });
});
