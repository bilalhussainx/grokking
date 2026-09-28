// OUAC merged the 101 and 105 applications into one Undergraduate application
// with Group A (current Ontario high-school students) and Group B (everyone
// else); the base fee is $159 for 3 choices plus $51 per extra choice.
// Sources, fetched 2026-09-27: https://www.ouac.on.ca/guide/undergrad-guide/
// and https://www.ouac.on.ca/guide/undergrad-fees/
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import { execSync } from "node:child_process";
import { PLATFORMS } from "../application-platforms";

describe("OUAC 2026-27", () => {
  it("nothing tells students to pick the retired 101/105 forms", () => {
    const files = execSync("git ls-files src", { encoding: "utf8" }).split("\n")
      .filter((f) => /\.(ts|tsx|json)$/.test(f) && !f.includes("__tests__") && fs.existsSync(f));
    const hits = files.filter((f) => /OUAC\s*10[15]\b|\b101\/105\b/.test(fs.readFileSync(f, "utf8")));
    expect(hits).toEqual([]);
  });

  it("the platform explainer uses Group A/B and the current fee", () => {
    const text = PLATFORMS.OUAC.oneLineExplainer;
    expect(text).toMatch(/Group A/);
    expect(text).toMatch(/\$159/);
    expect(text).not.toMatch(/\$156/);
  });
});
