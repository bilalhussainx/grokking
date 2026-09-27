// Returning to the Outline phase shows the options the student already
// generated (and paid a credit for) instead of asking to generate again.
import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import OutlinePicker from "../OutlinePicker";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
// jsdom has no scrollIntoView; the picker scrolls its chat on mount.
Element.prototype.scrollIntoView = () => {};

describe("OutlinePicker restore", () => {
  it("renders saved outline options without generating", () => {
    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => new Response("{}"));
    vi.stubGlobal("fetch", fetchMock);
    const opt = (title: string) => ({ title, sections: [{ label: "Opening", bullets: ["b"], wordBudget: 100 }] });
    render(
      <OutlinePicker essayId="e1" selectedThemes={["The bike shop"]} existingOutline={null}
        savedOptions={[opt("Chronological"), opt("Vignettes"), opt("In medias res")]} onOutlineSaved={() => {}} />,
    );
    expect(screen.getByText("Chronological")).toBeTruthy();
    expect(screen.getByText("In medias res")).toBeTruthy();
    const generateCalls = fetchMock.mock.calls.filter(([, init]) => String(init?.body ?? "").includes('"generate"'));
    expect(generateCalls).toEqual([]);
  });
});
