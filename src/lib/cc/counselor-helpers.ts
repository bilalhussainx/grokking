// Server-side helpers for the counselor marketplace.
//
// Centralized so route handlers don't reimplement the auth-uid → counselor-id
// lookup or the slug-uniqueness logic. Mirrors the pattern used by
// ensureStudentProfile in src/app/api/cc/helpers.ts.

import { createAdminSupabase } from "@/lib/supabase-server";

export interface CounselorRow {
  id: string;
  user_id: string;
  agency_id: string | null;
  slug: string;
  display_name: string;
  headline: string | null;
  bio: string | null;
  photo_url: string | null;
  years_experience: number | null;
  specialties: string[];
  languages: string[];
  hourly_rate_usd: number | null;
  accepts_new_students: boolean;
  verified: boolean;
  total_sessions: number;
  average_rating: number | null;
  total_reviews: number;
  // Stripe Connect Express account id — null until counselor completes
  // payouts onboarding. Read on /counselor/payouts and gated by the
  // booking endpoint (refuses bookings until this is set).
  stripe_account_id: string | null;
}

export interface AgencyRow {
  id: string;
  slug: string;
  name: string;
  website_url: string | null;
  logo_url: string | null;
  description: string | null;
  country: string;
  founded_year: number | null;
  total_acceptances: number;
  verified: boolean;
}

// Resolve the cc_counselors row for the currently-authenticated user. Returns
// null when the user isn't a counselor — callers use this both as a "is this
// user a counselor?" check and as the way to fetch their profile.
export async function getCounselorForUser(userId: string): Promise<CounselorRow | null> {
  const db = createAdminSupabase();
  const { data } = await db
    .from("cc_counselors")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle<CounselorRow>();
  return data;
}

// Same shape as ensureStudentProfile but for counselors. Used by the onboard
// flow — POST creates the row if it doesn't exist, returns the existing one
// if it does (idempotent).
export async function ensureCounselorProfile(
  userId: string,
  init: { displayName: string; agencySlug?: string },
): Promise<CounselorRow> {
  const db = createAdminSupabase();
  const existing = await getCounselorForUser(userId);
  if (existing) return existing;

  const slug = await pickUniqueCounselorSlug(init.displayName);
  let agencyId: string | null = null;
  if (init.agencySlug) {
    const { data: agency } = await db
      .from("cc_agencies")
      .select("id")
      .eq("slug", init.agencySlug)
      .maybeSingle<{ id: string }>();
    agencyId = agency?.id ?? null;
  }

  const { data, error } = await db
    .from("cc_counselors")
    .insert({
      user_id: userId,
      agency_id: agencyId,
      slug,
      display_name: init.displayName,
    })
    .select("*")
    .single<CounselorRow>();
  if (error || !data) {
    throw new Error(`Failed to create counselor: ${error?.message ?? "unknown"}`);
  }
  return data;
}

// Slug derivation: lowercase, hyphenated, with a numeric suffix on collision.
// Public profile lives at /counselors/[slug] so the slug shows up in URLs and
// shareable links.
async function pickUniqueCounselorSlug(displayName: string): Promise<string> {
  const base = displayName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "counselor";

  const db = createAdminSupabase();
  for (let attempt = 0; attempt < 50; attempt++) {
    const candidate = attempt === 0 ? base : `${base}-${attempt + 1}`;
    const { data } = await db
      .from("cc_counselors")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();
    if (!data) return candidate;
  }
  // Statistically impossible — but cheaper than throwing midway through onboarding.
  return `${base}-${Date.now().toString(36)}`;
}

// Resolve the agency for a slug. Used by /agencies/[slug] page + the
// counselor-onboarding "claim agency" flow.
export async function getAgencyBySlug(slug: string): Promise<AgencyRow | null> {
  const db = createAdminSupabase();
  const { data } = await db
    .from("cc_agencies")
    .select("*")
    .eq("slug", slug)
    .maybeSingle<AgencyRow>();
  return data;
}

// Counselor lookup by slug for the public profile page.
export async function getCounselorBySlug(slug: string): Promise<CounselorRow | null> {
  const db = createAdminSupabase();
  const { data } = await db
    .from("cc_counselors")
    .select("*")
    .eq("slug", slug)
    .maybeSingle<CounselorRow>();
  return data;
}

