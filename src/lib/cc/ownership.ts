// Ownership guards for routes that use the service-role (RLS-bypassing)
// Supabase client. With that client a filter on the row id alone lets any
// signed-in user touch any student's rows, so every student-data write must
// first prove the row belongs to the caller.
// Plan: docs/superpowers/plans/2026-09-25-security-1a-student-data-ownership.md
import type { SupabaseClient } from "@supabase/supabase-js";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_RE.test(value);
}

// cc_student_profiles has no unique constraint on user_id, so take the
// first row instead of letting maybeSingle() error on duplicates.
export async function getStudentProfileId(
  db: SupabaseClient,
  userId: string,
): Promise<string | null> {
  const { data } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle<{ id: string }>();
  return data?.id ?? null;
}

export interface OwnedEssay {
  id: string;
  student_id: string;
  share_token: string | null;
}

// The essay, only if it belongs to the caller's student profile.
export async function getOwnedEssay(
  db: SupabaseClient,
  userId: string,
  essayId: string,
): Promise<OwnedEssay | null> {
  if (!isUuid(essayId)) return null;
  const profileId = await getStudentProfileId(db, userId);
  if (!profileId) return null;
  const { data, error } = await db
    .from("cc_essays")
    .select("id, student_id, share_token")
    .eq("id", essayId)
    .eq("student_id", profileId)
    .maybeSingle<OwnedEssay>();
  if (error || !data) return null;
  return data;
}
