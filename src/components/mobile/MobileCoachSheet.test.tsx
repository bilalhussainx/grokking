import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MobileCoachSheet from "./MobileCoachSheet";

// CoachChat depends on useCoachKairos + useVoiceAgent; stub them so the
// sheet renders in isolation without spinning up the full coach context.
vi.mock("@/components/cc/coach/CoachChat", () => ({
  default: () => <div data-testid="coach-chat-mock">Coach chat content</div>,
}));

describe("MobileCoachSheet", () => {
  it("renders nothing when open is false", () => {
    const { container } = render(
      <MobileCoachSheet open={false} onClose={() => {}} />,
    );
    expect(container.querySelector('[data-testid="coach-chat-mock"]')).toBeNull();
  });

  it("renders the CoachChat content when open", () => {
    render(<MobileCoachSheet open={true} onClose={() => {}} />);
    expect(screen.getByTestId("coach-chat-mock")).toBeTruthy();
  });

  it("calls onClose when the scrim is clicked", () => {
    const onClose = vi.fn();
    render(<MobileCoachSheet open={true} onClose={onClose} />);
    const scrim = screen.getByTestId("mobile-coach-sheet-scrim");
    fireEvent.click(scrim);
    expect(onClose).toHaveBeenCalled();
  });

  it("renders a drag handle for visual affordance", () => {
    render(<MobileCoachSheet open={true} onClose={() => {}} />);
    expect(screen.getByTestId("mobile-coach-sheet-handle")).toBeTruthy();
  });
});
