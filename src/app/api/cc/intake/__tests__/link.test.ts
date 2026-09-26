import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { createFakeSupabase, type FakeSupabase } from "@/lib/cc/__tests__/helpers/fake-supabase";
import { POST } from "../link/route";

const h = vi.hoisted(() => ({ world: null as unknown, user: null as string | null }));

vi.mock("../../helpers", () => ({ createAdminSupabase: () => h.world }));
vi.mock("@/lib/supabase-server", () => ({
  createServerSupabase: async () => ({
    auth: { getUser: async () => ({ data: { user: h.user ? { id: h.user } : null } }) },
  }),
}));

const CALLER = "ca11e700-0000-4000-8000-000000000001";
const STRANGER_PROFILE = "57a46e70-1111-4000-8000-000000000001";

beforeEach(() => {
  h.user = CALLER;
  h.world = createFakeSupabase({
    cc_intake_sessions: [{ id: "5e550000-0000-4000-8000-000000000001", session_token: "tok-123", user_id: null }],
    // Another anonymous student's intake profile: the newest orphan.
    cc_student_profiles: [{ id: STRANGER_PROFILE, user_id: null, preferred_name: "Stranger", created_at: "2026-09-25T10:00:00Z" }],
  });
});

function post(body: unknown) {
  return new NextRequest("http://localhost/api/cc/intake/link", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/cc/intake/link", () => {
  it("links the session to the caller", async () => {
    const res = await POST(post({ session_token: "tok-123" }));
    expect(res.status).toBe(200);
    expect((h.world as FakeSupabase).tables.cc_intake_sessions[0].user_id).toBe(CALLER);
  });

  it("never assigns another student's orphan profile to the caller", async () => {
    await POST(post({ session_token: "tok-123" }));
    const stranger = (h.world as FakeSupabase).tables.cc_student_profiles.find((p) => p.id === STRANGER_PROFILE)!;
    expect(stranger.user_id).toBeNull();
  });
});
