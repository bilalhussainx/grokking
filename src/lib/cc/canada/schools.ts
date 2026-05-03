// src/lib/cc/canada/schools.ts
// Reads the three Canadian seed JSONs and exposes type-safe accessors.
// Used by the coach prompt builder + (future) UI for /cc/canada surfaces.
import deadlines from "@/data/canadian/ca-school-deadlines-2026.json";
import plans from "@/data/canadian/ca-school-application-plans.json";
import supplements from "@/data/canadian/ca-supplement-prompts-2026.json";

export interface CanadianSchool {
  name: string;
}

export interface CanadianDeadline {
  deadline_application: string;
  deadline_supplementary: string | null;
  portal_url: string;
  portal_login_note: string;
}

export interface CanadianApplicationPlan {
  plans: string[];
  is_public: boolean;
  need_aware_for_internationals: boolean;
}

export interface CanadianSupplementPrompt {
  type: string;
  text: string;
  word_limit: number;
  required: boolean;
}

export const CANADIAN_SCHOOL_NAMES = Object.keys(deadlines) as readonly string[];

export function getCanadianSchools(): CanadianSchool[] {
  return CANADIAN_SCHOOL_NAMES.map((name) => ({ name }));
}

export function getCanadianDeadline(name: string): CanadianDeadline | null {
  const map = deadlines as Record<string, CanadianDeadline>;
  return map[name] ?? null;
}

export function getCanadianApplicationPlan(name: string): CanadianApplicationPlan | null {
  const map = plans as Record<string, CanadianApplicationPlan>;
  return map[name] ?? null;
}

export function getCanadianSupplementPrompts(name: string): CanadianSupplementPrompt[] | null {
  const list = supplements as Array<{ school_name: string; prompts: CanadianSupplementPrompt[] }>;
  const found = list.find((s) => s.school_name === name);
  return found ? found.prompts : null;
}
