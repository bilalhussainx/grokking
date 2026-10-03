// The school catalog stores deadlines without a year ("Feb 1"). One helper
// turns them into a dated day in the current admissions cycle (Aug 1 to
// Jul 31), so Today and the timeline agree, and a date that already passed
// this cycle is not silently pushed into next year.
import fs from "node:fs";
import { describe, it, expect } from "vitest";
import { resolveCatalogDeadline, formatMonthDay } from "../catalog-deadline";

describe("resolveCatalogDeadline", () => {
  it("puts a spring deadline in the next calendar year during the fall", () => {
    expect(resolveCatalogDeadline("Feb 1", "2026-10-03")).toBe("2027-02-01");
    expect(resolveCatalogDeadline("Jan 15", "2026-10-03")).toBe("2027-01-15");
  });

  it("keeps a fall deadline in the current year during the fall", () => {
    expect(resolveCatalogDeadline("Nov 1", "2026-10-03")).toBe("2026-11-01");
    expect(resolveCatalogDeadline("Oct 3", "2026-10-03")).toBe("2026-10-03");
  });

  it("returns null for a date that already passed in this cycle", () => {
    expect(resolveCatalogDeadline("Oct 1", "2026-10-03")).toBeNull();
    expect(resolveCatalogDeadline("Aug 1", "2026-10-03")).toBeNull();
    expect(resolveCatalogDeadline("Jan 15", "2027-03-01")).toBeNull();
  });

  it("stays in the same cycle in spring", () => {
    expect(resolveCatalogDeadline("May 1", "2027-03-01")).toBe("2027-05-01");
    expect(resolveCatalogDeadline("Jul 1", "2027-03-01")).toBe("2027-07-01");
  });

  it("starts a new cycle on Aug 1", () => {
    expect(resolveCatalogDeadline("Nov 1", "2027-08-01")).toBe("2027-11-01");
    expect(resolveCatalogDeadline("Feb 1", "2027-08-01")).toBe("2028-02-01");
  });

  it("accepts full month names and a trailing period", () => {
    expect(resolveCatalogDeadline("February 1", "2026-10-03")).toBe("2027-02-01");
    expect(resolveCatalogDeadline("Nov. 15", "2026-10-03")).toBe("2026-11-15");
  });

  it("returns null for rolling, empty, malformed or impossible dates", () => {
    for (const v of ["Rolling", "", null, undefined, "soon", "Feb", "Feb 30", "Foo 1", "2026-02-01"]) {
      expect(resolveCatalogDeadline(v, "2026-10-03"), String(v)).toBeNull();
    }
  });

  it("only allows Feb 29 in a leap year", () => {
    expect(resolveCatalogDeadline("Feb 29", "2027-10-03")).toBe("2028-02-29");
    expect(resolveCatalogDeadline("Feb 29", "2026-10-03")).toBeNull();
  });
});

describe("formatMonthDay", () => {
  it("shows the month and day only", () => {
    expect(formatMonthDay("2027-02-01")).toBe("Feb 1");
    expect(formatMonthDay("2026-11-15")).toBe("Nov 15");
    expect(formatMonthDay("nope")).toBeNull();
  });
});

describe("one shared helper", () => {
  it("is what the timeline generator and Today use for catalog dates", () => {
    const timeline = fs.readFileSync("src/app/api/cc/timeline/generate/route.ts", "utf8");
    expect(timeline).toMatch(/resolveCatalogDeadline/);
    expect(timeline).not.toMatch(/function parseDeadline/);
    expect(fs.readFileSync("src/app/cc/dashboard/today-input.ts", "utf8")).toMatch(/resolveCatalogDeadline/);
    // Today must read the catalog columns, or Michigan's "Feb 1" never arrives.
    expect(fs.readFileSync("src/app/cc/dashboard/page.tsx", "utf8")).toMatch(/cc_schools\(name, regular_deadline, early_deadline\)/);
  });
});
