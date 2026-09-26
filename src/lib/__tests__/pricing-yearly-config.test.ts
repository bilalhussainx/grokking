import { describe, it, expect, vi, afterEach } from "vitest";
import { yearlyCheckoutConfigured } from "../pricing";

afterEach(() => vi.unstubAllEnvs());

describe("yearlyCheckoutConfigured", () => {
  it("is false until the yearly Stripe price is configured", () => {
    vi.stubEnv("NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY", "");
    expect(yearlyCheckoutConfigured()).toBe(false);
  });
  it("is true once it is set", () => {
    vi.stubEnv("NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY", "price_year");
    expect(yearlyCheckoutConfigured()).toBe(true);
  });
});
