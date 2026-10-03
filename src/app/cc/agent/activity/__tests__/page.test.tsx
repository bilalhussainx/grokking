// The activity log page exists only for S1 pilot students; everyone else gets a 404.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";

const getAuthUser = vi.fn();
vi.mock("@/lib/supabase-auth", () => ({ getAuthUser: () => getAuthUser() }));
vi.mock("next/navigation", () => ({ notFound: () => { throw new Error("NEXT_NOT_FOUND"); } }));
vi.mock("@/components/cc/agent/ActivityLog", () => ({ ActivityLog: () => <ol aria-label="What Kairos did and why" /> }));

import AgentActivityPage from "../page";

const U = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
beforeEach(() => { vi.stubEnv("AGENT_S1_ENABLED", "1"); vi.stubEnv("AGENT_S1_USER_IDS", U); });
afterEach(() => { vi.unstubAllEnvs(); getAuthUser.mockReset(); });

describe("/cc/agent/activity", () => {
  it("renders the activity log for a flagged student", async () => {
    getAuthUser.mockResolvedValue({ id: U });
    render(await AgentActivityPage());
    expect(screen.getByRole("heading", { name: /What Kairos did/ })).toBeTruthy();
    expect(screen.getByRole("list", { name: "What Kairos did and why" })).toBeTruthy();
  });

  it("is notFound for an unflagged student", async () => {
    getAuthUser.mockResolvedValue({ id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb" });
    await expect(AgentActivityPage()).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("is notFound when the flag is off, even for an allowlisted id", async () => {
    vi.stubEnv("AGENT_S1_ENABLED", "");
    getAuthUser.mockResolvedValue({ id: U });
    await expect(AgentActivityPage()).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("is notFound when signed out", async () => {
    getAuthUser.mockResolvedValue(null);
    await expect(AgentActivityPage()).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