// Search counselors. Used by /find-counselor.
//   - q:           name fragment (ilike on display_name)
//   - schoolName:  filters to counselors with VERIFIED admit proof for this school
//   - service:     counselor_service_type filter
//   - languages:   any-of match on the languages array
//   - acceptingOnly: when true, exclude counselors who have closed intake
export interface CounselorSearchParams {
  q?: string | null;
  schoolName?: string | null;
  service?: string | null;
  languages?: string[];
  acceptingOnly?: boolean;
  // Only admin-verified counselors (the public directory).
  verifiedOnly?: boolean;
  limit?: number;
}

export interface CounselorSearchResult extends CounselorRow {
  agency_name: string | null;
  agency_slug: string | null;
  agency_verified: boolean;
  matched_school_admits: number; // verified admits to the searched school
}

export async function searchCounselors(
  params: CounselorSearchParams,
): Promise<CounselorSearchResult[]> {
  const db = createAdminSupabase();
  const limit = params.limit ?? 25;

  // Base query — left-join agency for the agency badge in results.
  let query = db
    .from("cc_counselors")
    .select(`
      *,
      agency:cc_agencies!agency_id (id, slug, name, verified)
    `)
    .limit(limit);

  if (params.q) {
    query = query.ilike("display_name", `%${params.q}%`);
  }
  if (params.verifiedOnly) {
    query = query.eq("verified", true);
  }
  if (params.acceptingOnly !== false) {
    query = query.eq("accepts_new_students", true);
  }
  if (params.languages && params.languages.length > 0) {
    query = query.overlaps("languages", params.languages);
  }
  // Sort: verified first, then highest rating, then most reviews.
  query = query
    .order("verified", { ascending: false })
    .order("average_rating", { ascending: false, nullsFirst: false })
    .order("total_reviews", { ascending: false });

  type Row = CounselorRow & {
    agency: { id: string; slug: string; name: string; verified: boolean } | null;
  };
  const { data: counselors } = await query;
  const rows = (counselors ?? []) as Row[];

  // Filter by school admits when requested. Done as a second query so the
  // filter is "has at least one VERIFIED admit to this school". For cleaner
  // prod scale this becomes a SQL view; Phase 1 keeps it simple.
  let admitCounts = new Map<string, number>();
  if (params.schoolName) {
    const counselorIds = rows.map((r) => r.id);
    if (counselorIds.length > 0) {
      const { data: proofs } = await db
        .from("cc_counselor_admissions_proof")
        .select("counselor_id")
        .in("counselor_id", counselorIds)
        .eq("school_name", params.schoolName)
        .eq("decision", "admitted")
        .eq("verified_by_admin", true);
      type Proof = { counselor_id: string };
      for (const p of ((proofs ?? []) as Proof[])) {
        admitCounts.set(p.counselor_id, (admitCounts.get(p.counselor_id) ?? 0) + 1);
      }
    }
  }

  // Filter by service when requested — uses a separate query for the same
  // simplicity reasons.
  let serviceMatch: Set<string> | null = null;
  if (params.service) {
    const counselorIds = rows.map((r) => r.id);
    if (counselorIds.length > 0) {
      const { data: services } = await db
        .from("cc_counselor_services")
        .select("counselor_id")
        .in("counselor_id", counselorIds)
        .eq("service_type", params.service)
        .eq("active", true);
      type Svc = { counselor_id: string };
      serviceMatch = new Set(((services ?? []) as Svc[]).map((s) => s.counselor_id));
    }
  }

  return rows
    .filter((r) => {
      if (params.schoolName && (admitCounts.get(r.id) ?? 0) === 0) return false;
      if (serviceMatch && !serviceMatch.has(r.id)) return false;
      return true;
    })
    .map((r) => ({
      ...r,
      agency_name: r.agency?.name ?? null,
      agency_slug: r.agency?.slug ?? null,
      agency_verified: r.agency?.verified ?? false,
      matched_school_admits: admitCounts.get(r.id) ?? 0,
    }));
}
