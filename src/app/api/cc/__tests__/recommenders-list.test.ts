import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { createFakeSupabase, type FakeSupabase } from "@/lib/cc/__tests__/helpers/fake-supabase";
import { ALICE, ALICE_PROFILE } from "@/lib/cc/__tests__/helpers/fixtures";
import { GET, POST } from "../recommenders/route";

const h = vi.hoisted(() => ({ world: null as unknown }));
vi.mock("../helpers", () => ({
  requireAuth: async () => ({ user: { id: "a11ce000-0000-4000-8000-000000000001" }, supabase: {} }),
  unauthorized: () => new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }),
  createAdminSupabase: () => h.world,
}));
vi.mock("@/lib/supabase-server", () => ({ createAdminSupabase: () => h.world }));

// Production's real cc_recommenders columns (probed 2026-09-25): no created_at.
const REC_COLUMNS = ["id", "student_id", "recommender_type", "name", "subject", "email", "status",
  "brag_sheet_url", "asked_at", "submitted_at", "waiver_signed", "waiver_decision_note",
  "ask_email_text", "reminder_email_text", "context_notes", "relationship"];

beforeEach(() => {
  h.world = createFakeSupabase(
    {
      cc_student_profiles: [{ id: ALICE_PROFILE, user_id: ALICE }],
      cc_recommenders: [
        { id: "r2", student_id: ALICE_PROFILE, name: "Mr. Chen", recommender_type: "teacher", status: "considering" },
        { id: "r1", student_id: ALICE_PROFILE, name: "Ms. Rivera", recommender_type: "teacher", status: "asked" },
      ],
    },
    { columns: { cc_recommenders: REC_COLUMNS } },
  );
});

describe("GET /api/cc/recommenders", () => {
  it("lists the student's recommenders against production's real columns", async () => {
    const res = await GET();
    const json = (await res.json()) as { recommenders: { name: string }[] };
    expect(res.status).toBe(200);
    expect(json.recommenders.map((r) => r.name)).toEqual(["Mr. Chen", "Ms. Rivera"]);
  });

  it("reports a query failure instead of pretending the list is empty", async () => {
    h.world = createFakeSupabase(
      { cc_student_profiles: [{ id: ALICE_PROFILE, user_id: ALICE }], cc_recommenders: [] },
      { columns: { cc_recommenders: ["id"] } }, // student_id missing → the query errors
    );
    const res = await GET();
    expect(res.status).toBe(500);
  });
});

describe("POST /api/cc/recommenders", () => {
  it("saves context notes the student typed", async () => {
    const req = new NextRequest("http://localhost/api/cc/recommenders", {
      method: "POST",
      body: JSON.stringify({ name: "Dr. Okafor", recommender_type: "teacher", context_notes: "AP Bio; led the lab safety project" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const saved = (h.world as FakeSupabase).tables.cc_recommenders.find((r) => r.name === "Dr. Okafor")!;
    expect(saved.context_notes).toBe("AP Bio; led the lab safety project");
  });
});
