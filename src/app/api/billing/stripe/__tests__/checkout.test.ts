// src/app/api/billing/stripe/__tests__/checkout.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const h = vi.hoisted(() => ({ create: vi.fn(), user: { id: "u1", email: "s@example.com" } as { id: string; email: string } | null, existing: null as Record<string, unknown> | null, profile: null as Record<string, unknown> | null }));
vi.mock("stripe", () => ({
  default: class { checkout = { sessions: { create: h.create } }; },
}));
vi.mock("@/lib/supabase-auth", () => ({
  createServerSupabase: async () => ({
    auth: { getUser: async () => ({ data: { user: h.user } }) },
    from: (t: string) => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: t === "user_profiles" ? h.profile : h.existing }) }) }) }),
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
  h.existing = null;
  h.profile = null;
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

  it("refuses a second subscription and points to the billing portal", async () => {
    h.existing = { stripe_customer_id: "cus_1", stripe_subscription_id: "sub_1", status: "active" };
    const res = await POST(req({ interval: "year" }));
    expect(res.status).toBe(409);
    expect((await res.json()).manage).toBe(true);
    expect(h.create).not.toHaveBeenCalled();
  });

  it("still lets a signup-trial user (no Stripe subscription) subscribe", async () => {
    h.existing = { stripe_customer_id: null, stripe_subscription_id: null, status: "trialing" };
    expect((await POST(req({}))).status).toBe(200);
  });

  it("lets a user whose subscription was canceled subscribe again", async () => {
    h.existing = { stripe_customer_id: "cus_1", stripe_subscription_id: "sub_old", status: "canceled" };
    expect((await POST(req({}))).status).toBe(200);
  });

  it("treats a JSON null body as the default interval", async () => {
    const res = await POST(new NextRequest("http://localhost/api/billing/stripe/checkout", {
      method: "POST", body: "null", headers: { "Content-Type": "application/json", origin: "http://localhost" },
    }));
    expect(res.status).toBe(200);
  });

  // A student still in the free signup trial keeps the rest of it: Stripe
  // starts billing when the trial ends. Stripe needs trial_end ≥ 48h away.
  it("defers the first charge to the end of the signup trial", async () => {
    const end = new Date(Date.now() + 5 * 24 * 3600 * 1000);
    h.profile = { trial_ends_at: end.toISOString() };
    expect((await POST(req({}))).status).toBe(200);
    expect(h.create.mock.calls[0][0].subscription_data.trial_end).toBe(Math.floor(end.getTime() / 1000));
  });

  it("charges now when less than 48 hours of trial remain", async () => {
    h.profile = { trial_ends_at: new Date(Date.now() + 24 * 3600 * 1000).toISOString() };
    await POST(req({}));
    expect(h.create.mock.calls[0][0].subscription_data.trial_end).toBeUndefined();
  });

  it("charges now when there is no trial", async () => {
    await POST(req({}));
    expect(h.create.mock.calls[0][0].subscription_data.trial_end).toBeUndefined();
  });
});
