import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const h = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", () => ({ useParams: () => ({ code: "ABC123" }), useRouter: () => ({ push: h.push }) }));
vi.mock("@/contexts/AuthContext", () => ({ useAuth: () => ({ user: { id: "u1" }, loading: false }) }));

import JoinPage from "../[code]/page";

const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s });
afterEach(() => vi.unstubAllGlobals());

describe("/join/[code]", () => {
  it("names the counselor after joining and waits for Continue", async () => {
    vi.stubGlobal("fetch", vi.fn(async (url: string) =>
      url === "/api/counselor/join" ? json({ ok: true }, 201)
        : json({ counselor: { displayName: "Ms. Rivera", agencyName: "Ad Astra Counseling", linkedAt: "x" } })));
    render(<JoinPage />);
    expect(await screen.findByText(/linked to Ms\. Rivera/i)).toBeTruthy();
    expect(h.push).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    expect(h.push).toHaveBeenCalledWith("/cc/dashboard");
  });
});
