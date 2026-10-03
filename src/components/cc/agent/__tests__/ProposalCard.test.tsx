import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { ProposalCard } from "../ProposalCard";

const item = { kind: "proposal" as const, id: "p1", turnId: null, proposalKind: "task", payload: { title: "Draft your Why Michigan answer", dueDate: "2026-10-28" }, reason: "Michigan is on your list", token: "t", tokenExpiresAtMs: Date.now() + 600000 };
const json = (body: unknown, status: number) => new Response(JSON.stringify(body), { status });
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

describe("ProposalCard", () => {
  it("shows exactly what will change and why, with AI label and Confirm / Not now", () => {
    render(<ProposalCard item={item} />);
    expect(screen.getByText("Draft your Why Michigan answer")).toBeTruthy();
    expect(screen.getByText(/Michigan is on your list/)).toBeTruthy();
    expect(screen.getByText("AI")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Confirm" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Not now" })).toBeTruthy();
  });

  it("shows Saved only after the server confirms, then offers Undo", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(json({ status: "committed", receipt: { kind: "task", taskId: "t1" } }, 200));
    render(<ProposalCard item={item} />);
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(screen.queryByText("Saved")).toBeNull();
    await waitFor(() => expect(screen.getByText("Saved")).toBeTruthy());
    expect(screen.getByRole("button", { name: "Undo" })).toBeTruthy();
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body))).toEqual({ action: "confirm", token: "t" });
  });

  it("shows a retry message, not Saved, when the commit fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(json({ error: "commit_failed_retry" }, 503));
    render(<ProposalCard item={item} />);
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    await waitFor(() => expect(screen.getByText(/didn't save/)).toBeTruthy());
    expect(screen.queryByText("Saved")).toBeNull();
  });

  it("on 202 shows Saving…, never Saved, re-confirms after ~3 s and shows Saved only on committed", async () => {
    vi.useFakeTimers();
    const fetchMock = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(json({ status: "saving" }, 202))
      .mockResolvedValueOnce(json({ status: "committed", receipt: { kind: "task", taskId: "t1" } }, 200));
    render(<ProposalCard item={item} />);
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    await act(async () => { await vi.advanceTimersByTimeAsync(100); });
    expect(screen.getByText("Saving…")).toBeTruthy();
    expect(screen.queryByText("Saved")).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await act(async () => { await vi.advanceTimersByTimeAsync(3000); });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(JSON.parse(String(fetchMock.mock.calls[1][1]?.body))).toEqual({ action: "confirm", token: "t" });
    expect(screen.getByText("Saved")).toBeTruthy();
  });

  it("stops after 3 tries of 202 and shows the retry message, never Saved", async () => {
    vi.useFakeTimers();
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => json({ status: "saving" }, 202));
    render(<ProposalCard item={item} />);
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    await act(async () => { await vi.advanceTimersByTimeAsync(10000); });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(screen.getByText(/didn't save/)).toBeTruthy();
    expect(screen.queryByText("Saved")).toBeNull();
  });

  it("undo after Saved posts undo and shows Undone", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(json({ status: "committed", receipt: { kind: "task", taskId: "t1" } }, 200))
      .mockResolvedValueOnce(json({ status: "undone" }, 200));
    render(<ProposalCard item={item} />);
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Undo" })).toBeTruthy());
    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    await waitFor(() => expect(screen.getByText("Undone.")).toBeTruthy());
    expect(JSON.parse(String(fetchMock.mock.calls[1][1]?.body))).toEqual({ action: "undo" });
  });
});
