import { describe, it, expect } from "vitest";
import fs from "node:fs";
import { RETIRED_ROUTE_REDIRECTS, retiredDestination } from "../retired-routes";

describe("retired learning routes", () => {
  it.each([
    ["/course/python-fundamentals", "/"],
    ["/course/python-fundamentals/intro/exercise", "/"],
    ["/courses", "/"],
    ["/courses/languages", "/"],
    ["/talk", "/"],
    ["/pathways/software-engineer", "/"],
    ["/interviews/abc", "/cc/interview-prep"],
    ["/career/interviews", "/cc/interview-prep"],
    ["/dashboard", "/cc/dashboard"],
    ["/onboarding/language", "/onboarding"],
    ["/admin", "/admin/survey"],
    ["/admin/courses/new", "/admin/survey"],
    ["/verify/2", "/"],
    ["/landing", "/"],
  ])("%s redirects to %s", (path, dest) => {
    expect(retiredDestination(path)).toBe(dest);
  });

  it.each(["/cc/courses", "/college-interviews/x", "/admin/survey", "/onboarding", "/", "/coursework", "/cc/interview-prep"])(
    "%s is not retired",
    (path) => expect(retiredDestination(path)).toBeNull(),
  );

  it("every destination is itself live (no redirect chains)", () => {
    for (const r of RETIRED_ROUTE_REDIRECTS) expect(retiredDestination(r.destination)).toBeNull();
  });

  it("all redirects are temporary for the first release", () => {
    expect(RETIRED_ROUTE_REDIRECTS.every((r) => r.permanent === false)).toBe(true);
  });

  it("no page directory remains for a retired route", () => {
    const bases = [...new Set(RETIRED_ROUTE_REDIRECTS.map((r) => r.source.replace("/:path*", "")))].filter((b) => b !== "/admin");
    expect(bases.filter((b) => fs.existsSync(`src/app${b}`))).toEqual([]);
    expect(fs.existsSync("src/app/admin/page.tsx")).toBe(false);
  });
});
