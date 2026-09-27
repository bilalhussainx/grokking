// The TopNav search button fires "open-global-search". After the course search
// was retired, nothing listened, so the button did nothing. The command
// palette answers it, and it is mounted once for every signed-in page.
import { describe, it, expect, vi, afterEach } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import fs from "node:fs";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("@/contexts/CoachKairosContext", () => ({ useCoachKairos: () => ({ open: vi.fn() }) }));
import CommandPalette from "../CommandPalette";

afterEach(cleanup);

describe("command palette", () => {
  it("opens on the TopNav search event", () => {
    render(<CommandPalette />);
    expect(screen.queryByRole("dialog")).toBeNull();
    act(() => { window.dispatchEvent(new CustomEvent("open-global-search")); });
    expect(screen.getByRole("dialog")).toBeTruthy();
  });

  it("is mounted once, globally, not per AppShell", () => {
    expect(fs.readFileSync("src/app/providers.tsx", "utf8")).toMatch(/<CommandPalette \/>/);
    expect(fs.readFileSync("src/components/nav/AppShell.tsx", "utf8")).not.toMatch(/<CommandPalette \/>/);
  });
});
