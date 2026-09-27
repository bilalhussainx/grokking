import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MobileDrawer from "./MobileDrawer";

// Stub Coach Kairos context. MobileDrawer reads `openWithVariant` from it
// to handle the Tools → Coach row, but that branch isn't exercised in
// these tests, so a no-op stub is enough.
vi.mock("@/contexts/CoachKairosContext", () => ({
  useCoachKairos: () => ({ openWithVariant: () => {} }),
}));

const signOut = vi.fn();
vi.mock("@/contexts/AuthContext", () => ({ useAuth: () => ({ signOut }) }));

// Stub usePathname so Link can render without an App Router instance.
vi.mock("next/navigation", () => ({
  usePathname: () => "/cc/dashboard",
}));

describe("MobileDrawer", () => {
  it("renders nothing when open is false", () => {
    const { container } = render(
      <MobileDrawer open={false} grade="senior_writing" onClose={() => {}} />,
    );
    // Drawer is unmounted when closed (AnimatePresence with no initial mount).
    expect(container.querySelector("aside")).toBeNull();
  });

  it("renders aside + scrim when open is true", () => {
    render(<MobileDrawer open={true} grade="senior_writing" onClose={() => {}} />);
    expect(screen.getByRole("complementary")).toBeTruthy();
  });

  it("calls onClose when scrim is clicked", () => {
    const onClose = vi.fn();
    render(<MobileDrawer open={true} grade="senior_writing" onClose={onClose} />);
    const scrim = screen.getByTestId("mobile-drawer-scrim");
    fireEvent.click(scrim);
    expect(onClose).toHaveBeenCalled();
  });

  it("renders Apply / Profile / Tools section headers for senior_writing", () => {
    render(<MobileDrawer open={true} grade="senior_writing" onClose={() => {}} />);
    expect(screen.getByText("Apply")).toBeTruthy();
    expect(screen.getByText("Profile")).toBeTruthy();
    expect(screen.getByText("Tools")).toBeTruthy();
  });

  it("shows 'Unlocks junior year' caption for g9 Apply section", () => {
    render(<MobileDrawer open={true} grade="g9" onClose={() => {}} />);
    expect(screen.getByText(/Unlocks junior year/i)).toBeTruthy();
  });

  it("shows transfer-specific 'Why-transfer essay' label", () => {
    render(<MobileDrawer open={true} grade="transfer" onClose={() => {}} />);
    expect(screen.getByText(/Why-transfer essay/i)).toBeTruthy();
  });

  it("Sign out signs the user out (there is no /account/sign-out page)", () => {
    render(<MobileDrawer open grade="senior_writing" onClose={() => {}} />);
    fireEvent.click(screen.getByText("Sign out"));
    expect(signOut).toHaveBeenCalledTimes(1);
  });
});
