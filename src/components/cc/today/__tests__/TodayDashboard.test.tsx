// Today (GATE D4.2). The hydration test reproduces production React #418: the
// server renders at one clock, the browser hydrates 12 hours later.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import fs from "node:fs";

const h = vi.hoisted(() => ({
  coach: {
    openWithDraft: vi.fn(), openWithVariant: vi.fn(), sendMessage: vi.fn(), setVariantKey: vi.fn(),
    open: vi.fn(), toggleFamilyMode: vi.fn(), language: "en",
  },
  refresh: vi.fn(),
}));
vi.mock("@/contexts/CoachKairosContext", () => ({ useCoachKairos: () => h.coach }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: h.refresh }), usePathname: () => "/cc/dashboard" }));
import TodayDashboard from "../TodayDashboard";
import { buildTodayModel } from "@/app/cc/dashboard/today-model";
import { deriveTodayInput, type RawDashboardRows } from "@/app/cc/dashboard/today-input";

const raw = (over: Partial<RawDashboardRows> = {}): RawDashboardRows => ({
  profile: { preferred_name: null, transfer_current_school: null, transfer_target_term: null, transfer_credits_completed: null, dashboard_observations_enabled: null },
  schools: [], essays: [], activities: [], observations: [], blocked: false, ...over,
});
const model = (v: Parameters<typeof buildTodayModel>[0], over: Partial<RawDashboardRows> = {}) =>
  buildTodayModel(v, deriveTodayInput(raw(over), "2026-09-27"));

