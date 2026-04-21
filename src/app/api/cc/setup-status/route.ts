import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";

export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const uid = user.id;

  const { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("id, profile_completion_pct, intake_completed_at")
    .eq("user_id", uid)
    .maybeSingle();

  const studentId = profile?.id;

  const academicPromise = studentId
    ? supabase
        .from("cc_academic_profiles")
        .select("gpa_unweighted, test_strategy")
        .eq("student_id", studentId)
        .maybeSingle()
    : Promise.resolve({ data: null });

  const [
    academicRes,
    schoolsRes,
    essaysRes,
    essaysReviewedRes,
    supplementsRes,
    interviewsRes,
    activitiesRes,
    activitiesOptimizedRes,
    shareRes,
  ] = await Promise.all([
    academicPromise,
    supabase.from("user_schools").select("id").eq("user_id", uid).limit(1),
    studentId
      ? supabase.from("cc_essays").select("id").eq("student_id", studentId).limit(1)
      : Promise.resolve({ data: null }),
    studentId
      ? supabase
          .from("cc_essays")
          .select("id")
          .eq("student_id", studentId)
          .not("revision_comments", "is", null)
          .limit(1)
      : Promise.resolve({ data: null }),
    studentId
      ? supabase
          .from("cc_essays")
          .select("id")
          .eq("student_id", studentId)
          .not("supplement_id", "is", null)
          .limit(1)
      : Promise.resolve({ data: null }),
    supabase.from("interview_sessions").select("id").eq("user_id", uid).limit(1),
    studentId
      ? supabase.from("cc_activities").select("id").eq("student_id", studentId).limit(1)
      : Promise.resolve({ data: null }),
    studentId
      ? supabase
          .from("cc_activities")
          .select("id")
          .eq("student_id", studentId)
          .not("impact_score", "is", null)
          .limit(1)
      : Promise.resolve({ data: null }),
    supabase.from("cc_share_links").select("id").eq("user_id", uid).limit(1),
  ]);

  const academic = academicRes.data;

  return NextResponse.json({
    hasIntakeCompleted: !!profile?.intake_completed_at,
    hasGPA: !!academic?.gpa_unweighted,
    hasTestStrategy: !!academic?.test_strategy,
    profileCompletion: profile?.profile_completion_pct ?? 0,
    hasSchools: (schoolsRes.data?.length ?? 0) > 0,
    hasEssays: ((essaysRes.data as unknown[])?.length ?? 0) > 0,
    hasEssayReviewed: ((essaysReviewedRes.data as unknown[])?.length ?? 0) > 0,
    hasSupplementsStarted: ((supplementsRes.data as unknown[])?.length ?? 0) > 0,
    hasInterviewSessions: (interviewsRes.data?.length ?? 0) > 0,
    hasActivities: ((activitiesRes.data as unknown[])?.length ?? 0) > 0,
    hasActivitiesOptimized: ((activitiesOptimizedRes.data as unknown[])?.length ?? 0) > 0,
    hasShareLink: (shareRes.data?.length ?? 0) > 0,
  });
}
