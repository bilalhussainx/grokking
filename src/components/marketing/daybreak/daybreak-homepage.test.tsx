import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import DaybreakHomepage from "./DaybreakHomepage";
import { QUICK_CHECK_COPY } from "@/lib/daybreak";

const pricingState = vi.hoisted(() => ({ yearlyEnabled: false }));

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("@/lib/pricing", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/pricing")>();
  return {
    ...actual,
    yearlyCheckoutConfigured: () => pricingState.yearlyEnabled,
  };
});

function chooseQuickCheck(stage = "submitted", destination = "us", concern = "schools") {
  fireEvent.change(screen.getByLabelText(QUICK_CHECK_COPY.en.labels[0]), {
    target: { value: stage },
  });
  fireEvent.change(screen.getByLabelText(QUICK_CHECK_COPY.en.labels[1]), {
    target: { value: destination },
  });
  fireEvent.change(screen.getByLabelText(QUICK_CHECK_COPY.en.labels[2]), {
    target: { value: concern },
  });
}

function submitQuickCheck() {
  fireEvent.click(screen.getByRole("button", { name: /find my next step/i }));
}

function setCostAmounts(annualCost: string, grants: string, contribution: string) {
  fireEvent.change(screen.getByLabelText("Total annual cost"), {
    target: { value: annualCost },
  });
  fireEvent.change(screen.getByLabelText("Confirmed grants & scholarships"), {
    target: { value: grants },
  });
  fireEvent.change(screen.getByLabelText("Family contribution"), {
    target: { value: contribution },
  });
}

function submitCostCheck() {
  fireEvent.click(screen.getByRole("button", { name: /calculate the gap/i }));
}

function expectNoLiveAnnouncement(node: HTMLElement) {
  for (let current: HTMLElement | null = node; current; current = current.parentElement) {
    expect(current).not.toHaveAttribute("aria-live");
    expect(current).not.toHaveAttribute("role", "alert");
  }
}

beforeEach(() => {
  pricingState.yearlyEnabled = false;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Daybreak homepage quick check", () => {
  it("shows the stage-aware result and clears it when the visitor starts again", () => {
    render(<DaybreakHomepage />);

    chooseQuickCheck("submitted", "ca", "schools");
    submitQuickCheck();

    expect(screen.getByText(QUICK_CHECK_COPY.en.actions.submitted)).toBeInTheDocument();
    expect(screen.getByText(QUICK_CHECK_COPY.en.hint[1])).toBeInTheDocument();
    expect(screen.getByText(QUICK_CHECK_COPY.en.questions[0])).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: QUICK_CHECK_COPY.en.reset }));

    expect(screen.queryByText(QUICK_CHECK_COPY.en.actions.submitted)).not.toBeInTheDocument();
    expect(screen.getByLabelText(QUICK_CHECK_COPY.en.labels[0])).toHaveValue("");
  });

  it("invalidates a shown result when any answer changes", () => {
    render(<DaybreakHomepage />);
    chooseQuickCheck();
    submitQuickCheck();
    expect(screen.getByText(QUICK_CHECK_COPY.en.actions.submitted)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(QUICK_CHECK_COPY.en.labels[2]), {
      target: { value: "cost" },
    });

    expect(screen.queryByText(QUICK_CHECK_COPY.en.actions.submitted)).not.toBeInTheDocument();
    expect(screen.queryByText(QUICK_CHECK_COPY.en.actions.cost)).not.toBeInTheDocument();
  });

  it("sets Urdu language and right-to-left direction on the quick check", () => {
    render(<DaybreakHomepage />);
    fireEvent.change(screen.getByLabelText("Quick check language"), {
      target: { value: "ur" },
    });

    const quickCheck = screen.getByRole("region", { name: QUICK_CHECK_COPY.ur.check });
    expect(quickCheck).toHaveAttribute("lang", "ur");
    expect(quickCheck).toHaveAttribute("dir", "rtl");
    expect(screen.getByLabelText(QUICK_CHECK_COPY.ur.labels[0])).toBeInTheDocument();
  });

  it("does not write answers to storage or fetch data while completing the check", () => {
    const storageWrite = vi.spyOn(Storage.prototype, "setItem");
    const fetchRequest = vi.spyOn(globalThis, "fetch");
    render(<DaybreakHomepage />);

    chooseQuickCheck("junior", "exploring", "essay");
    submitQuickCheck();

    expect(screen.getByText(QUICK_CHECK_COPY.en.actions.essay)).toBeInTheDocument();
    expect(storageWrite).not.toHaveBeenCalled();
    expect(fetchRequest).not.toHaveBeenCalled();
  });
});

