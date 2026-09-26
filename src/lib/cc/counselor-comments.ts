// Counselor review loop (SP2/SP3) — per-student essay review + inline comments.
//
// Anchoring: cc_counselor_comments rows with artifact_type='essay' and
// artifact_id = cc_essays.id (uuid as text). Essay review state lives on
// cc_essays.counselor_review_state (in_review | changes_requested |
// resubmitted | approved).
//
// ID mapping gotcha: cc_essays.student_id references cc_student_profiles.id
// (the profile row), NOT auth.users.id. The counselor surface works in terms
// of the auth user id (student_user_id, from the roster), so every lookup
// bridges auth-uid → cc_student_profiles.id → cc_essays.student_id.
import { createAdminSupabase } from "@/lib/supabase-server";
import { isUuid } from "./ownership";

// Thrown when a comment targets an essay that isn't the named student's.
// Callers map it to 404 so essay ids from other students can't be probed.
export class EssayNotOwnedError extends Error {
  constructor() {
    super("essay does not belong to this student");
    this.name = "EssayNotOwnedError";
  }
}

export interface CounselorComment {
  id: string;
  authorUserId: string;
  body: string;
  rangeStart: number | null;
  rangeEnd: number | null;
  rangeTextSnapshot: string | null;
  status: "draft" | "shipped" | "resolved";
  createdAt: string;
  resolvedAt: string | null;
}

export interface EssaySummary {
  id: string;
  essayType: string | null;
  promptText: string | null;
  phase: string | null;
  wordCount: number | null;
  updatedAt: string;
  reviewState: "in_review" | "changes_requested" | "resubmitted" | "approved" | null;
  reviewUpdatedAt: string | null;
  shippedCommentCount: number;
  openCommentCount: number;
}

// Resolve the profile-row id for an auth user. Returns null if no profile.
async function profileIdForUser(studentUserId: string): Promise<string | null> {
  const db = createAdminSupabase();
  const { data } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", studentUserId)
    .limit(1)
    .maybeSingle<{ id: string }>();
  return data?.id ?? null;
}

// List a student's essays with review state + comment counts, for the
// counselor per-student view. studentUserId is the auth user id.
export async function listStudentEssays(
  studentUserId: string,
  opts: { agencyId?: string } = {},
): Promise<EssaySummary[]> {
  const profileId = await profileIdForUser(studentUserId);
  if (!profileId) return [];

  const db = createAdminSupabase();
  const { data: essays } = await db
    .from("cc_essays")
    .select(
      "id, essay_type, prompt_text, phase, word_count, updated_at, counselor_review_state, counselor_review_updated_at",
    )
    .eq("student_id", profileId)
    .order("updated_at", { ascending: false });
  const rows = essays ?? [];
  if (rows.length === 0) return [];

  // Comment counts per essay (one query, grouped client-side). Counselor
  // callers pass their agency so another agency's feedback never counts.
  const essayIds = rows.map((e) => e.id as string);
  let commentQuery = db
    .from("cc_counselor_comments")
    .select("artifact_id, status")
    .eq("artifact_type", "essay")
    .in("artifact_id", essayIds);
  if (opts.agencyId) commentQuery = commentQuery.eq("agency_id", opts.agencyId);
  const { data: comments } = await commentQuery;
  const shipped = new Map<string, number>();
  const open = new Map<string, number>();
  for (const c of comments ?? []) {
    const aid = c.artifact_id as string;
    if (c.status === "shipped") shipped.set(aid, (shipped.get(aid) ?? 0) + 1);
    if (c.status !== "resolved") open.set(aid, (open.get(aid) ?? 0) + 1);
  }

  return rows.map((e) => ({
    id: e.id as string,
    essayType: (e.essay_type as string) ?? null,
    promptText: (e.prompt_text as string) ?? null,
    phase: (e.phase as string) ?? null,
    wordCount: (e.word_count as number) ?? null,
    updatedAt: e.updated_at as string,
    reviewState: (e.counselor_review_state as EssaySummary["reviewState"]) ?? null,
    reviewUpdatedAt: (e.counselor_review_updated_at as string) ?? null,
    shippedCommentCount: shipped.get(e.id as string) ?? 0,
    openCommentCount: open.get(e.id as string) ?? 0,
  }));
}

export interface EssayDetail {
  id: string;
  essayType: string | null;
  promptText: string | null;
  wordLimit: number | null;
  currentDraft: string | null;
  wordCount: number | null;
  reviewState: EssaySummary["reviewState"];
  comments: CounselorComment[];
}

