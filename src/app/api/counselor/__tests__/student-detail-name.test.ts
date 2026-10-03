// The roster falls back to the auth account's name when the profile has
// none. The student file must use the same fallback, or the header says
// "Unnamed student" for a student the roster lists by name.
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createFakeSupabase } from "@/lib/cc/__tests__/helpers/fake-supabase";
import { ALICE, ALICE_PROFILE } from "@/lib/cc/__tests__/helpers/fixtures";

const h = vi.hoisted(() => ({
  world: null as unknown,
  authUsers: {} as Record<string, { user_metadata: Record<string, unknown> }>,
}));

const withAuth = () => Object.assign(h.world as object, {
  auth: { admin: { getUserById: async (id: string) => ({ data: { user: h.authUsers[id] ?? null }, error: null }) } },
});

vi.mock("@/lib/supabase-auth", () => ({
  getAuthUser: async () => ({ id: "c0c00000-0000-4000-8000-000000000001" }),
  createAdminSupabase: () => withAuth(),
}));
vi.mock("@/lib/supabase-server", () => ({ createAdminSupabase: () => withAuth() }));
vi.mock("@/lib/cc/agency-membership", () => ({ getAnyAgencyMembership: async () => null }));
vi.mock("@/lib/cc/counselor-comments", () => ({ listStudentEssays: async () => [] }));
vi.mock("@/lib/cc/student-roster", async (orig) => ({
  ...(await orig<typeof import("@/lib/cc/student-roster")>()),
  getStudentVisibility: async () => ({
    agencyId: "a9e0c700-0000-4000-8000-00000000000a",
    primaryCounselorUserId: "c0c00000-0000-4000-8000-000000000001",
    viewerRole: "counselor",
  }),
}));

import { GET } from "../students/[studentId]/route";

const get = async () => {
  const res = await GET(new Request("http://localhost/x"), { params: Promise.resolve({ studentId: ALICE }) });
  return (await res.json()) as { student: { preferredName: string | null } };
};

beforeEach(() => {
  h.authUsers = {};
  h.world = createFakeSupabase({
    cc_student_profiles: [{ id: ALICE_PROFILE, user_id: ALICE, preferred_name: null, legal_first_name: null }],
    user_subscriptions: [],
  });
});

describe("GET /api/counselor/students/[studentId] name", () => {
  it("falls back to the account's full name when the profile has none", async () => {
    h.authUsers[ALICE] = { user_metadata: { full_name: "  Maya Patel " } };
    expect((await get()).student.preferredName).toBe("Maya Patel");
  });

  it("uses user_metadata.name when there is no full_name", async () => {
    h.authUsers[ALICE] = { user_metadata: { name: "Maya" } };
    expect((await get()).student.preferredName).toBe("Maya");
  });

  it("keeps the profile name when there is one", async () => {
    (h.world as { tables: { cc_student_profiles: Record<string, unknown>[] } }).tables.cc_student_profiles[0].preferred_name = "May";
    h.authUsers[ALICE] = { user_metadata: { full_name: "Maya Patel" } };
    expect((await get()).student.preferredName).toBe("May");
  });

  it("stays null when no name exists anywhere", async () => {
    expect((await get()).student.preferredName).toBeNull();
  });
});
