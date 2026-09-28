// The frame is the only navigation on framed routes, so its rules are the
// product's rules: grade-9 limits, head-only Team, AI badge on Coach, Coach
// opened only by a tap, sheets that close on Escape and give focus back.
import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";

const h = vi.hoisted(() => ({
  pathname: "/cc/dashboard",
  auth: { user: { id: "u1" } as { id: string } | null, loading: false, signOut: vi.fn() },
  role: { isCounselor: false, isMember: false, isHead: false, requiresReview: false, loading: false },
  coach: { openWithDraft: vi.fn(), sendMessage: vi.fn(), open: vi.fn(), toggleFamilyMode: vi.fn(), language: "en" },
}));
vi.mock("next/navigation", () => ({ usePathname: () => h.pathname }));
vi.mock("@/contexts/AuthContext", () => ({ useAuth: () => h.auth }));
vi.mock("@/hooks/useCounselorRole", () => ({ useCounselorRole: () => h.role }));
vi.mock("@/contexts/CoachKairosContext", () => ({ useCoachKairos: () => h.coach }));
import AppFrame from "../AppFrame";

const student = { isCounselor: false, isMember: false, isHead: false, requiresReview: false, loading: false };
beforeEach(() => {
  vi.clearAllMocks();
  h.pathname = "/cc/dashboard";
  h.auth.user = { id: "u1" };
  h.auth.loading = false;
  h.role = { ...student };
  h.coach.language = "en";
});

const rail = () => screen.getByRole("navigation", { name: "Primary" });
const tabs = () => screen.getByRole("navigation", { name: "Phone" });
const linkHrefs = (el: HTMLElement) => within(el).queryAllByRole("link").map((a) => a.getAttribute("href"));

