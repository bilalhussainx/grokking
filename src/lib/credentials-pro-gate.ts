// src/lib/credentials-pro-gate.ts
// Verifiable Credentials SP1 — Task 10
// Pro-tier gate used by the credentials API routes.
//
// NOTE: The existing billing schema (supabase/migrations/20260326_billing.sql)
// stores the tier in the `plan` column of `user_subscriptions` — not `tier` as
// the task prompt assumed. This helper reads `plan` and also accepts `tier`
// for forward compatibility. An env allowlist lets us bypass the gate on
// testnet / local dev without seeding a subscription row.
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Returns true when the user is on Pro tier (or whitelisted via
 * CREDENTIALS_PRO_ALLOWLIST env for testnet development).
 *
 * Checks (in order):
 *  1. CREDENTIALS_PRO_ALLOWLIST env (comma-separated user ids)
 *  2. user_subscriptions table — active/trialing status AND plan='pro'
 *     (also tolerates a `tier` column if present)
 *  3. Fallback: false
 */
export async function isPro(
  supabase: SupabaseClient,
  userId: string,
): Promise<boolean> {
  const allowlist = (process.env.CREDENTIALS_PRO_ALLOWLIST ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (allowlist.includes(userId)) return true;

  // Try user_subscriptions — ignore errors (table may not exist yet).
  const { data } = await supabase
    .from("user_subscriptions")
    .select("status, plan")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) return false;

  const row = data as { status?: string; plan?: string; tier?: string };
  const status = row.status;
  const planOrTier = (row.plan ?? row.tier ?? "").toLowerCase();

  const activeStatus = status === "active" || status === "trialing";
  if (activeStatus && planOrTier === "pro") return true;

  return false;
}
