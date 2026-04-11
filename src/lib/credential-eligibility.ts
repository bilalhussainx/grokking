// src/lib/credential-eligibility.ts
// Verifiable Credentials SP1 — Task 7
// Pure eligibility engine + Supabase loader.

import { CREDENTIAL_CATALOG } from "@/data/credentials/catalog";
import type {
  DiplomaCriteriaContext,
  EligibilityResult,
} from "@/data/credentials/types";
import { createAdminSupabase } from "@/lib/supabase-auth";

export interface DiplomaEligibility extends EligibilityResult {
  diplomaId: string;
  title: string;
  description: string;
  category: "coding-course" | "tech-interview";
  imagePath: string;
}

/** Pure: evaluates every diploma in the catalog against the provided context. */
export function computeEligibility(ctx: DiplomaCriteriaContext): DiplomaEligibility[] {
  return CREDENTIAL_CATALOG.map((d) => {
    const r = d.evaluate(ctx);
    return {
      diplomaId: d.id,
      title: d.title,
      description: d.description,
      category: d.category,
      imagePath: d.imagePath,
      ...r,
    };
  });
}

/**
 * Loads the user's mocks + course completions from Supabase and runs computeEligibility.
 *
 * Schema adaptation notes (confirmed against supabase/migrations/):
 *  - There is no `interview_session_results` table. We read `interview_performance`
 *    joined with `interview_sessions` to reconstruct a `problem_slug`-shaped row.
 *    `problem_slug` is synthesized as `{company_persona_id}-{preset ?? interview_type}`
 *    so catalog rules matching on "google", "meta", "system-design", etc. still work.
 *  - `overall_score` is on a 1-10 scale; we rescale to 0-100 to match catalog thresholds.
 *  - `xp_transactions` has `action` + `ref_id` as documented.
 */
export async function loadEligibilityForUser(userId: string): Promise<DiplomaEligibility[]> {
  const supabase = createAdminSupabase();

  const [{ data: perfData }, { data: coursesData }] = await Promise.all([
    supabase
      .from("interview_performance")
      .select(
        "overall_score, created_at, company_persona_id, interview_type, session_id, interview_sessions!inner(preset, company_persona_id, interview_type)",
      )
      .eq("user_id", userId),
    supabase
      .from("xp_transactions")
      .select("ref_id, created_at")
      .eq("user_id", userId)
      .eq("action", "course_complete"),
  ]);

  const mocks = (perfData ?? []).map((row: Record<string, unknown>) => {
    const session = (row.interview_sessions ?? {}) as Record<string, unknown>;
    const company = String(
      session.company_persona_id ?? row.company_persona_id ?? "generic",
    );
    const preset = String(
      session.preset ?? row.interview_type ?? session.interview_type ?? "mock",
    );
    const problem_slug = `${company}-${preset}`.toLowerCase();
    const raw = Number(row.overall_score ?? 0);
    // overall_score is 1-10; rescale to 0-100 so catalog thresholds apply uniformly.
    const score = raw <= 10 ? raw * 10 : raw;
    return {
      problem_slug,
      score,
      created_at: String(row.created_at ?? ""),
    };
  });

  const ctx: DiplomaCriteriaContext = {
    userId,
    mocks,
    courseCompletions: (coursesData ?? []).map((c: Record<string, unknown>) => ({
      ref_id: String(c.ref_id ?? ""),
      created_at: String(c.created_at ?? ""),
    })),
  };

  return computeEligibility(ctx);
}
