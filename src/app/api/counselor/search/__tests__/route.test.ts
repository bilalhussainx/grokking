// /api/counselor/search backs the public /find-counselor page, so signed-out
// visitors can call it. It must return marketplace-profile fields only:
// never the counselor's auth user id or Stripe payout details.
import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { isPublicRoute } from "@/middleware";

vi.mock("@/lib/cc/counselor-helpers", () => ({
  searchCounselors: async () => [{
    id: "c1", slug: "jane", display_name: "Jane", headline: "Essays", bio: "b", photo_url: null,
    years_experience: 5, specialties: ["essays"], languages: ["en"], hourly_rate_usd: 90,
    accepts_new_students: true, verified: true, total_sessions: 3, average_rating: 4.8, total_reviews: 2,
    agency_name: "A", agency_slug: "a", agency_verified: true, matched_school_admits: 0,
    user_id: "auth-user-uuid", stripe_account_id: "acct_123", payout_status: "active", agency_id: "ag1",
    created_at: "2026-01-01", updated_at: "2026-01-02",
  }],
}));
vi.mock("@supabase/ssr", () => ({ createServerClient: () => ({ auth: { getUser: async () => ({ data: { user: null } }) } }) }));

import { GET } from "../route";

describe("counselor search", () => {
  it("is public, like the /find-counselor page it backs", () => {
    expect(isPublicRoute("/api/counselor/search")).toBe(true);
  });

  it("returns only public profile fields", async () => {
    const body = await (await GET(new NextRequest("http://l/api/counselor/search?q=jane"))).json();
    const c = body.counselors[0];
    expect(c.display_name).toBe("Jane");
    expect(c.slug).toBe("jane");
    for (const secret of ["user_id", "stripe_account_id", "payout_status", "agency_id"]) {
      expect(c).not.toHaveProperty(secret);
    }
  });
});
