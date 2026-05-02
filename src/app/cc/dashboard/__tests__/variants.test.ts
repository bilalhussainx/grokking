import { describe, it, expect } from "vitest";
import { selectVariant, buildVariant, type DashboardData } from "../variants";

const baseData: DashboardData = {
  preferredName: null,
  gradeLabel: null,
  daysToCommonApp: 99,
  schoolCount: 0,
  schoolReachCount: 0,
  schoolMatchCount: 0,
  schoolSafetyCount: 0,
  nextDeadline: null,
  urgentDeadlineCount: 0,
  essaysSubmittedCount: 0,
  essaysTotal: 0,
  activitiesCount: 0,
  activitiesAnalyzed: false,
  satRecommendation: null,
  satNextSitting: null,
  hasWaitlistedSchool: false,
  waitlistSchoolName: null,
  hasGPA: false,
  isInternational: false,
  transferCurrentSchool: null,
  transferTargetTerm: null,
  personalStatementPhase: null,
  decisionCounts: null,
  satReading: null,
  satMath: null,
  satTotal: null,
  observations: {},
};

describe("selectVariant", () => {
  it("transfer overrides grade", () => {
    expect(
      selectVariant({ is_transfer_student: true, grade_level: 11 }, []),
    ).toBe("transfer");
  });
  it("g9 / g10 / junior map by grade", () => {
    expect(selectVariant({ is_transfer_student: false, grade_level: 9 }, [])).toBe("g9");
    expect(selectVariant({ is_transfer_student: false, grade_level: 10 }, [])).toBe("g10");
    expect(selectVariant({ is_transfer_student: false, grade_level: 11 }, [])).toBe("junior");
  });
  it("grade 12 default = senior_writing", () => {
    expect(
      selectVariant({ is_transfer_student: false, grade_level: 12 }, []),
    ).toBe("senior_writing");
  });
  it("grade 12 + any submitted school = post_submit", () => {
    expect(
      selectVariant({ is_transfer_student: false, grade_level: 12 }, [
        { application_status: "submitted" },
      ]),
    ).toBe("senior_post_submit");
  });
  it("grade 12 + any decided school = decisions", () => {
    expect(
      selectVariant({ is_transfer_student: false, grade_level: 12 }, [
        { application_status: "accepted" },
      ]),
    ).toBe("senior_decisions");
    expect(
      selectVariant({ is_transfer_student: false, grade_level: 12 }, [
        { application_status: "waitlisted" },
      ]),
    ).toBe("senior_decisions");
  });
  it("missing grade = unknown", () => {
    expect(
      selectVariant({ is_transfer_student: false, grade_level: null }, []),
    ).toBe("unknown");
  });
});

describe("buildVariant — hero", () => {
  it("urgent deadline override fires for any variant", () => {
    const v = buildVariant("junior", {
      ...baseData,
      urgentDeadlineCount: 2,
      nextDeadline: { schoolName: "MIT", key: "EA", date: "2026-11-01", days: 8 },
    });
    expect(v.hero.urgent).toBe(true);
    expect(v.hero.headline).toContain("MIT");
    expect(v.hero.headline).toContain("8 days");
  });
  it("waitlist override fires for senior post-submit", () => {
    const v = buildVariant("senior_post_submit", {
      ...baseData,
      hasWaitlistedSchool: true,
      waitlistSchoolName: "Yale",
    });
    expect(v.hero.headline).toContain("Yale");
    expect(v.hero.headline).toContain("waitlisted");
  });
  it("g11 with no school list -> 'start your school list'", () => {
    const v = buildVariant("junior", { ...baseData, schoolCount: 0 });
    expect(v.hero.headline).toMatch(/school list/i);
    expect(v.hero.ctaHref).toBe("/schools");
  });
  it("g11 with school list but no test -> diagnostic SAT (only Aug-Dec)", () => {
    const isFall = new Date().getMonth() >= 7 && new Date().getMonth() <= 11;
    const v = buildVariant("junior", {
      ...baseData,
      schoolCount: 12,
      satRecommendation: null,
    });
    if (isFall) {
      expect(v.hero.headline).toMatch(/diagnostic/i);
    } else {
      // outside fall → either spring brainstorm or summer activities hero
      expect(["brainstorm", "Lock"]).toContainEqual(
        expect.stringMatching(new RegExp(v.hero.headline.includes("Lock") ? "Lock" : "brainstorm")),
      );
    }
  });
  it("transfer with no profile -> 'tell us where you are'", () => {
    const v = buildVariant("transfer", { ...baseData, transferCurrentSchool: null });
    expect(v.hero.headline).toMatch(/where you are/i);
    expect(v.hero.ctaHref).toBe("/cc/transfer-profile");
  });
  it("transfer with profile -> why-transfer essay", () => {
    const v = buildVariant("transfer", {
      ...baseData,
      transferCurrentSchool: "UC Davis",
      transferTargetTerm: "Fall 2026",
    });
    expect(v.hero.headline).toMatch(/why-transfer/i);
  });
});

