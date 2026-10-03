// A draft below 60% of its word limit gets "too early to score": the panel
// shows what to develop and no number (it used to fall back to "0 / 100").
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import RevisionPanel from "../RevisionPanel";
import { earlyDraftReview } from "@/lib/cc/essay-review-gate";

describe("RevisionPanel, too early to score", () => {
  it("shows what to develop and no score", () => {
    const onNav = vi.fn();
    const { container } = render(<RevisionPanel review={earlyDraftReview(130, 650) as never} loading={false} onNavigatePhase={onNav} />);
    expect(screen.getByText("Too early to score")).toBeTruthy();
    expect(container.textContent).toContain("130 words against a 650-word limit");
    expect(container.textContent).toContain("One specific moment");
    expect(container.textContent).not.toMatch(/\/ 100|Strong|Rethink the angle|Score breakdown/);
    fireEvent.click(screen.getByRole("button", { name: /Back to draft/ }));
    expect(onNav).toHaveBeenCalledWith("draft");
  });
});
