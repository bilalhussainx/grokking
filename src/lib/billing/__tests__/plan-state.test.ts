import { describe, it, expect } from "vitest";
import { derivePlanState } from "../plan-state";

const paid = { plan: "pro", status: "active", stripeSubscriptionId: "sub_1" };
const today = "2026-09-27";

describe("derivePlanState", () => {
  it("calls a live Stripe subscription Pro", () => {
    expect(derivePlanState({ role: "pro", trialEndsAt: "2026-10-04T00:00:00Z", subscription: paid, todayIso: today })).toEqual({ kind: "pro", trialEndsOn: null });
    expect(derivePlanState({ role: "pro", trialEndsAt: null, subscription: { ...paid, status: "past_due" }, todayIso: today }).kind).toBe("pro");
  });

  it("does not treat a signup trial as a paid subscription", () => {
    const free = { plan: "free", status: "active", stripeSubscriptionId: null };
    expect(derivePlanState({ role: "pro", trialEndsAt: "2026-10-04T12:00:00Z", subscription: free, todayIso: today })).toEqual({ kind: "trial", trialEndsOn: "2026-10-04" });
    expect(derivePlanState({ role: "pro", trialEndsAt: null, subscription: null, todayIso: today })).toEqual({ kind: "trial", trialEndsOn: null });
  });

  it("says Pro without guessing when billing couldn't be checked", () => {
    expect(derivePlanState({ role: "pro", trialEndsAt: null, subscription: "unavailable", todayIso: today }).kind).toBe("pro_unconfirmed");
  });

  it("distinguishes an ended trial from never having one", () => {
    expect(derivePlanState({ role: "student", trialEndsAt: "2026-09-01T00:00:00Z", subscription: null, todayIso: today })).toEqual({ kind: "ended", trialEndsOn: "2026-09-01" });
    expect(derivePlanState({ role: "student", trialEndsAt: null, subscription: null, todayIso: today })).toEqual({ kind: "free", trialEndsOn: null });
  });

  it("ignores a canceled subscription", () => {
    expect(derivePlanState({ role: "student", trialEndsAt: null, subscription: { ...paid, status: "canceled" }, todayIso: today }).kind).toBe("free");
  });
});
