import { NextResponse } from "next/server";
import { requireAuth, unauthorized } from "../../helpers";
import { createAdminSupabase } from "@/lib/supabase-server";

interface SessionGroup {
  totalSessions: number;
  currentArcStep: number;
  latestScore: {
    overallRecommendation: number;
    recommendationLabel: string;
    sessionId: string;
  } | null;
  sessions: {
    id: string;
    arcStep: number;
    status: string;
    startedAt: string;
    overallScore: number | null;
  }[];
}

const REC_LABELS: Record<number, string> = {
  1: "Do not recommend",
  2: "Recommend with concerns",
  3: "Neutral",
  4: "Recommend",
  5: "Strongly recommend",
};

export async function GET() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const db = createAdminSupabase();

  const { data: rawSessions } = await db
    .from("interview_sessions")
    .select("id, college_persona_id, status, started_at, ended_at")
    .eq("user_id", auth.user.id)
    .eq("category", "college")
    .not("college_persona_id", "is", null)
    .order("created_at", { ascending: true });

  if (!rawSessions || rawSessions.length === 0) {
    return NextResponse.json({ sessions: {} });
  }

  const sessionIds = rawSessions.map((s) => s.id);
  const { data: performances } = await db
    .from("interview_performance")
    .select("session_id, overall_score")
    .in("session_id", sessionIds);

  const scoreMap = new Map<string, number>();
  for (const p of performances || []) {
    scoreMap.set(p.session_id, p.overall_score);
  }

  const grouped: Record<string, SessionGroup> = {};

  for (const s of rawSessions) {
    const pid = s.college_persona_id as string;
    if (!grouped[pid]) {
      grouped[pid] = {
        totalSessions: 0,
        currentArcStep: 1,
        latestScore: null,
        sessions: [],
      };
    }
    const g = grouped[pid];
    g.totalSessions += 1;

    const overallScore = scoreMap.get(s.id) ?? null;
    const arcStep = g.totalSessions;

    g.sessions.push({
      id: s.id,
      arcStep,
      status: s.status,
      startedAt: s.started_at,
      overallScore,
    });
  }

  for (const pid of Object.keys(grouped)) {
    const g = grouped[pid];
    g.currentArcStep = Math.min(g.totalSessions + 1, 4);

    const completedWithScores = g.sessions
      .filter((s) => s.overallScore !== null)
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

    if (completedWithScores.length > 0) {
      const latest = completedWithScores[0];
      const rec = Math.round((latest.overallScore! / 10) * 5);
      const clamped = Math.max(1, Math.min(5, rec));
      g.latestScore = {
        overallRecommendation: clamped,
        recommendationLabel: REC_LABELS[clamped] || "Neutral",
        sessionId: latest.id,
      };
    }
  }

  return NextResponse.json({ sessions: grouped });
}
