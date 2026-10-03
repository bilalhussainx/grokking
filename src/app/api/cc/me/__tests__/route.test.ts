// @vitest-environment node
// /api/cc/me tells the client whether the S1 agent is on for this student.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextResponse } from "next/server";
import { createFakeSupabase } from "@/lib/cc/__tests__/helpers/fake-supabase";

const U = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
let userId = U;
vi.mock("@/app/api/cc/helpers", () => ({
  requireAuth: async () => ({ supabase: null, user: { id: userId } }),
  unauthorized: () => NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
  createAdminSupabase: () => createFakeSupabase({ cc_student_profiles: [{ id: "p1", user_id: U, preferred_name: "Ada" }] }),
}));

import { GET } from "../route";

beforeEach(() => { userId = U; vi.stubEnv("AGENT_S1_ENABLED", "1"); vi.stubEnv("AGENT_S1_USER_IDS", U); });
afterEach(() => vi.unstubAllEnvs());

describe("GET /api/cc/me", () => {
  it("agentS1 is true for an allowlisted student with the flag on", async () => {
    const body = await (await GET()).json();
    expect(body.agentS1).toBe(true);
    expect(body.profile).toMatchObject({ id: "p1" });
  });

  it("agentS1 is false for anyone else, and false for everyone with the flag off", async () => {
    userId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
    expect((await (await GET()).json()).agentS1).toBe(false);
    userId = U;
    vi.stubEnv("AGENT_S1_ENABLED", "");
    expect((await (await GET()).json()).agentS1).toBe(false);
  });
});
