// Stripe's current API (SDK 22 default) moved current_period_start/end from
// the subscription onto its items; the webhook read the old location and
// stored null for every subscription.
import { describe, it, expect } from "vitest";
import { subscriptionPeriod } from "../stripe-period";

describe("subscriptionPeriod", () => {
  it("reads the period from the first subscription item", () => {
    expect(subscriptionPeriod({ items: { data: [{ current_period_start: 1758758400, current_period_end: 1790294400 }] } })).toEqual({
      start: "2025-09-25T00:00:00.000Z",
      end: "2026-09-25T00:00:00.000Z",
    });
  });
  it("falls back to the legacy subscription-level fields", () => {
    expect(subscriptionPeriod({ current_period_start: 1758758400, current_period_end: 1761436800, items: { data: [] } })).toEqual({
      start: "2025-09-25T00:00:00.000Z",
      end: "2025-10-26T00:00:00.000Z",
    });
  });
  it("returns nulls for a missing subscription", () => {
    expect(subscriptionPeriod(null)).toEqual({ start: null, end: null });
  });
});
