// The legacy POST /api/cc/coach router had no callers; the Coach uses
// /api/cc/coach/message. It stays deleted, and nothing may call it.
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import { execSync } from "node:child_process";

describe("legacy /api/cc/coach route", () => {
  it("is deleted", () => {
    expect(fs.existsSync("src/app/api/cc/coach/route.ts")).toBe(false);
  });

  it("has no callers", () => {
    const files = execSync("git ls-files src", { encoding: "utf8" }).split("\n")
      .filter((f) => /\.(tsx?|jsx?)$/.test(f) && !f.includes("__tests__") && fs.existsSync(f));
    const callers = files.filter((f) => /api\/cc\/coach(?![/\w-])/.test(fs.readFileSync(f, "utf8")));
    expect(callers).toEqual([]);
  });
});
