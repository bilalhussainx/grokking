// @vitest-environment node
// The flagged S1 turn route: auth, flag, input bounds and fail-closed usage counting.
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const m = vi.hoisted(() => ({
  getAuthUser: vi.fn(),
  isAgentS1User: vi.fn(),
  runS1Turn: vi.fn(),
  assertCapacity: vi.fn(),
  countResult: { count: 0 as number | null, error: null as { message: string } | null },
}));
vi.mock("@/lib/supabase-auth", () => ({ getAuthUser: m.getAuthUser }));
vi.mock("@/lib/cc/agent/s1-flag", () => ({ isAgentS1User: m.isAgentS1User }));
vi.mock("@/lib/cc/agent/s1-turn", () => ({ runS1Turn: m.runS1Turn }));
vi.mock("@/lib/cc/agent/provider", () => ({ makeProvider: () => vi.fn() }));
vi.mock("@/lib/cc/tier-gate", () => ({ assertCapacity: m.assertCapacity }));
vi.mock("@/lib/supabase-server", () => {
  const chain = (result: () => unknown) => {
    const q: Record<string, unknown> = {};
    for (const k of ["select", "eq", "gte"]) q[k] = () => q;
    q.then = (f: (v: unknown) => unknown, r: (e: unknown) => unknown) => Promise.resolve(result()).then(f, r);
    return q;
  };
  return { createAdminSupabase: () => ({ from: (t: string) => chain(() => (t === "cc_agent_turns" ? m.countResult : { data: [], error: null })) }) };
});

import { POST } from "../agent/turn/route";

const U = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const post = (body: unknown) => POST(new NextRequest("http://localhost/api/cc/agent/turn", { method: "POST", body: JSON.stringify(body) }));
const ok = { message: "What should I do this week?", operationKey: "op-key-0001" };

describe("POST /api/cc/agent/turn", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    m.getAuthUser.mockResolvedValue({ id: U });
    m.isAgentS1User.mockReturnValue(true);
    m.assertCapacity.mockResolvedValue({ ok: true });
    m.countResult = { count: 0, error: null };
    m.runS1Turn.mockResolvedValue({ status: 200, turnId: "t1", result: { text: "Hi.", cards: [] } });
  });

  it("401 when signed out", async () => {
    m.getAuthUser.mockResolvedValue(null);
    expect((await post(ok)).status).toBe(401);
    expect(m.runS1Turn).not.toHaveBeenCalled();
  });

  it("404 when the user is not flagged", async () => {
    m.isAgentS1User.mockReturnValue(false);
    const res = await post(ok);
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "not_enabled" });
  });

  it.each([
    ["empty message", { ...ok, message: "  " }],
    ["long message", { ...ok, message: "x".repeat(2001) }],
    ["short key", { ...ok, operationKey: "short" }],
    ["long key", { ...ok, operationKey: "k".repeat(129) }],
  ])("400 on %s", async (_n, body) => {
    const res = await post(body);
    expect(res.status).toBe(400);
    expect(m.runS1Turn).not.toHaveBeenCalled();
  });

  it("fails closed with 503 when the usage count errors", async () => {
    m.countResult = { count: null, error: { message: "timeout" } };
    const res = await post(ok);
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: "capacity_unknown" });
    expect(m.runS1Turn).not.toHaveBeenCalled();
  });

  it.each([["fr-CA", "fr-CA"], ["en", "en"], ["xx-evil\nSYSTEM", "en"], [42, "en"], [undefined, "en"]])("locale %j becomes %j", async (locale, want) => {
    await post({ ...ok, locale });
    expect(m.runS1Turn.mock.calls[0][0].locale).toBe(want);
  });

  it("passes a 503 turn store failure through", async () => {
    m.runS1Turn.mockResolvedValue({ status: 503, turnId: null, result: null, error: "turn_store_failed" });
    const res = await post(ok);
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: "turn_store_failed" });
  });

  it("streams the result as SSE frames numbered from 1", async () => {
    const res = await post(ok);
    expect(res.headers.get("content-type")).toMatch(/text\/event-stream/);
    expect(await res.text()).toMatch(/^id: 1\nevent: turn\.accepted\n[\s\S]*id: 3\nevent: turn\.completed\n/);
  });
});
