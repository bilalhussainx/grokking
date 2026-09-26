import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { ALICE, ALICE_ESSAY, BOB, BOB_ESSAY, studentWorld } from "@/lib/cc/__tests__/helpers/fixtures";
import type { FakeSupabase } from "@/lib/cc/__tests__/helpers/fake-supabase";
import { PATCH as draftPATCH } from "../[id]/draft/route";
import { POST as sharePOST } from "../[id]/share/route";
import { POST as outlinePOST } from "../[id]/outline/route";

const h = vi.hoisted(() => ({ world: null as unknown, user: null as string | null }));

vi.mock("../../helpers", () => ({
  requireAuth: async () => (h.user ? { user: { id: h.user }, supabase: {} } : null),
  unauthorized: () => new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }),
  createAdminSupabase: () => h.world,
}));
vi.mock("@/lib/supabase-server", () => ({ createAdminSupabase: () => h.world }));

const world = () => h.world as FakeSupabase;
const essay = (id: string) => world().tables.cc_essays.find((e) => e.id === id)!;

function request(method: string, id: string, body?: unknown) {
  return new NextRequest(`http://localhost/api/cc/essays/${id}`, {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}
const ctx = (id: string) => ({ params: Promise.resolve({ id }) });

beforeEach(() => {
  h.world = studentWorld();
  h.user = null;
});

describe("PATCH /api/cc/essays/[id]/draft", () => {
  it("rejects another student's essay and leaves it unchanged", async () => {
    h.user = BOB;
    const res = await draftPATCH(request("PATCH", ALICE_ESSAY, { content: "hijacked" }), ctx(ALICE_ESSAY));
    expect(res.status).toBe(404);
    expect(essay(ALICE_ESSAY).current_draft).toBe("Alice wrote this.");
  });

  it("saves the caller's own draft", async () => {
    h.user = ALICE;
    const res = await draftPATCH(request("PATCH", ALICE_ESSAY, { content: "A better opening line" }), ctx(ALICE_ESSAY));
    expect(res.status).toBe(200);
    expect(essay(ALICE_ESSAY).current_draft).toBe("A better opening line");
    expect(essay(ALICE_ESSAY).word_count).toBe(4);
  });

  it("returns 401 when signed out", async () => {
    const res = await draftPATCH(request("PATCH", ALICE_ESSAY, { content: "x" }), ctx(ALICE_ESSAY));
    expect(res.status).toBe(401);
  });
});

describe("POST /api/cc/essays/[id]/share", () => {
  it("never reveals another student's existing share token", async () => {
    h.user = ALICE;
    const res = await sharePOST(request("POST", BOB_ESSAY), ctx(BOB_ESSAY));
    expect(res.status).toBe(404);
    expect(await res.text()).not.toContain("bob-secret-token");
  });

  it("does not mint a token on another student's essay", async () => {
    h.user = BOB;
    const res = await sharePOST(request("POST", ALICE_ESSAY), ctx(ALICE_ESSAY));
    expect(res.status).toBe(404);
    expect(essay(ALICE_ESSAY).share_token).toBeNull();
  });

  it("mints and stores a token for the owner", async () => {
    h.user = ALICE;
    const res = await sharePOST(request("POST", ALICE_ESSAY), ctx(ALICE_ESSAY));
    const json = (await res.json()) as { share_token: string };
    expect(res.status).toBe(200);
    expect(json.share_token).toMatch(/^[0-9a-f]{32}$/);
    expect(essay(ALICE_ESSAY).share_token).toBe(json.share_token);
  });
});

describe("POST /api/cc/essays/[id]/outline (save)", () => {
  const outline = { title: "Three Tuesdays", sections: [] };

  it("rejects saving onto another student's essay", async () => {
    h.user = BOB;
    const res = await outlinePOST(request("POST", ALICE_ESSAY, { action: "save", outline }), ctx(ALICE_ESSAY));
    expect(res.status).toBe(404);
    expect(essay(ALICE_ESSAY).outline_json).toBeNull();
    expect(world().tables.cc_essay_interactions).toHaveLength(0);
  });

  it("saves the owner's outline and moves the essay to draft", async () => {
    h.user = ALICE;
    const res = await outlinePOST(request("POST", ALICE_ESSAY, { action: "save", outline }), ctx(ALICE_ESSAY));
    expect(res.status).toBe(200);
    expect(essay(ALICE_ESSAY).outline_json).toEqual(outline);
    expect(essay(ALICE_ESSAY).phase).toBe("draft");
  });
});