// Fetch one essay + its comments, verifying it belongs to the student.
// includeDrafts controls whether draft (un-shipped) comments are returned —
// counselors see all; students only see shipped (enforced by the caller).
export async function getEssayForReview(
  studentUserId: string,
  essayId: string,
  opts: { onlyShipped?: boolean; agencyId?: string } = {},
): Promise<EssayDetail | null> {
  const profileId = await profileIdForUser(studentUserId);
  if (!profileId) return null;

  const db = createAdminSupabase();
  const { data: essay } = await db
    .from("cc_essays")
    .select("id, student_id, essay_type, prompt_text, word_limit, current_draft, word_count, counselor_review_state")
    .eq("id", essayId)
    .maybeSingle();
  if (!essay || essay.student_id !== profileId) return null; // not this student's essay

  let q = db
    .from("cc_counselor_comments")
    .select("id, author_user_id, body, range_start, range_end, range_text_snapshot, status, created_at, resolved_at")
    .eq("artifact_type", "essay")
    .eq("artifact_id", essayId)
    .order("range_start", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true });
  if (opts.onlyShipped) q = q.eq("status", "shipped");
  if (opts.agencyId) q = q.eq("agency_id", opts.agencyId);

  const { data: comments } = await q;
  return {
    id: essay.id as string,
    essayType: (essay.essay_type as string) ?? null,
    promptText: (essay.prompt_text as string) ?? null,
    wordLimit: (essay.word_limit as number) ?? null,
    currentDraft: (essay.current_draft as string) ?? null,
    wordCount: (essay.word_count as number) ?? null,
    reviewState: (essay.counselor_review_state as EssaySummary["reviewState"]) ?? null,
    comments: (comments ?? []).map((c) => ({
      id: c.id as string,
      authorUserId: c.author_user_id as string,
      body: c.body as string,
      rangeStart: (c.range_start as number) ?? null,
      rangeEnd: (c.range_end as number) ?? null,
      rangeTextSnapshot: (c.range_text_snapshot as string) ?? null,
      status: c.status as CounselorComment["status"],
      createdAt: c.created_at as string,
      resolvedAt: (c.resolved_at as string) ?? null,
    })),
  };
}

export interface AddCommentInput {
  agencyId: string;
  studentUserId: string;
  authorUserId: string;
  essayId: string;
  body: string;
  rangeStart?: number | null;
  rangeEnd?: number | null;
  rangeTextSnapshot?: string | null;
  status?: "draft" | "shipped"; // counselors with requires_review default draft
}

// True only when essayId is one of this student's essays.
export async function essayBelongsToStudent(
  studentUserId: string,
  essayId: string,
): Promise<boolean> {
  if (!isUuid(essayId)) return false;
  const profileId = await profileIdForUser(studentUserId);
  if (!profileId) return false;
  const db = createAdminSupabase();
  const { data } = await db
    .from("cc_essays")
    .select("id")
    .eq("id", essayId)
    .eq("student_id", profileId)
    .maybeSingle<{ id: string }>();
  return Boolean(data);
}

export async function addEssayComment(input: AddCommentInput): Promise<string> {
  if (!(await essayBelongsToStudent(input.studentUserId, input.essayId))) {
    throw new EssayNotOwnedError();
  }
  const db = createAdminSupabase();
  const { data, error } = await db
    .from("cc_counselor_comments")
    .insert({
      agency_id: input.agencyId,
      student_user_id: input.studentUserId,
      author_user_id: input.authorUserId,
      artifact_type: "essay",
      artifact_id: input.essayId,
      body: input.body,
      range_start: input.rangeStart ?? null,
      range_end: input.rangeEnd ?? null,
      range_text_snapshot: input.rangeTextSnapshot ?? null,
      status: input.status ?? "shipped",
    })
    .select("id")
    .single();
  if (error || !data) throw new Error(`comment insert failed: ${error?.message ?? "unknown"}`);
  return data.id as string;
}

export async function setCommentStatus(
  commentId: string,
  status: "draft" | "shipped" | "resolved",
): Promise<void> {
  const db = createAdminSupabase();
  const patch: Record<string, unknown> = { status };
  if (status === "resolved") patch.resolved_at = new Date().toISOString();
  const { error } = await db.from("cc_counselor_comments").update(patch).eq("id", commentId);
  if (error) throw error;
}

// Set the essay's counselor review state. Verifies the essay belongs to the
// student (via profile bridge) so a counselor can't flip another student's essay.
export async function setEssayReviewState(
  studentUserId: string,
  essayId: string,
  state: "in_review" | "changes_requested" | "resubmitted" | "approved",
): Promise<boolean> {
  const profileId = await profileIdForUser(studentUserId);
  if (!profileId) return false;
  const db = createAdminSupabase();
  const { data: essay } = await db
    .from("cc_essays")
    .select("id, student_id")
    .eq("id", essayId)
    .maybeSingle();
  if (!essay || essay.student_id !== profileId) return false;
  const { error } = await db
    .from("cc_essays")
    .update({ counselor_review_state: state, counselor_review_updated_at: new Date().toISOString() })
    .eq("id", essayId);
  if (error) throw error;
  return true;
}
