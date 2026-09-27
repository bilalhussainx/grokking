// Dashboards must not claim work is done when nothing is there, and quick
// links must go where their label says (audit QA-40, QA-52).
import { describe, it, expect } from "vitest";
import { buildVariant, type DashboardData } from "../variants";

const empty = {
  preferredName: null, gradeLabel: null, daysToCommonApp: 99, schoolCount: 0, schoolReachCount: 0,
  schoolMatchCount: 0, schoolSafetyCount: 0, nextDeadline: null, urgentDeadlineCount: 0,
  essaysSubmittedCount: 0, essaysTotal: 0, activitiesCount: 0, activitiesAnalyzed: false,
  satRecommendation: null, satNextSitting: null, hasWaitlistedSchool: false, waitlistSchoolName: null,
  hasGPA: false, isInternational: false, transferCurrentSchool: null, transferTargetTerm: null,
  personalStatementPhase: null, decisionCounts: null, satReading: null, satMath: null, satTotal: null,
  observations: {},
} as DashboardData;

describe("dashboard truthfulness", () => {
  it("an empty senior dashboard does not say all deadlines are logged", () => {
    const text = JSON.stringify(buildVariant("senior_writing", empty));
    expect(text).not.toContain("All deadlines logged");
    expect(text).toContain("Add schools to see deadlines.");
  });

  it("transfer quick links don't send a parent-docs label to recommenders", () => {
    const text = JSON.stringify(buildVariant("transfer", empty));
    expect(text).not.toContain("Translate-for-parent docs");
  });
});
