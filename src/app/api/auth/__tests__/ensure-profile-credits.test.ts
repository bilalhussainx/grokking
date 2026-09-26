// New signups get PRICING.free.signupCredits (200) once. ensure-profile runs on
// every session load; it must top up to that amount, never to the old 300.
import { describe, it, expect, vi, beforeEach } from "vitest";

const h = vi.hoisted(() => ({ granted: 0, rpc: vi.fn() }));
vi.mock("@/lib/supabase-auth", () => {
  const chain = (result: unknown) => {
    const q: Record<string, unknown> = {};
    for (const m of ["select", "eq", "update", "upsert"]) q[m] = () => q;
    q.maybeSingle = async () => result;
    q.single = async () => ({ data: { id: "u1" } });
    q.then = (res: (v: unknown) => unknown) => Promise.resolve(result).then(res);
    return q;
  };
  return {
    createServerSupabase: async () => ({ auth: { getUser: async () => ({ data: { user: { id: "u1", email: "s@x.io", user_metadata: {} } } }) } }),
    createAdminSupabase: () => ({
      from: (table: string) =>
        table === "credit_txns"
          ? chain({ data: h.granted ? [{ amount: h.granted }] : [] })
          : chain({ data: { id: "u1", trial_ends_at: "2026-10-01T00:00:00Z" } }),
      rpc: h.rpc,
    }),
  };
});
import { POST } from "../ensure-profile/route";

beforeEach(() => { h.rpc.mockReset().mockResolvedValue({ data: 200, error: null }); });

describe("ensure-profile signup credits", () => {
  it("does not top a 200-credit signup back up to 300", async () => {
    h.granted = 200;
    await POST();
    expect(h.rpc).not.toHaveBeenCalledWith("add_credits", expect.anything());
  });

  it("grants the missing signup credits up to 200 when none were granted", async () => {
    h.granted = 0;
    await POST();
    expect(h.rpc).toHaveBeenCalledWith("add_credits", { p_user_id: "u1", p_amount: 200, p_action: "signup_bonus" });
  });
});
