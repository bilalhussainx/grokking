// Pre-deploy workflow test (2026-09-27): picking a theme and generating
// outlines were not saved, so a reload sent the student back to Brainstorm
// and the three outlines (paid for with a credit) were gone. The chosen themes
// and the generated options are now recorded in cc_essay_interactions and
// served back by GET.
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const USER = "a11ce000-0000-4000-8000-000000000001";
const ESSAY = "a11ce000-2222-4000-8000-000000000001";

const h = vi.hoisted(() => ({
  updates: [] as Record<string, unknown>[],
  inserts: [] as Record<string, unknown>[],
  rows: [] as { turn_type: string; content: string; timestamp: string }[],
  owned: true,
  result: null as unknown,
}));

function db() {
  return {
    from: (table: string) => ({
      update: (u: Record<string, unknown>) => ({ eq: async () => { h.updates.push({ table, ...u }); return { error: null }; } }),
      insert: async (r: Record<string, unknown>) => { h.inserts.push({ table, ...r }); return { error: null }; },
      select: () => {
        let type = "";
        const q = {
          eq: (col: string, v: string) => { if (col === "turn_type") type = v; return q; },
          order: () => q,
          limit: async () => ({ data: h.rows.filter((r) => r.turn_type === type).slice(-1), error: null }),
        };
        return q;
      },
    }),
  };
}

vi.mock("../../helpers", () => ({
  requireAuth: async () => ({ user: { id: USER }, supabase: {} }),
  unauthorized: () => new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }),
  createAdminSupabase: () => db(),
}));
vi.mock("@/lib/cc/ownership", () => ({ getOwnedEssay: async () => (h.owned ? { id: ESSAY } : null) }));
vi.mock("@/lib/credits", () => ({ CREDIT_COSTS: { coach_text: 1 }, deductCredits: async () => true, addCredits: async () => 0 }));
vi.mock("@/lib/cc/essay-helpers", () => ({
  buildEssayContext: async () => ({ brainstormTranscript: [], wordLimit: 650 }),
  getOutlineSystemPrompt: () => "system",
}));
vi.mock("@/lib/cc/llm-stream", () => ({ callLLMJSON: async () => h.result }));

import { GET, POST } from "../[id]/outline/route";

const post = (body: unknown) =>
  POST(new NextRequest(`http://l/api/cc/essays/${ESSAY}/outline`, { method: "POST", body: JSON.stringify(body) }), { params: Promise.resolve({ id: ESSAY }) });
const get = () => GET(new NextRequest(`http://l/api/cc/essays/${ESSAY}/outline`), { params: Promise.resolve({ id: ESSAY }) });

beforeEach(() => { h.updates = []; h.inserts = []; h.rows = []; h.owned = true; h.result = null; });

describe("outline progress survives a reload", () => {
  it("saving the chosen themes moves the essay to Outline and records them", async () => {
    const res = await post({ action: "themes", selectedThemes: ["The bike shop", "Fixing things"] });
    expect(res.status).toBe(200);
    expect(h.updates).toEqual([expect.objectContaining({ table: "cc_essays", phase: "outline" })]);
    expect(h.inserts).toEqual([expect.objectContaining({ table: "cc_essay_interactions", essay_id: ESSAY, turn_type: "themes_selected", content: JSON.stringify(["The bike shop", "Fixing things"]) })]);
  });

  it("generated outlines are recorded with the themes they were made from", async () => {
    h.result = { outlines: [{ title: "A" }, { title: "B" }, { title: "C" }] };
    const res = await post({ action: "generate", selectedThemes: ["The bike shop"] });
    expect(res.status).toBe(200);
    const saved = h.inserts.find((r) => r.turn_type === "outline_options");
    expect(JSON.parse(String(saved?.content))).toEqual({ themes: ["The bike shop"], outlines: [{ title: "A" }, { title: "B" }, { title: "C" }] });
  });

  it("GET returns the latest themes and outline options", async () => {
    h.rows = [
      { turn_type: "themes_selected", content: JSON.stringify(["The bike shop"]), timestamp: "1" },
      { turn_type: "outline_options", content: JSON.stringify({ themes: ["The bike shop"], outlines: [{ title: "A" }] }), timestamp: "2" },
    ];
    const body = await (await get()).json();
    expect(body).toEqual({ themes: ["The bike shop"], outlines: [{ title: "A" }] });
  });

  it("GET is 404 for an essay the student doesn't own", async () => {
    h.owned = false;
    expect((await get()).status).toBe(404);
  });
});