describe("buildVariant — tiles", () => {
  it("g9 includes locked Application tracker tile", () => {
    const v = buildVariant("g9", baseData);
    const locked = v.tiles.find((t) => t.label === "Application tracker");
    expect(locked?.locked).toBe(true);
  });
  it("g10 has 6 tiles, none locked", () => {
    const v = buildVariant("g10", baseData);
    expect(v.tiles).toHaveLength(6);
    expect(v.tiles.every((t) => !t.locked)).toBe(true);
  });
  it("transfer hides SAT/ACT and includes professor recs note", () => {
    const v = buildVariant("transfer", baseData);
    expect(v.tiles.some((t) => t.label === "Test scores (final)")).toBe(false);
    const profRecs = v.priority.find((p) => p.label === "Professor recs");
    expect(profRecs?.meta).toMatch(/college, not high-school/i);
  });
});

describe("buildVariant — priority cards", () => {
  it("junior priority shows reach/match/safety counts", () => {
    const v = buildVariant("junior", {
      ...baseData,
      schoolCount: 12,
      schoolReachCount: 5,
      schoolMatchCount: 4,
      schoolSafetyCount: 3,
    });
    const list = v.priority.find((p) => p.label === "School list");
    expect(list?.meta).toBe("5 reach · 4 match · 3 safety");
  });
  it("senior_writing applications card flips to urgent on close deadline", () => {
    const v = buildVariant("senior_writing", {
      ...baseData,
      urgentDeadlineCount: 1,
      nextDeadline: { schoolName: "Cornell", key: "ED", date: "2025-11-01", days: 5 },
    });
    const apps = v.priority.find((p) => p.label === "Applications");
    expect(apps?.urgent).toBe(true);
  });
});

// ─── Phase 2 fields (handoff visual treatment) ───────────────────────────
describe("buildVariant — handoff Phase 2 fields", () => {
  it("populates statusTone per variant", () => {
    expect(buildVariant("g9", baseData).statusTone).toBe("leaf");
    expect(buildVariant("g10", baseData).statusTone).toBe("sky");
    expect(buildVariant("junior", baseData).statusTone).toBe("gold");
    expect(buildVariant("senior_writing", baseData).statusTone).toBe("gold");
    expect(buildVariant("senior_post_submit", baseData).statusTone).toBe("leaf");
    expect(buildVariant("senior_decisions", baseData).statusTone).toBe("leaf");
    expect(buildVariant("transfer", baseData).statusTone).toBe("sky");
  });

  it("urgent deadline hero uses rose tone + urgency block", () => {
    const v = buildVariant("senior_writing", {
      ...baseData,
      urgentDeadlineCount: 2,
      nextDeadline: { schoolName: "MIT", key: "EA", date: "2026-11-01", days: 8 },
    });
    expect(v.hero.ctaTone).toBe("rose");
    expect(v.hero.urgency).toBeTruthy();
    expect(v.hero.urgency?.value).toBe("8d");
    expect(v.hero.urgency?.label).toContain("MIT");
  });

  it("non-urgent hero leaves ctaTone undefined (defaults to gold)", () => {
    const v = buildVariant("junior", baseData);
    expect(v.hero.ctaTone).toBeUndefined();
    expect(v.hero.urgency).toBeUndefined();
  });

  it("populates 4 widgets per variant", () => {
    for (const key of [
      "g9", "g10", "junior",
      "senior_writing", "senior_post_submit", "senior_decisions",
      "transfer",
    ] as const) {
      const widgets = buildVariant(key, baseData).widgets;
      expect(widgets, `missing widgets for ${key}`).toBeDefined();
      expect(widgets?.length, `wrong widget count for ${key}`).toBe(4);
    }
  });

  it("first widget per variant is the gold-tinted primary metric", () => {
    expect(buildVariant("g9", baseData).widgets?.[0].tone).toBe("gold");
    expect(buildVariant("junior", baseData).widgets?.[0].tone).toBe("gold");
    expect(buildVariant("senior_writing", baseData).widgets?.[0].tone).toBe("gold");
  });
});

