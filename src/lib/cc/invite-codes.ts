// src/lib/cc/invite-codes.ts
//
// Mint / list / revoke / redeem helpers for cc_agency_invite_codes — the
// "warm onboarding" path where an agency head hands a printed/emailed code
// to a student so they bypass the cold marketplace search.
//
// Code format: <AGENCY-SLUG-UPPER>-<6 chars>. The 6-char suffix uses a
// Crockford-ish alphabet (no I/O/0/1) for legibility on paper and over the
// phone. Collisions are extremely unlikely but we retry on the unique-violation
// SQLSTATE just in case.
//
// Redemption is structured as: validate → resolve assigned counselor →
// CLAIM a use of the code (optimistic-concurrency UPDATE with affected-row
// detection) → upsert link (rolling the claim back if the link fails). The
// claim-first ordering means a race between two concurrent redeems of the same
// single-use code can only succeed once: the loser's UPDATE matches zero rows
// (it must verify a row came back, since a no-match Supabase UPDATE returns
// error:null), so it never creates a link. The link upsert is idempotent on
// (agency_id, student_user_id).

import { createAdminSupabase } from "@/lib/supabase-server";
import { randomBytes } from "crypto";

export interface InviteCode {
  id: string;
  agencyId: string;
  code: string;
  preassignedCounselorUserId: string | null;
  label: string | null;
  maxUses: number;
  usedCount: number;
  expiresAt: string | null;
  revokedAt: string | null;
  createdByUserId: string;
  createdAt: string;
}

interface Row {
  id: string;
  agency_id: string;
  code: string;
  preassigned_counselor_user_id: string | null;
  label: string | null;
  max_uses: number;
  used_count: number;
  expires_at: string | null;
  revoked_at: string | null;
  created_by_user_id: string;
  created_at: string;
}

function rowToCode(r: Row): InviteCode {
  return {
    id: r.id,
    agencyId: r.agency_id,
    code: r.code,
    preassignedCounselorUserId: r.preassigned_counselor_user_id,
    label: r.label,
    maxUses: r.max_uses,
    usedCount: r.used_count,
    expiresAt: r.expires_at,
    revokedAt: r.revoked_at,
    createdByUserId: r.created_by_user_id,
    createdAt: r.created_at,
  };
}

// No I, O, 0, 1 for legibility (couriers / verbal sharing).
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateCodeString(agencySlug: string): string {
  const bytes = randomBytes(8);
  let suffix = "";
  for (let i = 0; i < 6; i++) suffix += ALPHABET[bytes[i] % ALPHABET.length];
  return `${agencySlug.toUpperCase()}-${suffix}`;
}

export interface MintOpts {
  label?: string;
  maxUses?: number;
  expiresAt?: string;
  preassignedCounselorUserId?: string;
}

export async function mintInviteCode(
  agencyId: string,
  createdByUserId: string,
  opts: MintOpts = {},
): Promise<InviteCode> {
  const db = createAdminSupabase();
  const { data: agency } = await db
    .from("cc_agencies")
    .select("slug")
    .eq("id", agencyId)
    .single();
  if (!agency) throw new Error("agency not found");

  // Retry up to 5 times in the (extremely unlikely) case of a collision.
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateCodeString(agency.slug as string);
    const { data, error } = await db
      .from("cc_agency_invite_codes")
      .insert({
        agency_id: agencyId,
        code,
        preassigned_counselor_user_id: opts.preassignedCounselorUserId ?? null,
        label: opts.label ?? null,
        max_uses: opts.maxUses ?? 1,
        expires_at: opts.expiresAt ?? null,
        created_by_user_id: createdByUserId,
      })
      .select("*")
      .single<Row>();
    if (!error && data) return rowToCode(data);
    if (error && error.code === "23505") continue; // unique violation, retry
    throw new Error(`mintInviteCode failed: ${error?.message ?? "unknown"}`);
  }
  throw new Error("mintInviteCode: exhausted collision retries");
}

