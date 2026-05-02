import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import BottomTabBar from "./BottomTabBar";

describe("BottomTabBar", () => {
  it("shows Apply tab labeled 'Apply' for senior_writing", () => {
    render(<BottomTabBar grade="senior_writing" active="home" onTab={() => {}} />);
    expect(screen.getByText("Apply")).toBeTruthy();
  });
  it("shows Apply tab as locked for g9", () => {
    render(<BottomTabBar grade="g9" active="home" onTab={() => {}} />);
    const apply = screen.getByLabelText(/Apply/);
    expect(apply.getAttribute("aria-disabled")).toBe("true");
  });
  it("relabels Apply tab to 'Tests' for g10", () => {
    render(<BottomTabBar grade="g10" active="home" onTab={() => {}} />);
    expect(screen.getByText("Tests")).toBeTruthy();
  });
  it("relabels Apply tab to 'Why-Transfer' for transfer", () => {
    render(<BottomTabBar grade="transfer" active="home" onTab={() => {}} />);
    expect(screen.getByText("Why-Transfer")).toBeTruthy();
  });
  it("calls onTab with the tab id when a tab is clicked", () => {
    const onTab = vi.fn();
    render(<BottomTabBar grade="senior_writing" active="home" onTab={onTab} />);
    fireEvent.click(screen.getByLabelText(/Search/));
    expect(onTab).toHaveBeenCalledWith("search");
  });
  it("does NOT call onTab for the locked Apply tab in g9", () => {
    const onTab = vi.fn();
    render(<BottomTabBar grade="g9" active="home" onTab={onTab} />);
    fireEvent.click(screen.getByLabelText(/Apply/));
    expect(onTab).not.toHaveBeenCalled();
  });
});
