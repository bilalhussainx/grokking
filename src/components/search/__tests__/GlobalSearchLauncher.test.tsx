// GlobalSearch imports every course (~4.8 MB gzip). It used to be mounted on
// every page, so every visitor downloaded the whole catalogue. The launcher
// loads it only when search is first opened.
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import fs from "node:fs";

vi.mock("../GlobalSearch", () => ({
  default: ({ defaultOpen }: { defaultOpen?: boolean }) => <div>search loaded open={String(!!defaultOpen)}</div>,
}));
import GlobalSearchLauncher from "../GlobalSearchLauncher";

describe("GlobalSearchLauncher", () => {
  it("doesn't load search until it's asked for", () => {
    render(<GlobalSearchLauncher />);
    expect(screen.queryByText(/search loaded/)).toBeNull();
  });

  it("loads search already open on Ctrl+K", async () => {
    render(<GlobalSearchLauncher />);
    await act(async () => { fireEvent.keyDown(window, { key: "k", ctrlKey: true }); });
    expect(await screen.findByText("search loaded open=true")).toBeTruthy();
  });

  it("loads search already open on the open-global-search event (TopNav button)", async () => {
    render(<GlobalSearchLauncher />);
    await act(async () => { window.dispatchEvent(new CustomEvent("open-global-search")); });
    expect(await screen.findByText("search loaded open=true")).toBeTruthy();
  });

  it("the global providers no longer import GlobalSearch statically", () => {
    const src = fs.readFileSync("src/app/providers.tsx", "utf8");
    expect(src).not.toMatch(/import GlobalSearch from/);
    expect(src).toMatch(/GlobalSearchLauncher/);
  });
});
