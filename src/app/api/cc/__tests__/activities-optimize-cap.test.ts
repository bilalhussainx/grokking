// A full Common App activities list (10) is normal. The optimizer used to
// block at 10 (usage < limit), locking out every student who filled all
// slots. It must cap the rows it optimizes at the tier allowance instead.
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createFakeSupabase } from "@/lib/cc/__tests__/helpers/fake-supabase";
import { POST } from "../activities/optimize/route";

const U = "a11ce000-0000-4000-8000-000000000001";
const P = "a11ce000-1111-4000-8000-000000000001";
const h = vi.hoisted(() => ({ world: null as unknown, prompts: [] as string[], modelActivities: [] as { position: number; impactScore: number }[] }));

vi.mock("../helpers", () => ({
  requireAuth: async () => ({ user: { id: "a11ce000-0000-4000-8000-000000000001" }, supabase: {} }),
  unauthorized: () => new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }),
  createAdminSupabase: () => h.world,
}));
vi.mock("@/lib/supabase-server", () => ({ createAdminSupabase: () => h.world }));
vi.mock("@/lib/credits", () => ({ CREDIT_COSTS: { coach_text: 1 }, deductCredits: async () => true }));
vi.mock("@/lib/cc/llm-stream", () => ({
  callLLMJSON: async (messages: { role: string; content: string }[]) => {
    h.prompts.push(messages.map((m) => m.content).join("\n"));
    return { activities: h.modelActivities, honors: [], gaps: [] };
  },
}));

function seed(count: number, tier: "guest" | "free" | "pro") {
  h.world = createFakeSupabase({
    cc_student_profiles: [{ id: P, user_id: U, preferred_name: "Ada", legal_first_name: "Ada" }],
    cc_activities: Array.from({ length: count }, (_, i) => ({
      student_id: P, position: i + 1, activity_type: "Club", organization: `Org ${i + 1}`, role: "Member",
      description_150: "", grades_participated: [11], hours_per_week: 2, weeks_per_year: 30,
    })),
    cc_honors: [],
    v_user_tier: [{ user_id: U, tier }],
  });
}

beforeEach(() => { h.prompts = []; h.modelActivities = []; });

describe("POST /api/cc/activities/optimize caps instead of blocking", () => {
  it("optimizes all 10 activities for a free student with a full list", async () => {
    seed(10, "free");
    const res = await POST();
    expect(res.status).toBe(200);
    expect(h.prompts[0]).toContain("Org 10");
  });

  it("sends only the first 10 when a student has 12", async () => {
    seed(12, "pro");
    expect((await POST()).status).toBe(200);
    expect(h.prompts[0]).toContain("Org 10");
    expect(h.prompts[0]).not.toContain("Org 11");
  });

  it("gives a guest their 3-row allowance", async () => {
    seed(5, "guest");
    expect((await POST()).status).toBe(200);
    expect(h.prompts[0]).toContain("Org 3");
    expect(h.prompts[0]).not.toContain("Org 4");
  });

  it("tells the model when the list was capped, and reports counts to the client", async () => {
    seed(5, "guest");
    const res = await POST();
    expect(h.prompts[0]).toMatch(/only the first 3 of 5 activities/i);
    expect(await res.json()).toMatchObject({ optimizedCount: 3, totalCount: 5 });
  });

  it("never writes a score to an activity that wasn't sent to the model", async () => {
    seed(5, "guest");
    h.modelActivities = [{ position: 2, impactScore: 4 }, { position: 4, impactScore: 5 }, { position: 11, impactScore: 5 }];
    await POST();
    const rows = (h.world as { tables: Record<string, { position: number; impact_score?: number }[]> }).tables.cc_activities;
    expect(rows.find((r) => r.position === 2)?.impact_score).toBe(4);
    expect(rows.find((r) => r.position === 4)?.impact_score).toBeUndefined();
  });
});
