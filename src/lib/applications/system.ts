// Which application system a school uses (US / UCAS / Canadian platforms),
// and the plan options + checklist that fit it. UK and Canadian schools must
// never get US-only framing (ED/EA/REA, "Common App", "Aid filed").
import type { ComponentField } from "./deadlines";
import { ALL_TEST_CODES, getAdmissionsTest } from "@/lib/cc/uk/admissions-tests";
import { getCanadianDeadline } from "@/lib/cc/canada/schools";

export type ApplicationSystem = "US" | "UCAS" | "OUAC" | "EducationPlannerBC" | "CA_DIRECT";

export interface SchoolSystemInput {
  name?: string | null;
  country?: string | null;
  application_platform?: string | null;
}

export interface PlanOption {
  value: string;
  label: string;
  early?: boolean;
}

export interface ChecklistItem {
  key: ComponentField;
  label: string;
}

// UCAS key dates for 2027 entry (15 Oct 2026 / 13 Jan 2027, 18:00 UK time).
// Source: https://www.ucas.com/applying/applying-to-university/dates-and-deadlines-for-uni-applications
export const UCAS_DATES_URL =
  "https://www.ucas.com/applying/applying-to-university/dates-and-deadlines-for-uni-applications";

// cc_schools stores the UK as "UK"; the /schools filter historically sent "GB".
export function isUKCountry(country: string | null | undefined): boolean {
  return country === "UK" || country === "GB";
}

export function applicationSystemFor(s: SchoolSystemInput): ApplicationSystem {
  if (isUKCountry(s.country)) return "UCAS";
  if (s.country === "CA") {
    if (s.application_platform === "OUAC" || s.application_platform === "Waterloo_AIF") return "OUAC";
    if (s.application_platform === "EducationPlannerBC") return "EducationPlannerBC";
    return "CA_DIRECT";
  }
  return "US";
}

export function applicationSystemLabel(s: SchoolSystemInput): string | null {
  switch (applicationSystemFor(s)) {
    case "UCAS":
      return "Applies through UCAS";
    case "OUAC":
      return "Applies through OUAC";
    case "EducationPlannerBC":
      return "Applies through EducationPlannerBC";
    case "CA_DIRECT":
      return "Applies directly to the university";
    default:
      return null;
  }
}

const US_PLAN_OPTIONS: PlanOption[] = [
  { value: "ED", label: "ED", early: true },
  { value: "EA", label: "EA", early: true },
  { value: "REA", label: "REA", early: true },
  { value: "RD", label: "RD" },
  { value: "rolling", label: "Rolling" },
];

// UCAS and the Canadian platforms have no ED/EA-style plan choice, so non-US
// schools get no plan chips at all.
export function planOptionsFor(s: SchoolSystemInput): PlanOption[] {
  return applicationSystemFor(s) === "US" ? US_PLAN_OPTIONS : [];
}

const US_CHECKLIST: ChecklistItem[] = [
  { key: "common_app_filled", label: "Common App" },
  { key: "essays_complete", label: "Essays" },
  { key: "supplements_complete", label: "Supplements" },
  { key: "recs_submitted", label: "Recs" },
  { key: "transcript_submitted", label: "Transcript" },
  { key: "test_scores_submitted", label: "Test scores" },
  { key: "financial_aid_filed", label: "Aid filed" },
];

// Test codes (LNAT, UCAT, ...) the UK admissions-test registry lists for a school.
function ukTestCodesFor(schoolName: string): string[] {
  return ALL_TEST_CODES.filter((code) =>
    getAdmissionsTest(code)?.applies_to.some((a) => a.school === schoolName),
  );
}

// Non-US checklists reuse the existing cc_student_schools boolean columns with
// system-appropriate labels (e.g. common_app_filled = "the main application").
export function checklistFor(s: SchoolSystemInput): ChecklistItem[] {
  const system = applicationSystemFor(s);
  const name = s.name ?? "";

  if (system === "UCAS") {
    const items: ChecklistItem[] = [
      { key: "common_app_filled", label: "UCAS application" },
      { key: "essays_complete", label: "Personal statement" },
      { key: "recs_submitted", label: "Reference" },
      { key: "transcript_submitted", label: "Predicted grades" },
    ];
    const tests = ukTestCodesFor(name);
    if (tests.length > 0) {
      items.push({
        key: "test_scores_submitted",
        label: `Admissions test, if your course needs one (${tests.join(", ")})`,
      });
    }
    return items;
  }

  if (system === "US") return US_CHECKLIST;

  const appLabel =
    system === "OUAC"
      ? "OUAC application"
      : system === "EducationPlannerBC"
        ? "EducationPlannerBC application"
        : "Application (direct to the university)";
  const items: ChecklistItem[] = [{ key: "common_app_filled", label: appLabel }];
  if (getCanadianDeadline(name)?.deadline_supplementary) {
    items.push({
      key: "supplements_complete",
      label: "Supplementary application (if your program requires one)",
    });
  }
  items.push({ key: "transcript_submitted", label: "Transcripts" });
  return items;
}
