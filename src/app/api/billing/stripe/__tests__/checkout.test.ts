// src/app/api/billing/stripe/__tests__/checkout.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const h = vi.hoisted(() => ({ create: vi.fn(), user: { id: "u1", email: "s@example.com" } as { id: string; email: string } | null }));
vi.mock("stripe", () => ({
  default: class { checkout = { sessions: { create: h.create } }; },
}));
vi.mock("@/lib/supabase-auth", () => ({
  createServerSupabase: async () => ({
    auth: { getUser: async () => ({ data: { user: h.user } }) },
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null }) }) }) }),
  }),
}));

import { POST } from "../checkout/route";

const req = (body: unknown) =>
  new NextRequest("http://localhost/api/billing/stripe/checkout", {
    method: "POST", body: JSON.stringify(body), headers: { "Content-Type": "application/json", origin: "http://localhost" },
  });

beforeEach(() => {
  h.create.mockReset().mockResolvedValue({ url: "https://checkout.stripe.test/s" });
  h.user = { id: "u1", email: "s@example.com" };
  vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_x");
  vi.stubEnv("NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY", "price_month");
  vi.stubEnv("NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY", "price_year");
});

describe("POST /api/billing/stripe/checkout", () => {
  it("uses the monthly price by default", async () => {
    expect((await POST(req({}))).status).toBe(200);
    expect(h.create.mock.calls[0][0].line_items).toEqual([{ price: "price_month", quantity: 1 }]);
  });

  it("uses the yearly price for interval=year", async () => {
    await POST(req({ interval: "year" }));
    expect(h.create.mock.calls[0][0].line_items).toEqual([{ price: "price_year", quantity: 1 }]);
    expect(h.create.mock.calls[0][0].subscription_data.metadata).toEqual({ user_id: "u1", plan: "pro", interval: "year" });
  });

  it("rejects an unknown interval", async () => {
    expect((await POST(req({ interval: "week" }))).status).toBe(400);
    expect(h.create).not.toHaveBeenCalled();
  });

  it("never falls back to monthly when the yearly price is missing", async () => {
    vi.stubEnv("NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY", "");
    expect((await POST(req({ interval: "year" }))).status).toBe(500);
    expect(h.create).not.toHaveBeenCalled();
  });

  it("401s when signed out", async () => {
    h.user = null;
    expect((await POST(req({}))).status).toBe(401);
  });
});
