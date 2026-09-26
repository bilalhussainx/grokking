import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/supabase-server", () => ({
  createAdminSupabase: () => ({
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { tier: "pro" } }) }) }) }),
  }),
}));
import { TIER_CAPS, assertCapacity, blockedResponse } from "../tier-gate";

describe("Pro fair use", () => {
  it("caps Pro coach messages and voice minutes at fair-use defaults", () => {
    expect(TIER_CAPS.pro.coachMessagesPerDay).toBe(300);
    expect(TIER_CAPS.pro.coachVoiceMinutesPerDay).toBe(120);
  });

  it("a Pro user over the limit gets a 429 fair-use response, not a paywall", async () => {
    const r = await assertCapacity("u1", "coachMessagesPerDay", 300);
    expect(r.ok).toBe(false);
    if (r.ok) return;
    const res = blockedResponse(r);
    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.fairUse).toBe(true);
    expect(body.error).toMatch(/fair[- ]use/i);
  });
});
