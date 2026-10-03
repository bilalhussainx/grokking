import { describe, it, expect } from "vitest";
import {
  applicationSystemFor,
  applicationSystemLabel,
  planOptionsFor,
  checklistFor,
} from "../system";
import { componentProgress } from "../deadlines";

const harvard = { name: "Harvard University", country: "US", application_platform: null };
const legacyUS = { name: "Stanford University", country: null, application_platform: null };
const oxford = { name: "University of Oxford", country: "UK", application_platform: "UCAS" };
const ucl = { name: "University College London", country: "UK", application_platform: "UCAS" };
const bristolGB = { name: "University of Bristol", country: "GB", application_platform: null };
const toronto = { name: "University of Toronto", country: "CA", application_platform: "OUAC" };
const ubc = { name: "University of British Columbia", country: "CA", application_platform: "EducationPlannerBC" };
const mcgill = { name: "McGill University", country: "CA", application_platform: "McGill_direct" };

describe("applicationSystemFor", () => {
  it("treats US and legacy NULL-country rows as US", () => {
    expect(applicationSystemFor(harvard)).toBe("US");
    expect(applicationSystemFor(legacyUS)).toBe("US");
  });
  it("routes every UK school (UK or GB code) through UCAS", () => {
    expect(applicationSystemFor(oxford)).toBe("UCAS");
    expect(applicationSystemFor(bristolGB)).toBe("UCAS");
  });
  it("maps Canadian platforms", () => {
    expect(applicationSystemFor(toronto)).toBe("OUAC");
    expect(applicationSystemFor(ubc)).toBe("EducationPlannerBC");
    expect(applicationSystemFor(mcgill)).toBe("CA_DIRECT");
    expect(applicationSystemFor({ name: "X", country: "CA", application_platform: null })).toBe("CA_DIRECT");
  });
});

describe("applicationSystemLabel", () => {
  it("is null for US schools", () => {
    expect(applicationSystemLabel(harvard)).toBeNull();
  });
  it("names the system for UK and Canada", () => {
    expect(applicationSystemLabel(oxford)).toBe("Applies through UCAS");
    expect(applicationSystemLabel(toronto)).toBe("Applies through OUAC");
    expect(applicationSystemLabel(ubc)).toBe("Applies through EducationPlannerBC");
    expect(applicationSystemLabel(mcgill)).toBe("Applies directly to the university");
  });
});

describe("planOptionsFor", () => {
  it("offers ED/EA/REA/RD/Rolling to US schools only", () => {
    expect(planOptionsFor(harvard).map((o) => o.value)).toEqual(["ED", "EA", "REA", "RD", "rolling"]);
    expect(planOptionsFor(legacyUS).length).toBe(5);
  });
  it("offers no US plan types to UK or Canadian schools", () => {
    expect(planOptionsFor(oxford)).toEqual([]);
    expect(planOptionsFor(toronto)).toEqual([]);
    expect(planOptionsFor(mcgill)).toEqual([]);
  });
});

describe("checklistFor", () => {
  const labels = (s: Parameters<typeof checklistFor>[0]) => checklistFor(s).map((i) => i.label);

  it("keeps the 7-item US checklist for US schools", () => {
    expect(labels(harvard)).toEqual([
      "Common App",
      "Essays",
      "Supplements",
      "Recs",
      "Transcript",
      "Test scores",
      "Aid filed",
    ]);
  });

  it("gives UK schools a UCAS checklist with no Common App or Aid filed", () => {
    const l = labels(ucl);
    expect(l).toContain("UCAS application");
    expect(l).toContain("Personal statement");
    expect(l).toContain("Reference");
    expect(l).toContain("Predicted grades");
    expect(l.join(" ")).not.toMatch(/Common App|Aid filed|FAFSA|CSS/);
  });

  it("lists the admissions tests a UK school uses, from the UK admissions-test registry", () => {
    const test = checklistFor(oxford).find((i) => i.key === "test_scores_submitted");
    expect(test).toBeDefined();
    expect(test!.label).toMatch(/^Admissions test/);
  });

  it("omits the admissions-test item for a UK school with no test in the registry", () => {
    const unknownUK = { name: "University of Exeter", country: "UK", application_platform: "UCAS" };
    expect(checklistFor(unknownUK).some((i) => i.key === "test_scores_submitted")).toBe(false);
  });

  it("gives Canadian schools platform application + transcripts, no Common App or Aid filed", () => {
    expect(labels(toronto)[0]).toBe("OUAC application");
    expect(labels(ubc)[0]).toBe("EducationPlannerBC application");
    expect(labels(mcgill)[0]).toBe("Application (direct to the university)");
    for (const s of [toronto, ubc, mcgill]) {
      const l = labels(s);
      expect(l).toContain("Transcripts");
      expect(l.join(" ")).not.toMatch(/Common App|Aid filed|FAFSA|CSS/);
    }
  });

  it("includes a supplementary application only where the Canadian data lists one", () => {
    expect(labels(toronto)).toContain("Supplementary application (if your program requires one)");
    expect(labels(mcgill)).not.toContain("Supplementary application (if your program requires one)");
  });

  it("drives progress off the system's own checklist", () => {
    const keys = checklistFor(mcgill).map((i) => i.key);
    const row = {
      common_app_filled: true,
      essays_complete: false,
      supplements_complete: false,
      recs_submitted: false,
      transcript_submitted: true,
      test_scores_submitted: false,
      financial_aid_filed: false,
    };
    expect(componentProgress(row, keys)).toEqual({ complete: 2, total: 2, pct: 100 });
  });
});
