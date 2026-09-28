// Today's view model. It must only say what the rows say: a failed read is
// "Couldn't load", an empty list is empty, a stored date is the stored day,
// and nothing claims Coach writes essays.
import { describe, it, expect } from "vitest";
import { isGrade9BlockedPath } from "@/lib/cc/grade-route-policy";
import { formatIsoDate } from "@/lib/format-iso-date";
import { deriveTodayInput, type RawDashboardRows, type RawSchoolRow, type TodayInput } from "../today-input";
import { buildTodayModel } from "../today-model";
import type { VariantKey } from "../variants";

const VARIANTS: VariantKey[] = ["g9", "g10", "junior", "senior_writing", "senior_post_submit", "senior_decisions", "transfer", "unknown"];

const raw = (over: Partial<RawDashboardRows> = {}): RawDashboardRows => ({
  profile: { preferred_name: null, transfer_current_school: null, transfer_target_term: null, transfer_credits_completed: null, dashboard_observations_enabled: null },
  schools: [], essays: [], activities: [], observations: [], blocked: false, deadlinesUnavailable: false, ...over,
});
const empty: TodayInput = deriveTodayInput(raw(), "2026-09-27");
const school = (name: string, over: Partial<RawSchoolRow> = {}): RawSchoolRow => ({ application_status: null, cc_schools: { name }, ...over });

describe("formatIsoDate", () => {
  it("formats stored dates without a timezone", () => {
    expect(formatIsoDate("2026-11-01")).toBe("Nov 1, 2026");
    expect(formatIsoDate("2026-11-01T23:30:00Z")).toBe("Nov 1, 2026"); // the stored day, never shifted
    expect(formatIsoDate("2027-01-15T00:00:00-08:00")).toBe("Jan 15, 2027");
    expect(formatIsoDate("")).toBeNull();
    expect(formatIsoDate("soon")).toBeNull();
    expect(formatIsoDate("2026-13-01")).toBeNull();
  });
});

