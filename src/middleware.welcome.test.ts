// Signed-out visitors on "/" are served the lightweight, server-rendered
// Daybreak homepage from /welcome. "/" itself is the signed-in app home and
// pulls in the dashboard and the whole course catalogue (~4.8 MB gzip).
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const h = vi.hoisted(() => ({ user: null as null | { id: string; is_anonymous?: boolean } }));
vi.mock("@supabase/ssr", () => ({
  createServerClient: () => ({
    auth: { getUser: async () => ({ data: { user: h.user } }) },
    from: () => {
      const q: Record<string, unknown> = {};
      for (const m of ["select", "eq", "in", "order", "limit"]) q[m] = () => q;
      q.maybeSingle = async () => ({ data: { language_picker_seen_at: "2026-01-01", grade_level: 11 } });
      q.single = q.maybeSingle;
      return q;
    },
  }),
}));
import { middleware } from "./middleware";

const rewriteTarget = (res: Response) => res.headers.get("x-middleware-rewrite");

beforeEach(() => { h.user = null; });

describe("anonymous homepage rewrite", () => {
  it("serves signed-out visitors on / from /welcome", async () => {
    const res = await middleware(new NextRequest("https://www.kairoslearn.com/"));
    expect(new URL(rewriteTarget(res)!).pathname).toBe("/welcome");
  });

  it("keeps query strings (e.g. referral links)", async () => {
    const res = await middleware(new NextRequest("https://www.kairoslearn.com/?ref=abc"));
    expect(new URL(rewriteTarget(res)!).search).toBe("?ref=abc");
  });

  it("does not rewrite a signed-in user's /", async () => {
    h.user = { id: "u1", is_anonymous: false };
    const res = await middleware(new NextRequest("https://www.kairoslearn.com/"));
    expect(rewriteTarget(res)).toBeNull();
  });

  it("does not rewrite other public pages", async () => {
    const res = await middleware(new NextRequest("https://www.kairoslearn.com/pricing"));
    expect(rewriteTarget(res)).toBeNull();
  });
});
