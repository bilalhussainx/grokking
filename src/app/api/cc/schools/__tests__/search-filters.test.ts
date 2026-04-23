import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

let lastChain: any;

function createMockChain() {
  const chain = {
    eq: vi.fn(function () {
      return this;
    }),
    ilike: vi.fn(function () {
      return this;
    }),
    order: vi.fn(function () {
      return this;
    }),
    limit: vi.fn(function () {
      return this;
    }),
    then: vi.fn((resolve) => resolve({ data: [], error: null })),
  };
  lastChain = chain;
  return chain;
}

vi.mock("../../helpers", () => ({
  createAdminSupabase: () => ({
    from: vi.fn(() => ({
      select: vi.fn(() => createMockChain()),
    })),
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

async function callSearch(body: Record<string, unknown>) {
  const { POST } = await import("../search/route");
  const req = new NextRequest("http://localhost/api/cc/schools/search", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
  return POST(req);
}

describe("/api/cc/schools/search filter behavior", () => {
  it("filters need-blind international when flag is true", async () => {
    await callSearch({ need_blind_international: true });
    expect(lastChain.eq).toHaveBeenCalledWith("need_blind_international", true);
  });

  it("filters meets-full-need international when flag is true", async () => {
    await callSearch({ meets_full_need_international: true });
    expect(lastChain.eq).toHaveBeenCalledWith("meets_full_need_international", true);
  });

  it("filters css-profile-required when flag is true", async () => {
    await callSearch({ css_profile_required: true });
    expect(lastChain.eq).toHaveBeenCalledWith("css_profile_required", true);
  });

  it("does not filter when flag is absent or false", async () => {
    await callSearch({ state: "MA" });
    const calls = lastChain.eq.mock.calls.map((c: any) => c[0]);
    expect(calls).not.toContain("need_blind_international");
    expect(calls).not.toContain("meets_full_need_international");
    expect(calls).not.toContain("css_profile_required");
  });
});
