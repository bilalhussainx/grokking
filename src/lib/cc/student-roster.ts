import { createAdminSupabase } from "@/lib/supabase-server";
import { getAnyAgencyMembership } from "./agency-membership";

export interface RosterStudent {
  linkId: string;
  studentUserId: string;
  primaryCounselorUserId: string;
  linkedViaCode: boolean;
  linkedAt: string;
  // Hydrated from cc_student_profiles (null when the student hasn't filled it in yet)
  preferredName: string | null;
  legalFirstName: string | null;
  gradeLevel: number | null;
  graduationYear: number | null;
  highSchoolName: string | null;
  stateProvince: string | null;
  profileCompletionPct: number | null;
  isTransfer: boolean;
}

interface LinkRow {
  id: string;
  student_user_id: string;
  primary_counselor_user_id: string;
  linked_via_code_id: string | null;
  linked_at: string;
}

interface ProfileRow {
  user_id: string;
  preferred_name: string | null;
  legal_first_name: string | null;
  grade_level: number | null;
  graduation_year: number | null;
  high_school_name: string | null;
  state_province: string | null;
  profile_completion_pct: number | null;
  is_transfer_student: boolean | null;
}

// Returns the roster of students the viewer can see. Head → all active links
// in the agency; counselor → only links where they are the primary counselor.
// Empty array when the viewer isn't an agency member.
export async function listRosterForViewer(viewerUserId: string): Promise<RosterStudent[]> {
  const membership = await getAnyAgencyMembership(viewerUserId);
  if (!membership) return [];

  const db = createAdminSupabase();
  let query = db
    .from("cc_student_counselor_links")
    .select("id, student_user_id, primary_counselor_user_id, linked_via_code_id, linked_at")
    .eq("agency_id", membership.agencyId)
    .eq("status", "active")
    .order("linked_at", { ascending: false });

  if (membership.role !== "head") {
    query = query.eq("primary_counselor_user_id", viewerUserId);
  }

  const { data: links } = await query;
  const linkRows = (links ?? []) as LinkRow[];
  if (linkRows.length === 0) return [];

  const studentIds = linkRows.map((l) => l.student_user_id);
  const { data: profiles } = await db
    .from("cc_student_profiles")
    .select(
      "user_id, preferred_name, legal_first_name, grade_level, graduation_year, high_school_name, state_province, profile_completion_pct, is_transfer_student",
    )
    .in("user_id", studentIds);
  const profileById = new Map<string, ProfileRow>(
    ((profiles ?? []) as ProfileRow[]).map((p) => [p.user_id, p]),
  );

  return linkRows.map((l) => {
    const p = profileById.get(l.student_user_id);
    return {
      linkId: l.id,
      studentUserId: l.student_user_id,
      primaryCounselorUserId: l.primary_counselor_user_id,
      linkedViaCode: l.linked_via_code_id !== null,
      linkedAt: l.linked_at,
      preferredName: p?.preferred_name ?? null,
      legalFirstName: p?.legal_first_name ?? null,
      gradeLevel: p?.grade_level ?? null,
      graduationYear: p?.graduation_year ?? null,
      highSchoolName: p?.high_school_name ?? null,
      stateProvince: p?.state_province ?? null,
      profileCompletionPct: p?.profile_completion_pct ?? null,
      isTransfer: p?.is_transfer_student ?? false,
    };
  });
}
