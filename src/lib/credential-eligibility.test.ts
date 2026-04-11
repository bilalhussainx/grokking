import { describe, it, expect } from "vitest";
import { computeEligibility } from "./credential-eligibility";
import type { DiplomaCriteriaContext } from "@/data/credentials/types";

const baseCtx = (overrides: Partial<DiplomaCriteriaContext> = {}): DiplomaCriteriaContext => ({
  userId: "user-1",
  mocks: [],
  courseCompletions: [],
  ...overrides,
});

describe("computeEligibility", () => {
  it("returns all 11 diplomas with eligible=false for an empty context", () => {
    const results = computeEligibility(baseCtx());
    expect(results).toHaveLength(11);
    for (const r of results) {
      expect(r.eligible).toBe(false);
      expect(r.reason).toBeTruthy();
      expect(r.diplomaId).toBeTruthy();
    }
  });

  it("marks coding-interview-foundations eligible when course complete + 5 qualifying mocks avg >= 75", () => {
    const ctx = baseCtx({
      courseCompletions: [{ ref_id: "coding-interview-patterns", created_at: "2026-04-01T00:00:00Z" }],
      mocks: Array.from({ length: 5 }, (_, i) => ({
        problem_slug: `coding-interview-pattern-${i}`,
        score: 80,
        created_at: "2026-04-01T00:00:00Z",
      })),
    });
    const r = computeEligibility(ctx).find((x) => x.diplomaId === "coding-interview-foundations");
    expect(r?.eligible).toBe(true);
    expect(r?.evidence).toBeDefined();
  });

  it("keeps coding-interview-foundations ineligible when course missing", () => {
    const ctx = baseCtx({
      mocks: Array.from({ length: 5 }, (_, i) => ({
        problem_slug: `coding-interview-pattern-${i}`,
        score: 80,
        created_at: "2026-04-01T00:00:00Z",
      })),
    });
    const r = computeEligibility(ctx).find((x) => x.diplomaId === "coding-interview-foundations");
    expect(r?.eligible).toBe(false);
  });

  it("marks google-swe-mock-mastery eligible with 10 google mocks avg >= 80", () => {
    const ctx = baseCtx({
      mocks: Array.from({ length: 10 }, (_, i) => ({
        problem_slug: `google-interview-${i}`,
        score: 85,
        created_at: "2026-04-01T00:00:00Z",
      })),
    });
    const r = computeEligibility(ctx).find((x) => x.diplomaId === "google-swe-mock-mastery");
    expect(r?.eligible).toBe(true);
  });

  it("marks python-fundamentals eligible via course completion alone", () => {
    const ctx = baseCtx({
      courseCompletions: [{ ref_id: "python-fundamentals", created_at: "2026-04-01T00:00:00Z" }],
    });
    const r = computeEligibility(ctx).find((x) => x.diplomaId === "python-fundamentals");
    expect(r?.eligible).toBe(true);
    expect(r?.reason).toContain("python");
  });

  it("each result carries evidence and a non-empty reason", () => {
    const ctx = baseCtx({
      courseCompletions: [{ ref_id: "dsa-fundamentals", created_at: "2026-04-01T00:00:00Z" }],
    });
    const results = computeEligibility(ctx);
    for (const r of results) {
      expect(typeof r.reason).toBe("string");
      expect(r.reason.length).toBeGreaterThan(0);
      expect(r.evidence).toBeDefined();
    }
    const dsa = results.find((x) => x.diplomaId === "data-structures-mastery");
    expect(dsa?.eligible).toBe(true);
  });
});
