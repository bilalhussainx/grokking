import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useVoicePreference } from "../useVoicePreference";

function Probe({ storageKey }: { storageKey: string }) {
  const [on, setOn] = useVoicePreference(storageKey);
  return (
    <div>
      <span data-testid="value">{String(on)}</span>
      <button data-testid="toggle" onClick={() => setOn(!on)}>toggle</button>
    </div>
  );
}

describe("useVoicePreference", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts false when nothing in storage", () => {
    render(<Probe storageKey="test-voice-1" />);
    expect(screen.getByTestId("value").textContent).toBe("false");
  });

  it("rehydrates true when 'true' is in storage", () => {
    localStorage.setItem("test-voice-2", "true");
    render(<Probe storageKey="test-voice-2" />);
    expect(screen.getByTestId("value").textContent).toBe("true");
  });

  it("writes 'true' to storage when toggled on", () => {
    render(<Probe storageKey="test-voice-3" />);
    act(() => {
      screen.getByTestId("toggle").click();
    });
    expect(screen.getByTestId("value").textContent).toBe("true");
    expect(localStorage.getItem("test-voice-3")).toBe("true");
  });

  it("writes 'false' to storage when toggled off (after on)", () => {
    localStorage.setItem("test-voice-4", "true");
    render(<Probe storageKey="test-voice-4" />);
    act(() => {
      screen.getByTestId("toggle").click();
    });
    expect(localStorage.getItem("test-voice-4")).toBe("false");
  });

  it("survives unmount + remount when storage value is 'true'", () => {
    const { unmount } = render(<Probe storageKey="test-voice-5" />);
    act(() => {
      screen.getByTestId("toggle").click();
    });
    expect(localStorage.getItem("test-voice-5")).toBe("true");
    unmount();
    render(<Probe storageKey="test-voice-5" />);
    expect(screen.getByTestId("value").textContent).toBe("true");
  });

  it("treats any non-'true' string as false", () => {
    localStorage.setItem("test-voice-6", "1");
    render(<Probe storageKey="test-voice-6" />);
    expect(screen.getByTestId("value").textContent).toBe("false");
  });
});
