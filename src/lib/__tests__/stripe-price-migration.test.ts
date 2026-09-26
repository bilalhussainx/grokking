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
