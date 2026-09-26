// Pro subscribers pay $12 (legacy, until migrated), $15/month or $99/year, and
// this card doesn't know which: it must not print one hardcoded price.
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import SubscriptionStatus from "../SubscriptionStatus";

afterEach(() => vi.unstubAllGlobals());

describe("SubscriptionStatus", () => {
  it("shows Pro without claiming a specific price", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({
      subscription: { id: "s", userId: "u", stripeSubscriptionId: "sub_1", stripeCustomerId: "cus_1", plan: "pro", status: "active",
        currentPeriodStart: null, currentPeriodEnd: "2026-10-25T00:00:00Z", cancelAtPeriodEnd: false, createdAt: "", updatedAt: "" },
    }))));
    render(<SubscriptionStatus />);
    await screen.findAllByText(/pro/i);
    expect(document.body.textContent).not.toMatch(/\$\d+/);
  });
});
