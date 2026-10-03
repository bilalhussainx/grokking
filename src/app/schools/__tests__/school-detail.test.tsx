import { describe, it, expect, vi, afterEach } from "vitest";
import { Suspense } from "react";
import { act, render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

import SchoolDetailPage from "../[id]/page";

const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s });
afterEach(() => vi.unstubAllGlobals());

async function renderWith(school: Record<string, unknown>) {
  vi.stubGlobal("fetch", vi.fn(async (url: string) =>
    url.endsWith("/supplements") ? json({ supplements: [] }) : json({ school })));
  const params = Promise.resolve({ id: "s1" });
  await act(async () => {
    render(
      <Suspense fallback={null}>
        <SchoolDetailPage params={params} />
      </Suspense>,
    );
  });
}

describe("/schools/[id] for UK and Canadian schools", () => {
  it("shows the UCAS system and points to the UCAS deadline, with no US stats", async () => {
    await renderWith({
      id: "s1", name: "University College London", city: "London", state: null,
      country: "UK", application_platform: "UCAS", acceptance_rate: null, regular_deadline: null,
    });
    expect(await screen.findByText("Applies through UCAS")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /see the UCAS deadline/i })).toHaveAttribute(
      "href",
      expect.stringContaining("ucas.com"),
    );
    expect(screen.queryByText("Acceptance rate")).toBeNull();
    expect(screen.queryByText("Test scores (mid-50%)")).toBeNull();
    expect(screen.queryByText("Avg HS GPA")).toBeNull();
  });

  it("shows OUAC for an Ontario school", async () => {
    await renderWith({
      id: "s1", name: "University of Toronto", city: "Toronto", state: null, province: "ON",
      country: "CA", application_platform: "OUAC", acceptance_rate: null, regular_deadline: null,
    });
    expect(await screen.findByText("Applies through OUAC")).toBeInTheDocument();
    expect(screen.getByText(/Toronto, ON, Canada/)).toBeInTheDocument();
  });

  it("keeps the US stat grid for US schools", async () => {
    await renderWith({
      id: "s1", name: "MIT", city: "Cambridge", state: "MA", country: "US", acceptance_rate: 0.04,
    });
    expect(await screen.findByText("Acceptance rate")).toBeInTheDocument();
    expect(screen.getByText("4%")).toBeInTheDocument();
    expect(screen.queryByText(/Applies through/)).toBeNull();
  });
});
