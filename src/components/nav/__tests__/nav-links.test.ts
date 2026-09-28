// Every sidebar and command-palette destination must be a real page. Master
// shipped "Settings" → /account/settings, which 404'd in production.
import { describe, it, expect } from "vitest";
import fs from "node:fs";

const SOURCES = [
  "src/components/nav/palette-data.ts", "src/components/app-shell/app-nav.ts", "src/components/app-shell/AppFrame.tsx",
  "src/app/cc/dashboard/today-model.ts", "src/components/cc/today/GradeQuestion.tsx",
];

function pageExists(href: string): boolean {
  const path = href.split(/[?#]/)[0];
  const file = path === "/" ? "src/app/page.tsx" : `src/app${path}/page.tsx`;
  return fs.existsSync(file);
}

function internalHrefs(source: string): string[] {
  return [...source.matchAll(/href(?::\s*|=)"([^"]+)"/g)]
    .map((m) => m[1])
    .filter((h) => h.startsWith("/"));
}

describe("nav destinations", () => {
  it("flags a destination with no page", () => {
    expect(pageExists("/account/settings")).toBe(false);
  });

  it("every sidebar and palette href resolves to a page", () => {
    const missing = SOURCES.flatMap((file) => internalHrefs(fs.readFileSync(file, "utf8"))).filter((h) => !pageExists(h));
    expect(missing).toEqual([]);
  });
});
