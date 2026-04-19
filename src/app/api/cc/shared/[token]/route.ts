import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase-server";

const REC_LABELS: Record<number, string> = {
  1: "Do not recommend",
  2: "Recommend with concerns",
  3: "Neutral",
  4: "Recommend",
  5: "Strongly recommend",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const db = createAdminSupabase();

  const { data: link } = await db
    .from("cc_share_links")
    .select("student_id, visible_sections, is_active")
    .eq("share_token", token)
    .eq("is_active", true)
    .single();

  if (!link) {
    return NextResponse.json({ error: "Link not active" }, { status: 404 });
  }

  const sections = link.visible_sections as Record<string, boolean>;
  const studentId = link.student_id;

  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("preferred_name, legal_first_name, user_id")
    .eq("id", studentId)
    .single();

  const studentName = profile?.preferred_name || profile?.legal_first_name || "Student";

  const result: Record<string, unknown> = {
    studentName,
    visibleSections: sections,
  };

  if (sections.essays) {
    const { data: essays } = await db
      .from("cc_essays")
      .select("essay_type, prompt_text, content, word_count, phase")
      .eq("student_id", studentId)
      .order("updated_at", { ascending: false });
    result.essays = (essays || []).map((e) => ({
      essayType: e.essay_type,
      promptText: e.prompt_text,
      content: e.content,
      wordCount: e.word_count,
      phase: e.phase,
    }));
  }

  if (sections.activities) {
    const { data: activities } = await db
      .from("cc_activities")
      .select("position, activity_type, organization, role, description_150, hours_per_week")
      .eq("student_id", studentId)
      .order("position");
    result.activities = (activities || []).map((a) => ({
      position: a.position,
      activityType: a.activity_type,
      organization: a.organization,
      role: a.role,
      description150: a.description_150,
      hoursPerWeek: a.hours_per_week,
    }));

    const { data: honors } = await db
      .from("cc_honors")
      .select("title, level, description_100")
      .eq("student_id", studentId)
      .order("position");
    result.honors = (honors || []).map((h) => ({
      title: h.title,
      level: h.level,
      description100: h.description_100,
    }));
  }

  if (sections.schoolList) {
    const { data: schools } = await db
      .from("cc_student_schools")
      .select("application_status, cc_schools(name, city, state)")
      .eq("student_id", studentId);
    result.schoolList = (schools || []).map((s) => {
      const school = s.cc_schools as unknown as { name: string; city: string; state: string } | null;
      return {
        schoolName: school?.name || "Unknown",
        city: school?.city || "",
        state: school?.state || "",
        applicationStatus: s.application_status,
      };
    });
  }

  if (sections.recommendations) {
    const { data: recs } = await db
      .from("cc_recommenders")
      .select("name, recommender_type, subject, status")
      .eq("student_id", studentId)
      .order("created_at");
    result.recommendations = (recs || []).map((r) => ({
      name: r.name,
      recommenderType: r.recommender_type,
      subject: r.subject,
      status: r.status,
    }));
  }

  if (sections.interviewScores && profile?.user_id) {
    const { data: sessions } = await db
      .from("interview_sessions")
      .select("id, college_persona_id, status")
      .eq("user_id", profile.user_id)
      .eq("category", "college")
      .not("college_persona_id", "is", null);

    if (sessions && sessions.length > 0) {
      const sessionIds = sessions.map((s) => s.id);
      const { data: perfs } = await db
        .from("interview_performance")
        .select("session_id, overall_score")
        .in("session_id", sessionIds);

      const scoreMap = new Map<string, number>();
      for (const p of perfs || []) {
        scoreMap.set(p.session_id, p.overall_score);
      }

      const grouped: Record<string, { totalSessions: number; currentArcStep: number; latestRecommendation: string }> = {};
      for (const s of sessions) {
        const pid = s.college_persona_id as string;
        if (!grouped[pid]) {
          grouped[pid] = { totalSessions: 0, currentArcStep: 1, latestRecommendation: "Neutral" };
        }
        grouped[pid].totalSessions += 1;
      }
      for (const pid of Object.keys(grouped)) {
        const g = grouped[pid];
        g.currentArcStep = Math.min(g.totalSessions + 1, 4);

        const pidSessions = sessions.filter((s) => s.college_persona_id === pid);
        const scores = pidSessions
          .map((s) => scoreMap.get(s.id))
          .filter((x): x is number => x !== undefined);

        if (scores.length > 0) {
          const latest = scores[scores.length - 1];
          const rec = Math.max(1, Math.min(5, Math.round((latest / 10) * 5)));
          g.latestRecommendation = REC_LABELS[rec] || "Neutral";
        }
      }
      result.interviewScores = grouped;
    }
  }

  return NextResponse.json(result);
}
