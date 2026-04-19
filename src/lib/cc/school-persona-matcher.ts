import { COLLEGE_PERSONAS, type CollegePersona } from "@/data/college-interviewer-personas";

const OVERRIDE_MAP: Record<string, string> = {
  "university of pennsylvania": "penn-undergrad",
  "massachusetts institute of technology": "mit-undergrad",
};

export function matchSchoolToPersona(schoolName: string): CollegePersona | null {
  const lower = schoolName.toLowerCase();

  const overrideId = OVERRIDE_MAP[lower];
  if (overrideId) {
    return COLLEGE_PERSONAS.find((p) => p.id === overrideId) || null;
  }

  return (
    COLLEGE_PERSONAS.find((p) => lower.includes(p.shortName.toLowerCase())) ||
    null
  );
}

export const SUPPORTED_SCHOOLS = COLLEGE_PERSONAS.map((p) => p.shortName);