describe("Daybreak homepage cost check", () => {
  it("shows the validation error when confirmed grants exceed annual cost", () => {
    render(<DaybreakHomepage />);
    setCostAmounts("10", "10.01", "0");
    submitCostCheck();

    const error = screen.getByText(/Check the highlighted amount/);
    expect(error).toHaveTextContent("Check the highlighted amount.");
    expect(error).not.toHaveAttribute("role", "alert");
    expect(screen.getByLabelText("Confirmed grants & scholarships")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByLabelText("Confirmed grants & scholarships")).toHaveAccessibleDescription(
      /Confirmed grants cannot exceed the total annual cost/,
    );
    expectNoLiveAnnouncement(error);
    return waitFor(() => expect(error).toHaveFocus());
  });

  it("treats explicit zeroes as entered amounts", () => {
    render(<DaybreakHomepage />);
    setCostAmounts("0", "0", "0");
    submitCostCheck();

    const heading = screen.getByRole("heading", { name: "Your entered amounts cover this cost." });
    expect(heading).toHaveAccessibleDescription(/USD\s*0\.00/);
    expect(heading.getAttribute("aria-describedby")).toContain("cost-result-amount");
    expectNoLiveAnnouncement(heading);
    return waitFor(() => expect(heading).toHaveFocus());
  });

  it("calculates decimal amounts in cents", () => {
    render(<DaybreakHomepage />);
    setCostAmounts("45,000.50", "23,000.40", "1,000.05");
    submitCostCheck();

    const heading = screen.getByRole("heading", { name: "Your remaining annual gap." });
    expect(heading).toHaveAccessibleDescription(/USD\s*21,000\.05/);
    expect(screen.getByLabelText("Total annual cost")).toHaveAttribute("inputmode", "decimal");
  });

  it("clears entered values and results when currency changes", () => {
    render(<DaybreakHomepage />);
    setCostAmounts("100", "20", "30");
    submitCostCheck();
    expect(screen.getByRole("heading", { name: "Your remaining annual gap." })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Currency for every amount"), {
      target: { value: "CAD" },
    });

    expect(screen.getByLabelText("Total annual cost")).toHaveValue("");
    expect(screen.getByLabelText("Confirmed grants & scholarships")).toHaveValue("");
    expect(screen.getByText("Amounts cleared. Changing currency does not convert your entries.")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Your remaining annual gap." })).not.toBeInTheDocument();
  });

  it("shows the unknown-amount collection path and returns to the inputs", async () => {
    render(<DaybreakHomepage />);
    fireEvent.click(screen.getByRole("button", { name: /i don’t know the amounts yet/i }));

    const unknownHeading = screen.getByRole("heading", { name: "Collect these three things." });
    expect(unknownHeading).toBeInTheDocument();
    expect(screen.getByText("The school’s current annual cost, including living costs.")).toBeInTheDocument();
    expectNoLiveAnnouncement(unknownHeading);
    await waitFor(() => expect(unknownHeading).toHaveFocus());

    fireEvent.click(screen.getByRole("button", { name: "Back to my numbers" }));
    expect(screen.queryByRole("heading", { name: "Collect these three things." })).not.toBeInTheDocument();
    expect(screen.getByLabelText("Total annual cost")).toHaveFocus();
  });
});

describe("Daybreak homepage yearly price gate", () => {
  it("shows the annual price only when yearly checkout is configured", () => {
    const { unmount } = render(<DaybreakHomepage />);
    expect(screen.queryByText(/\$99\/year USD/)).not.toBeInTheDocument();

    unmount();
    pricingState.yearlyEnabled = true;
    render(<DaybreakHomepage />);

    expect(screen.getAllByText(/\$99\/year USD/).length).toBeGreaterThan(0);
  });
});
