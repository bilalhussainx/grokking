// src/lib/cc/uk/schools.ts
// Reads UK seed JSONs and exposes type-safe accessors. Mirrors the
// Canadian pattern at src/lib/cc/canada/schools.ts.
import deadlines from "@/data/uk/uk-school-deadlines-2026.json";
import plans from "@/data/uk/uk-school-application-plans.json";

export interface UKSchool {
  name: string;
}

export interface UKDeadline {
  deadline_application: string;
  deadline_test_registration: string | null;
  oxbridge_or_medical: boolean;
  portal_url: string;
  portal_login_note: string;
}

export interface UKApplicationPlan {
  plans: string[];
  is_public: boolean;
  need_aware_for_internationals: boolean;
}

export const UK_SCHOOL_NAMES = Object.keys(deadlines) as readonly string[];

export function getUKSchools(): UKSchool[] {
  return UK_SCHOOL_NAMES.map((name) => ({ name }));
}

export function getUKDeadline(name: string): UKDeadline | null {
  const map = deadlines as Record<string, UKDeadline>;
  return map[name] ?? null;
}

export function getUKApplicationPlan(name: string): UKApplicationPlan | null {
  const map = plans as Record<string, UKApplicationPlan>;
  return map[name] ?? null;
}

export function isOxbridgeOrMedical(name: string): boolean {
  const d = getUKDeadline(name);
  return d?.oxbridge_or_medical === true;
}
