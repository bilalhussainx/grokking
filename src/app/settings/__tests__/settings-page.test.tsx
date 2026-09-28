// Settings separates account role, trial status and paid billing (GATE D4.2).
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import fs from "node:fs";

const h = vi.hoisted(() => ({
  auth: {
    user: { id: "u1", email: "ada@example.com" },
    profile: { full_name: "Ada Lovelace", role: "pro", trial_ends_at: null as string | null, referral_code: null as string | null, login_streak: 12 },
    credits: 40, creditsLoaded: true, loading: false, signOut: vi.fn(),
  },
  role: { isCounselor: false, isMember: false, isHead: false, requiresReview: false, loading: false },
  me: { grade_level: 11, is_transfer_student: false, dashboard_observations_enabled: true } as Record<string, unknown> | null,
  subscription: { plan: "free", status: "active", stripeSubscriptionId: null } as Record<string, unknown>,
}));
vi.mock("@/contexts/AuthContext", () => ({ useAuth: () => h.auth }));
vi.mock("@/hooks/useCounselorRole", () => ({ useCounselorRole: () => h.role }));
import SettingsPage from "../page";

beforeEach(() => {
  h.auth.profile = { full_name: "Ada Lovelace", role: "pro", trial_ends_at: null, referral_code: null, login_streak: 12 };
  h.role = { isCounselor: false, isMember: false, isHead: false, requiresReview: false, loading: false };
  h.me = { grade_level: 11, is_transfer_student: false, dashboard_observations_enabled: true };
  h.subscription = { plan: "free", status: "active", stripeSubscriptionId: null };
  vi.stubGlobal("fetch", vi.fn(async (url: string) =>
    String(url).includes("/api/cc/me")
      ? new Response(JSON.stringify({ profile: h.me }), { status: 200 })
      : new Response(JSON.stringify({ subscription: h.subscription }), { status: 200 })));
});
afterEach(() => { vi.unstubAllGlobals(); });

describe("Settings", () => {
  it("shows a signup trial with an unknown end date honestly, and no login streak", async () => {
    render(<SettingsPage />);
    expect(await screen.findByText("Pro trial")).toBeTruthy();
    expect(screen.getByText(/trial end date isn't available/i)).toBeTruthy();
    expect(screen.getByText("Student")).toBeTruthy();
    expect(await screen.findByText("Grade 11")).toBeTruthy();
    expect(screen.queryByText(/streak/i)).toBeNull();
    expect(screen.queryByRole("button", { name: /Manage billing/ })).toBeNull();
    expect(screen.getByRole("link", { name: /See options after my trial/ }).getAttribute("href")).toBe("/pricing");
  });

  it("offers Manage billing only for a paid plan", async () => {
    h.subscription = { plan: "pro", status: "active", stripeSubscriptionId: "sub_1" };
    render(<SettingsPage />);
    expect(await screen.findByRole("button", { name: /Manage billing/ })).toBeTruthy();
  });

  it("shows a head counselor's role and workspace access, never a student grade", async () => {
    h.role = { isCounselor: true, isMember: true, isHead: true, requiresReview: false, loading: false };
    h.me = null;
    render(<SettingsPage />);
    expect(await screen.findByText("Head counselor")).toBeTruthy();
    expect(screen.getByText("Team lead")).toBeTruthy();
    expect(screen.queryByText("Grade")).toBeNull();
    expect(screen.queryByRole("checkbox", { name: /dashboard suggestions/i })).toBeNull();
    expect(screen.getByRole("link", { name: "Edit public profile" }).getAttribute("href")).toBe("/counselor/profile");
  });

  it("reflects the saved suggestions preference", async () => {
    h.me = { grade_level: 11, is_transfer_student: false, dashboard_observations_enabled: false };
    render(<SettingsPage />);
    const box = (await screen.findByRole("checkbox", { name: /Show dashboard suggestions/ })) as HTMLInputElement;
    await vi.waitFor(() => expect(box.checked).toBe(false));
  });

  it("keeps the referral card behind an existing code and uses only Daybreak colors", () => {
    const src = fs.readFileSync("src/app/settings/page.tsx", "utf8");
    expect(src).toMatch(/p\.referral_code\s*&&/);
    for (const f of ["src/app/settings/page.tsx", "src/app/settings/settings.css", "src/components/settings/ManageBillingButton.tsx"]) {
      expect(fs.readFileSync(f, "utf8"), f).not.toMatch(/#05080d|#d4af37|#d4a84b|Cormorant|login_streak/i);
    }
  });
});
