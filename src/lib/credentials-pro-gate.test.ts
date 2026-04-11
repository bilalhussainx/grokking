import { describe, it, expect, beforeEach, vi } from "vitest";
import { isPro } from "./credentials-pro-gate";

const stubSupabase = (
  data: Record<string, unknown> | null = null,
) =>
  ({
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({ data, error: null }),
        }),
      }),
    }),
  }) as unknown as Parameters<typeof isPro>[0];

describe("isPro", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns true when user is in CREDENTIALS_PRO_ALLOWLIST", async () => {
    vi.stubEnv("CREDENTIALS_PRO_ALLOWLIST", "user-1,user-2");
    expect(await isPro(stubSupabase(), "user-1")).toBe(true);
  });

  it("returns false when not in allowlist and no subscription row", async () => {
    vi.stubEnv("CREDENTIALS_PRO_ALLOWLIST", "");
    expect(await isPro(stubSupabase(), "user-x")).toBe(false);
  });

  it("returns true for active pro plan row", async () => {
    vi.stubEnv("CREDENTIALS_PRO_ALLOWLIST", "");
    expect(
      await isPro(stubSupabase({ status: "active", plan: "pro" }), "user-x"),
    ).toBe(true);
  });

  it("returns false for active free plan row", async () => {
    vi.stubEnv("CREDENTIALS_PRO_ALLOWLIST", "");
    expect(
      await isPro(stubSupabase({ status: "active", plan: "free" }), "user-x"),
    ).toBe(false);
  });

  it("returns false for canceled pro plan row", async () => {
    vi.stubEnv("CREDENTIALS_PRO_ALLOWLIST", "");
    expect(
      await isPro(stubSupabase({ status: "canceled", plan: "pro" }), "user-x"),
    ).toBe(false);
  });
});
