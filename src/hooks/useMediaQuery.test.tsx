import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useMediaQuery } from "./useMediaQuery";

function Probe({ q }: { q: string }) {
  const matches = useMediaQuery(q);
  return <span data-testid="m">{String(matches)}</span>;
}

describe("useMediaQuery", () => {
  let mockMql: { matches: boolean; addEventListener: ReturnType<typeof vi.fn>; removeEventListener: ReturnType<typeof vi.fn>; media: string };
  beforeEach(() => {
    mockMql = { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn(), media: "" };
    window.matchMedia = vi.fn().mockImplementation((q: string) => ({ ...mockMql, media: q }));
  });

  it("returns false initially when matchMedia.matches is false", () => {
    render(<Probe q="(max-width: 1023.98px)" />);
    expect(screen.getByTestId("m").textContent).toBe("false");
  });

  it("returns true when the media query starts matched", () => {
    mockMql.matches = true;
    render(<Probe q="(max-width: 1023.98px)" />);
    expect(screen.getByTestId("m").textContent).toBe("true");
  });

  it("updates on media-query change events", () => {
    let listener: ((e: { matches: boolean }) => void) | null = null;
    mockMql.addEventListener = vi.fn((evt: string, l: (e: { matches: boolean }) => void) => {
      if (evt === "change") listener = l;
    });
    render(<Probe q="(max-width: 1023.98px)" />);
    expect(screen.getByTestId("m").textContent).toBe("false");
    act(() => listener!({ matches: true }));
    expect(screen.getByTestId("m").textContent).toBe("true");
  });

  it("unsubscribes on unmount", () => {
    const removeSpy = vi.fn();
    mockMql.removeEventListener = removeSpy;
    const { unmount } = render(<Probe q="(max-width: 1023.98px)" />);
    unmount();
    expect(removeSpy).toHaveBeenCalled();
  });
});
