// The dashboard-suggestions switch reuses the existing observation preference
// (cc_student_profiles.dashboard_observations_enabled) through the existing
// identity PATCH. No new table, no new route.
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createFakeSupabase, type FakeSupabase } from "@/lib/cc/__tests__/helpers/fake-supabase";

const ME = "a11ce000-0000-4000-8000-000000000001";
const h = vi.hoisted(() => ({ world: null as unknown }));
vi.mock("../helpers", () => ({
  requireAuth: async () => ({ user: { id: "a11ce000-0000-4000-8000-000000000001" }, supabase: h.world }),
  unauthorized: () => new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }),
  createAdminSupabase: () => h.world,
}));
import { PATCH } from "../profile/identity/route";

const req = (body: unknown) =>
  new Request("http://localhost/api/cc/profile/identity", { method: "PATCH", body: JSON.stringify(body) }) as unknown as Parameters<typeof PATCH>[0];

let world: FakeSupabase;
beforeEach(() => {
  world = createFakeSupabase({ cc_student_profiles: [{ id: "p1", user_id: ME, grade_level: null, dashboard_observations_enabled: true }] });
  h.world = world;
});

describe("PATCH /api/cc/profile/identity", () => {
  it("saves the dashboard suggestions preference", async () => {
    const res = await PATCH(req({ dashboard_observations_enabled: false }));
    expect(res.status).toBe(200);
    expect(world.tables.cc_student_profiles[0].dashboard_observations_enabled).toBe(false);
  });

  it("rejects a non-boolean preference", async () => {
    const res = await PATCH(req({ dashboard_observations_enabled: "no" }));
    expect(res.status).toBe(400);
    expect(world.tables.cc_student_profiles[0].dashboard_observations_enabled).toBe(true);
  });

  it("still saves a grade (the unknown-grade question on Today)", async () => {
    expect((await PATCH(req({ grade_level: 11 }))).status).toBe(200);
    expect(world.tables.cc_student_profiles[0].grade_level).toBe(11);
  });
});
