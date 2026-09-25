import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MarketingShell from "./MarketingShell";

const route = vi.hoisted(() => ({ pathname: "/about" }));
vi.mock("next/navigation", () => ({ usePathname: () => route.pathname }));

describe("marketing mobile menu", () => {
  beforeEach(() => { route.pathname = "/about"; });

  it("closes on navigation and stays closed when returning to the original page", () => {
    const { rerender } = render(<MarketingShell>About</MarketingShell>);
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");

    route.pathname = "/pricing";
    rerender(<MarketingShell>Pricing</MarketingShell>);
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");

    route.pathname = "/about";
    rerender(<MarketingShell>About</MarketingShell>);
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("button", { name: "Close menu" })).toBeInTheDocument();
  });
});
