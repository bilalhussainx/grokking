import { describe, it, expect, vi } from "vitest";
import { createFakeSupabase } from "@/lib/cc/__tests__/helpers/fake-supabase";
import { isPublicRoute } from "@/middleware";

const h = vi.hoisted(() => ({ world: null as unknown }));
vi.mock("../helpers", () => ({ createAdminSupabase: () => h.world }));
import { GET } from "../glossary/route";

describe("glossary", () => {
  it("is reachable by guests (GlossaryProvider mounts on public pages)", () => {
    expect(isPublicRoute("/api/cc/glossary")).toBe(true);
  });

  it("returns an empty list, not a 500, when the table errors", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    h.world = createFakeSupabase({ cc_glossary: [] }, { columns: { cc_glossary: ["id"] } });
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ terms: [] });
  });
});
