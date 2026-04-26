import { describe, it, expect } from "vitest";
import { detectReuse, wordCount, wordCountColor } from "../reuse-detector";

describe("detectReuse", () => {
  it("flags school-leakage (Stanford essay mentions MIT)", () => {
    const f = detectReuse(
      "I love MIT's hands-on culture and the way it pairs theory with making.",
      "Stanford",
      [],
    );
    expect(f.schoolLeakageDetected).toBe("MIT");
    expect(f.flagged).toBe(true);
  });
  it("does not flag own school name", () => {
    const f = detectReuse(
      "I love MIT's hands-on culture and the way it pairs theory with making.",
      "MIT",
      [],
    );
    expect(f.schoolLeakageDetected).toBeNull();
    expect(f.flagged).toBe(false);
  });
  it("does not match 'admit' as MIT", () => {
    const f = detectReuse(
      "If admitted I would commit to research immediately.",
      "Yale",
      [],
    );
    expect(f.schoolLeakageDetected).toBeNull();
  });
  it("flags high token overlap with another essay", () => {
    const a = "I built a violin program at my school that taught fifty students traditional South Asian music over three years and raised four thousand dollars in scholarships.";
    const b = "I built a violin program at my school that taught fifty students traditional South Asian music over three years and raised four thousand dollars in scholarships and reached more.";
    const f = detectReuse(a, "Yale", [{ id: "other-1", school_name: "Brown", current_draft: b }]);
    expect(f.reuseScore).toBeGreaterThan(0.55);
    expect(f.flagged).toBe(true);
    expect(f.topMatchEssayId).toBe("other-1");
  });
  it("does not flag distinct content", () => {
    const a = "My grandmother's hands taught me to roll dough on a Tuesday afternoon when I was seven years old.";
    const b = "Building a robotics team in eleventh grade taught me how to negotiate with skeptical teachers.";
    const f = detectReuse(a, "Yale", [{ id: "other", school_name: "Brown", current_draft: b }]);
    expect(f.reuseScore).toBeLessThan(0.5);
    expect(f.flagged).toBe(false);
  });
});

describe("wordCount", () => {
  it("counts words", () => {
    expect(wordCount("hello world")).toBe(2);
    expect(wordCount("  hello  world  ")).toBe(2);
    expect(wordCount("")).toBe(0);
    expect(wordCount(null)).toBe(0);
  });
});

describe("wordCountColor", () => {
  it("green near limit", () => {
    expect(wordCountColor(248, 250)).toBe("green");
  });
  it("red over limit", () => {
    expect(wordCountColor(265, 250)).toBe("red");
  });
  it("amber under target", () => {
    expect(wordCountColor(50, 250)).toBe("amber");
  });
  it("green when no limit", () => {
    expect(wordCountColor(500, null)).toBe("green");
  });
});
