import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { createFakeSupabase, type FakeSupabase } from "@/lib/cc/__tests__/helpers/fake-supabase";
import { ALICE, ALICE_PROFILE } from "@/lib/cc/__tests__/helpers/fixtures";
import { POST } from "../onboarding/complete/route";

const h = vi.hoisted(() => ({ world: null as unknown }));
vi.mock("../helpers", () => ({
  requireAuth: async () => ({ user: { id: "a11ce000-0000-4000-8000-000000000001", user_metadata: {} }, supabase: h.world }),
  unauthorized: () => new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }),
  ensureStudentProfile: async () => ({ id: "a11ce000-1111-4000-8000-000000000001" }),
}));

const world = () => h.world as FakeSupabase;
const transferBody = (gpa: string) => ({
  language: "en",
  role: "tx",
  concerns: [],
  transfer: { currentSchool: "QA Community College", creditsCompleted: 32, targetTerm: "Fall 2027", gpa, reason: "I want a stronger engineering program." },
});
const post = (body: unknown) =>
  new NextRequest("http://localhost/api/cc/onboarding/complete", {
    method: "POST", body: JSON.stringify(body), headers: { "Content-Type": "application/json" },
  });

beforeEach(() => {
  h.world = createFakeSupabase({
    cc_student_profiles: [{ id: ALICE_PROFILE, user_id: ALICE, preferred_name: "Alice" }],
    cc_academic_profiles: [],
  });
});

describe("POST /api/cc/onboarding/complete — transfer GPA", () => {
  it("saves the transfer student's GPA to their academic profile", async () => {
    const res = await POST(post(transferBody("3.50")));
    expect(res.status).toBe(200);
    expect(world().tables.cc_academic_profiles).toEqual([
      expect.objectContaining({ student_id: ALICE_PROFILE, gpa_unweighted: 3.5, gpa_scale: "4.0" }),
    ]);
  });

  it("updates an existing academic profile instead of duplicating it", async () => {
    world().tables.cc_academic_profiles.push({ id: "ac1", student_id: ALICE_PROFILE, gpa_unweighted: 2.9, gpa_scale: "4.0" });
    await POST(post(transferBody("3.7")));
    expect(world().tables.cc_academic_profiles).toHaveLength(1);
    expect(world().tables.cc_academic_profiles[0].gpa_unweighted).toBe(3.7);
  });

  it("finishes onboarding but saves nothing for an unreadable GPA", async () => {
    const res = await POST(post(transferBody("abc")));
    const json = (await res.json()) as { gpaSaved: boolean };
    expect(res.status).toBe(200);
    expect(json.gpaSaved).toBe(false);
    expect(world().tables.cc_academic_profiles).toHaveLength(0);
  });

  it("never writes a GPA for the high-school path", async () => {
    await POST(post({ language: "en", role: "hs", grade: 11, concerns: [] }));
    expect(world().tables.cc_academic_profiles).toHaveLength(0);
  });
});