export async function listInviteCodes(agencyId: string): Promise<InviteCode[]> {
  const db = createAdminSupabase();
  const { data } = await db
    .from("cc_agency_invite_codes")
    .select("*")
    .eq("agency_id", agencyId)
    .order("created_at", { ascending: false });
  return ((data ?? []) as Row[]).map(rowToCode);
}

export async function revokeInviteCode(
  id: string,
  agencyId: string,
): Promise<void> {
  const db = createAdminSupabase();
  const { error } = await db
    .from("cc_agency_invite_codes")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", id)
    .eq("agency_id", agencyId);
  if (error) throw error;
}

export interface RedeemResult {
  linkId: string;
  agencyId: string;
  counselorUserId: string;
}

export async function redeemInviteCode(
  code: string,
  studentUserId: string,
): Promise<RedeemResult> {
  const db = createAdminSupabase();
  const { data: row } = await db
    .from("cc_agency_invite_codes")
    .select("*")
    .eq("code", code)
    .maybeSingle<Row>();
  if (!row) throw new Error("code not found");
  if (row.revoked_at) throw new Error("code revoked");
  if (row.expires_at && new Date(row.expires_at) < new Date()) {
    throw new Error("code expired");
  }
  if (row.used_count >= row.max_uses) {
    throw new Error("code exhausted (already at max_uses)");
  }

  // Pick assigned counselor: preassigned, or fall back to first head of agency.
  let counselorUserId: string | null = row.preassigned_counselor_user_id;
  if (!counselorUserId) {
    const { data: head } = await db
      .from("cc_agency_members")
      .select("user_id")
      .eq("agency_id", row.agency_id)
      .eq("role", "head")
      .order("joined_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (!head) {
      throw new Error("agency has no head — code cannot be redeemed");
    }
    counselorUserId = head.user_id as string;
  }
  // Narrowed: both branches above guarantee a non-null counselor here.
  const resolvedCounselorUserId: string = counselorUserId;

  // Claim a use of the code FIRST, with optimistic concurrency. The WHERE
  // clause guards against both a stale read (used_count changed under us) and
  // exhaustion (used_count already at max). We .select() so we can detect the
  // zero-rows case: a Supabase UPDATE that matches no rows returns error:null,
  // so checking `error` alone is NOT enough — we must verify a row came back.
  const { data: claimed, error: claimError } = await db
    .from("cc_agency_invite_codes")
    .update({ used_count: row.used_count + 1 })
    .eq("id", row.id)
    .eq("used_count", row.used_count)        // CAS: only if unchanged since our read
    .lt("used_count", row.max_uses)          // belt-and-suspenders exhaustion guard
    .select("id")
    .maybeSingle();
  if (claimError) {
    throw new Error(`code claim failed: ${claimError.message}`);
  }
  if (!claimed) {
    // Zero rows updated: someone else claimed the last use between our read
    // and our write (or it's now exhausted). This is the race-loser path.
    throw new Error("code exhausted (already at max_uses)");
  }

  // Slot is ours. Now create the link. If THIS fails, roll the counter back
  // so the use isn't consumed without a link.
  const { data: link, error: linkError } = await db
    .from("cc_student_counselor_links")
    .upsert({
      agency_id: row.agency_id,
      student_user_id: studentUserId,
      primary_counselor_user_id: resolvedCounselorUserId,
      linked_via_code_id: row.id,
      status: "active",
    }, { onConflict: "agency_id,student_user_id" })
    .select("id")
    .single();
  if (linkError || !link) {
    // Best-effort rollback of the claim so the code isn't silently burned.
    const { error: rollbackError } = await db
      .from("cc_agency_invite_codes")
      .update({ used_count: row.used_count })
      .eq("id", row.id)
      .eq("used_count", row.used_count + 1);   // only roll back OUR increment
    if (rollbackError) {
      console.error(
        `[invite-codes] link upsert failed AND counter rollback failed for code ${row.id}: ${rollbackError.message}`,
      );
    }
    throw new Error(`link upsert failed: ${linkError?.message ?? "unknown"}`);
  }

  return { linkId: link.id as string, agencyId: row.agency_id, counselorUserId: resolvedCounselorUserId };
}