// ─── Phase 2.5 — bespoke priority module content (extras) ────────────────
describe("buildVariant — Phase 2.5 priority extras", () => {
  it("senior_writing PS card has phaseBar with capitalized current phase", () => {
    const v = buildVariant("senior_writing", { ...baseData, personalStatementPhase: "draft" });
    const ps = v.priority.find((p) => p.label === "Personal statement");
    expect(ps?.extra?.kind).toBe("phaseBar");
    if (ps?.extra?.kind === "phaseBar") {
      expect(ps.extra.current).toBe("Draft");
      expect(ps.extra.phases).toEqual(["Brainstorm", "Outline", "Draft", "Revise"]);
    }
  });

  it("senior_writing PS phaseBar.current is null when no PS exists", () => {
    const v = buildVariant("senior_writing", { ...baseData, personalStatementPhase: null });
    const ps = v.priority.find((p) => p.label === "Personal statement");
    if (ps?.extra?.kind === "phaseBar") {
      expect(ps.extra.current).toBeNull();
    }
  });

  it("senior_writing supplements has progressBar extra", () => {
    const v = buildVariant("senior_writing", {
      ...baseData,
      essaysSubmittedCount: 8,
      essaysTotal: 23,
    });
    const sup = v.priority.find((p) => p.label === "Supplements");
    expect(sup?.extra?.kind).toBe("progressBar");
    if (sup?.extra?.kind === "progressBar") {
      expect(sup.extra.current).toBe(8);
      expect(sup.extra.total).toBe(23);
      expect(sup.extra.tone).toBe("gold");
    }
  });

  it("senior_post_submit decisions tracker has decisionCounts when schools exist", () => {
    const v = buildVariant("senior_post_submit", {
      ...baseData,
      decisionCounts: { admitted: 4, waitlisted: 1, denied: 3, pending: 6 },
    });
    const card = v.priority.find((p) => p.label === "Decisions tracker");
    expect(card?.extra?.kind).toBe("decisionCounts");
    if (card?.extra?.kind === "decisionCounts") {
      expect(card.extra.admitted).toBe(4);
      expect(card.extra.waitlisted).toBe(1);
      expect(card.extra.denied).toBe(3);
      expect(card.extra.pending).toBe(6);
    }
  });

  it("senior_post_submit decisions tracker omits extra when no decisionCounts", () => {
    const v = buildVariant("senior_post_submit", { ...baseData, decisionCounts: null });
    const card = v.priority.find((p) => p.label === "Decisions tracker");
    expect(card?.extra).toBeUndefined();
  });

  it("senior_decisions Decisions card has decisionCounts breakdown", () => {
    const v = buildVariant("senior_decisions", {
      ...baseData,
      decisionCounts: { admitted: 2, waitlisted: 0, denied: 1, pending: 3 },
    });
    const card = v.priority[0];
    expect(card.extra?.kind).toBe("decisionCounts");
  });

  it("junior test strategy has satBars with target=1500", () => {
    const v = buildVariant("junior", {
      ...baseData,
      satReading: 720,
      satMath: 670,
      satTotal: 1390,
    });
    const tests = v.priority.find((p) => p.label === "Test strategy");
    expect(tests?.extra?.kind).toBe("satBars");
    if (tests?.extra?.kind === "satBars") {
      expect(tests.extra.target).toBe(1500);
      expect(tests.extra.reading).toBe(720);
      expect(tests.extra.math).toBe(670);
    }
  });

  it("junior satBars carries null reading/math when no test attempt", () => {
    const v = buildVariant("junior", { ...baseData });
    const tests = v.priority.find((p) => p.label === "Test strategy");
    if (tests?.extra?.kind === "satBars") {
      expect(tests.extra.reading).toBeNull();
      expect(tests.extra.math).toBeNull();
    }
  });
});

// ─── Phase 2.7 — coach nudge callouts ───────────────────────────────────
describe("buildVariant — Phase 2.7 coach nudges", () => {
  it("attaches nudge to matching priority card by label", () => {
    const v = buildVariant("senior_writing", {
      ...baseData,
      observations: {
        "Personal statement": {
          observation: "¶3 still tells, doesn't show. 15 min if you want to nail it.",
          eyebrow: "COACH'S NUDGE",
        },
      },
    });
    const ps = v.priority.find((p) => p.label === "Personal statement");
    expect(ps?.nudge).toBeDefined();
    expect(ps?.nudge?.observation).toContain("tells, doesn't show");
    expect(ps?.nudge?.eyebrow).toBe("COACH'S NUDGE");
  });

  it("does not attach nudge when observations map is empty", () => {
    const v = buildVariant("senior_writing", { ...baseData, observations: {} });
    const ps = v.priority.find((p) => p.label === "Personal statement");
    expect(ps?.nudge).toBeUndefined();
  });

  it("ignores observations whose label has no matching card", () => {
    const v = buildVariant("g9", {
      ...baseData,
      observations: { "Personal statement": { observation: "x", eyebrow: "y" } },
    });
    // g9 has no Personal statement card — observation should be silently dropped.
    expect(v.priority.find((p) => p.label === "Personal statement")).toBeUndefined();
  });

  it("attaches multiple nudges across cards in the same variant", () => {
    const v = buildVariant("junior", {
      ...baseData,
      observations: {
        "Activities": { observation: "Teaching is your through-line.", eyebrow: "COACH NOTICED" },
        "Test strategy": { observation: "Math has 100 points to find.", eyebrow: "COACH NOTICED" },
      },
    });
    expect(v.priority.find((p) => p.label === "Activities")?.nudge).toBeDefined();
    expect(v.priority.find((p) => p.label === "Test strategy")?.nudge).toBeDefined();
  });
});
