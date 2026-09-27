import { describe, it, expect } from "vitest";
import sitemap from "../sitemap";
import manifest from "../manifest";
import robots from "../robots";
import { GET as llms } from "../llms.txt/route";
import { GET as llmsFull } from "../llms-full.txt/route";
import { retiredDestination } from "@/lib/retired-routes";

const COURSE_WORDS = /\b(courses?|lessons?|tutoring|leetcode)\b/i;

describe("SEO describes the admissions product", () => {
  it("sitemap lists no retired URL", () => {
    const paths = sitemap().map((e) => new URL(e.url).pathname);
    expect(paths.filter((p) => retiredDestination(p) !== null)).toEqual([]);
    expect(paths).toContain("/pricing");
  });
  it("manifest names the counselor, not courses", () => {
    const m = manifest();
    expect(`${m.name} ${m.description}`).not.toMatch(COURSE_WORDS);
    expect(m.description).toMatch(/college/i);
  });
  it("robots no longer mentions credentials", () => {
    expect(JSON.stringify(robots())).not.toContain("/credentials");
  });
  it.each([["llms.txt", llms], ["llms-full.txt", llmsFull]])("%s is about admissions", async (_n, get) => {
    const text = await (await get()).text();
    expect(text).toMatch(/college/i);
    expect(text).not.toMatch(/\/course\//);
    expect(text).not.toMatch(COURSE_WORDS);
  });
});
