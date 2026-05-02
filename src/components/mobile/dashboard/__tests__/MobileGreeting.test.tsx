import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MobileGreeting from "../MobileGreeting";
import type { DashboardSummary } from "@/components/cc/dashboard/sections/types";

const baseSummary: DashboardSummary = {
  firstName: "Aanya",
  brief: null,
  schools: [],
  personalStatement: null,
  activities: { logged: 0, optimized: 0 },
  variantKey: "junior",
  statusLabel: "Junior · runway to senior year",
  statusTone: "gold",
  courses: null,
  psatPlan: null,
  whyTransferEssay: null,
  priorityWidgets: [],
  footerWidgets: [],
  observations: {},
};

describe("MobileGreeting", () => {
  it("renders 'Hi, <name>.' when firstName is set", () => {
    render(<MobileGreeting summary={baseSummary} />);
    expect(screen.getByText("Hi, Aanya.")).toBeTruthy();
  });
  it("renders 'Welcome.' when firstName is null", () => {
    render(<MobileGreeting summary={{ ...baseSummary, firstName: null }} />);
    expect(screen.getByText("Welcome.")).toBeTruthy();
  });
  it("renders the statusLabel inside the tone pill", () => {
    render(<MobileGreeting summary={baseSummary} />);
    expect(screen.getByText(/Junior/i)).toBeTruthy();
  });
});
