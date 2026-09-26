import { describe, it, expect, vi, beforeEach } from "vitest";
import { createFakeSupabase, type FakeSupabase } from "./helpers/fake-supabase";
import { ALICE, ALICE_ESSAY, ALICE_PROFILE, BOB, BOB_ESSAY, BOB_PROFILE } from "./helpers/fixtures";

const h = vi.hoisted(() => ({ world: null as unknown }));
vi.mock("@/lib/supabase-server", () => ({ createAdminSupabase: () => h.world }));

import {
  addEssayComment,
  EssayNotOwnedError,
  getEssayForReview,
  listStudentEssays,
  setCommentStatus,
} from "../counselor-comments";

const AGENCY_A = "a9e0c700-0000-4000-8000-00000000000a";
const AGENCY_B = "a9e0c700-0000-4000-8000-00000000000b";
const COUNSELOR = "c0c00000-0000-4000-8000-000000000001";

function comment(id: string, agency: string, status: string) {
  return {
    id, agency_id: agency, student_user_id: ALICE, author_user_id: COUNSELOR,
    artifact_type: "essay", artifact_id: ALICE_ESSAY, body: `note ${id}`,
    range_start: null, range_end: null, range_text_snapshot: null,
    status, created_at: "2026-09-25T10:00:00Z", resolved_at: null,
  };
}

const world = () => h.world as FakeSupabase;

beforeEach(() => {
  h.world = createFakeSupabase({
    cc_student_profiles: [{ id: ALICE_PROFILE, user_id: ALICE }, { id: BOB_PROFILE, user_id: BOB }],
    cc_essays: [
      { id: ALICE_ESSAY, student_id: ALICE_PROFILE, essay_type: "personal_statement", prompt_text: "p", word_limit: 650, current_draft: "d", word_count: 1, phase: "draft", updated_at: "2026-09-25", counselor_review_state: null, counselor_review_updated_at: null },
      { id: BOB_ESSAY, student_id: BOB_PROFILE, essay_type: "personal_statement", prompt_text: "p", word_limit: 650, current_draft: "d", word_count: 1, phase: "draft", updated_at: "2026-09-25", counselor_review_state: null, counselor_review_updated_at: null },
    ],
    cc_counselor_comments: [
      comment("c1", AGENCY_A, "shipped"),
      comment("c2", AGENCY_B, "draft"),
      comment("c3", AGENCY_B, "shipped"),
    ],
  });
});

describe("addEssayComment", () => {
  const base = { agencyId: AGENCY_A, studentUserId: ALICE, authorUserId: COUNSELOR, body: "Tighten the opening." };

  it("refuses an essay that belongs to a different student", async () => {
    await expect(addEssayComment({ ...base, essayId: BOB_ESSAY })).rejects.toBeInstanceOf(EssayNotOwnedError);
    expect(world().tables.cc_counselor_comments).toHaveLength(3);
  });

  it("refuses a non-uuid essay id without touching the database", async () => {
    await expect(addEssayComment({ ...base, essayId: "undefined" })).rejects.toBeInstanceOf(EssayNotOwnedError);
    expect(world().tables.cc_counselor_comments).toHaveLength(3);
  });

  it("inserts a comment on the student's own essay", async () => {
    const id = await addEssayComment({ ...base, essayId: ALICE_ESSAY });
    expect(typeof id).toBe("string");
    expect(world().tables.cc_counselor_comments).toHaveLength(4);
  });
});

describe("getEssayForReview", () => {
  it("shows a counselor only their own agency's comments", async () => {
    const essay = await getEssayForReview(ALICE, ALICE_ESSAY, { agencyId: AGENCY_A });
    expect(essay!.comments.map((c) => c.id)).toEqual(["c1"]);
  });

  it("shows the student shipped comments from every agency", async () => {
    const essay = await getEssayForReview(ALICE, ALICE_ESSAY, { onlyShipped: true });
    expect(essay!.comments.map((c) => c.id).sort()).toEqual(["c1", "c3"]);
  });

  it("shows the student a supervised draft once a head publishes it", async () => {
    await setCommentStatus("c2", "shipped");
    const essay = await getEssayForReview(ALICE, ALICE_ESSAY, { onlyShipped: true });
    expect(essay!.comments.map((c) => c.id).sort()).toEqual(["c1", "c2", "c3"]);
  });
});

describe("listStudentEssays", () => {
  it("counts only the viewing agency's comments", async () => {
    const [essay] = await listStudentEssays(ALICE, { agencyId: AGENCY_A });
    expect(essay.shippedCommentCount).toBe(1);
    expect(essay.openCommentCount).toBe(1);
  });
});
