// GET /api/counselor/students/[studentId]
//
// Per-student file for the counselor review surface (SP2). Returns the
// student's profile header + their essays with review state + comment counts.
// Visibility enforced via getStudentVisibility (head: any agency student;
// counselor: assigned only).
import { NextResponse } from "next/server";
import { getAuthUser, createAdminSupabase } from "@/lib/supabase-auth";
import { authMetadataName, getStudentVisibility } from "@/lib/cc/student-roster";
import { listStudentEssays } from "@/lib/cc/counselor-comments";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ studentId: string }> }) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const { studentId } = await params;
  const vis = await getStudentVisibility(user.id, studentId);
  if (!vis) return NextResponse.json({ error: "student not on your roster" }, { status: 403 });

  const db = createAdminSupabase();
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("preferred_name, legal_first_name, grade_level, graduation_year, high_school_name, state_province, profile_completion_pct, is_transfer_student")
    .eq("user_id", studentId)
    .maybeSingle();

  const { data: sub } = await db
    .from("user_subscriptions")
    .select("plan, status")
    .eq("user_id", studentId)
    .maybeSingle();

  const essays = await listStudentEssays(studentId, { agencyId: vis.agencyId });
  // Same fallback as the roster, so the header matches the roster's name.
  const authName = profile?.preferred_name || profile?.legal_first_name ? null : await authMetadataName(db, studentId);

  return NextResponse.json({
    student: {
      userId: studentId,
      preferredName: profile?.preferred_name ?? authName ?? null,
      legalFirstName: profile?.legal_first_name ?? null,
      gradeLevel: profile?.grade_level ?? null,
      graduationYear: profile?.graduation_year ?? null,
      highSchoolName: profile?.high_school_name ?? null,
      stateProvince: profile?.state_province ?? null,
      profileCompletionPct: profile?.profile_completion_pct ?? null,
      isTransfer: profile?.is_transfer_student ?? false,
      isPro: sub?.plan === "pro" && (sub?.status === "active" || sub?.status === "trialing"),
    },
    essays,
    viewerRole: vis.viewerRole,
  });
}
