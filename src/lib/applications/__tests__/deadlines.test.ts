import { describe, it, expect } from "vitest";
import {
  componentProgress,
  daysUntil,
  urgencyClass,
  lookupSchoolDeadlines,
  seedDeadlinesFor,
  kanbanColumnFor,
  buildICalendar,
  nextUpcomingDeadline,
  type SchoolDeadlineRow,
} from "../deadlines";

const baseRow: SchoolDeadlineRow = {
  id: "row-1",
  school_name: "MIT",
  application_plan: "EA",
  application_status: "in_progress",
  deadline_ea: null,
  deadline_ed: null,
  deadline_edii: null,
  deadline_rea: null,
  deadline_rd: null,
  deadline_financial_aid: null,
  deadline_css_profile: null,
  deadline_fafsa: null,
  common_app_filled: false,
  essays_complete: false,
  supplements_complete: false,
  recs_submitted: false,
  transcript_submitted: false,
  test_scores_submitted: false,
  financial_aid_filed: false,
  portal_url: null,
  notes: null,
};

describe("componentProgress", () => {
  it("returns 0/7 when nothing is done", () => {
    const p = componentProgress(baseRow);
    expect(p.complete).toBe(0);
    expect(p.total).toBe(7);
    expect(p.pct).toBe(0);
  });
  it("returns 7/7 when all complete", () => {
    const p = componentProgress({
      ...baseRow,
      common_app_filled: true,
      essays_complete: true,
      supplements_complete: true,
      recs_submitted: true,
      transcript_submitted: true,
      test_scores_submitted: true,
      financial_aid_filed: true,
    });
    expect(p.complete).toBe(7);
    expect(p.pct).toBe(100);
  });
});

describe("urgencyClass", () => {
  it("urgent under 14 days", () => {
    expect(urgencyClass(8)).toBe("urgent");
    expect(urgencyClass(0)).toBe("urgent");
  });
  it("soon between 14 and 30", () => {
    expect(urgencyClass(20)).toBe("soon");
  });
  it("ok beyond 30", () => {
    expect(urgencyClass(45)).toBe("ok");
  });
  it("ok if past", () => {
    expect(urgencyClass(-3)).toBe("ok");
  });
});

describe("daysUntil", () => {
  it("returns positive count for future dates (tolerant to UTC/local DST drift)", () => {
    const future = new Date();
    future.setDate(future.getDate() + 10);
    // Use local-date components (avoids the ISO-UTC timezone slide)
    const yyyy = future.getFullYear();
    const mm = String(future.getMonth() + 1).padStart(2, "0");
    const dd = String(future.getDate()).padStart(2, "0");
    expect(daysUntil(`${yyyy}-${mm}-${dd}`)).toBe(10);
  });
});

describe("lookupSchoolDeadlines", () => {
  it("finds MIT exactly", () => {
    const r = lookupSchoolDeadlines("MIT");
    expect(r?.deadline_ea).toBe("2025-11-01");
  });
  it("finds Harvard via case-insensitive match", () => {
    const r = lookupSchoolDeadlines("harvard");
    expect(r?.deadline_rea).toBe("2025-11-01");
  });
  it("returns null for unknown school", () => {
    const r = lookupSchoolDeadlines("ZZZ University");
    expect(r).toBeNull();
  });
});

describe("seedDeadlinesFor", () => {
  it("seeds US deadlines for US (and legacy NULL-country) schools", () => {
    expect(seedDeadlinesFor("MIT", "US")?.deadline_ea).toBe("2025-11-01");
    expect(seedDeadlinesFor("MIT", null)?.deadline_ea).toBe("2025-11-01");
  });
  it("never seeds US deadlines onto UK or Canadian schools", () => {
    // Substring matching maps "University of British Columbia" onto Columbia's
    // ED/CSS/FAFSA dates; non-US schools must skip the US seed entirely.
    expect(lookupSchoolDeadlines("University of British Columbia")).not.toBeNull();
    expect(seedDeadlinesFor("University of British Columbia", "CA")).toBeNull();
    expect(seedDeadlinesFor("University of Oxford", "UK")).toBeNull();
  });
});

describe("kanbanColumnFor", () => {
  it("maps status -> column", () => {
    expect(kanbanColumnFor("not_started")).toBe("not_started");
    expect(kanbanColumnFor("in_progress")).toBe("in_progress");
    expect(kanbanColumnFor("considering")).toBe("in_progress");
    expect(kanbanColumnFor("submitted")).toBe("submitted");
    expect(kanbanColumnFor("accepted")).toBe("decisions");
    expect(kanbanColumnFor("waitlisted")).toBe("decisions");
    expect(kanbanColumnFor("rejected")).toBe("decisions");
    expect(kanbanColumnFor(null)).toBe("not_started");
  });
});

describe("nextUpcomingDeadline", () => {
  it("returns null when no future deadlines", () => {
    const past = "2020-01-01";
    expect(nextUpcomingDeadline({ ...baseRow, deadline_rd: past })).toBeNull();
  });
  it("returns earliest future deadline across keys", () => {
    const future1 = new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10);
    const future2 = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
    const r = nextUpcomingDeadline({ ...baseRow, deadline_ea: future2, deadline_rd: future1 });
    expect(r?.key).toBe("deadline_rd");
  });
});

describe("buildICalendar", () => {
  it("emits VCALENDAR + one VEVENT per deadline", () => {
    const rows: SchoolDeadlineRow[] = [
      { ...baseRow, deadline_ea: "2025-11-01", deadline_rd: "2026-01-04" },
    ];
    const ics = buildICalendar(rows);
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("END:VCALENDAR");
    const events = (ics.match(/BEGIN:VEVENT/g) ?? []).length;
    expect(events).toBe(2);
    expect(ics).toContain("MIT — EA Deadline");
    expect(ics).toContain("MIT — Regular Decision Deadline");
  });
});
