import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "../invite-codes/route";

const h = vi.hoisted(() => ({
  members: new Set<string>(),
  mint: null as unknown as (...args: unknown[]) => Promise<unknown>,
}));

vi.mock("@/lib/supabase-auth", () => ({ getAuthUser: async () => ({ id: "head-1" }) }));
vi.mock("@/lib/cc/agency-membership", () => ({
  getAnyAgencyMembership: async () => ({ role: "head", agencyId: "agency-A", requiresReview: false }),
  getAgencyMembership: async (userId: string) => (h.members.has(userId) ? { role: "counselor" } : null),
}));
vi.mock("@/lib/cc/invite-codes", () => ({
  mintInviteCode: (...args: unknown[]) => h.mint(...args),
  listInviteCodes: async () => [],
}));

const post = (body: unknown) =>
  new NextRequest("http://localhost/api/counselor/invite-codes", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

let mint: ReturnType<typeof vi.fn>;

beforeEach(() => {
  h.members = new Set(["zuha"]);
  mint = vi.fn(async () => ({ code: "ADASTRA-K7M9P2" }));
  h.mint = mint;
});

describe("POST /api/counselor/invite-codes preassignment", () => {
  it("rejects a preassigned counselor outside the head's agency", async () => {
    const res = await POST(post({ preassignedCounselorUserId: "stranger" }));
    expect(res.status).toBe(400);
    expect(mint).not.toHaveBeenCalled();
  });

  it("mints with a preassigned counselor from the same agency", async () => {
    const res = await POST(post({ preassignedCounselorUserId: "zuha" }));
    expect(res.status).toBe(201);
    expect(mint).toHaveBeenCalledWith("agency-A", "head-1", expect.objectContaining({ preassignedCounselorUserId: "zuha" }));
  });

  it("mints without preassignment as before", async () => {
    const res = await POST(post({ label: "Fall cohort" }));
    expect(res.status).toBe(201);
  });
});
