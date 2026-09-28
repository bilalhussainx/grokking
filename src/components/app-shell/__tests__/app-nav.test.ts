// GATE D4.2 navigation model. The rail, More, search and phone tabs all read
// these lists, so a grade-9 leak or a missing head-only guard shows up here.
import { describe, it, expect } from "vitest";
import { isGrade9BlockedPath } from "@/lib/cc/grade-route-policy";
import {
  isActiveHref, isDaybreakPage, searchEntries, shellStageFor, staffPrimary, staffTabs, studentPlanning,
  studentPrimary, studentTabs, usesAppFrame, type MobileTab, type NavEntry,
} from "../app-nav";

const hrefs = (items: Array<NavEntry | MobileTab>) =>
  items.flatMap((e) => ("href" in e ? [e.href] : []));

describe("student navigation", () => {
  it("offers grade 9 no blocked destination anywhere: rail, More, search or phone tabs", () => {
    const lists = [...studentPrimary("g9"), ...studentPlanning("g9")];
    const all = [...lists, ...searchEntries(lists, "e"), ...studentTabs()];
    expect(hrefs(all).filter((h) => isGrade9BlockedPath(h.split(/[?#]/)[0]))).toEqual([]);
    expect(hrefs(all)).toEqual(expect.arrayContaining(["/schools", "/cc/net-price", "/cc/majors", "/cc/activities-optimizer"]));
  });

  it("gives grade 11 the application tools grade 9 cannot open", () => {
    expect(hrefs([...studentPrimary("junior"), ...studentPlanning("junior")])).toEqual(
      expect.arrayContaining(["/applications", "/cc/essays", "/cc/interview-prep", "/cc/recommenders", "/cc/test-strategy"]),
    );
  });

  it("does not silently treat an unknown grade as grade 9", () => {
    expect(hrefs(studentPrimary("unknown"))).toEqual(hrefs(studentPrimary("junior")));
    expect(hrefs(studentPlanning("unknown"))).toEqual(hrefs(studentPlanning("junior")));
  });

  it("points transfer coursework at the transfer profile", () => {
    expect(studentPlanning("transfer").find((l) => l.id === "coursework")).toMatchObject({
      label: "Credits & coursework", href: "/cc/transfer-profile",
    });
  });

  it("keeps Coach and Family mode as actions, not routes", () => {
    expect(studentPrimary("junior").filter((e) => e.kind === "action").map((e) => e.id)).toEqual(["coach", "family"]);
    expect(hrefs(studentPrimary("junior"))).not.toContain("/cc");
    expect(studentTabs().map((t) => t.label)).toEqual(["Today", "Coach", "Schools", "More"]);
    expect(studentTabs().find((t) => t.id === "coach")).toMatchObject({ kind: "coach" });
  });
});

describe("counselor navigation", () => {
  it("shows Team & invites to a head only", () => {
    expect(hrefs(staffPrimary({ isMember: true, isHead: true }))).toContain("/counselor/team");
    expect(hrefs(staffPrimary({ isMember: true, isHead: false }))).not.toContain("/counselor/team");
    expect(staffTabs({ isMember: true, isHead: true }).map((t) => t.label)).toEqual(["Students", "Work", "Team", "More"]);
    expect(staffTabs({ isMember: true, isHead: false }).map((t) => t.label)).toEqual(["Students", "Work", "Profile", "More"]);
  });

  it("sends a counselor without a workspace to setup, not to the member-only roster", () => {
    const nav = staffPrimary({ isMember: false, isHead: false });
    expect(nav[0]).toMatchObject({ label: "Workspace setup", href: "/counselor/dashboard" });
    expect(hrefs(nav)).not.toContain("/counselor/students");
    expect(hrefs(nav)).not.toContain("/counselor/team");
    expect(hrefs(nav)).toEqual(expect.arrayContaining(["/counselor/services", "/counselor/profile"]));
    expect(staffTabs({ isMember: false, isHead: false }).map((t) => t.label)).toEqual(["Setup", "Profile", "Settings", "More"]);
  });
});

describe("frame helpers", () => {
  it("searches labels and keywords, ignoring case", () => {
    expect(searchEntries(studentPrimary("junior"), "COST").map((e) => e.label)).toEqual(["Aid & net price"]);
    expect(searchEntries(studentPrimary("junior"), "zzz")).toEqual([]);
    expect(searchEntries(studentPrimary("junior"), "  ")).toHaveLength(studentPrimary("junior").length);
  });

  it("marks Today active only on the dashboard itself", () => {
    expect(isActiveHref("/cc/dashboard", "/cc/dashboard")).toBe(true);
    expect(isActiveHref("/cc/dashboard/x", "/cc/dashboard")).toBe(false);
    expect(isActiveHref("/cc/essays/abc", "/cc/essays")).toBe(true);
    expect(isActiveHref("/cc/essaysx", "/cc/essays")).toBe(false);
  });

  it("frames app routes and leaves marketing pages and public profiles alone", () => {
    for (const p of ["/cc/dashboard", "/cc/essays/1", "/counselor/team", "/engagements/9", "/schools", "/applications", "/settings", "/profile"]) {
      expect(usesAppFrame(p), p).toBe(true);
    }
    for (const p of ["/", "/welcome", "/pricing", "/counselors/ada", "/login", "/schoolsx", "/my-schools", null]) {
      expect(usesAppFrame(p), String(p)).toBe(false);
    }
  });

  it("keeps legacy page bodies on their dark surface until they are restyled", () => {
    expect(isDaybreakPage("/cc/dashboard")).toBe(true);
    expect(isDaybreakPage("/settings")).toBe(true);
    for (const p of ["/cc/essays", "/schools", "/applications", "/counselor/dashboard", "/cc/dashboard/x"]) {
      expect(isDaybreakPage(p), p).toBe(false);
    }
  });

  it("derives the rail stage the same way the dashboard does", () => {
    expect(shellStageFor(null)).toBe("unknown");
    expect(shellStageFor({ grade_level: 9, is_transfer_student: false })).toBe("g9");
    expect(shellStageFor({ grade_level: 12, is_transfer_student: false })).toBe("senior_writing");
    expect(shellStageFor({ grade_level: 9, is_transfer_student: true })).toBe("transfer");
    expect(shellStageFor({ grade_level: null, is_transfer_student: null })).toBe("unknown");
  });
});
