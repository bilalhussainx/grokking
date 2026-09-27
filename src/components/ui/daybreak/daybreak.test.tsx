import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { BottomNav, Button, Callout, Card, Field, Select, StatusChip, Tabs } from ".";

describe("Daybreak primitives", () => {
  it("associates field labels and descriptions, exposes errors, and forwards refs", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Field ref={ref} label="Email address" hint="Use your school email." error="Enter a valid email." />);
    const input = screen.getByRole("textbox", { name: "Email address" });
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Use your school email.").id).toBe(input.getAttribute("aria-describedby")?.split(" ")[0]);
    expect(screen.getByText("Enter a valid email.").id).toBe(input.getAttribute("aria-describedby")?.split(" ")[1]);
  });

  it("uses a native select with its label and controlled value", () => {
    const ref = React.createRef<HTMLSelectElement>();
    render(
      <Select ref={ref} label="Country" value="ca" onChange={() => {}}>
        <option value="us">United States</option>
        <option value="ca">Canada</option>
      </Select>,
    );
    expect(ref.current).toBe(screen.getByRole("combobox", { name: "Country" }));
    expect((screen.getByRole("combobox") as HTMLSelectElement).value).toBe("ca");
  });

  it("defaults buttons to type button and provides the requested variants", () => {
    render(<Button variant="quiet">Continue</Button>);
    const button = screen.getByRole("button", { name: "Continue" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveClass("db-button", "db-button--quiet");
  });

  it("renders card tone, redundant chip mark, and alert semantics for error callouts", () => {
    const { container } = render(
      <>
        <Card tone="sage">A calm card</Card>
        <StatusChip tone="success">Saved</StatusChip>
        <Callout tone="error">Something needs attention.</Callout>
        <Callout tone="info">A little information.</Callout>
      </>,
    );
    expect(container.querySelector(".db-card")).toHaveClass("db-card--sage");
    expect(screen.getByText("✓")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Something needs attention.");
    expect(screen.getByText("A little information.")).not.toHaveAttribute("role");
  });

  it("supports named tablists, complete associations, disabled skipping, and Home/End", () => {
    render(
      <Tabs label="Planning sections"
        items={[
          { id: "one", label: "One", content: "First panel" },
          { id: "disabled", label: "Disabled", content: "Hidden panel", disabled: true },
          { id: "three", label: "Three", content: "Third panel" },
        ]}
      />,
    );
    const tablist = screen.getByRole("tablist", { name: "Planning sections" });
    const one = screen.getByRole("tab", { name: "One" });
    const three = screen.getByRole("tab", { name: "Three" });
    const allPanels = Array.from(tablist.parentElement!.querySelectorAll<HTMLElement>('[role="tabpanel"]'));
    screen.getAllByRole("tab").forEach((tab) => {
      const panelId = tab.getAttribute("aria-controls");
      const panel = document.getElementById(panelId!);
      expect(panel).toBeInTheDocument();
      expect(panel).toHaveAttribute("aria-labelledby", tab.id);
    });
    expect(allPanels).toHaveLength(3);
    fireEvent.keyDown(one, { key: "ArrowRight" });
    expect(three).toHaveFocus();
    expect(three).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Third panel");
    fireEvent.keyDown(three, { key: "Home" });
    expect(one).toHaveFocus();
    fireEvent.keyDown(one, { key: "End" });
    expect(three).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Disabled" })).toBeDisabled();
  });

  it("uses the nearest RTL direction for arrow navigation and reports controlled changes", () => {
    const onValueChange = vi.fn();
    render(
      <section dir="ltr">
        <div dir="rtl">
          <Tabs label="Choices" value="second" onValueChange={onValueChange} items={[
            { id: "first", label: "First", content: "First content" },
            { id: "second", label: "Second", content: "Second content" },
            { id: "third", label: "Third", content: "Third content" },
          ]} />
        </div>
      </section>,
    );
    fireEvent.keyDown(screen.getByRole("tab", { name: "Second" }), { key: "ArrowRight" });
    expect(onValueChange).toHaveBeenLastCalledWith("first");
    expect(screen.getByRole("tab", { name: "First" })).toHaveFocus();
    fireEvent.keyDown(screen.getByRole("tab", { name: "First" }), { key: "ArrowLeft" });
    expect(onValueChange).toHaveBeenLastCalledWith("second");
    expect(screen.getByRole("tab", { name: "Second" })).toHaveFocus();
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Second content");
  });

  it("creates unique tab and panel IDs for repeated instances", () => {
    const items = [{ id: "overview", label: "Overview", content: "Summary" }];
    render(<><Tabs items={items} /><Tabs items={items} /></>);
    const tabs = screen.getAllByRole("tab");
    const panels = Array.from(document.querySelectorAll<HTMLElement>('[role="tabpanel"]'));
    expect(new Set(tabs.map((tab) => tab.id)).size).toBe(2);
    expect(new Set(panels.map((panel) => panel.id)).size).toBe(2);
    tabs.forEach((tab) => expect(tab.getAttribute("aria-controls")).toBeTruthy());
  });

  it("marks only the current bottom navigation destination", () => {
    render(
      <BottomNav label="Student navigation" currentHref="/plan" items={[
        { href: "/home", label: "Home", icon: "⌂" },
        { href: "/plan", label: "Plan" },
      ]} />,
    );
    expect(screen.getByRole("navigation", { name: "Student navigation" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Plan" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
  });
});
