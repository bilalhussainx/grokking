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
    variantKey: null,
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

  it("lists all 8 canonical need-blind schools for intl full-aid students in school-builder mode", () => {
    const ctx: CoachContext = {
      ...baseContext,
      mode: "school-builder",
      isInternational: true,
      country: "PK",
      affordabilityValue: "zero",
      needsFullAid: true,
    };
    const prompt = buildSystemPrompt(ctx);
    for (const school of ["MIT", "Harvard", "Yale", "Princeton", "Dartmouth", "Amherst", "Williams", "Bowdoin"]) {
      expect(prompt).toContain(school);
    }
  });

  it("mentions the need-aware-meets-full-need distinction for intl full-aid students", () => {
    const ctx: CoachContext = {
      ...baseContext,
      mode: "school-builder",
      isInternational: true,
      country: "PK",
      affordabilityValue: "zero",
      needsFullAid: true,
    };
    const prompt = buildSystemPrompt(ctx);
    expect(prompt.toLowerCase()).toMatch(/need-aware/);
    const needAwareSchools = ["Columbia", "Penn", "Duke", "Vanderbilt", "Rice", "Pomona", "Wellesley", "Middlebury"];
    expect(needAwareSchools.some((s) => prompt.includes(s))).toBe(true);
  });

  it("includes first-gen guidance block when isFirstGen is true", () => {
    const ctx: CoachContext = { ...baseContext, mode: "general", isFirstGen: true };
    const prompt = buildSystemPrompt(ctx);
    expect(prompt).toContain("QuestBridge");
    expect(prompt).toContain("Posse");
    expect(prompt).toContain("College Advising Corps");
    for (const school of ["UMich", "UNC-Chapel Hill", "UT Austin", "Vassar", "Amherst", "Williams"]) {
      expect(prompt).toContain(school);
    }
  });

  it("excludes first-gen guidance block when isFirstGen is false", () => {
    const ctx: CoachContext = { ...baseContext, mode: "general", isFirstGen: false };
    const prompt = buildSystemPrompt(ctx);
    expect(prompt).not.toContain("QuestBridge");
    expect(prompt).not.toContain("Posse");
  });

  it("includes unconditional international block when isInternational is true and needsFullAid is false", () => {
    const ctx: CoachContext = {
      ...baseContext,
      mode: "school-builder",
      isInternational: true,
      country: "IN",
      needsFullAid: false,
      affordabilityValue: "30k_50k",
    };
    const prompt = buildSystemPrompt(ctx);
    expect(prompt).toContain("CSS Profile");
    expect(prompt).toContain("TOEFL");
    expect(prompt.toLowerCase()).toContain("timezone");
  });

  it("includes Pakistani-specific guidance when isInternational and country is PK", () => {
    const ctx: CoachContext = {
      ...baseContext,
      mode: "general",
      isInternational: true,
      country: "PK",
    };
    const prompt = buildSystemPrompt(ctx);
    expect(prompt.toLowerCase()).toContain("pakistan");
    expect(prompt.toLowerCase()).toContain("gpa conversion");
    expect(prompt).toContain("WES");
  });

  it("surfaces CSS Profile guide link for international students in general mode", () => {
    const ctx: CoachContext = {
      ...baseContext,
      mode: "general",
      isInternational: true,
      country: "IN",
    };
    const prompt = buildSystemPrompt(ctx);
    expect(prompt).toContain("CSS Profile");
    expect(prompt).toContain("/profile/css-guide");
    expect(prompt.toLowerCase()).toContain("not the fafsa");
  });

  it("describes CSS Profile walkthrough offer for international students", () => {
    const ctx: CoachContext = {
      ...baseContext,
      mode: "general",
      isInternational: true,
      country: "NG",
    };
    const prompt = buildSystemPrompt(ctx);
    expect(prompt.toLowerCase()).toContain("walk you through the css profile");
    expect(prompt).toContain("October 1");
    expect(prompt).toContain("Noncustodial");
  });

  it("adds Pakistan-specific CSS Profile asset note when country is PK", () => {
    const ctx: CoachContext = {
      ...baseContext,
      mode: "general",
      isInternational: true,
      country: "PK",
    };
    const prompt = buildSystemPrompt(ctx);
    expect(prompt.toLowerCase()).toContain("property, gold");
    expect(prompt.toLowerCase()).toContain("agricultural income");
  });

  it("does not surface CSS Profile guide for domestic students", () => {
    const ctx: CoachContext = {
      ...baseContext,
      mode: "general",
      isInternational: false,
    };
    const prompt = buildSystemPrompt(ctx);
    expect(prompt).not.toContain("/profile/css-guide");
    expect(prompt).not.toContain("not the FAFSA");
  });

  // Per-variant guidance block — keeps the LLM inside the right step-by-step
  // path on subsequent turns (the opening seed message in
  // src/lib/cc/variant-walkthroughs.ts only frames turn 1).
  it("g9 variant locks essays/SAT/applications away", () => {
    const ctx: CoachContext = { ...baseContext, variantKey: "g9", grade: 9 };
    const prompt = buildSystemPrompt(ctx);
    expect(prompt).toContain("GRADE 9");
    expect(prompt.toLowerCase()).toContain("course rigor");
    expect(prompt.toLowerCase()).toContain("club");
    expect(prompt.toLowerCase()).toContain("do not push");
    expect(prompt.toLowerCase()).toContain("essays");
  });

  it("g10 variant pushes PSAT 10 + summer + depth", () => {
    const ctx: CoachContext = { ...baseContext, variantKey: "g10", grade: 10 };
    const prompt = buildSystemPrompt(ctx);
    expect(prompt).toContain("GRADE 10");
    expect(prompt).toContain("PSAT 10");
    expect(prompt.toLowerCase()).toContain("summer");
  });

  it("junior variant blocks personal-statement drafting", () => {
    const ctx: CoachContext = { ...baseContext, variantKey: "junior", grade: 11 };
    const prompt = buildSystemPrompt(ctx);
    expect(prompt).toContain("JUNIOR");
    expect(prompt.toLowerCase()).toContain("brainstorm only");
    expect(prompt.toLowerCase()).toContain("drafting starts senior fall");
  });

  it("senior_writing variant orders by deadline pressure", () => {
    const ctx: CoachContext = { ...baseContext, variantKey: "senior_writing", grade: 12 };
    const prompt = buildSystemPrompt(ctx);
    expect(prompt).toContain("writing season");
    expect(prompt.toLowerCase()).toContain("school list locked");
    expect(prompt.toLowerCase()).toContain("supplements");
  });

  it("senior_post_submit variant guides demonstrated interest + interview prep", () => {
    const ctx: CoachContext = { ...baseContext, variantKey: "senior_post_submit", grade: 12 };
    const prompt = buildSystemPrompt(ctx);
    expect(prompt).toContain("submitted");
    expect(prompt.toLowerCase()).toContain("demonstrated interest");
    expect(prompt.toLowerCase()).toContain("plan-b");
  });

  it("senior_decisions variant prioritizes aid math", () => {
    const ctx: CoachContext = { ...baseContext, variantKey: "senior_decisions", grade: 12 };
    const prompt = buildSystemPrompt(ctx);
    expect(prompt).toContain("decisions in");
    expect(prompt.toLowerCase()).toContain("aid letter");
    expect(prompt.toLowerCase()).toContain("may 1");
  });

  it("transfer variant rejects first-year strategies", () => {
    const ctx: CoachContext = { ...baseContext, variantKey: "transfer" };
    const prompt = buildSystemPrompt(ctx);
    expect(prompt).toContain("TRANSFER APPLICANT");
    expect(prompt.toLowerCase()).toContain("why-transfer essay");
    expect(prompt.toLowerCase()).toContain("professor");
    expect(prompt.toLowerCase()).toContain("do not apply");
  });

  it("variantKey null produces no variant block", () => {
    const ctx: CoachContext = { ...baseContext, variantKey: null };
    const prompt = buildSystemPrompt(ctx);
    expect(prompt).not.toContain("DASHBOARD VARIANT:");
  });

  it("variantKey 'unknown' produces no variant block", () => {
    const ctx: CoachContext = { ...baseContext, variantKey: "unknown" };
    const prompt = buildSystemPrompt(ctx);
    expect(prompt).not.toContain("DASHBOARD VARIANT:");
  });

  describe("catalog constraint (Workstream C — Canada)", () => {
    // The previous behavior gated international schools by country (only
    // CA/PK/UK heard about UofT etc). US students who explicitly asked for
    // Toronto were refused even though we have 12 Canadian + 12 UK schools
    // loaded. The gate was removed — every student sees the full catalog.
    it("US student now sees the full international catalog (no stale refusal)", () => {
      const prompt = buildSystemPrompt({ ...baseContext, country: "US" });
      expect(prompt).not.toContain("US schools only");
      expect(prompt).not.toContain("Canadian, UK, or other non-US");
      expect(prompt).toContain("12 Canadian universities");
      expect(prompt).toContain("12 UK universities");
    });
    it("Canadian student sees the catalog block", () => {
      const prompt = buildSystemPrompt({ ...baseContext, country: "CA" });
      expect(prompt).toContain("12 Canadian universities");
      expect(prompt).toContain("University of Toronto");
    });
    it("Pakistani student sees the catalog block (Brampton ICP)", () => {
      const prompt = buildSystemPrompt({ ...baseContext, country: "PK" });
      expect(prompt).toContain("12 Canadian universities");
    });
  });

  describe("Canada guidance block (Workstream C)", () => {
    it("appears for Canadian students", () => {
      const prompt = buildSystemPrompt({ ...baseContext, country: "CA" });
      expect(prompt).toContain("CANADIAN APPLICATION GUIDANCE");
      expect(prompt).toContain("OUAC");
    });
    it("appears for Pakistani students (diaspora dual-apply)", () => {
      const prompt = buildSystemPrompt({ ...baseContext, country: "PK" });
      expect(prompt).toContain("CANADIAN APPLICATION GUIDANCE");
    });
    it("does not appear for US students", () => {
      const prompt = buildSystemPrompt({ ...baseContext, country: "US" });
      expect(prompt).not.toContain("CANADIAN APPLICATION GUIDANCE");
    });
  });

  describe("UK catalog constraint + guidance (Workstream M)", () => {
    it("UK student gets the relaxed catalog block naming UK + CA schools", () => {
      const prompt = buildSystemPrompt({ ...baseContext, country: "UK" });
      expect(prompt).toContain("12 UK universities");
      expect(prompt).toContain("Oxford");
      expect(prompt).toContain("12 Canadian universities");
      expect(prompt).not.toContain("US schools only");
    });
    it("Pakistani student gets a catalog block naming all three regions (US, CA, UK)", () => {
      const prompt = buildSystemPrompt({ ...baseContext, country: "PK" });
      expect(prompt).toContain("12 UK universities");
      expect(prompt).toContain("12 Canadian universities");
    });
    it("UK guidance block appears for UK students", () => {
      const prompt = buildSystemPrompt({ ...baseContext, country: "UK" });
      expect(prompt).toContain("UK APPLICATION GUIDANCE");
      expect(prompt).toContain("UCAS");
      expect(prompt).toContain("October 15");
    });
    it("UK guidance block appears for Pakistani students (Saïd Foundation surfacing)", () => {
      const prompt = buildSystemPrompt({ ...baseContext, country: "PK" });
      expect(prompt).toContain("UK APPLICATION GUIDANCE");
      expect(prompt).toContain("SAÏD FOUNDATION");
    });
    it("UK guidance block does NOT appear for US students", () => {
      const prompt = buildSystemPrompt({ ...baseContext, country: "US" });
      expect(prompt).not.toContain("UK APPLICATION GUIDANCE");
    });
    it("UK guidance block does NOT mention Saïd for Indian students", () => {
      const prompt = buildSystemPrompt({ ...baseContext, country: "IN" });
      expect(prompt).not.toContain("SAÏD FOUNDATION");
    });
  });
});
