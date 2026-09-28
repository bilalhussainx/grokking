// Review Focus 5: the portal button never sends anyone to checkout on its own,
// explains a missing billing account, recovers from errors, and sends one
// request per click.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ManageBillingButton from "../ManageBillingButton";

let fetchMock: ReturnType<typeof vi.fn>;
beforeEach(() => { fetchMock = vi.fn(); vi.stubGlobal("fetch", fetchMock); });
afterEach(() => { vi.unstubAllGlobals(); });

const reply = (status: number, body: unknown) => new Response(JSON.stringify(body), { status });

describe("ManageBillingButton", () => {
  it("opens the portal URL the API returns", async () => {
    fetchMock.mockResolvedValue(reply(200, { url: "https://billing.stripe.com/p/session_1" }));
    const onNavigate = vi.fn();
    render(<ManageBillingButton onNavigate={onNavigate} />);
    fireEvent.click(screen.getByRole("button", { name: /Manage billing/ }));
    await vi.waitFor(() => expect(onNavigate).toHaveBeenCalledWith("https://billing.stripe.com/p/session_1"));
    expect(fetchMock).toHaveBeenCalledWith("/api/billing/stripe/portal", { method: "POST" });
  });

  it("explains a missing billing account without redirecting to checkout", async () => {
    fetchMock.mockResolvedValue(reply(404, { error: "No Stripe customer on file." }));
    const onNavigate = vi.fn();
    render(<ManageBillingButton onNavigate={onNavigate} />);
    fireEvent.click(screen.getByRole("button", { name: /Manage billing/ }));
    expect(await screen.findByText("No billing account is connected.")).toBeTruthy();
    expect(screen.getByRole("link", { name: "View plans" }).getAttribute("href")).toBe("/pricing");
    expect(onNavigate).not.toHaveBeenCalled();
    expect(fetchMock.mock.calls.every(([u]) => !String(u).includes("checkout"))).toBe(true);
  });

  it("recovers from a failure with Try again", async () => {
    fetchMock.mockResolvedValueOnce(reply(502, { error: "Portal failed" }));
    fetchMock.mockResolvedValueOnce(reply(200, { url: "https://billing.stripe.com/p/session_2" }));
    const onNavigate = vi.fn();
    render(<ManageBillingButton onNavigate={onNavigate} />);
    fireEvent.click(screen.getByRole("button", { name: /Manage billing/ }));
    expect(await screen.findByRole("alert")).toHaveTextContent("We couldn't open billing.");
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    await vi.waitFor(() => expect(onNavigate).toHaveBeenCalledWith("https://billing.stripe.com/p/session_2"));
  });

  it("treats a thrown network error like a failure, not a missing account", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    render(<ManageBillingButton onNavigate={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /Manage billing/ }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Your plan has not changed.");
    expect(screen.queryByText("No billing account is connected.")).toBeNull();
  });

  it("sends one request when clicked twice while opening", async () => {
    let release!: (r: Response) => void;
    fetchMock.mockReturnValue(new Promise<Response>((r) => { release = r; }));
    render(<ManageBillingButton onNavigate={vi.fn()} />);
    const button = screen.getByRole("button", { name: /Manage billing/ });
    fireEvent.click(button);
    fireEvent.click(screen.getByRole("button", { name: /Opening secure billing/ }));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    release(reply(200, { url: "https://billing.stripe.com/p/x" }));
  });
});
