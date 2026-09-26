import { describe, it, expect } from "vitest";
import { assertKeyMode, planPriceMigration, type SubLite } from "../../../scripts/stripe/price-migration";

const sub = (id: string, over: Partial<SubLite> = {}): SubLite => ({
  id, status: "active", cancel_at_period_end: false, items: [{ id: `si_${id}`, price: "price_12" }], ...over,
});

describe("assertKeyMode", () => {
  it("accepts test keys", () => expect(assertKeyMode("sk_test_abc", false)).toBe("test"));
  it("refuses live keys unless allowed", () => {
    expect(() => assertKeyMode("sk_live_abc", false)).toThrow(/live/i);
    expect(assertKeyMode("sk_live_abc", true)).toBe("live");
  });
  it("refuses missing or unknown keys", () => {
    expect(() => assertKeyMode(undefined, true)).toThrow();
    expect(() => assertKeyMode("pk_test_abc", true)).toThrow();
  });
});

describe("planPriceMigration", () => {
  it("moves only live subscriptions on an old price, one item each", () => {
    const plan = planPriceMigration(
      [
        sub("a"),
        sub("b", { status: "trialing" }),
        sub("c", { status: "past_due" }),
        sub("d", { status: "canceled" }),
        sub("e", { cancel_at_period_end: true }),
        sub("f", { items: [{ id: "si_f", price: "price_15" }] }),
        sub("g", { items: [{ id: "si_g1", price: "price_12" }, { id: "si_g2", price: "price_addon" }] }),
      ],
      ["price_12"],
      "price_15",
    );
    expect(plan.updates).toEqual([
      { subscriptionId: "a", itemId: "si_a" },
      { subscriptionId: "b", itemId: "si_b" },
      { subscriptionId: "c", itemId: "si_c" },
      { subscriptionId: "g", itemId: "si_g1" },
    ]);
    expect(plan.skipped.map((s) => [s.subscriptionId, s.reason])).toEqual([
      ["d", "status canceled"],
      ["e", "ending at period end"],
      ["f", "not on an old price"],
    ]);
  });
});

import { assertCompatiblePrices, type PriceLite } from "../../../scripts/stripe/price-migration";

describe("assertCompatiblePrices", () => {
  const monthly12: PriceLite = { id: "price_12", product: "prod_pro", currency: "usd", interval: "month", interval_count: 1 };
  it("accepts a same-product, same-interval swap", () =>
    expect(() => assertCompatiblePrices(monthly12, { ...monthly12, id: "price_15" })).not.toThrow());
  it.each([
    ["a yearly price (Stripe would reset the anchor and invoice now)", { interval: "year" as const }],
    ["a different interval count", { interval_count: 3 }],
    ["another currency", { currency: "eur" }],
    ["another product", { product: "prod_other" }],
  ])("refuses %s", (_label, over) =>
    expect(() => assertCompatiblePrices(monthly12, { ...monthly12, id: "price_x", ...over })).toThrow());
});

describe("planPriceMigration skips scheduled changes", () => {
  it("leaves subscriptions with a schedule or a scheduled cancellation alone", () => {
    const plan = planPriceMigration(
      [
        { ...sub("s"), schedule: "sub_sched_1" },
        { ...sub("c"), cancel_at: 1893456000 },
        sub("ok"),
      ],
      ["price_12"],
      "price_15",
    );
    expect(plan.updates.map((u) => u.subscriptionId)).toEqual(["ok"]);
    expect(plan.skipped.map((s) => [s.subscriptionId, s.reason])).toEqual([
      ["s", "has a subscription schedule"],
      ["c", "cancellation scheduled"],
    ]);
  });
});
