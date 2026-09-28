import { describe, it, expect } from "vitest";
import { execSync } from "node:child_process";
import fs from "node:fs";
import { findRetiredReferences } from "./retired-links.helpers";

const SHELL = [
  "src/app/providers.tsx", "src/components/layout/TopNav.tsx", "src/components/marketing/daybreak/DaybreakFooter.tsx",
  "src/app/settings/page.tsx", "src/components/nav/sidebar-data.ts", "src/components/nav/palette-data.ts",
  "src/components/app-shell/app-nav.ts", "src/components/app-shell/AppFrame.tsx",
];

describe("retired learning links", () => {
  it("the app shell links to no retired page or API", () => {
    expect(findRetiredReferences(SHELL)).toEqual([]);
  });

  it("no shipped source links to a retired page or API", () => {
    const files = execSync("git ls-files src", { encoding: "utf8" }).split("\n")
      .filter((f) => /\.(ts|tsx|json)$/.test(f) && fs.existsSync(f) && !/__tests__|\.test\.|retired-routes\.ts$/.test(f));
    expect(findRetiredReferences(files)).toEqual([]);
  });

  it("admissions coursework survives", () => {
    expect(fs.existsSync("src/app/cc/courses/page.tsx")).toBe(true);
  });
});