describe("deriveTodayInput", () => {
  it("reports a failed read as unavailable, never as zero", () => {
    const i = deriveTodayInput(raw({ schools: null, essays: null, activities: null }), "2026-09-27");
    expect(i.schoolCount).toBeNull();
    expect(i.statusCounts).toBeNull();
    expect(i.essaysTotal).toBeNull();
    expect(i.activitiesCount).toBeNull();
    const m = buildTodayModel("junior", i);
    expect(m.unavailable).toBe(true);
    const partial = buildTodayModel("junior", deriveTodayInput(raw({ schools: null }), "2026-09-27"));
    expect(partial.unavailable).toBe(false);
    const list = partial.rows.find((r) => r.id === "schools")!;
    expect(list.detail).toMatch(/Couldn't load/);
    expect(list.detail).not.toMatch(/\b0\b/);
  });

  it("picks the earliest saved deadline from today on and ignores past dates", () => {
    const i = deriveTodayInput(raw({ schools: [
      school("Old State", { deadline_rd: "2026-01-05" }),
      school("North College", { deadline_ea: "2026-11-01", deadline_rd: "2027-01-15" }),
      school("South University", { deadline_ed: "2026-09-27" }),
    ] }), "2026-09-27");
    expect(i.nextDeadline).toEqual({ schoolName: "South University", label: "ED", date: "2026-09-27" });
  });

  it("counts each decision status on its own", () => {
    const i = deriveTodayInput(raw({ schools: [
      school("A", { application_status: "accepted" }), school("B", { application_status: "rejected" }),
      school("C", { application_status: "waitlisted" }), school("D", { application_status: "deferred" }),
      school("E", { application_status: "submitted" }), school("F", { application_status: "deposited" }),
    ] }), "2026-09-27");
    expect(i.statusCounts).toEqual({ submitted: 1, accepted: 1, rejected: 1, waitlisted: 1, deferred: 1, deposited: 1 });
  });

  it("carries deadlinesUnavailable through, distinct from a fully failed schools read", () => {
    const i = deriveTodayInput(raw({ schools: [school("A")], deadlinesUnavailable: true }), "2026-09-27");
    expect(i.schoolCount).toBe(1);
    expect(i.deadlinesUnavailable).toBe(true);
  });

  it("drops observations when the student turned suggestions off", () => {
    const obs = [{ module_label: "Essays", observation: "Your outline has three stories.", eyebrow: "Noticed" }];
    expect(deriveTodayInput(raw({ observations: obs }), "2026-09-27").observation).toEqual({ eyebrow: "Noticed", text: "Your outline has three stories." });
    const off = deriveTodayInput(raw({ observations: obs, profile: { ...raw().profile, dashboard_observations_enabled: false } }), "2026-09-27");
    expect(off.observation).toBeNull();
    expect(buildTodayModel("junior", off).suggestionsOn).toBe(false);
  });
});

describe("buildTodayModel", () => {
  it("never sends grade 9 to a blocked page", () => {
    const m = buildTodayModel("g9", empty);
    const hrefs = [m.step!.cta.href, ...m.rows.map((r) => r.href)];
    expect(hrefs.filter((h) => isGrade9BlockedPath(h.split(/[?#]/)[0]))).toEqual([]);
    expect(m.grade9).toBe(true);
  });

  it("invents no numbers or dates for an empty account", () => {
    for (const v of VARIANTS) {
      const m = buildTodayModel(v, empty);
      for (const r of m.rows) expect(r.detail, `${v}/${r.id}`).not.toMatch(/\d/);
      expect(m.step?.basis ?? "", v).not.toMatch(/\d/);
    }
  });

  it("shows the next saved date as the stored calendar day", () => {
    const i = { ...empty, schoolCount: 2, nextDeadline: { schoolName: "North College", label: "EA", date: "2026-11-01" } };
    const row = buildTodayModel("junior", i).rows.find((r) => r.id === "applications")!;
    expect(row.detail).toContain("North College EA, Nov 1, 2026");
    expect(row.detail).toMatch(/official/);
  });

  it("lets saved work replace the generic starting point", () => {
    const m = buildTodayModel("senior_writing", { ...empty, essaysTotal: 1, essaysFinal: 0, personalStatementPhase: "outline" });
    expect(m.step!.eyebrow).toBe("Continue your work · Outline");
    expect(m.headline).toEqual(["Welcome back.", "Pick up your thread."]);
    const junior = buildTodayModel("junior", { ...empty, schoolCount: 3 });
    expect(junior.step!.cta).toEqual({ label: "Open my school list", href: "/schools" });
    expect(junior.step!.basis).toBe("Based on the 3 schools on your list.");
  });

  it("keeps each decision distinct and assumes no offer", () => {
    const m = buildTodayModel("senior_decisions", { ...empty, schoolCount: 4, statusCounts: { submitted: 0, accepted: 1, rejected: 1, waitlisted: 1, deferred: 1, deposited: 0 } });
    const row = m.rows.find((r) => r.id === "decisions")!;
    expect(row.detail).toBe("1 accepted · 1 waitlisted · 1 deferred · 1 not admitted.");
  });

  it("keeps unfinished essays in view after a submission", () => {
    const m = buildTodayModel("senior_post_submit", { ...empty, schoolCount: 2, statusCounts: { submitted: 1, accepted: 0, rejected: 0, waitlisted: 0, deferred: 0, deposited: 0 }, essaysTotal: 3, essaysFinal: 1 });
    expect(m.rows.map((r) => r.id)).toEqual(["submitted", "essays", "cost"]);
    expect(m.rows[0].detail).toBe("1 application marked submitted. Check receipt in each school's official portal.");
    expect(m.rows[1].detail).toBe("3 essays in Essay Studio, 1 marked final or submitted.");
  });

  it("describes transfer credits as recorded, never as transferable", () => {
    const m = buildTodayModel("transfer", { ...empty, transfer: { currentSchool: "Lakeside Community College", targetTerm: "Fall 2027", creditsCompleted: 30 } });
    expect(m.rowsTitle).toBe("Your transfer details");
    expect(m.rows.map((r) => r.detail)).toEqual([
      "Lakeside Community College",
      "Fall 2027",
      "30 credits completed, as you recorded them. Each college decides what transfers.",
    ]);
    expect(m.step!.cta.href).toBe("/cc/essays?type=transfer");
    const blank = buildTodayModel("transfer", empty);
    expect(blank.step!.cta.href).toBe("/cc/transfer-profile");
    expect(blank.rows[0].detail).toBe("Not added yet.");
  });

  it("asks an unknown-grade student one question instead of guessing", () => {
    const m = buildTodayModel("unknown", empty);
    expect(m.askGrade).toBe(true);
    expect(m.step).toBeNull();
    expect(m.grade9).toBe(false);
  });

  it("never claims Coach writes the essay, and never says 'preview'", () => {
    for (const v of VARIANTS) {
      const text = JSON.stringify(buildTodayModel(v, { ...empty, personalStatementPhase: "draft", transfer: { currentSchool: "X", targetTerm: null, creditsCompleted: null } }));
      expect(text, v).not.toMatch(/(coach|kairos|we|ai)\s+(will\s+)?(write|draft)s?\s+(your|the|an?)\s+(essay|statement)/i);
      expect(text, v).not.toMatch(/preview/i);
    }
  });

  it("says it couldn't load deadlines, never that none are saved, when the fallback schools read was used", () => {
    const i = { ...empty, schoolCount: 2, deadlinesUnavailable: true };
    const row = buildTodayModel("junior", i).rows.find((r) => r.id === "applications")!;
    expect(row.detail).toMatch(/couldn't load/i);
    expect(row.detail).not.toMatch(/No upcoming dates saved/);
  });

  it("carries the blocked-link flag through to the view", () => {
    expect(buildTodayModel("g9", deriveTodayInput(raw({ blocked: true }), "2026-09-27")).blockedNotice).toBe(true);
  });
});
