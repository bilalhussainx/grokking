import { describe, it, expect, vi, beforeEach } from "vitest";

const h = vi.hoisted(() => ({ result: "ok" as string | null, error: null as unknown, calls: [] as unknown[][] }));
vi.mock("@/lib/supabase-auth", () => ({
  createAdminSupabase: () => ({
    rpc: async (fn: string, args: unknown) => { h.calls.push([fn, args]); return { data: h.result, error: h.error }; },
  }),
}));
import { makeCreditBilling } from "../credit-reservations";

beforeEach(() => { h.result = "ok"; h.error = null; h.calls = []; });

describe("makeCreditBilling", () => {
  const billing = makeCreditBilling("u1");

  it("passes the actor, key and amount to the RPCs", async () => {
    await billing.reserve("op-1", 3);
    await billing.capture("op-1", 1);
    await billing.release("op-2");
    expect(h.calls).toEqual([
      ["reserve_credits", { p_user_id: "u1", p_key: "op-1", p_max: 3 }],
      ["capture_credits", { p_user_id: "u1", p_key: "op-1", p_final: 1 }],
      ["release_credits", { p_user_id: "u1", p_key: "op-2" }],
    ]);
  });

  it.each(["insufficient_credits", "reservation_conflict", "already_captured", "already_released", "not_reserved", "over_reservation"])(
    "maps %s to a BillingError", async (code) => {
      h.result = code;
      await expect(billing.reserve("op", 1)).rejects.toMatchObject({ name: "BillingError", code });
    });

  it("maps an RPC failure to billing_unavailable (never treated as success)", async () => {
    h.result = null; h.error = { message: "down" };
    await expect(billing.capture("op", 1)).rejects.toMatchObject({ code: "billing_unavailable" });
  });

  it("rejects negative or non-integer amounts before calling the database", async () => {
    await expect(billing.reserve("op", -1)).rejects.toMatchObject({ code: "over_reservation" });
    await expect(billing.capture("op", 1.5)).rejects.toMatchObject({ code: "over_reservation" });
    expect(h.calls).toEqual([]);
  });
});
