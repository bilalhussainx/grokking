import { describe, it, expect } from "vitest";
import { buildSystemPrompt, type CoachContext } from "../coach-prompt-builder";

describe("buildSystemPrompt", () => {
  const baseContext: CoachContext = {
    mode: "general",
    studentName: "Alex",
    grade: 11,
    country: "US",
    state: "CA",
    isInternational: false,
    isFirstGen: false,
    gpaUnweighted: 3.8,
    gpaRawDisplay: null,
    testStrategy: "SAT",
    satTotal: 1450,
    actComposite: null,
    schoolCount: 5,
    schoolSummary: "2 reach, 2 match, 1 safety",
    hasIntakeCompleted: true,
    hasGPA: true,
    hasSchools: true,
    hasEssays: false,
    hasEssayReviewed: false,
    hasActivitiesOptimized: false,
    hasSupplementsStarted: false,
    hasInterviewSessions: false,
    latestEssayReview: null,
    preferences: null,
    focusEssay: null,
    applicationSnapshot: null,
    affordabilityValue: null,
    needsFullAid: false,
  };

  it("includes personality guidelines", () => {
    const prompt = buildSystemPrompt(baseContext);
    expect(prompt).toContain("Coach Kairos");
    expect(prompt).toContain("casual, warm");
  });

  it("includes student profile data", () => {
    const prompt = buildSystemPrompt(baseContext);
    expect(prompt).toContain("Alex");
    expect(prompt).toContain("3.8");
    expect(prompt).toContain("CA");
  });

  it("includes intake instructions when mode is intake", () => {
    const ctx: CoachContext = { ...baseContext, mode: "intake", hasIntakeCompleted: false, studentName: null };
    const prompt = buildSystemPrompt(ctx);
    expect(prompt).toContain("name");
    expect(prompt).toContain("grade");
  });

  it("includes school-builder instructions when mode is school-builder", () => {
    const ctx: CoachContext = { ...baseContext, mode: "school-builder" };
    const prompt = buildSystemPrompt(ctx);
    expect(prompt).toContain("financial");
    expect(prompt).toContain("region");
  });

  it("includes GPA conversion note for international students without GPA", () => {
    const ctx: CoachContext = { ...baseContext, mode: "academic", country: "PK", isInternational: true, gpaUnweighted: null, hasGPA: false };
    const prompt = buildSystemPrompt(ctx);
    expect(prompt).toContain("grading system");
    expect(prompt).toContain("convert");
  });

  it("suggests next step in general mode", () => {
    const ctx: CoachContext = { ...baseContext, hasEssays: false };
    const prompt = buildSystemPrompt(ctx);
    expect(prompt).toContain("essay");
  });

  it("surfaces full-aid guidance in school-builder when needsFullAid is true", () => {
    const ctx: CoachContext = {
      ...baseContext,
      mode: "school-builder",
      affordabilityValue: "zero",
      needsFullAid: true,
      isInternational: true,
      country: "PK",
    };
    const prompt = buildSystemPrompt(ctx);
    expect(prompt).toContain("CSS Profile");
    expect(prompt).toContain("need-blind");
    expect(prompt).toMatch(/MIT|Harvard|Yale|Princeton|Amherst/);
  });

  it("excludes full-aid guidance in school-builder when needsFullAid is false", () => {
    const ctx: CoachContext = {
      ...baseContext,
      mode: "school-builder",
      affordabilityValue: "30k_50k",
      needsFullAid: false,
    };
    const prompt = buildSystemPrompt(ctx);
    expect(prompt).not.toContain("need-blind for international");
    expect(prompt).not.toContain("CSS Profile");
  });

  it("includes affordability context in the profile summary when needsFullAid is true", () => {
    const ctx: CoachContext = {
      ...baseContext,
      affordabilityValue: "zero",
      needsFullAid: true,
    };
    const prompt = buildSystemPrompt(ctx);
    expect(prompt).toContain("$0");
    expect(prompt.toLowerCase()).toContain("full financial aid");
  });
});
