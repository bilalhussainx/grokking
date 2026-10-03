// Essay review honesty (Oct 3 audit). A 130-word draft against a 650-word
// limit got 85 "STRONG", the review praised dialogue that wasn't in the
// draft, and "application fit" was scored for a student with no schools.
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import type { EssayContext } from "@/lib/cc/essay-helpers";

const words = (n: number) => Array.from({ length: n }, (_, i) => (i === 0 ? "The kitchen smelled like burnt cumin" : `w${i}`)).join(" ");

const h = vi.hoisted(() => ({
  ctx: null as unknown,
  llm: vi.fn(),
  deduct: vi.fn(async () => true),
  updates: [] as Record<string, unknown>[],
}));

// A chainable stand-in for the admin client: every query resolves empty, and
// updates are recorded.
function stubDb() {
  const chain = (onUpdate?: Record<string, unknown>): unknown =>
    new Proxy({}, {
      get(_t, prop) {
        if (prop === "then") return (res: (v: unknown) => void) => res({ data: null, count: 0, error: null });
        if (prop === "update") return (patch: Record<string, unknown>) => { h.updates.push(patch); return chain(patch); };
        return () => chain(onUpdate);
      },
    });
  return { from: () => chain() };
}

vi.mock("../../helpers", () => ({
  requireAuth: async () => ({ user: { id: "a11ce000-0000-4000-8000-000000000001" }, supabase: {} }),
  unauthorized: () => new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }),
  createAdminSupabase: () => stubDb(),
}));
vi.mock("@/lib/credits", () => ({ CREDIT_COSTS: { coach_text: 1 }, deductCredits: h.deduct }));
vi.mock("@/lib/cc/tier-gate", () => ({ assertCapacity: async () => ({ ok: true }), blockedResponse: () => new Response(null, { status: 402 }) }));
vi.mock("@/lib/cc/llm-stream", () => ({ callLLMJSON: h.llm }));
vi.mock("@/lib/cc/essay-helpers", async (orig) => ({
  ...(await orig<typeof import("@/lib/cc/essay-helpers")>()),
  buildEssayContext: async () => h.ctx,
}));

import { POST } from "../[id]/review/route";
import { getReviewSystemPrompt } from "@/lib/cc/essay-helpers";

const baseCtx = (over: Partial<EssayContext> = {}): EssayContext => ({
  studentName: "Maya", activities: [], honors: [], academicHighlights: "", essayType: "personal_statement",
  promptText: "Share an essay on any topic of your choice.", wordLimit: 650, wordLimitIsSet: true, brainstormTranscript: null,
  outlineJson: null, currentDraft: words(130), schoolCountry: null, parentPersonalStatement: null, hasSchools: false, ...over,
});

const review = () => POST(new NextRequest("http://localhost/x", { method: "POST" }), { params: Promise.resolve({ id: "e1" }) });

beforeEach(() => {
  h.ctx = baseCtx();
  h.llm.mockReset();
  h.deduct.mockClear();
  h.updates = [];
});

describe("POST /api/cc/essays/[id]/review", () => {
  it("returns 'too early to score' with no number for a 130-word draft, without charging or calling the model", async () => {
    const res = await review();
    expect(res.status).toBe(200);
    const { review: r } = (await res.json()) as { review: Record<string, unknown> };
    expect(r.tooEarlyToScore).toBe(true);
    expect(r).not.toHaveProperty("overallScore");
    expect(r).not.toHaveProperty("scoreBreakdown");
    expect(r.whatToDevelop).toEqual(expect.any(Array));
    expect(h.llm).not.toHaveBeenCalled();
    expect(h.deduct).not.toHaveBeenCalled();
    expect(h.updates.some((u) => "revision_comments" in u)).toBe(false);
  });

  it("drops application fit and unquoted praise from a scored review", async () => {
    h.ctx = baseCtx({ currentDraft: words(420), hasSchools: false });
    h.llm.mockResolvedValue({
      overallScore: 70,
      scoreBreakdown: { promptFit: 70, voiceAuthenticity: 70, specificity: 70, reflectionDepth: 70, structuralCraft: 70, applicationFit: 85 },
      strengths: ['"burnt cumin" grounds the scene.', 'The dialogue "Nani, it\'s me" is vivid.'],
      comments: [], overallNotes: "ok", wordCount: 420, promptFitScore: 0.7,
    });
    const res = await review();
    const { review: r } = (await res.json()) as { review: { scoreBreakdown: Record<string, number>; strengths: string[] } };
    expect(r.scoreBreakdown).not.toHaveProperty("applicationFit");
    expect(r.strengths).toEqual(['"burnt cumin" grounds the scene.']);
    const saved = h.updates.find((u) => "revision_comments" in u)!.revision_comments as typeof r;
    expect(saved.scoreBreakdown).not.toHaveProperty("applicationFit");
  });
});

describe("getReviewSystemPrompt", () => {
  it("requires every strength to quote the student's actual words", () => {
    const p = getReviewSystemPrompt(baseCtx({ hasSchools: true }));
    expect(p).toMatch(/quote the student's exact words/i);
    expect(p).toMatch(/never praise anything that is not in the draft/i);
  });
  it("asks for application fit only when the student has schools", () => {
    expect(getReviewSystemPrompt(baseCtx({ hasSchools: true }))).toContain("applicationFit");
    expect(getReviewSystemPrompt(baseCtx({ hasSchools: false }))).not.toContain("applicationFit");
  });
});
