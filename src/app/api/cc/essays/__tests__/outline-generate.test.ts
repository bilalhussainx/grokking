import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "../[id]/outline/route";

const h = vi.hoisted(() => ({
  result: null as unknown,
  refunds: [] as unknown[][],
  llmOpts: [] as unknown[],
}));

vi.mock("../../helpers", () => ({
  requireAuth: async () => ({ user: { id: "a11ce000-0000-4000-8000-000000000001" }, supabase: {} }),
  unauthorized: () => new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }),
  createAdminSupabase: () => ({ from: () => ({ update: () => ({ eq: async () => ({ error: null }) }), insert: async () => ({ error: null }) }) }),
}));
vi.mock("@/lib/credits", () => ({
  CREDIT_COSTS: { coach_text: 1 },
  deductCredits: async () => true,
  addCredits: async (...args: unknown[]) => { h.refunds.push(args); return 0; },
}));
vi.mock("@/lib/cc/essay-helpers", () => ({
  buildEssayContext: async () => ({ brainstormTranscript: [], wordLimit: 650 }),
  getOutlineSystemPrompt: () => "system",
}));
vi.mock("@/lib/cc/llm-stream", () => ({
  callLLMJSON: async (_messages: unknown, opts: unknown) => { h.llmOpts.push(opts); return h.result; },
}));

const ESSAY = "a11ce000-2222-4000-8000-000000000001";
const generate = () =>
  POST(
    new NextRequest(`http://localhost/api/cc/essays/${ESSAY}/outline`, {
      method: "POST", body: JSON.stringify({ action: "generate" }), headers: { "Content-Type": "application/json" },
    }),
    { params: Promise.resolve({ id: ESSAY }) },
  );

beforeEach(() => {
  h.result = null;
  h.refunds = [];
  h.llmOpts = [];
});

describe("POST outline (generate) failure handling", () => {
  it("returns a retryable 503 and refunds the credit when generation fails", async () => {
    const res = await generate();
    const json = (await res.json()) as { error: string; retryable: boolean };
    expect(res.status).toBe(503);
    expect(json.retryable).toBe(true);
    expect(json.error).toMatch(/try again/i);
    expect(h.refunds).toEqual([["a11ce000-0000-4000-8000-000000000001", 1, "essay_outline_refund"]]);
  });

  it("returns the outlines when generation succeeds, in JSON mode, without a refund", async () => {
    h.result = { outlines: [{ title: "A" }, { title: "B" }, { title: "C" }] };
    const res = await generate();
    expect(res.status).toBe(200);
    expect(h.refunds).toEqual([]);
    expect(h.llmOpts[0]).toEqual(expect.objectContaining({ jsonMode: true, label: "outline" }));
  });
});
