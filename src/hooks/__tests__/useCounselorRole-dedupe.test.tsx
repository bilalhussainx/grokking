// The counselor layout, AppFrame and page each call useCounselorRole. Each used
// to fetch /api/counselor/me on its own, so one page load fired 3-5 identical
// slow requests (Oct 3 prod timing: 3-7 s each). One shared lookup per user.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { useCounselorRole, __resetCounselorRoleCache } from "../useCounselorRole";

vi.mock("@/contexts/AuthContext", () => ({ useAuth: () => ({ user: { id: "u-1" }, loading: false }) }));

function Probe({ label }: { label: string }) {
  const s = useCounselorRole();
  return <p data-testid={label}>{s.loading ? "loading" : s.isHead ? "head" : "member-no"}</p>;
}

const meBody = { counselor: { id: "c-1", slug: "qa" }, membership: { agencyId: "a-1", role: "head", requiresReview: false } };

describe("useCounselorRole shares one /api/counselor/me lookup", () => {
  beforeEach(() => { __resetCounselorRoleCache(); window.localStorage.clear(); });
  afterEach(() => vi.restoreAllMocks());

  it("three mounted users of the hook make one request", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => new Response(JSON.stringify(meBody), { status: 200 }));
    const { getByTestId } = render(<><Probe label="a" /><Probe label="b" /><Probe label="c" /></>);
    await waitFor(() => expect(getByTestId("c").textContent).toBe("head"));
    expect(getByTestId("a").textContent).toBe("head");
    expect(fetchMock.mock.calls.filter(([u]) => String(u) === "/api/counselor/me")).toHaveLength(1);
  });

  it("a failed lookup is not cached, so a later mount retries", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}", { status: 500 }));
    const first = render(<Probe label="x" />);
    await waitFor(() => expect(first.getByTestId("x").textContent).not.toBe("loading"));
    first.unmount();
    fetchMock.mockResolvedValue(new Response(JSON.stringify(meBody), { status: 200 }));
    const second = render(<Probe label="y" />);
    await waitFor(() => expect(second.getByTestId("y").textContent).toBe("head"));
  });
});
