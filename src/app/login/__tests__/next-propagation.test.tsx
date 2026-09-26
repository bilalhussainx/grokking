import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const h = vi.hoisted(() => ({ next: "/join/abc123", google: vi.fn() }));
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(h.next ? `next=${encodeURIComponent(h.next)}` : ""),
  useRouter: () => ({ push: vi.fn() }),
}));
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ user: null, loading: false, signInWithGoogle: h.google, signInWithEmail: vi.fn(), signUpWithEmail: vi.fn() }),
}));

import LoginPage from "../page";

const studentSignupLinks = () =>
  screen.getAllByRole("link").filter((a) => {
    const href = a.getAttribute("href") ?? "";
    return href.startsWith("/signup") && !href.includes("counselor");
  });

describe("/login carries ?next= onward", () => {
  it("sends new users to sign-up with the invite path intact", () => {
    render(<LoginPage />);
    const links = studentSignupLinks();
    expect(links.length).toBeGreaterThan(0);
    for (const a of links) expect(a.getAttribute("href")).toBe(`/signup?next=${encodeURIComponent("/join/abc123")}`);
  });

  it("passes next to Google sign-in", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getAllByRole("button", { name: /google/i })[0]);
    expect(h.google).toHaveBeenCalledWith("/join/abc123");
  });

  it("drops an off-site next", () => {
    h.next = "//evil.com";
    render(<LoginPage />);
    for (const a of studentSignupLinks()) expect(a.getAttribute("href")).toBe("/signup");
    h.next = "/join/abc123";
  });
});
