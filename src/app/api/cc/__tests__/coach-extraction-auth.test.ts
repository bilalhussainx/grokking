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

it("the legacy message route skips actions and extraction for S1 users", () => {
  const src = fs.readFileSync(path.join(API_ROOT, "cc/coach/message/route.ts"), "utf8");
  expect(src).toMatch(/isAgentS1User\(user\.id\)/);
});
