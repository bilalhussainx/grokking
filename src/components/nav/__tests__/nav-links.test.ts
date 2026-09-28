// Every sidebar and command-palette destination must be a real page. Master
// shipped "Settings" → /account/settings, which 404'd in production.
import { describe, it, expect } from "vitest";
import fs from "node:fs";

const SOURCES = ["src/components/nav/sidebar-data.ts", "src/components/nav/palette-data.ts", "src/components/mobile/MobileDrawer.tsx", "src/components/app-shell/app-nav.ts"];

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
