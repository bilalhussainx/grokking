import { describe, it, expect } from "vitest";
import { detectMode } from "../coach-mode-detector";
import type { ProfileProgress } from "../coach-mode-detector";

describe("detectMode", () => {
  const emptyProgress: ProfileProgress = {
    hasIntakeCompleted: false,
    hasGPA: false,
    hasSchools: false,
    hasEssays: false,
    hasEssayReviewed: false,
    hasActivitiesOptimized: false,
    hasSupplementsStarted: false,
    hasInterviewSessions: false,
  };

  const fullProgress: ProfileProgress = {
    hasIntakeCompleted: true,
    hasGPA: true,
    hasSchools: true,
    hasEssays: true,
    hasEssayReviewed: true,
    hasActivitiesOptimized: true,
    hasSupplementsStarted: true,
    hasInterviewSessions: true,
  };

  it("returns intake when intake not completed", () => {
    expect(detectMode(emptyProgress, "/", "")).toBe("intake");
  });

  it("returns intake even if on another page when no profile", () => {
    expect(detectMode(emptyProgress, "/schools", "")).toBe("intake");
  });

  it("returns mode from explicit user request", () => {
    expect(detectMode(fullProgress, "/", "help me find schools")).toBe("school-builder");
    expect(detectMode(fullProgress, "/", "help me with my essay")).toBe("essay");
    expect(detectMode(fullProgress, "/", "prepare me for interviews")).toBe("interview");
  });

  it("returns page-based mode when on school pages", () => {
    expect(detectMode(fullProgress, "/schools", "what about this one")).toBe("school-browse");
    expect(detectMode(fullProgress, "/my-schools", "remove MIT")).toBe("school-browse");
  });

  it("returns essay mode on essay pages", () => {
    expect(detectMode(fullProgress, "/cc/essays", "")).toBe("essay");
  });

  it("returns interview mode on interview pages", () => {
    expect(detectMode(fullProgress, "/college-interviews", "")).toBe("interview");
  });

  it("returns general as default", () => {
    expect(detectMode(fullProgress, "/", "hello")).toBe("general");
  });

  // A missing GPA must not hijack unrelated questions with "what's your GPA?".
  describe("student with intake done but no GPA", () => {
    const noGpa = { ...emptyProgress, hasIntakeCompleted: true };

    it("answers an unrelated question in general mode", () => {
      expect(detectMode(noGpa, "/", "")).toBe("general");
      expect(detectMode(noGpa, "/", "When is the UCAS deadline for Oxford?")).toBe("general");
      expect(detectMode(noGpa, "/", "voice session start")).toBe("general");
      expect(detectMode(noGpa, "/cc/dashboard", "what should I do this week?")).toBe("general");
    });

    it("does not read everyday words as test names", () => {
      expect(detectMode(noGpa, "/", "I sat down with my mom to talk about cost")).toBe("general");
      expect(detectMode(noGpa, "/", "how should I act at a campus visit?")).toBe("general");
    });

    it("enters academic mode when the message is about grades or tests", () => {
      expect(detectMode(noGpa, "/", "my GPA is 3.7 unweighted")).toBe("academic");
      expect(detectMode(noGpa, "/", "how do my grades look?")).toBe("academic");
      expect(detectMode(noGpa, "/", "should I retake the SAT?")).toBe("academic");
      expect(detectMode(noGpa, "/", "I got a 33 on the ACT")).toBe("academic");
      expect(detectMode(noGpa, "/", "do I need test scores?")).toBe("academic");
    });

    it("enters academic mode when the student explicitly starts intake", () => {
      expect(detectMode(noGpa, "/", "let's start my intake")).toBe("academic");
      expect(detectMode(noGpa, "/", "Can we continue the intake questions?")).toBe("academic");
    });
  });
});
