// src/lib/interview-session.ts
// Stateful interview session lifecycle: create, advance, end, persist score.

import { createAdminSupabase } from "@/lib/supabase-auth";
import type {
  InterviewSession,
  InterviewStructure,
  InterviewPlan,
  InterviewScorecard,
} from "@/types/interview";

/**
 * Create a new interview session. Returns the session ID.
 */
export async function createSession(opts: {
  userId: string;
  companyPersonaId: string;
  category: "tech" | "college";
  interviewType: string;
  preset?: string;
  language?: string;
  questionPlan: InterviewPlan;
  sessionStructure: InterviewStructure | null;
}): Promise<string> {
  const admin = createAdminSupabase();

  const { data, error } = await admin
    .from("interview_sessions")
    .insert({
      user_id: opts.userId,
      company_persona_id: opts.companyPersonaId,
      category: opts.category,
      interview_type: opts.interviewType,
      preset: opts.preset || null,
      language: opts.language || "en",
      question_plan: opts.questionPlan,
      session_structure: opts.sessionStructure,
      conversation_history: [],
      code_submissions: [],
      status: "active",
      current_phase: 0,
      total_turns: 0,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(`Failed to create session: ${error?.message}`);
  }

  return data.id;
}

/**
 * Get an active session by ID. Returns null if not found or not active.
 */
export async function getSession(
  sessionId: string,
  userId: string
): Promise<InterviewSession | null> {
  const admin = createAdminSupabase();

  const { data, error } = await admin
    .from("interview_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    userId: data.user_id,
    companyPersonaId: data.company_persona_id,
    category: data.category,
    interviewType: data.interview_type,
    status: data.status,
    currentPhase: data.current_phase,
    questionPlan: data.question_plan,
    sessionStructure: data.session_structure,
    conversationHistory: data.conversation_history || [],
    codeSubmissions: data.code_submissions || [],
    totalTurns: data.total_turns,
    startedAt: data.started_at,
    endedAt: data.ended_at,
  };
}

/**
 * Record a turn in the session (user message + assistant response).
 */
export async function recordTurn(
  sessionId: string,
  userMessage: string,
  assistantMessage: string,
  currentPhase?: number
): Promise<void> {
  const admin = createAdminSupabase();

  const { data: session } = await admin
    .from("interview_sessions")
    .select("conversation_history, total_turns")
    .eq("id", sessionId)
    .single();

  if (!session) return;

  const history = [...(session.conversation_history || [])];
  history.push({ role: "user", content: userMessage });
  history.push({ role: "assistant", content: assistantMessage });

  const updates: Record<string, unknown> = {
    conversation_history: history,
    total_turns: (session.total_turns || 0) + 1,
  };

  if (currentPhase !== undefined) {
    updates.current_phase = currentPhase;
  }

  await admin
    .from("interview_sessions")
    .update(updates)
    .eq("id", sessionId);
}

/**
 * Record a code submission for the session.
 */
export async function recordCodeSubmission(
  sessionId: string,
  submission: {
    problemId: string;
    code: string;
    language: string;
    passed: boolean;
  }
): Promise<void> {
  const admin = createAdminSupabase();

  const { data: session } = await admin
    .from("interview_sessions")
    .select("code_submissions")
    .eq("id", sessionId)
    .single();

  if (!session) return;

  const submissions = [...(session.code_submissions || [])];
  submissions.push({ ...submission, timestamp: Date.now() });

  await admin
    .from("interview_sessions")
    .update({ code_submissions: submissions })
    .eq("id", sessionId);
}

/**
 * End a session and persist the scorecard to interview_performance.
 * Also writes facts to the knowledge graph.
 */
export async function endSession(
  sessionId: string,
  userId: string,
  scorecard: InterviewScorecard
): Promise<void> {
  const admin = createAdminSupabase();

  // Mark session as completed
  await admin
    .from("interview_sessions")
    .update({ status: "completed", ended_at: new Date().toISOString() })
    .eq("id", sessionId);

  // Get session metadata for the performance record
  const { data: session } = await admin
    .from("interview_sessions")
    .select("company_persona_id, category, interview_type")
    .eq("id", sessionId)
    .single();

  if (!session) return;

  // Extract topics from scorecard
  const topicsStrong: string[] = [];
  const topicsWeak: string[] = [];
  for (const q of scorecard.questions || []) {
    const topic = q.question.slice(0, 100);
    if (q.score >= 7) topicsStrong.push(topic);
    if (q.score <= 4) topicsWeak.push(topic);
  }

  // Persist to interview_performance
  await admin.from("interview_performance").insert({
    user_id: userId,
    session_id: sessionId,
    company_persona_id: session.company_persona_id,
    category: session.category,
    interview_type: session.interview_type,
    overall_score: scorecard.overall,
    communication_score: scorecard.categories.communication,
    technical_depth_score: scorecard.categories.technicalDepth,
    problem_solving_score: scorecard.categories.problemSolving,
    code_quality_score: scorecard.categories.codeQuality,
    strengths: scorecard.strengths,
    improvements: scorecard.improvements,
    question_scores: scorecard.questions,
    topics_strong: topicsStrong,
    topics_weak: topicsWeak,
  });

  // Write facts to knowledge graph (fire-and-forget)
  writeInterviewFacts(userId, scorecard, topicsStrong, topicsWeak).catch(
    () => {}
  );
}

/**
 * Write interview performance facts to the knowledge graph.
 */
async function writeInterviewFacts(
  userId: string,
  scorecard: InterviewScorecard,
  topicsStrong: string[],
  topicsWeak: string[]
): Promise<void> {
  const { upsertFact } = await import("@/lib/knowledge-graph");

  for (const topic of topicsWeak) {
    await upsertFact(userId, {
      subject: userId,
      predicate: "weak_at",
      object: topic,
      confidence: 0.7,
      sourceAgent: "interviewer",
    });
  }

  for (const topic of topicsStrong) {
    await upsertFact(userId, {
      subject: userId,
      predicate: "strong_at",
      object: topic,
      confidence: 0.7,
      sourceAgent: "interviewer",
    });
  }

  const level =
    scorecard.overall >= 8
      ? "strong"
      : scorecard.overall >= 5
        ? "moderate"
        : "needs_improvement";
  await upsertFact(userId, {
    subject: userId,
    predicate: "interview_readiness",
    object: level,
    confidence: 0.6,
    sourceAgent: "interviewer",
  });
}

/**
 * Get the user's last N interview performances for trend analysis.
 */
export async function getPerformanceTrend(
  userId: string,
  companyPersonaId?: string,
  limit = 5
): Promise<{
  sessions: Array<{
    overall: number;
    communication: number;
    technicalDepth: number;
    problemSolving: number;
    codeQuality: number;
    createdAt: string;
    companyPersonaId: string;
  }>;
  trend: "improving" | "declining" | "stable" | "insufficient_data";
}> {
  const admin = createAdminSupabase();

  let query = admin
    .from("interview_performance")
    .select(
      "overall_score, communication_score, technical_depth_score, problem_solving_score, code_quality_score, created_at, company_persona_id"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (companyPersonaId) {
    query = query.eq("company_persona_id", companyPersonaId);
  }

  const { data } = await query;

  if (!data || data.length < 2) {
    return {
      sessions: (data || []).map((d) => ({
        overall: d.overall_score,
        communication: d.communication_score,
        technicalDepth: d.technical_depth_score,
        problemSolving: d.problem_solving_score,
        codeQuality: d.code_quality_score,
        createdAt: d.created_at,
        companyPersonaId: d.company_persona_id,
      })),
      trend: "insufficient_data",
    };
  }

  const recent = data.slice(0, Math.ceil(data.length / 2));
  const older = data.slice(Math.ceil(data.length / 2));
  const recentAvg =
    recent.reduce((s, d) => s + d.overall_score, 0) / recent.length;
  const olderAvg =
    older.reduce((s, d) => s + d.overall_score, 0) / older.length;

  const diff = recentAvg - olderAvg;
  const trend =
    diff > 0.5 ? "improving" : diff < -0.5 ? "declining" : "stable";

  return {
    sessions: data.map((d) => ({
      overall: d.overall_score,
      communication: d.communication_score,
      technicalDepth: d.technical_depth_score,
      problemSolving: d.problem_solving_score,
      codeQuality: d.code_quality_score,
      createdAt: d.created_at,
      companyPersonaId: d.company_persona_id,
    })),
    trend,
  };
}
