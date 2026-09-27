import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/components/marketing/daybreak/DaybreakHomepage", () => ({ default: () => <main>daybreak home</main> }));
import WelcomePage from "../page";

describe("/welcome", () => {
  it("renders the Daybreak homepage", () => {
    render(<WelcomePage />);
    expect(screen.getByText("daybreak home")).toBeTruthy();
  });
});
