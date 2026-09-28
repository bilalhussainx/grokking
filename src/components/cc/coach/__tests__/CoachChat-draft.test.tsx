// The composer receives a staged draft and focus. The student presses send.
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

const h = vi.hoisted(() => ({ draft: "add Michigan and Toronto" as string | null, send: vi.fn(), clear: vi.fn() }));
vi.mock("@/contexts/CoachKairosContext", () => ({
  useCoachKairos: () => ({
    messages: [], sendMessage: h.send, isStreaming: false, isLoading: false, language: "en",
    appendVoiceTurn: vi.fn(), ttsError: null, clearTtsError: vi.fn(),
    pendingDraft: h.draft, clearPendingDraft: h.clear,
  }),
}));
vi.mock("@/hooks/useVoiceAgent", () => ({
  useVoiceAgent: () => ({ isConnected: false, isConnecting: false, isSpeaking: false, micMuted: false, error: null, start: vi.fn(), stop: vi.fn() }),
}));
import CoachChat from "../CoachChat";

beforeEach(() => { h.send.mockClear(); h.clear.mockClear(); });

describe("CoachChat draft", () => {
  it("puts a staged draft in the composer, focused, without sending it", () => {
    h.draft = "add Michigan and Toronto";
    render(<CoachChat />);
    const box = screen.getByRole("textbox", { name: "Message Coach Kairos" }) as HTMLInputElement;
    expect(box.value).toBe("add Michigan and Toronto");
    expect(document.activeElement).toBe(box);
    expect(h.clear).toHaveBeenCalledTimes(1);
    expect(h.send).not.toHaveBeenCalled();
  });

  it("focuses an empty composer when Coach is opened from the Coach tab", () => {
    h.draft = "";
    render(<CoachChat />);
    const box = screen.getByRole("textbox", { name: "Message Coach Kairos" }) as HTMLInputElement;
    expect(box.value).toBe("");
    expect(document.activeElement).toBe(box);
    expect(h.send).not.toHaveBeenCalled();
  });

  it("leaves the composer alone when nothing is staged", () => {
    h.draft = null;
    render(<CoachChat />);
    expect(document.activeElement).not.toBe(screen.getByRole("textbox", { name: "Message Coach Kairos" }));
    expect(h.clear).not.toHaveBeenCalled();
  });
});
