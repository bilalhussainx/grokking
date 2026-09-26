// A failed load or save must not look like "you have no recommenders".
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RecommendersPage from "../page";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

afterEach(() => vi.unstubAllGlobals());

describe("RecommendersPage", () => {
  it("says the list couldn't load, not that there are none, when the API fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => json({ error: "Failed to load recommenders" }, 500)));
    render(<RecommendersPage />);
    expect(await screen.findByText(/couldn't load your recommenders/i)).toBeTruthy();
    expect(screen.queryByText(/no recommenders yet/i)).toBeNull();
  });

  it("keeps the form and shows an error when saving a recommender fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async (_url: string, init?: RequestInit) =>
      init?.method === "POST" ? json({ error: "Failed to add recommender" }, 500) : json({ recommenders: [] })));
    render(<RecommendersPage />);
    fireEvent.click(await screen.findByRole("button", { name: /^add$/i }));
    fireEvent.change(screen.getByPlaceholderText("Ms. Johnson"), { target: { value: "Ms. Rivera" } });
    fireEvent.click(screen.getByRole("button", { name: /add recommender/i }));
    expect(await screen.findByText(/couldn't save/i)).toBeTruthy();
    await waitFor(() => expect((screen.getByPlaceholderText("Ms. Johnson") as HTMLInputElement).value).toBe("Ms. Rivera"));
  });
});
