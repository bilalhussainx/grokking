import { describe, it, expect, vi } from "vitest";
import fs from "node:fs";

const h = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock("@/lib/cc/tier-gate", () => ({ getTier: async () => "free" }));
vi.mock("@/lib/supabase-auth", () => ({
  createAdminSupabase: () => ({
    rpc: h.rpc,
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null }) }) }) }),
  }),
}));
import { deductCredits } from "../credits";

describe("signup credits", () => {
  it("backfills a missing credit row with 200, not 300", async () => {
    h.rpc.mockImplementation(async (fn: string) => ({ data: fn === "deduct_credits" ? false : 200, error: null }));
    await deductCredits("u1", 1, "coach_text");
    expect(h.rpc).toHaveBeenCalledWith("add_credits", { p_user_id: "u1", p_amount: 200, p_action: "signup_bonus" });
  });

  it("the migration grants 200 credits and a 7-day trial", () => {
    const sql = fs.readFileSync("supabase/migrations/20260925_pricing_200_credits_7day_trial.sql", "utf8");
    expect(sql).toMatch(/VALUES \(NEW\.id, 200\)/);
    expect(sql).toMatch(/VALUES \(NEW\.id, 200, 'signup_bonus'\)/);
    expect(sql).toMatch(/INTERVAL '7 days'/);
    expect(sql).not.toMatch(/300|INTERVAL '30 days'/);
  });
});
