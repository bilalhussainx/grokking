import { describe, it, expect, vi, beforeEach } from "vitest";
import { createFakeSupabase } from "@/lib/cc/__tests__/helpers/fake-supabase";
import { GET } from "../my-counselor/route";

const STUDENT = "a11ce000-0000-4000-8000-000000000001";
const h = vi.hoisted(() => ({ world: null as unknown, user: "a11ce000-0000-4000-8000-000000000001" as string | null }));
vi.mock("../helpers", () => ({
  requireAuth: async () => (h.user ? { user: { id: h.user }, supabase: {} } : null),
  unauthorized: () => new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }),
  createAdminSupabase: () => h.world,
}));

const link = (over: Record<string, unknown> = {}) => ({
  id: "l1", agency_id: "ag1", student_user_id: STUDENT, primary_counselor_user_id: "c-user",
  status: "active", linked_at: "2026-09-20T00:00:00Z", ...over,
});

beforeEach(() => {
  h.user = STUDENT;
  h.world = createFakeSupabase({
    cc_student_counselor_links: [link()],
    cc_agencies: [{ id: "ag1", name: "Ad Astra Counseling" }],
    cc_counselors: [{ user_id: "c-user", display_name: "Ms. Rivera" }],
  });
});

describe("GET /api/cc/my-counselor", () => {
  it("names the student's counselor and agency", async () => {
    const json = await (await GET()).json();
    expect(json.counselor).toEqual({ displayName: "Ms. Rivera", agencyName: "Ad Astra Counseling", linkedAt: "2026-09-20T00:00:00Z" });
  });

  it("falls back to the agency name when there is no primary counselor", async () => {
    h.world = createFakeSupabase({
      cc_student_counselor_links: [link({ primary_counselor_user_id: null })],
      cc_agencies: [{ id: "ag1", name: "Ad Astra Counseling" }],
      cc_counselors: [],
    });
    const json = await (await GET()).json();
    expect(json.counselor.displayName).toBe("Ad Astra Counseling");
  });

  it("returns null for an unlinked or ended link", async () => {
    h.world = createFakeSupabase({ cc_student_counselor_links: [link({ status: "ended" })], cc_agencies: [], cc_counselors: [] });
    expect((await (await GET()).json()).counselor).toBeNull();
  });

  it("401s when signed out", async () => {
    h.user = null;
    expect((await GET()).status).toBe(401);
  });
});
