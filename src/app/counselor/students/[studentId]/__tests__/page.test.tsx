// Counselor student file: the copy must not leak the "Unnamed student"
// placeholder into a sentence.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({ useParams: () => ({ studentId: "stu-1" }) }));
vi.mock("@/hooks/useCounselorRole", () => ({
  useCounselorRole: () => ({ loading: false, isMember: true, isHead: false, role: "counselor", agencyId: "ag-1", requiresReview: false }),
}));

import StudentFilePage from "../page";

const student = (over: Record<string, unknown> = {}) => ({
  userId: "stu-1", preferredName: null, legalFirstName: null, gradeLevel: 12, graduationYear: null,
  highSchoolName: null, stateProvince: null, profileCompletionPct: null, isTransfer: false, isPro: false, ...over,
});

let routes: Record<string, () => Response>;
beforeEach(() => {
  routes = {};
  vi.stubGlobal("fetch", vi.fn(async (url: string) => {
    const handler = routes[url];
    return handler ? handler() : new Response("{}", { status: 404 });
  }));
});
afterEach(() => vi.unstubAllGlobals());

const json = (body: unknown, status = 200) => () => new Response(JSON.stringify(body), { status });

describe("counselor student file copy", () => {
  it("says 'this student' instead of 'Unnamed' when there is no name", async () => {
    routes["/api/counselor/students/stu-1"] = json({ student: student(), essays: [], viewerRole: "counselor" });
    render(<StudentFilePage />);
    const empty = await screen.findByText(/No essays yet/);
    expect(empty.textContent).toBe("No essays yet. They'll appear here once this student starts drafting.");
  });

  it("uses the first name when there is one", async () => {
    routes["/api/counselor/students/stu-1"] = json({ student: student({ preferredName: "Maya Patel" }), essays: [], viewerRole: "counselor" });
    render(<StudentFilePage />);
    expect((await screen.findByText(/No essays yet/)).textContent).toBe("No essays yet. They'll appear here once Maya starts drafting.");
  });
});
