// The public agency page lists the agency's counselors. Membership lives in
// cc_agency_members; cc_counselors.agency_id is no longer set by anything,
// so listing by it showed nobody.
import fs from "node:fs";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createFakeSupabase } from "./helpers/fake-supabase";

const h = vi.hoisted(() => ({ world: null as unknown }));
vi.mock("@/lib/supabase-server", () => ({ createAdminSupabase: () => h.world }));

import { listPublicAgencyCounselors } from "../counselor-helpers";

const AGENCY = "a9e0c700-0000-4000-8000-00000000000a";
const OTHER = "a9e0c700-0000-4000-8000-00000000000b";
const counselor = (user_id: string, over: Record<string, unknown> = {}) => ({
  id: `c-${user_id}`, user_id, agency_id: null, slug: user_id, display_name: user_id.toUpperCase(), headline: null,
  photo_url: null, verified: false, total_sessions: 0, average_rating: null, total_reviews: 0,
  stripe_account_id: "acct_secret", payout_status: "pending", hourly_rate_usd: 100, ...over,
});

beforeEach(() => {
  h.world = createFakeSupabase({
    cc_agency_members: [
      { agency_id: AGENCY, user_id: "head", role: "head", requires_review: false, joined_at: "2026-05-01" },
      { agency_id: AGENCY, user_id: "rated", role: "counselor", requires_review: false, joined_at: "2026-05-02" },
      { agency_id: AGENCY, user_id: "no-profile", role: "counselor", requires_review: true, joined_at: "2026-05-03" },
      { agency_id: OTHER, user_id: "elsewhere", role: "counselor", requires_review: false, joined_at: "2026-05-04" },
    ],
    cc_counselors: [
      counselor("head"),
      counselor("rated", { verified: true, average_rating: 4.8 }),
      counselor("elsewhere"),
      // Legacy agency_id pointing here, but not a member: not listed.
      counselor("legacy", { agency_id: AGENCY }),
    ],
  });
});

describe("listPublicAgencyCounselors", () => {
  it("lists members who have a counselor profile, verified first", async () => {
    const list = await listPublicAgencyCounselors(AGENCY);
    expect(list.map((c) => c.slug)).toEqual(["rated", "head"]);
  });

  it("returns only public fields", async () => {
    const [first] = await listPublicAgencyCounselors(AGENCY);
    expect(Object.keys(first).sort()).toEqual(
      ["average_rating", "display_name", "headline", "photo_url", "slug", "total_reviews", "total_sessions", "verified"],
    );
  });

  it("returns an empty list for an agency with no members", async () => {
    expect(await listPublicAgencyCounselors("a9e0c700-0000-4000-8000-0000000000ff")).toEqual([]);
  });
});

describe("/agencies/[slug] page", () => {
  it("lists counselors through membership, not cc_counselors.agency_id", () => {
    const page = fs.readFileSync("src/app/agencies/[slug]/page.tsx", "utf8");
    expect(page).toMatch(/listPublicAgencyCounselors\(agency\.id\)/);
    expect(page).not.toMatch(/from\("cc_counselors"\)/);
  });
});
