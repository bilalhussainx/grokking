import { describe, it, expect } from "vitest";
import { retiredRefsInText, isLiveApiPath } from "./retired-links.helpers";

describe("retired-link guard helpers", () => {
  it("flags a call to an API route that no longer exists", () => {
    expect(isLiveApiPath("/api/ai/tts")).toBe(false);
    expect(isLiveApiPath("/api/bridges")).toBe(false);
  });
  it("accepts live API routes, including dynamic and truncated template paths", () => {
    expect(isLiveApiPath("/api/language/sarvam/stream")).toBe(true);
    expect(isLiveApiPath("/api/cc/essays/")).toBe(true);
    expect(isLiveApiPath("/api/interviews/plan")).toBe(true);
  });
  it("catches absolute kairoslearn URLs to retired pages", () => {
    expect(retiredRefsInText(`const u = "https://kairoslearn.com/courses";`)).toEqual(["/courses"]);
    expect(retiredRefsInText(`see https://www.kairoslearn.ai/course/python`)).toEqual(["/course/python"]);
  });
  it("catches dead API literals and ignores live ones", () => {
    expect(retiredRefsInText(`fetch("/api/ai/tts"); fetch(\`/api/cc/essays/\${id}\`)`)).toEqual(["/api/ai/tts"]);
  });
});
