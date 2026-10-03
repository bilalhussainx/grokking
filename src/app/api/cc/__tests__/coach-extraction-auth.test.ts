// Coach extraction makes paid model calls and writes into a student's profile,
// academics and activities with the admin client. Only a route that has
// identified the signed-in user may trigger it, and it must never trust a
// student id sent by the client.
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const API_ROOT = path.join(__dirname, "..", "..");

function routeFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === "__tests__" ? [] : routeFiles(full);
    return e.name === "route.ts" ? [full] : [];
  });
}

const extractionRoutes = routeFiles(API_ROOT).filter((f) =>
  fs.readFileSync(f, "utf8").includes("runCoachExtraction"),
);

describe("routes that run Coach extraction", () => {
  it("exist (the guard is not vacuous)", () => {
    expect(extractionRoutes.length).toBeGreaterThan(0);
  });

  it.each(extractionRoutes.map((f) => [path.relative(API_ROOT, f)]))(
    "%s authenticates the caller and takes no student id from the request",
    (rel) => {
      const src = fs.readFileSync(path.join(API_ROOT, rel), "utf8");
      expect(src).toMatch(/auth\.getUser\(\)/);
      expect(src).not.toMatch(/\{\s*[^}]*\bstudent_id\b[^}]*\}\s*=\s*await\s+req\.json\(\)/);
    },
  );
});

// Source ranges of `if (... && !agentS1 && ...) { ... }` blocks.
function agentS1GuardedRanges(src: string): Array<[number, number]> {
  const ranges: Array<[number, number]> = [];
  for (const m of src.matchAll(/if\s*\(([^()]*)\)\s*\{/g)) {
    if (!m[1].split("&&").some((c) => c.trim() === "!agentS1")) continue;
    let depth = 0;
    let i = m.index! + m[0].length - 1;
    for (; i < src.length; i++) {
      if (src[i] === "{") depth++;
      else if (src[i] === "}" && --depth === 0) break;
    }
    ranges.push([m.index!, i]);
  }
  return ranges;
}

describe.each(["cc/coach/message/route.ts", "cc/coach/voice-turn/route.ts"])("legacy writer %s for S1 users", (rel) => {
  const src = fs.readFileSync(path.join(API_ROOT, rel), "utf8");
  const ranges = agentS1GuardedRanges(src);
  const inGuard = (i: number) => ranges.some(([a, b]) => i > a && i < b);
  const calls = (name: string) => [...src.matchAll(new RegExp(`\\b${name}\\(`, "g"))].map((m) => m.index!);

  it("derives the guard from the signed-in user's flag", () => {
    expect(src).toMatch(/const agentS1 = isAgentS1User\(user\.id\);/);
  });

  it("runs every runCoachExtraction( inside an !agentS1 block", () => {
    expect(calls("runCoachExtraction").length).toBeGreaterThan(0);
    for (const i of calls("runCoachExtraction")) expect(inGuard(i), `runCoachExtraction at offset ${i}`).toBe(true);
  });

  it("parses <<actions>> only behind the guard", () => {
    expect(calls("parseActionsBlock").length).toBeGreaterThan(0);
    for (const i of calls("parseActionsBlock")) {
      const ternary = /agentS1\s*\?\s*null\s*:\s*$/.test(src.slice(Math.max(0, i - 40), i));
      expect(inGuard(i) || ternary, `parseActionsBlock at offset ${i}`).toBe(true);
    }
  });
});
