import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MobileWidgets from "../MobileWidgets";
import type { WidgetItem } from "@/components/cc/dashboard/sections/types";

describe("MobileWidgets", () => {
  it("returns null when no items", () => {
    const { container } = render(<MobileWidgets items={[]} />);
    expect(container.firstChild).toBeNull();
  });
  it("renders a horizontal-scroll strip with one card per item", () => {
    const items: WidgetItem[] = [
      { n: "12", label: "Schools", tone: "gold" },
      { n: "8", label: "Essays", delta: "+2" },
      { n: "—", label: "Streak" },
    ];
    render(<MobileWidgets items={items} />);
    expect(screen.getByText("12")).toBeTruthy();
    expect(screen.getByText("Schools")).toBeTruthy();
    expect(screen.getByText("+2")).toBeTruthy();
    expect(screen.getByTestId("mobile-widgets-strip")).toBeTruthy();
  });
});
