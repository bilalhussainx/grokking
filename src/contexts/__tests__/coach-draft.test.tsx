// Amendment A: "Ask Kairos" opens the existing Coach with the student's words
// already typed. Nothing is sent on the student's behalf, and opening Coach
// this way must also suppress the automatic greeting on "/".
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";

vi.mock("@/contexts/AuthContext", () => ({ useAuth: () => ({ user: { id: "u1" }, profile: { full_name: "Ada Lovelace" } }) }));
vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
vi.mock("@/hooks/useCoachVoice", () => ({ useCoachVoice: () => ({ speak: vi.fn(), stop: vi.fn() }) }));
import { CoachKairosProvider, useCoachKairos } from "../CoachKairosContext";

const fetchMock = vi.fn(async (url: string) =>
  new Response(JSON.stringify(String(url).includes("history") ? { messages: [] } : {}), { status: 200 }));

beforeEach(() => { fetchMock.mockClear(); vi.stubGlobal("fetch", fetchMock); });
afterEach(() => { vi.unstubAllGlobals(); });

function Probe() {
  const c = useCoachKairos();
  return (
    <div>
      <span data-testid="open">{String(c.isOpen)}</span>
      <span data-testid="draft">{c.pendingDraft ?? "none"}</span>
      <button type="button" onClick={() => c.openWithDraft("  add Michigan and Toronto  ")}>ask</button>
      <button type="button" onClick={c.clearPendingDraft}>clear</button>
    </div>
  );
}

describe("openWithDraft", () => {
  it("opens the drawer with the student's words staged and sends nothing", async () => {
    render(<CoachKairosProvider><Probe /></CoachKairosProvider>);
    await act(async () => {}); // history load settles: empty conversation on "/"
    fireEvent.click(screen.getByText("ask"));
    expect(screen.getByTestId("open").textContent).toBe("true");
    expect(screen.getByTestId("draft").textContent).toBe("add Michigan and Toronto");
    // Past the 1.5 s window in which "/" would otherwise auto-send "hi".
    await act(async () => { await new Promise((r) => setTimeout(r, 1700)); });
    expect(fetchMock.mock.calls.map(([u]) => String(u))).not.toContain("/api/cc/coach/message");
    fireEvent.click(screen.getByText("clear"));
    expect(screen.getByTestId("draft").textContent).toBe("none");
  });
});