describe("AppFrame (student)", () => {
  it("gives grade 9 no blocked tools in the rail or in More", () => {
    render(<AppFrame stage="g9"><p>page</p></AppFrame>);
    expect(linkHrefs(rail())).not.toContain("/cc/essays");
    expect(linkHrefs(rail())).not.toContain("/applications");
    expect(linkHrefs(rail())).not.toContain("/cc/interview-prep");
    expect(linkHrefs(rail())).toContain("/schools");
    fireEvent.click(screen.getByRole("button", { name: "More planning tools" }));
    const more = screen.getByRole("dialog", { name: "Your planning space" });
    for (const blocked of ["/cc/recommenders", "/cc/test-strategy", "/cc/waitlist", "/cc/essays"]) {
      expect(linkHrefs(more)).not.toContain(blocked);
    }
    expect(within(more).getByText("Application tools come later")).toBeTruthy();
  });

  it("marks Today as the current page", () => {
    render(<AppFrame stage="junior"><p>page</p></AppFrame>);
    expect(within(rail()).getByRole("link", { name: "Today" }).getAttribute("aria-current")).toBe("page");
  });

  it("gives Daybreak pages the frame's styles and keeps legacy pages on their dark surface", () => {
    const { unmount } = render(<AppFrame stage="junior"><p>page</p></AppFrame>);
    expect(document.getElementById("af-main")!.className).toBe("af-main af-db");
    unmount();
    h.pathname = "/cc/essays";
    render(<AppFrame stage="junior"><p>page</p></AppFrame>);
    expect(document.getElementById("af-main")!.className).toBe("af-main af-legacy kl-surface-app");
  });

  it("labels Coach Kairos with the AI badge and opens it only on a tap, without sending", () => {
    render(<AppFrame stage="junior"><p>page</p></AppFrame>);
    expect(h.coach.openWithDraft).not.toHaveBeenCalled();
    const coach = within(rail()).getByRole("button", { name: /Coach Kairos/ });
    expect(within(coach).getByText("AI")).toBeTruthy();
    fireEvent.click(coach);
    expect(h.coach.openWithDraft).toHaveBeenCalledWith("");
    expect(h.coach.sendMessage).not.toHaveBeenCalled();
  });

  it("opens the Coach composer from the phone Coach tab", () => {
    render(<AppFrame stage="junior"><p>page</p></AppFrame>);
    const tab = within(tabs()).getByRole("button", { name: /Coach/ });
    expect(within(tab).getByText("AI")).toBeTruthy();
    fireEvent.click(tab);
    expect(h.coach.openWithDraft).toHaveBeenCalledWith("");
  });

  it("opens family mode when the Coach language has it, and Coach otherwise", () => {
    const { unmount } = render(<AppFrame stage="junior"><p>page</p></AppFrame>);
    fireEvent.click(within(rail()).getByRole("button", { name: "Family mode" }));
    expect(h.coach.toggleFamilyMode).toHaveBeenCalledWith(true);
    unmount();
    h.coach.language = "xx";
    render(<AppFrame stage="junior"><p>page</p></AppFrame>);
    fireEvent.click(within(rail()).getByRole("button", { name: "Family mode" }));
    expect(h.coach.open).toHaveBeenCalled();
  });

  it("closes More on Escape and gives focus back to the button that opened it", () => {
    render(<AppFrame stage="junior"><p>page</p></AppFrame>);
    const button = screen.getByRole("button", { name: "More planning tools" });
    button.focus();
    fireEvent.click(button);
    const dialog = screen.getByRole("dialog", { name: "Your planning space" });
    expect(document.activeElement).toBe(within(dialog).getByRole("button", { name: "Close panel" }));
    fireEvent.keyDown(dialog, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(button);
  });

  it("closes the More sheet when a link inside it is clicked, even to the same path", () => {
    render(<AppFrame stage="g9"><p>page</p></AppFrame>);
    fireEvent.click(screen.getByRole("button", { name: "More planning tools" }));
    const dialog = screen.getByRole("dialog", { name: "Your planning space" });
    fireEvent.click(within(dialog).getByRole("link", { name: "What can I use now?" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("finds pages by label or keyword and says so when nothing matches", () => {
    render(<AppFrame stage="junior"><p>page</p></AppFrame>);
    fireEvent.click(screen.getByRole("button", { name: "Find a page" }));
    const dialog = screen.getByRole("dialog", { name: "Find a page" });
    const box = within(dialog).getByRole("searchbox", { name: "Search your pages" });
    expect(document.activeElement).toBe(box);
    fireEvent.change(box, { target: { value: "cost" } });
    expect(within(dialog).getByRole("link", { name: "Aid & net price" })).toBeTruthy();
    fireEvent.change(box, { target: { value: "zzz" } });
    expect(within(dialog).getByText("No matching page. Try another word.")).toBeTruthy();
  });

  it("asks before signing out", () => {
    render(<AppFrame stage="junior"><p>page</p></AppFrame>);
    fireEvent.click(within(rail().parentElement!).getByRole("button", { name: "Sign out" }));
    fireEvent.click(within(screen.getByRole("dialog", { name: "Sign out of KairosLearn?" })).getByRole("button", { name: "Stay here" }));
    expect(h.auth.signOut).not.toHaveBeenCalled();
    fireEvent.click(within(rail().parentElement!).getByRole("button", { name: "Sign out" }));
    fireEvent.click(within(screen.getByRole("dialog", { name: "Sign out of KairosLearn?" })).getByRole("button", { name: "Sign out" }));
    expect(h.auth.signOut).toHaveBeenCalledTimes(1);
  });

  it("shows a signed-out visitor Sign in, not the student navigation", () => {
    h.auth.user = null;
    render(<AppFrame stage="unknown"><p>page</p></AppFrame>);
    expect(screen.queryByRole("navigation", { name: "Primary" })).toBeNull();
    expect(screen.queryByRole("navigation", { name: "Phone" })).toBeNull();
    expect(screen.getByRole("link", { name: "Sign in" }).getAttribute("href")).toBe("/login");
  });
});

describe("AppFrame (counselor)", () => {
  it("shows Team & invites to a head counselor", () => {
    h.pathname = "/counselor/dashboard";
    h.role = { isCounselor: true, isMember: true, isHead: true, requiresReview: false, loading: false };
    render(<AppFrame stage="unknown" audience="staff"><p>page</p></AppFrame>);
    expect(linkHrefs(rail())).toContain("/counselor/team");
    expect(within(tabs()).getByRole("link", { name: "Team" })).toBeTruthy();
    expect(within(rail()).queryByRole("button", { name: /Coach Kairos/ })).toBeNull();
  });

  it("hides Team & invites from a supervised counselor", () => {
    h.pathname = "/counselor/dashboard";
    h.role = { isCounselor: true, isMember: true, isHead: false, requiresReview: true, loading: false };
    render(<AppFrame stage="unknown" audience="staff"><p>page</p></AppFrame>);
    expect(linkHrefs(rail())).not.toContain("/counselor/team");
    expect(within(tabs()).getByRole("link", { name: "Profile" })).toBeTruthy();
  });
});
