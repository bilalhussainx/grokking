// src/lib/cc/uk/scholarships.ts
// UK scholarships catalog with country + level + school-overlap filtering.
// Pakistani-specific surfacing for Saïd Foundation + Reach Oxford + HEC
// is the moat — almost no other platform names these awards proactively.
import data from "@/data/uk/uk-scholarships.json";

export type ScholarshipLevel = "undergraduate" | "graduate";

export interface UKScholarship {
  name: string;
  url: string;
  schools: string[];
  level: ScholarshipLevel | string;
  coverage: string;
  eligibility: string;
  deadline: string;
  pakistani_relevant: boolean;
  notes: string;
}

const ALL = data as UKScholarship[];

export const ALL_SCHOLARSHIP_NAMES = ALL.map((s) => s.name);

export function getScholarship(name: string): UKScholarship | null {
  return ALL.find((s) => s.name === name) ?? null;
}

export function relevantScholarships(input: {
  country: string;
  schoolsApplying: string[];
  level: ScholarshipLevel;
}): UKScholarship[] {
  const isPK = input.country === "PK";
  return ALL.filter((s) => {
    // Level gate
    if (s.level !== input.level) return false;

    // Pakistani-only awards filter for non-Pakistani students
    const isPakistaniOnly = /Saïd Foundation|Pakistan HEC/.test(s.name);
    if (isPakistaniOnly && !isPK) return false;

    // School overlap — at least one of the student's schools matches
    const overlaps = s.schools.some(
      (sch) =>
        sch === "various UK Russell Group" ||
        sch === "various UK" ||
        input.schoolsApplying.includes(sch),
    );
    if (!overlaps) return false;

    return true;
  });
}
