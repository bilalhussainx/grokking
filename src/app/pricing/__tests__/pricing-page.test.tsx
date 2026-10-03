import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PricingPage, { metadata } from "../page";
import { PRICING, PRO_FAIR_USE, TRIAL_TERMS } from "@/lib/pricing";

vi.mock("next/navigation", () => ({ usePathname: () => "/pricing", useRouter: () => ({ push: vi.fn() }) }));
vi.mock("@/contexts/AuthContext", () => ({ useAuth: () => ({ user: null }) }));

describe("pricing page", () => {
  it("tells the plan story from pricing.ts", () => {
    render(<PricingPage />);
    const text = document.body.textContent ?? "";
    expect(text).toContain(`$${PRICING.pro.monthlyUsd}`);
    expect(text).toContain(`$${PRICING.pro.yearlyUsd}/year`);
    expect(text).toContain(`${PRICING.free.signupCredits}`);
    expect(text).toContain(`${PRO_FAIR_USE.coachMessagesPerDay} coach messages`);
    expect(text).toContain(TRIAL_TERMS);
  });

  it("labels the checkout button with what it does (subscribe), not a free start", () => {
    render(<PricingPage />);
    expect(screen.getByRole("button", { name: /Subscribe monthly/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Start Pro/ })).not.toBeInTheDocument();
  });

  it("does not describe the old free plan", () => {
    const { container } = render(<PricingPage />);
    const text = `${container.textContent} ${metadata.description}`;
    expect(text).not.toMatch(/free forever|\$0|unlimited everything|English only|3 schools|1 essay/i);
  });
});
