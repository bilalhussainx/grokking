// Guard: shipped copy must tell one plan story (src/lib/pricing.ts) and one
// language count (src/lib/coach-language-claim.ts). Scans shipped source, not tests.
import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { PRICING, TRIAL_TERMS } from "@/lib/pricing";
import { COACH_LANGUAGE_COUNT } from "@/lib/coach-language-claim";

const ROOT = join(__dirname, "..", "..", "..");
const SCAN_DIRS = ["src/app", "src/components", "src/lib"];

// In-app free-tier enforcement copy (the tier matrix in tier-gate.ts and the
// upgrade modal that mirrors it). Not marketing; the controller decides whether
// these caps change. Listed so the guard stays honest about what it skips.
const SKIP = new Set([
  "src/lib/cc/tier-gate.ts",
  "src/components/upgrade/UpgradeModal.tsx",
]);

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "__tests__" || name.startsWith(".")) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(name) && !/\.test\.(ts|tsx)$/.test(name)) out.push(p);
  }
  return out;
}

// Comment-only lines (cost notes, rationale) are not shipped copy.
function stripComments(text: string): string {
  return text
    .split("\n")
    .map((l) => (/^\s*(\/\/|\/\*|\*)/.test(l) ? "" : l))
    .join("\n");
}

const FILES = SCAN_DIRS.flatMap((d) => walk(join(ROOT, d)))
  .map((p) => ({ path: relative(ROOT, p).split(sep).join("/"), text: stripComments(readFileSync(p, "utf8")) }))
  .filter((f) => !SKIP.has(f.path));

function hits(re: RegExp): string[] {
  const found: string[] = [];
  for (const f of FILES) {
    f.text.split("\n").forEach((line, i) => {
      if (re.test(line)) found.push(`${f.path}:${i + 1}: ${line.trim().slice(0, 120)}`);
    });
  }
  return found;
}

describe("one plan story", () => {
  const BANNED: [string, RegExp][] = [
    ["Free forever", /free forever/i],
    ["$0 forever", /\$0\s*(<[^>]*>)?\s*forever|>\s*forever\s*</i],
    ["unlimited everything", /unlimited everything/i],
    ["3 schools", /first (3|three) schools|["'`]3 schools["'`]|three schools and one essay/i],
    ["1 essay draft", /\b1 essay draft/i],
    ["3 voice sessions", /\b3 voice sessions/i],
    ["English only (plan row)", /["'`]English only["'`]/],
    ["1 mock", /\b1 mock\b/i],
    ["access to all courses", /all courses/i],
    ["continue learning", /continue learning/i],
    ["ambiguous trial button", /Start Pro free|Start Pro —|Start Pro yearly/],
    ["old trial line", /Free 7-day trial\. No card/i],
  ];
  it.each(BANNED)("no shipped source says %s", (_name, re) => {
    expect(hits(re)).toEqual([]);
  });

  it("states only the two Pro prices (15 and 99) next to a billing period", () => {
    const priceRe = /\$\s?(\d+(?:\.\d+)?)\s*(?:USD)?\s*(?:\/|per\s+|a\s+)\s*(?:month|mo\b|year|yr\b)/gi;
    const bad: string[] = [];
    for (const f of FILES) {
      for (const m of f.text.matchAll(priceRe)) {
        const n = Number(m[1]);
        if (n !== PRICING.pro.monthlyUsd && n !== PRICING.pro.yearlyUsd) bad.push(`${f.path}: ${m[0]}`);
      }
    }
    expect(bad).toEqual([]);
  });

  it("does not hard-code the Pro prices in page copy", () => {
    // `$15/month` or `$99/year` literals belong in pricing.ts only.
    const literal = /\$\s?(15|99)\s*(?:USD)?\s*(?:\/|per\s+)\s*(?:month|year)/i;
    const offenders = FILES.filter((f) => f.path !== "src/lib/pricing.ts" && literal.test(f.text)).map((f) => f.path);
    expect(offenders).toEqual([]);
  });

  it("the trial sentence is honest: no card, paying is optional", () => {
    expect(TRIAL_TERMS).toMatch(/7-day/);
    expect(TRIAL_TERMS).toMatch(/no card/i);
    expect(TRIAL_TERMS).toMatch(/only starts if you (choose to )?subscribe/i);
  });

  it("pricing, faq, terms and signup render the shared trial sentence or numbers from pricing.ts", () => {
    const get = (p: string) => FILES.find((f) => f.path === p)!.text;
    for (const p of ["src/app/pricing/page.tsx", "src/lib/faq-items.ts", "src/app/terms/page.tsx"]) {
      expect(get(p), p).toMatch(/PRICING|proMonthlyLabel|TRIAL_TERMS/);
    }
  });
});
