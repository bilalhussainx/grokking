import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "../../../helpers";
import { createAdminSupabase } from "@/lib/supabase-server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ session_id: string }> }
) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { session_id } = await params;

  const db = createAdminSupabase();

  const { data: session } = await db
    .from("interview_sessions")
    .select("id, college_persona_id, status, started_at, ended_at, category")
    .eq("id", session_id)
    .eq("user_id", auth.user.id)
    .eq("category", "college")
    .single();

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const { data: perf } = await db
    .from("interview_performance")
    .select(
      "overall_score, communication_score, technical_depth_score, problem_solving_score, code_quality_score, strengths, improvements, question_scores, topics_strong, topics_weak"
    )
    .eq("session_id", session_id)
    .single();

  return NextResponse.json({
    session: {
      id: session.id,
      collegePersonaId: session.college_persona_id,
      status: session.status,
      startedAt: session.started_at,
      endedAt: session.ended_at,
    },
    scorecard: perf
      ? {
          overallScore: perf.overall_score,
          communicationScore: perf.communication_score,
          technicalDepthScore: perf.technical_depth_score,
          problemSolvingScore: perf.problem_solving_score,
          codeQualityScore: perf.code_quality_score,
          strengths: perf.strengths,
          improvements: perf.improvements,
          questionScores: perf.question_scores,
          topicsStrong: perf.topics_strong,
          topicsWeak: perf.topics_weak,
        }
      : null,
  });
}
