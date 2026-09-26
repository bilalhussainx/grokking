// "use client" must be the first statement in a file (comments allowed
// above it) or Next.js fails the build. A scripted import insertion once
// put an import above it; tsc and vitest didn't notice, the build did.
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

function files(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return d.name === "__tests__" || p === path.join("src", "data") ? [] : files(p); // src/data holds lesson text quoting directives
    return /\.tsx?$/.test(d.name) ? [p] : [];
  });
}

describe('"use client" placement', () => {
  it("is the first statement wherever it appears", () => {
    const bad = files("src").filter((f) => {
      const lines = fs.readFileSync(f, "utf8").split(/\r?\n/);
      const idx = lines.findIndex((l) => /^\s*["']use client["'];?\s*$/.test(l));
      if (idx < 0) return false;
      return lines.slice(0, idx).some((l) => l.trim() && !/^\s*(\/\/|\/\*|\*)/.test(l));
    });
    expect(bad).toEqual([]);
  });
});
