// providers.tsx only needs to know whether a /course/<slug> is a language
// course. Importing the full language library for that shipped ~1.5 MB of
// lesson source (bundled with the course catalogue) to every page.
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import { languageCourses } from "../index";
import { LANGUAGE_COURSE_SLUGS, isLanguageCourseSlug } from "../slugs";

describe("language course slugs", () => {
  it("lists exactly the slugs of the language courses", () => {
    expect([...LANGUAGE_COURSE_SLUGS].sort()).toEqual(languageCourses.map((c) => c.slug).sort());
  });
  it("answers membership", () => {
    expect(isLanguageCourseSlug(languageCourses[0].slug)).toBe(true);
    expect(isLanguageCourseSlug("python-fundamentals")).toBe(false);
  });
  it("the global providers don't import the language library", () => {
    const src = fs.readFileSync("src/app/providers.tsx", "utf8");
    expect(src).not.toMatch(/from "@\/data\/languages"/);
  });
});
