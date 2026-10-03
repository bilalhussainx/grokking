import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "../onboard/route";

const h = vi.hoisted(() => ({ ensure: vi.fn() }));

vi.mock("@/lib/supabase-auth", () => ({
  createServerSupabase: async () => ({
    auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
  }),
}));
vi.mock("@/lib/cc/counselor-helpers", () => ({
  ensureCounselorProfile: (...args: unknown[]) => h.ensure(...args),
}));

const post = (body: unknown) =>
  new NextRequest("http://localhost/api/counselor/onboard", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

beforeEach(() => {
  h.ensure.mockReset();
  h.ensure.mockResolvedValue({ id: "c-1", slug: "sam-lee", display_name: "Sam Lee", agency_id: null });
});

describe("POST /api/counselor/onboard", () => {
  // Agency affiliation shows on the agency's public page. It comes only from
  // creating an agency or being added by its head, never from typing a slug.
  it("ignores a self-claimed agency slug", async () => {
    const res = await POST(post({ displayName: "Sam Lee", agencySlug: "ad-astra" }));
    expect(res.status).toBe(200);
    expect(h.ensure).toHaveBeenCalledWith("user-1", { displayName: "Sam Lee" });
  });

  it("still requires a display name", async () => {
    const res = await POST(post({ displayName: "S" }));
    expect(res.status).toBe(400);
    expect(h.ensure).not.toHaveBeenCalled();
  });
});
