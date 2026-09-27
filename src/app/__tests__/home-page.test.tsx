import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
vi.mock("@/components/marketing/daybreak/DaybreakHomepage", () => ({ default: () => <main data-testid="daybreak-homepage" /> }));
import HomePage from "../page";

describe("/", () => {
  it("renders the admissions homepage", () => {
    render(<HomePage />);
    expect(screen.getByTestId("daybreak-homepage")).toBeTruthy();
  });
});
