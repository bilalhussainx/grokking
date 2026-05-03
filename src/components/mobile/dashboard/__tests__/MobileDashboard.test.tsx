import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act, fireEvent } from "@testing-library/react";
import MobileDashboard from "../MobileDashboard";
import type { DashboardSummary } from "@/components/cc/dashboard/sections/types";

vi.mock("@/components/cc/coach/CoachChat", () => ({
  default: () => <div data-testid="coach-chat-mock">Coach</div>,
}));

vi.mock("@/contexts/CoachKairosContext", () => ({
  useCoachKairos: () => ({
    openWithVariant: vi.fn(),
    isOpen: false,
    open: vi.fn(),
    close: vi.fn(),
  }),
}));

const fixture: DashboardSummary = {
  firstName: "Aanya",
  brief: "Revise your personal statement this week.",
  schools: [],
  personalStatement: null,
  activities: { logged: 4, optimized: 2 },
  variantKey: "junior",
  statusLabel: "Junior · runway to senior year",
  statusTone: "gold",
  courses: null,
  psatPlan: null,
  whyTransferEssay: null,
  priorityWidgets: [
    { kind: "schoolListBalance", data: {}, nudge: undefined },
    { kind: "satBars", data: {}, nudge: undefined },
  ],
  footerWidgets: [
    { n: "7", label: "Schools", tone: "gold" },
    { n: "8", label: "Activities" },
  ],
  observations: {},
};

describe("MobileDashboard", () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(fixture) }),
    ) as unknown as typeof fetch;
  });

  it("shows loading state initially, then summary", async () => {
    render(<MobileDashboard />);
    await waitFor(() => expect(screen.getByText("Hi, Aanya.")).toBeTruthy());
  });

  it("renders the bottom tab bar after summary loads", async () => {
    render(<MobileDashboard />);
    await waitFor(() => expect(screen.getByLabelText(/Home/)).toBeTruthy());
    expect(screen.getByLabelText(/Apply/)).toBeTruthy();
    expect(screen.getByLabelText(/Search/)).toBeTruthy();
  });

  it("renders the footer widgets when present", async () => {
    render(<MobileDashboard />);
    await waitFor(() => expect(screen.getByText("Schools")).toBeTruthy());
    expect(screen.getByText("Activities")).toBeTruthy();
  });

  it("opens the drawer when hamburger is tapped", async () => {
    render(<MobileDashboard />);
    await waitFor(() => expect(screen.getByLabelText(/Open menu/)).toBeTruthy());
    fireEvent.click(screen.getByLabelText(/Open menu/));
    await waitFor(() => expect(screen.getByRole("complementary")).toBeTruthy());
  });

  it("opens the search sheet when search icon is tapped", async () => {
    render(<MobileDashboard />);
    await waitFor(() => expect(screen.getByLabelText(/Open search/)).toBeTruthy());
    fireEvent.click(screen.getByLabelText(/Open search/));
    await waitFor(() => {
      const dialogs = screen.getAllByRole("dialog");
      expect(dialogs.some((d) => d.getAttribute("aria-label") === "Search")).toBe(true);
    });
  });

  it("refetches summary on kairos:message-complete with extracted > 0", async () => {
    const fetchSpy = global.fetch as unknown as ReturnType<typeof vi.fn>;
    render(<MobileDashboard />);
    await waitFor(() => expect(screen.getByText("Hi, Aanya.")).toBeTruthy());
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    act(() => {
      window.dispatchEvent(
        new CustomEvent("kairos:message-complete", {
          detail: { extracted: 1, actionKinds: ["add_schools"] },
        }),
      );
    });
    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(2));
  });

  it("does NOT refetch on kairos:message-complete when extracted=0 and actionKinds=[]", async () => {
    const fetchSpy = global.fetch as unknown as ReturnType<typeof vi.fn>;
    render(<MobileDashboard />);
    await waitFor(() => expect(screen.getByText("Hi, Aanya.")).toBeTruthy());
    act(() => {
      window.dispatchEvent(
        new CustomEvent("kairos:message-complete", {
          detail: { extracted: 0, actionKinds: [] },
        }),
      );
    });
    await new Promise((r) => setTimeout(r, 50));
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
