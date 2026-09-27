import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";

const mocks = vi.hoisted(() => ({
  auth: { user: null as null | { id: string }, profile: null as null | { full_name: string }, credits: 0, loading: false },
  router: { replace: vi.fn(), push: vi.fn(), back: vi.fn(), forward: vi.fn(), refresh: vi.fn(), prefetch: vi.fn() },
  preferences: { onboarding_completed: true },
  earnXP: vi.fn(),
  openPanel: vi.fn(),
  openCoach: vi.fn(),
}));

vi.mock("next/navigation", () => ({ useRouter: () => mocks.router }));
vi.mock("next/link", () => ({ default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => <a href={href} {...props}>{children}</a> }));
vi.mock("@/contexts/AuthContext", () => ({ useAuth: () => mocks.auth }));
vi.mock("@/contexts/AIContext", () => ({ useAI: () => ({ openPanel: mocks.openPanel }) }));
vi.mock("@/contexts/CoachKairosContext", () => ({ useCoachKairos: () => ({ open: mocks.openCoach }) }));
vi.mock("@/contexts/XPContext", () => ({ useXP: () => ({ earnXP: mocks.earnXP }) }));
vi.mock("@/hooks/useCourseProgress", () => ({ useCourseProgress: () => ({}) }));
vi.mock("@/data", () => ({ courses: [] }));
vi.mock("@/data/languages", () => ({ getAllLanguageCourses: () => [] }));

vi.mock("framer-motion", async () => {
  const React = await import("react");
  const passthrough = ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => React.createElement("div", props, children);
  const span = ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => React.createElement("span", props, children);
  return { motion: { div: passthrough, span }, useInView: () => true, useScroll: () => ({}), useTransform: () => 0 };
});

vi.mock("lucide-react", () => {
  const Icon = () => null;
  return {
    BookOpen: Icon, ArrowRight: Icon, Sparkles: Icon, Star: Icon, Target: Icon, Users: Icon,
    Building2: Icon, MessageSquare: Icon, Code2: Icon, Globe: Icon, GraduationCap: Icon,
    Zap: Icon, Shield: Icon, Brain: Icon, Server: Icon, Clock: Icon, Trophy: Icon,
    ClipboardList: Icon, Share2: Icon,
  };
});

vi.mock("@/components/marketing/daybreak/DaybreakHomepage", () => ({ default: () => <main data-testid="daybreak-homepage">Daybreak homepage</main> }));
vi.mock("@/components/ui/ProgressRing", () => ({ default: () => null }));
vi.mock("@/components/onboarding/WelcomeModal", () => ({ default: () => null }));
vi.mock("@/components/onboarding/DashboardWalkthrough", () => ({ default: () => null }));
vi.mock("@/components/ui/SamsaraLogo", () => ({ default: () => null }));
vi.mock("@/components/cc/dashboard/OnboardingChecklist", () => ({ default: () => null }));
vi.mock("@/components/cc/dashboard/CounselorDashboard", () => ({ default: () => null }));
vi.mock("@/components/nav/AppShell", () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }));

import HomePage from "./page";

function setPath(path: string) {
  window.history.replaceState({}, "", path);
}

function mockJsonFetch() {
  vi.stubGlobal("fetch", vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    const payload = url.includes("/api/user/preferences")
      ? mocks.preferences
      : url.includes("/api/cc/me")
        ? { profile: null }
        : null;
    return { ok: true, json: async () => payload };
  }));
}

describe("root route Daybreak and signed-in routing", () => {
  beforeEach(() => {
    window.localStorage.clear();
    setPath("/");
    mocks.auth = { user: null, profile: null, credits: 0, loading: false };
    mocks.preferences = { onboarding_completed: true };
    vi.clearAllMocks();
    mockJsonFetch();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("renders Daybreak once signed-out auth resolves, without redirecting to /landing", () => {
    mocks.auth.loading = true;
    const view = render(<HomePage />);
    expect(screen.queryByTestId("daybreak-homepage")).toBeNull();

    mocks.auth.loading = false;
    view.rerender(<HomePage />);

    expect(screen.getByTestId("daybreak-homepage")).toBeInTheDocument();
    expect(mocks.router.replace).not.toHaveBeenCalled();
    expect(mocks.router.push).not.toHaveBeenCalled();
  });

  it("sends onboarded users to the dashboard and preserves query parameters", async () => {
    mocks.auth = { user: { id: "student-1" }, profile: { full_name: "Sam Student" }, credits: 0, loading: false };
    window.localStorage.setItem("onboarding_complete", "true");
    setPath("/?source=welcome&view=schools");

    render(<HomePage />);

    await waitFor(() => expect(mocks.router.replace).toHaveBeenCalledWith("/cc/dashboard?source=welcome&view=schools"));
  });

  it("keeps focus=intake on the root route for an onboarded user", async () => {
    mocks.auth = { user: { id: "student-1" }, profile: { full_name: "Sam Student" }, credits: 0, loading: false };
    window.localStorage.setItem("onboarding_complete", "true");
    setPath("/?focus=intake&source=coach");

    render(<HomePage />);

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(mocks.router.replace).not.toHaveBeenCalled();
  });

  it("routes users whose preferences show incomplete onboarding to coach intake", async () => {
    mocks.auth = { user: { id: "student-1" }, profile: { full_name: "Sam Student" }, credits: 0, loading: false };
    mocks.preferences = { onboarding_completed: false };

    render(<HomePage />);

    await waitFor(() => expect(mocks.router.replace).toHaveBeenCalledWith("/cc/dashboard?coach=open&focus=intake"));
  });
});