let fetchMock: ReturnType<typeof vi.fn>;
beforeEach(() => {
  vi.clearAllMocks();
  fetchMock = vi.fn(async () => new Response(JSON.stringify({ counselor: null }), { status: 200 }));
  vi.stubGlobal("fetch", fetchMock);
  window.history.replaceState(null, "", "/cc/dashboard");
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

describe("TodayDashboard", () => {
  it("hydrates without a mismatch when the browser's clock is 12 hours from the server's", async () => {
    const m = model("junior", { schools: [{ application_status: null, cc_schools: { name: "North College" }, deadline_ea: "2026-11-01" }] });
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-09-27T09:00:00Z"));
    const html = renderToString(<TodayDashboard model={m} />);
    vi.setSystemTime(new Date("2026-09-27T21:00:00Z"));
    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);
    const recoverable: unknown[] = [];
    await act(async () => {
      hydrateRoot(container, <TodayDashboard model={m} />, { onRecoverableError: (e) => recoverable.push(e) });
    });
    expect(recoverable).toEqual([]);
    expect(container.textContent).toContain("Nov 1, 2026");
    container.remove();
  });

  it("renders nothing from the viewer's clock and none of the old navy palette", () => {
    const code = [
      "src/components/cc/today/TodayDashboard.tsx", "src/components/cc/today/AskKairos.tsx",
      "src/components/cc/today/GradeQuestion.tsx", "src/components/cc/today/YourPeople.tsx",
      "src/app/cc/dashboard/today-model.ts", "src/app/cc/dashboard/today-input.ts", "src/lib/format-iso-date.ts",
    ];
    for (const f of code) expect(fs.readFileSync(f, "utf8"), f).not.toMatch(/new Date\(|Date\.now|toLocale|getHours|getTimezoneOffset/);
    const look = [...code, "src/components/cc/today/today.css", "src/components/app-shell/app-frame.css", "src/components/app-shell/AppFrame.tsx"];
    for (const f of look) expect(fs.readFileSync(f, "utf8"), f).not.toMatch(/#05080d|#d4af37|#d4a84b|Cormorant/i);
    expect(fs.existsSync("src/components/cc/dashboard/Greeting.tsx")).toBe(false);
    expect(fs.existsSync("src/app/cc/dashboard/AdaptiveDashboardLegacy.tsx")).toBe(false);
  });

  it("Ask Kairos hands the words to Coach and sends nothing", () => {
    render(<TodayDashboard model={model("junior")} />);
    const box = screen.getByRole("textbox", { name: /Ask Kairos/ });
    fireEvent.change(box, { target: { value: "add Michigan and Toronto and tell me what's due" } });
    fireEvent.submit(box.closest("form")!);
    expect(h.coach.openWithDraft).toHaveBeenCalledWith("add Michigan and Toronto and tell me what's due");
    expect(h.coach.sendMessage).not.toHaveBeenCalled();
    expect((box as HTMLInputElement).value).toBe("");
  });

  it("opens nothing by itself and badges every Coach entry as AI", () => {
    render(<TodayDashboard model={model("junior")} />);
    expect(h.coach.openWithDraft).not.toHaveBeenCalled();
    expect(h.coach.openWithVariant).not.toHaveBeenCalled();
    expect(h.coach.setVariantKey).toHaveBeenCalledWith("junior");
    const invitation = screen.getByRole("region", { name: "A place to think it through." });
    expect(within(invitation).getByText("AI")).toBeTruthy();
    fireEvent.click(within(invitation).getByRole("button", { name: "Talk with Coach" }));
    expect(h.coach.openWithVariant).toHaveBeenCalledWith("junior");
  });

  it("hides the invitation for this visit and lets the student bring it back", () => {
    render(<TodayDashboard model={model("junior")} />);
    fireEvent.click(screen.getByRole("button", { name: "Not today" }));
    expect(screen.queryByRole("region", { name: "A place to think it through." })).toBeNull();
    expect(screen.getByRole("status").textContent).toBe("Coach invitation hidden for this visit.");
    const restore = screen.getByRole("button", { name: "Show the invitation" });
    expect(document.activeElement).toBe(restore);
    fireEvent.click(restore);
    expect(screen.getByRole("region", { name: "A place to think it through." })).toBeTruthy();
  });

  it("keeps Coach reachable but quiet when suggestions are off", () => {
    render(<TodayDashboard model={model("junior", { profile: { ...raw().profile, dashboard_observations_enabled: false } })} />);
    expect(screen.queryByRole("region", { name: "A place to think it through." })).toBeNull();
    expect(screen.queryByRole("button", { name: "Show the invitation" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Open Coach Kairos" }));
    expect(h.coach.openWithVariant).toHaveBeenCalledWith("junior");
  });

  it("explains a blocked deep link and drops the flag", () => {
    window.history.replaceState(null, "", "/cc/dashboard?blocked=grade9");
    render(<TodayDashboard model={model("g9", { blocked: true })} />);
    const heading = screen.getByRole("heading", { name: "That tool opens later." });
    expect(document.activeElement).toBe(heading);
    expect(window.location.search).toBe("");
    fireEvent.click(screen.getByRole("button", { name: "Got it" }));
    expect(screen.queryByRole("heading", { name: "That tool opens later." })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "What can I use now?" }));
    expect(screen.getByRole("heading", { name: "That tool opens later." })).toBeTruthy();
  });

  it("shows a failed load as unavailable, with a retry, instead of an empty plan", () => {
    render(<TodayDashboard model={model("junior", { schools: null, essays: null, activities: null })} />);
    expect(screen.getByRole("heading", { name: "We won't fill in the blanks." })).toBeTruthy();
    expect(screen.queryByText(/No schools saved yet/)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(h.refresh).toHaveBeenCalled();
  });

  it("saves an unknown grade through the existing profile API, and says so when it fails", async () => {
    render(<TodayDashboard model={model("unknown")} />);
    fetchMock.mockImplementation(async (url: string) =>
      String(url).includes("identity") ? new Response("{}", { status: 200 }) : new Response(JSON.stringify({ counselor: null }), { status: 200 }));
    fireEvent.click(screen.getByRole("button", { name: "Grade 11" }));
    await waitFor(() => expect(h.refresh).toHaveBeenCalled());
    const call = fetchMock.mock.calls.find(([u]) => String(u) === "/api/cc/profile/identity")!;
    expect(call[1]).toMatchObject({ method: "PATCH", body: JSON.stringify({ grade_level: 11 }) });

    fetchMock.mockImplementation(async (url: string) =>
      String(url).includes("identity") ? new Response("{}", { status: 500 }) : new Response(JSON.stringify({ counselor: null }), { status: 200 }));
    fireEvent.click(screen.getByRole("button", { name: "Grade 9" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("We couldn't save that. Try again, or skip for now.");
    expect(screen.getByRole("link", { name: "I'm transferring" }).getAttribute("href")).toBe("/cc/transfer-profile");
    fireEvent.click(screen.getByRole("button", { name: "I'm not sure / skip for now" }));
    expect(screen.getByRole("heading", { name: "We can start with your question." })).toBeTruthy();
  });

  it("names a linked counselor and never links to a bare /join", async () => {
    fetchMock.mockImplementation(async () => new Response(JSON.stringify({ counselor: { displayName: "Ms. Rivera", agencyName: "North High" } }), { status: 200 }));
    const { container, unmount } = render(<TodayDashboard model={model("junior")} />);
    expect(await screen.findByText("Your counselor: Ms. Rivera")).toBeTruthy();
    expect(container.querySelector('a[href="/join"]')).toBeNull();
    unmount();
    fetchMock.mockImplementation(async () => new Response("{}", { status: 500 }));
    render(<TodayDashboard model={model("junior")} />);
    expect(await screen.findByText("We couldn't check your counselor connection right now.")).toBeTruthy();
  });

  it("opens family mode as a Coach action", () => {
    render(<TodayDashboard model={model("junior")} />);
    fireEvent.click(screen.getByRole("button", { name: "Open family mode" }));
    expect(h.coach.toggleFamilyMode).toHaveBeenCalledWith(true);
  });
});
