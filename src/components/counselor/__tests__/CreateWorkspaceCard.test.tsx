import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CreateWorkspaceCard from "../CreateWorkspaceCard";

const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s });
afterEach(() => vi.unstubAllGlobals());

describe("CreateWorkspaceCard", () => {
  it("posts name, slug and display name, then goes to the team page", async () => {
    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) =>
      json({ agencyId: "a", agencySlug: "rivera-college-counseling" }, 201));
    vi.stubGlobal("fetch", fetchMock);
    const navigate = vi.fn();
    render(<CreateWorkspaceCard displayName="Ms. Rivera" onCreated={navigate} />);
    fireEvent.change(screen.getByPlaceholderText(/workspace name/i), { target: { value: "Rivera College Counseling" } });
    fireEvent.click(screen.getByRole("button", { name: /create workspace/i }));
    await vi.waitFor(() => expect(navigate).toHaveBeenCalledWith("/counselor/team"));
    expect(JSON.parse(fetchMock.mock.calls[0][1]!.body as string)).toEqual({
      name: "Rivera College Counseling", slug: "rivera-college-counseling", displayName: "Ms. Rivera",
    });
  });

  it("shows a message when the name is taken", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => json({ error: "slug taken" }, 409)));
    render(<CreateWorkspaceCard displayName="Ms. Rivera" onCreated={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText(/workspace name/i), { target: { value: "Ad Astra" } });
    fireEvent.click(screen.getByRole("button", { name: /create workspace/i }));
    expect(await screen.findByText(/already taken/i)).toBeTruthy();
  });
});
