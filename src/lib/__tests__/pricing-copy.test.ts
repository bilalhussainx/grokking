// src/lib/__tests__/pricing-copy.test.ts
// Prices and credit amounts come from src/lib/pricing.ts. This fails if any
// app/component/lib file still advertises the pre-2026-09-25 pricing.
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { PRICING, proMonthlyLabel, proYearlyLabel, yearlySavingsPct } from "../pricing";

const ROOTS = ["src/app", "src/components", "src/lib"];
const SKIP = [path.join("src", "lib", "__tests__"), path.join("src", "data")];
const STALE = [/\$12\b/, /\b300 credits\b/i, /\b300 Credits\b/, /30[- ]day (free )?(pro )?trial/i, /one month(,)? free/i, /1 month Pro/i];

function files(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    if (SKIP.some((s) => p.startsWith(s))) return [];
    if (d.isDirectory()) return files(p);
    return /\.(tsx?|mdx?)$/.test(d.name) ? [p] : [];
  });
}

describe("pricing", () => {
  it("has the 2026-09-25 numbers", () => {
    expect(PRICING).toEqual({ free: { signupCredits: 200 }, pro: { monthlyUsd: 15, yearlyUsd: 99, trialDays: 7 } });
    expect(proMonthlyLabel()).toBe("$15/month");
    expect(proYearlyLabel()).toBe("$99/year");
    expect(yearlySavingsPct()).toBe(45);
  });

  it("no source file advertises the old pricing", () => {
    const hits = ROOTS.flatMap(files).flatMap((f) => {
      const src = fs.readFileSync(f, "utf8");
      return STALE.filter((re) => re.test(src)).map((re) => `${f}: ${re}`);
    });
    expect(hits).toEqual([]);
  });
});
