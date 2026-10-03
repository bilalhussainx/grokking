// Guard: the site claims one Coach Kairos language count
// (src/lib/coach-language-claim.ts). Scans shipped source, not tests.
import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { COACH_LANGUAGE_COUNT } from "@/lib/coach-language-claim";

const ROOT = join(__dirname, "..", "..", "..");
const SCAN_DIRS = ["src/app", "src/components", "src/lib"];

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "__tests__" || name.startsWith(".")) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(name) && !/\.test\.(ts|tsx)$/.test(name)) out.push(p);
  }
  return out;
}

const FILES = SCAN_DIRS.flatMap((d) => walk(join(ROOT, d))).map((p) => ({
  path: relative(ROOT, p).split(sep).join("/"),
  text: readFileSync(p, "utf8"),
}));

// Provider routing and persona code lists real per-provider language groups;
// those are engineering facts, not marketing claims.
const ENGINEERING = /^src\/lib\/(cc\/coach-languages|voice-provider-router|language-)/;

describe("one language count", () => {
  it("is 18", () => expect(COACH_LANGUAGE_COUNT).toBe(18));

  it("no shipped copy claims a different number of languages", () => {
    const claim = /\b(\d+)\+?\s*(?:more\s+)?(?:coach\s+)?languages\b/gi;
    const bad: string[] = [];
    for (const f of FILES) {
      if (ENGINEERING.test(f.path)) continue;
      f.text.split("\n").forEach((line, i) => {
        if (/^\s*(\/\/|\/\*|\*)/.test(line)) return;
        for (const m of line.matchAll(claim)) {
          if (Number(m[1]) !== COACH_LANGUAGE_COUNT) bad.push(`${f.path}:${i + 1}: ${m[0]}`);
        }
        if (/\b\d+ (more|langs)\b|\band \d+ more\b/i.test(line) && /language|hindi|punjabi/i.test(line)) {
          bad.push(`${f.path}:${i + 1}: ${line.trim().slice(0, 100)}`);
        }
      });
    }
    expect(bad).toEqual([]);
  });

  it("copy that states the count reads it from the shared constant", () => {
    const hardcoded = FILES.filter((f) => !ENGINEERING.test(f.path) && f.path !== "src/lib/coach-language-claim.ts")
      .filter((f) => f.text.split("\n").some((l) => !/^\s*(\/\/|\/\*|\*)/.test(l) && /\b18\s+(coach\s+)?languages\b/i.test(l)));
    expect(hardcoded.map((f) => f.path)).toEqual([]);
  });
});
