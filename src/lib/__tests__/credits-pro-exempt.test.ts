// Pro is "unlimited under fair use" (founder, 2026-09-25): tier-gate's daily
// caps are the limit, so Pro users don't spend credits. Nothing refills
// credits, so charging Pro would lock paying users out.
import { describe, it, expect, vi, beforeEach } from "vitest";

const h = vi.hoisted(() => ({ tier: "free" as string, rpc: vi.fn() }));
vi.mock("@/lib/cc/tier-gate", () => ({ getTier: async () => h.tier }));
vi.mock("@/lib/supabase-auth", () => ({
  createAdminSupabase: () => ({
    rpc: h.rpc,
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { user_id: "u1" } }) }) }) }),
  }),
}));
import { deductCredits } from "../credits";

beforeEach(() => { h.rpc.mockReset().mockResolvedValue({ data: true, error: null }); });

describe("deductCredits and Pro", () => {
  it("does not charge a Pro user", async () => {
    h.tier = "pro";
    expect(await deductCredits("u1", 5, "interview")).toBe(true);
    expect(h.rpc).not.toHaveBeenCalled();
  });

  it("still charges free users", async () => {
    h.tier = "free";
    expect(await deductCredits("u1", 5, "interview")).toBe(true);
    expect(h.rpc).toHaveBeenCalledWith("deduct_credits", { p_user_id: "u1", p_amount: 5, p_action: "interview", p_ref_id: null });
  });
});
