// The frame must replace TopNav exactly where it renders: a route with neither
// would have no navigation at all, and a route with both would stack a navy
// header on the Daybreak rail.
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import fs from "node:fs";

const h = vi.hoisted(() => ({ pathname: "/cc/dashboard" }));
vi.mock("next/navigation", () => ({ usePathname: () => h.pathname, useRouter: () => ({ push: vi.fn() }) }));
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ user: { id: "u1" }, loading: false }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("@/contexts/CoachKairosContext", () => ({
  useCoachKairos: () => ({
    isOpen: false, toggle: vi.fn(), close: vi.fn(), isStreaming: false, language: "en", setLanguage: vi.fn(),
    voiceEnabled: false, setVoiceEnabled: vi.fn(), isSpeaking: false, stopSpeaking: vi.fn(),
    familyMode: false, toggleFamilyMode: vi.fn(),
  }),
  CoachKairosProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("@/components/layout/TopNav", () => ({ default: () => <nav data-testid="topnav" /> }));
vi.mock("@/components/cc/coach/CoachChat", () => ({ default: () => null }));
vi.mock("@/components/family-mode/FamilyModeView", () => ({ default: () => null }));
vi.mock("@/components/family-mode/HandToParentButton", () => ({ default: () => null }));
vi.mock("@/components/cc/WorkingLatePrompt", () => ({ default: () => null }));
vi.mock("@/components/nav/CommandPalette", () => ({ default: () => null }));
vi.mock("@/components/ui/ShortcutsHelp", () => ({ default: () => null }));
vi.mock("@/components/feedback/SurveyPrompt", () => ({ default: () => null }));
vi.mock("@/components/app-shell/AppFrame", () => ({
  default: ({ stage, audience, children }: { stage: string; audience?: string; children: React.ReactNode }) => (
    <div data-testid="frame" data-stage={stage} data-audience={audience ?? "student"}>{children}</div>
  ),
}));

import { APP_FRAME_PREFIXES } from "../app-nav";
import AppShell from "@/components/nav/AppShell";
import CoachKairosShell from "@/components/cc/coach/CoachKairosShell";
import { AppLayout } from "@/app/providers";

beforeEach(() => { h.pathname = "/cc/dashboard"; });

describe("mounting the frame", () => {
  it("gives every framed prefix a layout that renders AppShell", () => {
    for (const prefix of APP_FRAME_PREFIXES) {
      const file = `src/app${prefix}/layout.tsx`;
      expect(fs.existsSync(file), file).toBe(true);
      expect(fs.readFileSync(file, "utf8"), file).toMatch(/<AppShell\b/);
    }
  });

  it("drops the navy TopNav where the frame renders, and keeps it elsewhere", () => {
    const { unmount } = render(<AppLayout><p>page</p></AppLayout>);
    expect(screen.queryByTestId("topnav")).toBeNull();
    expect(screen.getByText("page")).toBeTruthy();
    unmount();
    h.pathname = "/my-schools";
    render(<AppLayout><p>page</p></AppLayout>);
    expect(screen.getByTestId("topnav")).toBeTruthy();
  });

  it("hides the floating gold Coach button where the rail and tabs already offer Coach", () => {
    const { unmount } = render(<CoachKairosShell />);
    expect(screen.queryByRole("button", { name: "Open Coach Kairos" })).toBeNull();
    unmount();
    h.pathname = "/my-schools";
    render(<CoachKairosShell />);
    expect(screen.getByRole("button", { name: "Open Coach Kairos" })).toBeTruthy();
  });

  it("hands the stage and audience to the frame", () => {
    render(<AppShell grade="g9" audience="staff"><p>page</p></AppShell>);
    const frame = screen.getByTestId("frame");
    expect(frame.dataset.stage).toBe("g9");
    expect(frame.dataset.audience).toBe("staff");
  });
});
