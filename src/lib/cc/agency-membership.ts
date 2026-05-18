// src/lib/cc/agency-membership.ts
//
// Read/write helpers for cc_agency_members. Schema:
//   PRIMARY KEY (agency_id, user_id)
//   role IN ('head', 'counselor')
//   requires_review BOOLEAN  — head-only counselors are flagged so their
//     student replies funnel through head-review before going out.
//
// All helpers use the service-role admin client because callers are server
// routes (or other server-side helpers) that have already authenticated the
// user; RLS would only get in the way here. Mirrors the convention used in
// src/lib/cc/counselor-helpers.ts.

import { createAdminSupabase } from "@/lib/supabase-server";

export interface AgencyMembership {
  agencyId: string;
  userId: string;
  role: "head" | "counselor";
  requiresReview: boolean;
  joinedAt: string;
}

interface Row {
  agency_id: string;
  user_id: string;
  role: "head" | "counselor";
  requires_review: boolean;
  joined_at: string;
}

function rowToMembership(r: Row): AgencyMembership {
  return {
    agencyId: r.agency_id,
    userId: r.user_id,
    role: r.role,
    requiresReview: r.requires_review,
    joinedAt: r.joined_at,
  };
}

// Exact-pair lookup. Used to answer "is this user a member of this agency,
// and if so what's their role?" Returns null for non-members so callers can
// use it as a presence check.
export async function getAgencyMembership(
  userId: string,
  agencyId: string,
): Promise<AgencyMembership | null> {
  const db = createAdminSupabase();
  const { data } = await db
    .from("cc_agency_members")
    .select("*")
    .eq("user_id", userId)
    .eq("agency_id", agencyId)
    .maybeSingle<Row>();
  return data ? rowToMembership(data) : null;
}

// "What agency is this user part of?" — counselors only belong to one agency
// in Phase 1, but the schema doesn't enforce that, so we pick the earliest
// membership deterministically.
export async function getAnyAgencyMembership(
  userId: string,
): Promise<AgencyMembership | null> {
  const db = createAdminSupabase();
  const { data } = await db
    .from("cc_agency_members")
    .select("*")
    .eq("user_id", userId)
    .order("joined_at", { ascending: true })
    .limit(1)
    .maybeSingle<Row>();
  return data ? rowToMembership(data) : null;
}

// Roster for the agency dashboard. Heads listed first (so admin tools default
// to showing leadership at the top), then counselors by tenure. We sort in JS
// after the DB query because PostgREST's ascending order on the role TEXT
// column happens to put 'counselor' before 'head' alphabetically — which is
// the opposite of what we want.
export async function listAgencyMembers(
  agencyId: string,
): Promise<AgencyMembership[]> {
  const db = createAdminSupabase();
  const { data } = await db
    .from("cc_agency_members")
    .select("*")
    .eq("agency_id", agencyId)
    .order("joined_at", { ascending: true });
  const rows = (data ?? []) as Row[];
  rows.sort((a, b) =>
    a.role === b.role
      ? a.joined_at.localeCompare(b.joined_at)
      : a.role === "head"
        ? -1
        : 1,
  );
  return rows.map(rowToMembership);
}

// Add a member. Throws on FK violation or duplicate primary key — callers
// should catch and surface a sensible error message (e.g. "already a member").
export async function addAgencyMember(
  agencyId: string,
  userId: string,
  role: "head" | "counselor",
  requiresReview = false,
): Promise<void> {
  const db = createAdminSupabase();
  const { error } = await db
    .from("cc_agency_members")
    .insert({
      agency_id: agencyId,
      user_id: userId,
      role,
      requires_review: requiresReview,
    });
  if (error) throw error;
}

export async function removeAgencyMember(
  agencyId: string,
  userId: string,
): Promise<void> {
  const db = createAdminSupabase();
  const { error } = await db
    .from("cc_agency_members")
    .delete()
    .eq("agency_id", agencyId)
    .eq("user_id", userId);
  if (error) throw error;
}

// Toggle the head-review flag for a single counselor. Used by the agency
// head from /counselor/agency/members when a junior counselor graduates out
// of supervision (or, less happily, needs to be put back under review).
export async function setRequiresReview(
  agencyId: string,
  userId: string,
  requiresReview: boolean,
): Promise<void> {
  const db = createAdminSupabase();
  const { error } = await db
    .from("cc_agency_members")
    .update({ requires_review: requiresReview })
    .eq("agency_id", agencyId)
    .eq("user_id", userId);
  if (error) throw error;
}

// Promote/demote between head and counselor. Phase 1 doesn't expose this in
// the UI (heads are seeded at agency creation), but the helper exists so
// admin tooling has a single chokepoint to go through.
export async function setMemberRole(
  agencyId: string,
  userId: string,
  role: "head" | "counselor",
): Promise<void> {
  const db = createAdminSupabase();
  const { error } = await db
    .from("cc_agency_members")
    .update({ role })
    .eq("agency_id", agencyId)
    .eq("user_id", userId);
  if (error) throw error;
}
