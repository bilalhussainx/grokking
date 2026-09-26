import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { ALICE, ALICE_COURSE, ALICE_REC, BOB_COURSE, BOB_REC, studentWorld } from "@/lib/cc/__tests__/helpers/fixtures";
import type { FakeSupabase } from "@/lib/cc/__tests__/helpers/fake-supabase";

const h = vi.hoisted(() => ({ world: null as unknown, user: null as string | null }));

vi.mock("../helpers", () => ({
  requireAuth: async () => (h.user ? { user: { id: h.user }, supabase: {} } : null),
  unauthorized: () => new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }),
  createAdminSupabase: () => h.world,
  ensureStudentProfile: async () => ({ id: "unused" }),
}));
vi.mock("@/lib/supabase-server", () => ({ createAdminSupabase: () => h.world }));
vi.mock("@/lib/cc/openrouter", () => ({ chatOnce: async () => "Dear teacher, would you write me a letter?" }));

const world = () => h.world as FakeSupabase;
const row = (table: string, id: string) => world().tables[table].find((r) => r.id === id);

function req(method: string, url: string, body?: unknown) {
  return new NextRequest(url, {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}
const ctx = (id: string) => ({ params: Promise.resolve({ id }) });

beforeEach(() => {
  h.world = studentWorld();
  h.user = ALICE;
});

describe("DELETE /api/cc/courses", () => {
  it("cannot delete another student's course", async () => {
    const { DELETE } = await import("../courses/route");
    const res = await DELETE(req("DELETE", `http://localhost/api/cc/courses?id=${BOB_COURSE}`));
    expect(res.status).toBe(404);
    expect(row("cc_courses", BOB_COURSE)).toBeDefined();
  });

  it("deletes the caller's own course", async () => {
    const { DELETE } = await import("../courses/route");
    const res = await DELETE(req("DELETE", `http://localhost/api/cc/courses?id=${ALICE_COURSE}`));
    expect(res.status).toBe(200);
    expect(row("cc_courses", ALICE_COURSE)).toBeUndefined();
  });

  it("returns 404 for a non-uuid id instead of a database error", async () => {
    const { DELETE } = await import("../courses/route");
    const res = await DELETE(req("DELETE", "http://localhost/api/cc/courses?id=undefined"));
    expect(res.status).toBe(404);
  });

  it("returns 404 when the caller has no student profile", async () => {
    h.user = "c0000000-0000-4000-8000-000000000003";
    const { DELETE } = await import("../courses/route");
    const res = await DELETE(req("DELETE", `http://localhost/api/cc/courses?id=${ALICE_COURSE}`));
    expect(res.status).toBe(404);
    expect(row("cc_courses", ALICE_COURSE)).toBeDefined();
  });
});

describe("/api/cc/recommenders/[id]", () => {
  it("PATCH cannot change another student's recommender email", async () => {
    const { PATCH } = await import("../recommenders/[id]/route");
    const res = await PATCH(req("PATCH", "http://localhost/x", { email: "attacker@evil.test" }), ctx(BOB_REC));
    expect(res.status).toBe(404);
    expect(row("cc_recommenders", BOB_REC)!.email).toBe("chen@school.test");
  });

  it("PATCH updates the caller's own recommender", async () => {
    const { PATCH } = await import("../recommenders/[id]/route");
    const res = await PATCH(req("PATCH", "http://localhost/x", { status: "asked" }), ctx(ALICE_REC));
    expect(res.status).toBe(200);
    expect(row("cc_recommenders", ALICE_REC)!.status).toBe("asked");
  });

  it("PATCH with no recognized fields is a 400, not an empty update", async () => {
    const { PATCH } = await import("../recommenders/[id]/route");
    const res = await PATCH(req("PATCH", "http://localhost/x", { student_id: "x" }), ctx(ALICE_REC));
    expect(res.status).toBe(400);
  });

  it("DELETE cannot remove another student's recommender", async () => {
    const { DELETE } = await import("../recommenders/[id]/route");
    const res = await DELETE(req("DELETE", "http://localhost/x"), ctx(BOB_REC));
    expect(res.status).toBe(404);
    expect(row("cc_recommenders", BOB_REC)).toBeDefined();
  });

  it("DELETE removes the caller's own recommender", async () => {
    const { DELETE } = await import("../recommenders/[id]/route");
    const res = await DELETE(req("DELETE", "http://localhost/x"), ctx(ALICE_REC));
    expect(res.status).toBe(200);
    expect(row("cc_recommenders", ALICE_REC)).toBeUndefined();
  });
});

describe("POST /api/cc/recommenders/ask-email-text", () => {
  it("does not write the generated email onto another student's recommender", async () => {
    const { POST } = await import("../recommenders/ask-email-text/route");
    const res = await POST(req("POST", "http://localhost/x", { recommenderId: BOB_REC, teacherName: "Mr. Chen" }));
    expect(res.status).toBe(200);
    expect(row("cc_recommenders", BOB_REC)!.ask_email_text).toBeNull();
  });

  it("saves the generated email on the caller's own recommender", async () => {
    const { POST } = await import("../recommenders/ask-email-text/route");
    await POST(req("POST", "http://localhost/x", { recommenderId: ALICE_REC, teacherName: "Ms. Rivera" }));
    expect(row("cc_recommenders", ALICE_REC)!.ask_email_text).toBe("Dear teacher, would you write me a letter?");
  });
});
