import { describe, it, expect } from "vitest";
import { getOwnedEssay, getStudentProfileId, getStudentProfileIds, isUuid } from "../ownership";
import { ALICE, ALICE_ESSAY, ALICE_PROFILE, BOB, asDb, studentWorld } from "./helpers/fixtures";

describe("isUuid", () => {
  it("accepts a v4 uuid and rejects route placeholders", () => {
    expect(isUuid(ALICE_ESSAY)).toBe(true);
    expect(isUuid("new")).toBe(false);
    expect(isUuid("undefined")).toBe(false);
    expect(isUuid(undefined)).toBe(false);
  });
});

describe("getStudentProfileId", () => {
  it("returns the caller's profile id", async () => {
    expect(await getStudentProfileId(asDb(studentWorld()), ALICE)).toBe(ALICE_PROFILE);
  });

  it("returns null when the user has no profile", async () => {
    expect(await getStudentProfileId(asDb(studentWorld()), "c0000000-0000-4000-8000-000000000003")).toBeNull();
  });

  it("still resolves when a user has duplicate profile rows", async () => {
    const world = studentWorld();
    world.tables.cc_student_profiles.push({ id: "a11ce000-1111-4000-8000-00000000dup0", user_id: ALICE });
    expect(await getStudentProfileId(asDb(world), ALICE)).toBe(ALICE_PROFILE);
  });
});

describe("getOwnedEssay", () => {
  it("returns the essay when it belongs to the caller", async () => {
    const essay = await getOwnedEssay(asDb(studentWorld()), ALICE, ALICE_ESSAY);
    expect(essay).toEqual({ id: ALICE_ESSAY, student_id: ALICE_PROFILE, share_token: null });
  });

  it("returns null for another student's essay", async () => {
    expect(await getOwnedEssay(asDb(studentWorld()), BOB, ALICE_ESSAY)).toBeNull();
  });

  it("returns null for a non-uuid id", async () => {
    expect(await getOwnedEssay(asDb(studentWorld()), ALICE, "new")).toBeNull();
  });

  it("returns null when the caller has no profile", async () => {
    expect(await getOwnedEssay(asDb(studentWorld()), "c0000000-0000-4000-8000-000000000003", ALICE_ESSAY)).toBeNull();
  });
});

describe("duplicate profile rows (no unique user_id)", () => {
  const DUP_PROFILE = "a11ce000-1111-4000-8000-0000000000d2";
  const DUP_ESSAY = "a11ce000-2222-4000-8000-0000000000d2";

  it("finds an essay that hangs off the caller's second profile", async () => {
    const world = studentWorld();
    world.tables.cc_student_profiles.push({ id: DUP_PROFILE, user_id: ALICE });
    world.tables.cc_essays.push({ id: DUP_ESSAY, student_id: DUP_PROFILE, share_token: null });
    expect(await getOwnedEssay(asDb(world), ALICE, DUP_ESSAY)).toEqual({ id: DUP_ESSAY, student_id: DUP_PROFILE, share_token: null });
  });

  it("returns every profile id the user owns", async () => {
    const world = studentWorld();
    world.tables.cc_student_profiles.push({ id: DUP_PROFILE, user_id: ALICE });
    expect((await getStudentProfileIds(asDb(world), ALICE)).sort()).toEqual([ALICE_PROFILE, DUP_PROFILE].sort());
  });
});
