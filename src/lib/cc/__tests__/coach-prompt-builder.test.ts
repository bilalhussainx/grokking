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
});
