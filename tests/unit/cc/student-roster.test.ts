import { describe, it, expect, beforeAll } from "vitest";
import {
  resetCounselorE2eState,
  ensureAgency,
  ensureAgencyMember,
  ensureCounselorRow,
  admin,
} from "../../e2e/helpers/db-fixtures";
import { ensurePersonaUser } from "../../e2e/helpers/auth-fixtures";
import { listRosterForViewer } from "@/lib/cc/student-roster";

describe("listRosterForViewer", () => {
  let agencyId: string;
  let headId: string;
  let counselorId: string;
  let student1: string; // assigned to counselor
  let student2: string; // assigned to head

  beforeAll(async () => {
    await resetCounselorE2eState();
    const head = await ensurePersonaUser("head");
    const counselor = await ensurePersonaUser("counselor");
    const s1 = await ensurePersonaUser("student-with-code");
    const s2 = await ensurePersonaUser("student-cold");
    headId = head.userId;
    counselorId = counselor.userId;
    student1 = s1.userId;
    student2 = s2.userId;

    agencyId = await ensureAgency("e2e-roster", "E2E Roster Agency");
    await ensureCounselorRow(headId, "E2E Head");
    await ensureCounselorRow(counselorId, "E2E Counselor");
    await ensureAgencyMember(agencyId, headId, "head");
    await ensureAgencyMember(agencyId, counselorId, "counselor");

    const db = admin();
    // student1 → counselor, student2 → head
    await db.from("cc_student_counselor_links").upsert(
      [
        { agency_id: agencyId, student_user_id: student1, primary_counselor_user_id: counselorId, status: "active" },
        { agency_id: agencyId, student_user_id: student2, primary_counselor_user_id: headId, status: "active" },
      ],
      { onConflict: "agency_id,student_user_id" },
    );
    // Give student1 a profile so the join returns name fields.
    // cc_student_profiles' PK is `id` (gen_random_uuid) with only a non-unique
    // index on user_id — there is no unique constraint to ON CONFLICT against,
    // so we delete-then-insert by user_id to stay idempotent across reruns.
    await db.from("cc_student_profiles").delete().eq("user_id", student1);
    await db.from("cc_student_profiles").insert({
      user_id: student1,
      preferred_name: "Roster Kid",
      grade_level: 11,
      high_school_name: "Test High",
    });
  });

  it("head sees all active links in the agency", async () => {
    const roster = await listRosterForViewer(headId);
    const ids = roster.map((r) => r.studentUserId).sort();
    expect(ids).toContain(student1);
    expect(ids).toContain(student2);
  });

  it("counselor sees only their assigned students", async () => {
    const roster = await listRosterForViewer(counselorId);
    const ids = roster.map((r) => r.studentUserId);
    expect(ids).toContain(student1);
    expect(ids).not.toContain(student2);
  });

  it("hydrates student profile fields when present", async () => {
    const roster = await listRosterForViewer(counselorId);
    const row = roster.find((r) => r.studentUserId === student1);
    expect(row?.preferredName).toBe("Roster Kid");
    expect(row?.gradeLevel).toBe(11);
    expect(row?.highSchoolName).toBe("Test High");
  });

  it("returns empty array for a user with no agency", async () => {
    const roster = await listRosterForViewer("00000000-0000-0000-0000-000000000000");
    expect(roster).toEqual([]);
  });
});
