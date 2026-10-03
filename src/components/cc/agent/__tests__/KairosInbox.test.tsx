import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, within, waitFor } from "@testing-library/react";
import { KairosInbox } from "../KairosInbox";

afterEach(() => vi.restoreAllMocks());

describe("KairosInbox", () => {
  it("labels the whole section as AI and renders nudge and proposal", async () => {
    const items = [
      { kind: "nudge", id: "n1", trigger: "deadline", title: "Michigan deadline is close", detail: "Your ED date is in 12 days", createdAt: "2026-10-03T00:00:00Z" },
      { kind: "proposal", id: "p1", proposalKind: "task", payload: { title: "Draft your Why Michigan answer", dueDate: null }, reason: "Michigan is on your list", token: "t", tokenExpiresAtMs: Date.now() + 600000 },
    ];
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ items }), { status: 200 }));
    render(<KairosInbox />);
    const heading = await waitFor(() => screen.getByRole("heading", { name: /Kairos noticed/ }));
    expect(within(heading).getByText("AI")).toBeTruthy();
    expect(screen.getByText("Michigan deadline is close")).toBeTruthy();
    expect(screen.getByText("Your ED date is in 12 days")).toBeTruthy();
    expect(screen.getByText("Draft your Why Michigan answer")).toBeTruthy();
  });
});
