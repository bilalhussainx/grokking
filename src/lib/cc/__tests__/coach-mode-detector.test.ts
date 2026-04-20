import { describe, it, expect } from "vitest";
import { detectMode } from "../coach-mode-detector";
import type { ProfileProgress } from "../coach-mode-detector";

describe("detectMode", () => {
  const emptyProgress: ProfileProgress = {
    hasIntakeCompleted: false,
    hasGPA: false,
    hasSchools: false,
    hasEssays: false,
    hasInterviewSessions: false,
  };

  const fullProgress: ProfileProgress = {
    hasIntakeCompleted: true,
    hasGPA: true,
    hasSchools: true,
    hasEssays: true,
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

  it("returns academic when GPA missing and intake done", () => {
    const progress = { ...emptyProgress, hasIntakeCompleted: true };
    expect(detectMode(progress, "/", "")).toBe("academic");
  });
});
