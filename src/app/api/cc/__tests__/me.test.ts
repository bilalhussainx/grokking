// /api/cc/me was called by four pages (schools, applications, home,
// transfer profile) but never existed; the transfer profile couldn't pre-fill.
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createFakeSupabase } from "@/lib/cc/__tests__/helpers/fake-supabase";
import { GET } from "../me/route";

const ME = "a11ce000-0000-4000-8000-000000000001";
const h = vi.hoisted(() => ({ world: null as unknown, user: "a11ce000-0000-4000-8000-000000000001" as string | null }));
vi.mock("../helpers", () => ({
  requireAuth: async () => (h.user ? { user: { id: h.user }, supabase: {} } : null),
  unauthorized: () => new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }),
  createAdminSupabase: () => h.world,
}));

const row = (id: string, user_id: string, over: Record<string, unknown> = {}) => ({
  id, user_id, preferred_name: "Ada", grade_level: null, is_transfer_student: true, is_international: false,
  affordability_value: "under_10k", needs_full_aid: true, transfer_current_school: "QA Community College",
  transfer_credits_completed: 30, transfer_target_term: "Fall 2027", transfer_reason: "program fit", ...over,
});

beforeEach(() => { h.user = ME; });

describe("GET /api/cc/me", () => {
  it("returns the caller's own profile fields", async () => {
    h.world = createFakeSupabase({ cc_student_profiles: [row("p1", ME), row("p9", "someone-else", { preferred_name: "Other" })] });
    const json = await (await GET()).json();
    expect(json.profile).toMatchObject({ id: "p1", is_transfer_student: true, transfer_current_school: "QA Community College" });
    expect(json.profile.preferred_name).toBe("Ada");
  });

  it("is deterministic when a user has duplicate profile rows", async () => {
    h.world = createFakeSupabase({ cc_student_profiles: [row("p2", ME), row("p1", ME)] });
    expect((await (await GET()).json()).profile.id).toBe("p1");
  });

  it("returns profile null (200) when the user has no row yet", async () => {
    h.world = createFakeSupabase({ cc_student_profiles: [row("p9", "someone-else")] });
    const res = await GET();
    expect(res.status).toBe(200);
    expect((await res.json()).profile).toBeNull();
  });

  it("401s when signed out", async () => {
    h.user = null;
    expect((await GET()).status).toBe(401);
  });
});
