import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ApplicationBoard from "../ApplicationBoard";

const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s });
afterEach(() => vi.unstubAllGlobals());

function row(id: string, school_name: string, school_country: string, school_application_platform: string | null) {
  return {
    id, school_name, school_country, school_application_platform,
    application_plan: null, application_status: "not_started",
    deadline_ea: null, deadline_ed: null, deadline_edii: null, deadline_rea: null, deadline_rd: null,
    deadline_financial_aid: null, deadline_css_profile: null, deadline_fafsa: null,
    common_app_filled: false, essays_complete: false, supplements_complete: false, recs_submitted: false,
    transcript_submitted: false, test_scores_submitted: false, financial_aid_filed: false,
    portal_url: null, notes: null,
  };
}

async function openCard(rows: unknown[], schoolName: string) {
  vi.stubGlobal("fetch", vi.fn(async (url: string) =>
    url === "/api/cc/applications/list" ? json({ rows }) : json({ profile: null })));
  render(<ApplicationBoard />);
  fireEvent.click(await screen.findByText(schoolName));
}

describe("ApplicationBoard per application system", () => {
  it("gives a UK school a UCAS checklist and no US plan picker", async () => {
    await openCard([row("r1", "University College London", "UK", "UCAS")], "University College London");
    expect(screen.getByText("UCAS application")).toBeInTheDocument();
    expect(screen.getByText("Personal statement")).toBeInTheDocument();
    expect(screen.getByText("Reference")).toBeInTheDocument();
    expect(screen.getByText("Predicted grades")).toBeInTheDocument();
    expect(screen.queryByText("Common App")).toBeNull();
    expect(screen.queryByText("Aid filed")).toBeNull();
    expect(screen.queryByRole("option", { name: "ED" })).toBeNull();
    expect(screen.getByText("Applies through UCAS")).toBeInTheDocument();
  });

  it("gives a Canadian school an OUAC checklist with transcripts", async () => {
    await openCard([row("r2", "University of Toronto", "CA", "OUAC")], "University of Toronto");
    expect(screen.getByText("OUAC application")).toBeInTheDocument();
    expect(screen.getByText("Transcripts")).toBeInTheDocument();
    expect(screen.queryByText("Common App")).toBeNull();
    expect(screen.queryByText("Aid filed")).toBeNull();
    expect(screen.queryByRole("option", { name: "REA" })).toBeNull();
  });

  it("keeps the US checklist and plan picker for US schools", async () => {
    await openCard([row("r3", "Harvard University", "US", null)], "Harvard University");
    expect(screen.getByText("Common App")).toBeInTheDocument();
    expect(screen.getByText("Aid filed")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "ED" })).toBeInTheDocument();
  });
});
