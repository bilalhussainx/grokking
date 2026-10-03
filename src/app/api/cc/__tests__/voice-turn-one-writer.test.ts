// @vitest-environment node
// One writer: for S1-flagged users only confirmed agent proposals write, so the
// legacy voice-turn route must neither parse <<actions>> nor run extraction.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { createFakeSupabase } from "@/lib/cc/__tests__/helpers/fake-supabase";

const U = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const m = vi.hoisted(() => ({ runCoachExtraction: vi.fn(), parseActionsBlock: vi.fn() }));
vi.mock("@/lib/supabase-auth", () => ({ createServerSupabase: async () => ({ auth: { getUser: async () => ({ data: { user: { id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" } } }) } }) }));
vi.mock("@/app/api/cc/helpers", () => ({ createAdminSupabase: () => createFakeSupabase({ cc_student_profiles: [{ id: "p1", user_id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" }], cc_coach_conversations: [] }) }));
vi.mock("@/lib/cc/coach-extract", () => ({ runCoachExtraction: m.runCoachExtraction }));
vi.mock("@/lib/cc/coach-actions-block", async (importOriginal) => {
  const real = await importOriginal<typeof import("@/lib/cc/coach-actions-block")>();
  m.parseActionsBlock.mockImplementation(real.parseActionsBlock);
  return { ...real, parseActionsBlock: m.parseActionsBlock };
});

import { POST } from "../coach/voice-turn/route";

const turn = () => POST(new NextRequest("http://localhost/api/cc/coach/voice-turn", { method: "POST", body: JSON.stringify({ role: "assistant", content: 'Great list. <<actions>>{"add_schools":[{"name":"MIT"}]}<</actions>>' }) }));

describe("legacy voice-turn route", () => {
  beforeEach(() => {
    m.runCoachExtraction.mockReset().mockResolvedValue({ extracted: true, schoolsAddedCount: 1 });
    m.parseActionsBlock.mockClear();
  });
  afterEach(() => vi.unstubAllEnvs());

  it("parses actions and runs extraction for an unflagged user", async () => {
    vi.stubEnv("AGENT_S1_ENABLED", "1");
    vi.stubEnv("AGENT_S1_USER_IDS", "someone-else");
    const res = await turn();
    expect(res.status).toBe(200);
    expect(m.parseActionsBlock).toHaveBeenCalledTimes(1);
    expect(m.runCoachExtraction).toHaveBeenCalledTimes(1);
  });

  it("does neither for an S1-flagged user", async () => {
    vi.stubEnv("AGENT_S1_ENABLED", "1");
    vi.stubEnv("AGENT_S1_USER_IDS", U);
    const res = await turn();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, schoolsAddedCount: 0 });
    expect(m.parseActionsBlock).not.toHaveBeenCalled();
    expect(m.runCoachExtraction).not.toHaveBeenCalled();
  });
});
