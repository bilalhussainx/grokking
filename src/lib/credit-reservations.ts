// Exactly-once credit settlement for multi-step operations (agent turns,
// refresh jobs): reserve holds credits, capture keeps the final amount and
// refunds the rest, release refunds everything. The database enforces
// idempotency per (user, operationKey); see 20260925_credit_reservations.sql.
import { createAdminSupabase } from "@/lib/supabase-auth";

export type BillingErrorCode =
  | "insufficient_credits" | "reservation_conflict" | "already_captured" | "already_released"
  | "not_reserved" | "over_reservation" | "billing_unavailable";

export class BillingError extends Error {
  name = "BillingError";
  constructor(public code: BillingErrorCode) { super(code); }
}

export interface BillingPort {
  reserve(operationKey: string, maxCredits: number): Promise<void>;
  capture(operationKey: string, finalCredits: number): Promise<void>;
  release(operationKey: string): Promise<void>;
}

const CODES = new Set<string>(["insufficient_credits", "reservation_conflict", "already_captured", "already_released", "not_reserved", "over_reservation"]);

export function makeCreditBilling(userId: string): BillingPort {
  const call = async (fn: string, args: Record<string, unknown>) => {
    const { data, error } = await createAdminSupabase().rpc(fn, args);
    if (error || typeof data !== "string") throw new BillingError("billing_unavailable");
    if (data === "ok") return;
    throw new BillingError(CODES.has(data) ? (data as BillingErrorCode) : "billing_unavailable");
  };
  const amount = (n: number) => { if (!Number.isInteger(n) || n < 0) throw new BillingError("over_reservation"); return n; };
  return {
    reserve: async (key, max) => call("reserve_credits", { p_user_id: userId, p_key: key, p_max: amount(max) }),
    capture: async (key, final) => call("capture_credits", { p_user_id: userId, p_key: key, p_final: amount(final) }),
    release: async (key) => call("release_credits", { p_user_id: userId, p_key: key }),
  };
}
