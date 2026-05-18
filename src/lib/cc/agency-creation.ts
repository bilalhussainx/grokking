// src/lib/cc/agency-creation.ts
//
// Single chokepoint for "a new counselor wants to start an agency and be its
// head". Coordinates three writes that have to happen together:
//   1. ensure the caller has a cc_counselors row (idempotent)
//   2. insert the cc_agencies row (or recognize an existing one owned by the
//      caller — keeps the onboarding POST idempotent on slug)
//   3. insert the cc_agency_members head row
//
// Postgres lacks a cross-table transaction over PostgREST so this is best-
// effort sequential; the head-membership step is the last thing that can fail
// and we fail loudly when it does. The idempotency path catches the common
// "user double-clicks the onboarding submit" case without needing a real txn.
//
// Throws on slug conflict when the slug is taken by another head or by a
// different agency the caller isn't part of. Returns the existing agency when
// the caller is already its head.

import { createAdminSupabase } from "@/lib/supabase-server";
import { ensureCounselorProfile } from "./counselor-helpers";
import { addAgencyMember, getAgencyMembership } from "./agency-membership";

export interface CreateAgencyInput {
  name: string;
  slug: string;
  displayName: string;
  websiteUrl?: string;
  country?: string;
}

export interface CreateAgencyResult {
  agencyId: string;
  agencySlug: string;
}

export async function createAgencyAndMakeHead(
  userId: string,
  input: CreateAgencyInput,
): Promise<CreateAgencyResult> {
  const db = createAdminSupabase();

  // Make sure the caller has a counselor row first — addAgencyMember has an
  // FK on cc_counselors via user_id only loosely (membership uses auth user
  // id) but downstream UI assumes "if I'm a head, I'm also a counselor".
  await ensureCounselorProfile(userId, { displayName: input.displayName });

  // Slug is the unique key on cc_agencies. Look it up before inserting so we
  // can return the existing row when the caller is already its head, or fail
  // with a useful message when it's taken by someone else.
  const { data: existing } = await db
    .from("cc_agencies")
    .select("id, slug")
    .eq("slug", input.slug)
    .maybeSingle();

  if (existing) {
    const membership = await getAgencyMembership(userId, existing.id as string);
    if (membership && membership.role === "head") {
      return {
        agencyId: existing.id as string,
        agencySlug: existing.slug as string,
      };
    }
    if (membership) {
      throw new Error(
        `slug already taken — you are a ${membership.role} of "${existing.slug}", not the head`,
      );
    }
    throw new Error(`slug "${input.slug}" already taken by another agency`);
  }

  const { data: created, error } = await db
    .from("cc_agencies")
    .insert({
      slug: input.slug,
      name: input.name,
      website_url: input.websiteUrl ?? null,
      country: input.country ?? "US",
    })
    .select("id")
    .single();
  if (error || !created) {
    throw new Error(`agency insert failed: ${error?.message ?? "unknown"}`);
  }
  const agencyId = created.id as string;

  await addAgencyMember(agencyId, userId, "head", false);
  return { agencyId, agencySlug: input.slug };
}
