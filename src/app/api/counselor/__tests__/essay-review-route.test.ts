import { describe, it, expect, vi, beforeEach } from "vitest";
import { createFakeSupabase, type FakeSupabase } from "@/lib/cc/__tests__/helpers/fake-supabase";
import { ALICE, ALICE_ESSAY, ALICE_PROFILE, BOB, BOB_ESSAY, BOB_PROFILE } from "@/lib/cc/__tests__/helpers/fixtures";
import { GET as essayGET, POST as essayPOST } from "../students/[studentId]/essays/[essayId]/route";
import { GET as studentGET } from "../students/[studentId]/route";

const AGENCY_A = "a9e0c700-0000-4000-8000-00000000000a";
const AGENCY_B = "a9e0c700-0000-4000-8000-00000000000b";
const COUNSELOR = "c0c00000-0000-4000-8000-000000000001";

const h = vi.hoisted(() => ({
  world: null as unknown,
  membership: null as null | { role: string; requiresReview: boolean; agencyId: string },
}));

vi.mock("@/lib/supabase-auth", () => ({
  getAuthUser: async () => ({ id: "c0c00000-0000-4000-8000-000000000001" }),
  createAdminSupabase: () => h.world,
}));
vi.mock("@/lib/supabase-server", () => ({ createAdminSupabase: () => h.world }));
vi.mock("@/lib/cc/student-roster", () => ({
  getStudentVisibility: async () => ({
    agencyId: "a9e0c700-0000-4000-8000-00000000000a",
    primaryCounselorUserId: "c0c00000-0000-4000-8000-000000000001",
    viewerRole: "counselor",
  }),
  authMetadataName: async () => null,
}));
vi.mock("@/lib/cc/agency-membership", () => ({ getAnyAgencyMembership: async () => h.membership }));

const world = () => h.world as FakeSupabase;
const essay = (id: string) => world().tables.cc_essays.find((e) => e.id === id)!;
const post = (body: unknown) =>
  new Request("http://localhost/x", { method: "POST", body: JSON.stringify(body), headers: { "Content-Type": "application/json" } });
const ctx = (essayId: string) => ({ params: Promise.resolve({ studentId: ALICE, essayId }) });

beforeEach(() => {
  h.membership = { role: "counselor", requiresReview: false, agencyId: AGENCY_A };
  h.world = createFakeSupabase({
    cc_student_profiles: [{ id: ALICE_PROFILE, user_id: ALICE }, { id: BOB_PROFILE, user_id: BOB }],
    cc_essays: [
      { id: ALICE_ESSAY, student_id: ALICE_PROFILE, current_draft: "d", word_count: 1, counselor_review_state: "resubmitted", updated_at: "2026-09-25" },
      { id: BOB_ESSAY, student_id: BOB_PROFILE, current_draft: "d", word_count: 1, counselor_review_state: null, updated_at: "2026-09-25" },
    ],
    cc_counselor_comments: [
      { id: "cA", agency_id: AGENCY_A, artifact_type: "essay", artifact_id: ALICE_ESSAY, author_user_id: COUNSELOR, body: "A", status: "shipped", created_at: "2026-09-25", range_start: null },
      { id: "cB", agency_id: AGENCY_B, artifact_type: "essay", artifact_id: ALICE_ESSAY, author_user_id: "x", body: "B", status: "draft", created_at: "2026-09-25", range_start: null },
    ],
  });
});

describe("POST /api/counselor/students/[studentId]/essays/[essayId]", () => {
  it("404s a comment aimed at another student's essay and writes nothing", async () => {
    const res = await essayPOST(post({ action: "comment", body: "injected" }), ctx(BOB_ESSAY));
    expect(res.status).toBe(404);
    expect(world().tables.cc_counselor_comments).toHaveLength(2);
  });

  it("saves a comment on the student's own essay", async () => {
    const res = await essayPOST(post({ action: "comment", body: "Good hook." }), ctx(ALICE_ESSAY));
    expect(res.status).toBe(201);
  });

  it("forbids a supervised counselor from setting the review state", async () => {
    h.membership = { role: "counselor", requiresReview: true, agencyId: AGENCY_A };
    const res = await essayPOST(post({ action: "review", state: "approved" }), ctx(ALICE_ESSAY));
    expect(res.status).toBe(403);
    expect(essay(ALICE_ESSAY).counselor_review_state).toBe("resubmitted");
  });

  it("lets an unsupervised counselor approve", async () => {
    const res = await essayPOST(post({ action: "review", state: "approved" }), ctx(ALICE_ESSAY));
    expect(res.status).toBe(200);
    expect(essay(ALICE_ESSAY).counselor_review_state).toBe("approved");
  });
});

describe("GET counselor views", () => {
  it("essay view shows only the viewer's agency comments", async () => {
    const res = await essayGET(new Request("http://localhost/x"), ctx(ALICE_ESSAY));
    const json = (await res.json()) as { essay: { comments: { id: string }[] } };
    expect(json.essay.comments.map((c) => c.id)).toEqual(["cA"]);
  });

  it("student file counts only the viewer's agency comments", async () => {
    const res = await studentGET(new Request("http://localhost/x"), { params: Promise.resolve({ studentId: ALICE }) });
    const json = (await res.json()) as { essays: { id: string; openCommentCount: number }[] };
    expect(json.essays.find((e) => e.id === ALICE_ESSAY)!.openCommentCount).toBe(1);
  });
});
