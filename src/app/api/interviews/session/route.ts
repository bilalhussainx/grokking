// src/app/api/interviews/session/route.ts
// POST: start a new interview session
// PUT: record a turn (advance the session)
// DELETE: abandon a session

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import {
  deductCredits,
  hasUsedFreeInterview,
  CREDIT_COSTS,
} from "@/lib/credits";
import {
  createSession,
  getSession,
  recordTurn,
  endSession,
} from "@/lib/interview-session";
import {
  buildAdaptiveContext,
  buildAdaptivePromptExtension,
} from "@/lib/interview-question-planner";
import { getCompanyPersona } from "@/data/interview-personas";
import type { InterviewScorecard } from "@/types/interview";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ------------------------------------------------------------------ */
/*  POST — Start a new interview session                              */
/* ------------------------------------------------------------------ */
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Credit gate: first interview is free, subsequent ones cost credits
  const usedFree = await hasUsedFreeInterview(user.id);
  if (usedFree) {
    const ok = await deductCredits(user.id, CREDIT_COSTS.interview, "interview");
    if (!ok)
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 402 }
      );
  }

  try {
    const body = await req.json();
    const {
      companyPersonaId = "generic",
      category = "tech",
      interviewType = "technical",
      preset,
      language = "en",
      questionPlan,
    } = body;

    const persona = getCompanyPersona(companyPersonaId);

    // Build adaptive context (weakness-aware question selection)
    let adaptiveExtension = "";
    try {
      const adaptiveCtx = await buildAdaptiveContext({
        userId: user.id,
        persona,
        interviewType,
        language,
      });
      adaptiveExtension = buildAdaptivePromptExtension(adaptiveCtx);
    } catch (err) {
      console.warn("[Session] Adaptive context failed (non-fatal):", err);
    }

    // Persist the session row
    const sessionId = await createSession({
      userId: user.id,
      companyPersonaId,
      category,
      interviewType,
      preset,
      language,
      questionPlan: questionPlan || {
        questions: [],
        interviewerPersona: "",
        timeAllocation: { intro: 5, questions: 40, wrapUp: 5 },
      },
      sessionStructure: persona.sessionStructure,
    });

    // Build agent context for the interview (non-fatal)
    let agentContextStr = "";
    try {
      const { buildAgentContext } = await import("@/lib/agent-context");
      const ctx = await buildAgentContext(
        user.id,
        "interviewer",
        `interview ${companyPersonaId}`,
        { companyId: companyPersonaId }
      );
      agentContextStr = ctx.promptContext;
    } catch {
      // agent-context is optional
    }

    return NextResponse.json({
      sessionId,
      sessionStructure: persona.sessionStructure,
      adaptiveContext: adaptiveExtension,
      agentContext: agentContextStr,
    });
  } catch (error) {
    console.error("[Session] POST error:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}

/* ------------------------------------------------------------------ */
/*  PUT — Record a turn in the session                                */
/* ------------------------------------------------------------------ */
export async function PUT(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { sessionId, userMessage, assistantMessage, currentPhase } = body;

    if (!sessionId || !userMessage || !assistantMessage) {
      return NextResponse.json(
        { error: "sessionId, userMessage, assistantMessage required" },
        { status: 400 }
      );
    }

    // Verify session belongs to user
    const session = await getSession(sessionId, user.id);
    if (!session)
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    if (session.status !== "active")
      return NextResponse.json(
        { error: "Session is not active" },
        { status: 400 }
      );

    await recordTurn(sessionId, userMessage, assistantMessage, currentPhase);

    // Store memory + extract facts (fire-and-forget, non-blocking)
    import("@/lib/agent-memory-store")
      .then(({ storeAgentMemory }) => {
        storeAgentMemory(user.id, "interviewer", userMessage, {
          role: "user",
          metadata: {
            sessionId,
            companyPersonaId: session.companyPersonaId,
          },
        });
      })
      .catch(() => {});

    import("@/lib/fact-extractor")
      .then(({ extractAndStoreFacts }) => {
        extractAndStoreFacts({
          userId: user.id,
          agentType: "interviewer",
          userMessage,
          assistantMessage,
          metadata: {
            sessionId,
            companyPersonaId: session.companyPersonaId,
          },
        });
      })
      .catch(() => {});

    return NextResponse.json({
      success: true,
      totalTurns: session.totalTurns + 1,
    });
  } catch (error) {
    console.error("[Session] PUT error:", error);
    return NextResponse.json(
      { error: "Failed to record turn" },
      { status: 500 }
    );
  }
}

/* ------------------------------------------------------------------ */
/*  DELETE — End or abandon a session                                 */
/* ------------------------------------------------------------------ */
export async function DELETE(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    if (!sessionId)
      return NextResponse.json(
        { error: "sessionId required" },
        { status: 400 }
      );

    const session = await getSession(sessionId, user.id);
    if (!session)
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );

    // If a scorecard is provided in the body, complete the session;
    // otherwise mark it as abandoned.
    try {
      const body = await req.json();
      if (body.scorecard) {
        await endSession(
          sessionId,
          user.id,
          body.scorecard as InterviewScorecard
        );
        return NextResponse.json({ status: "completed" });
      }
    } catch {
      // No body or invalid JSON — treat as abandon
    }

    const { createAdminSupabase } = await import("@/lib/supabase-auth");
    const admin = createAdminSupabase();
    await admin
      .from("interview_sessions")
      .update({ status: "abandoned", ended_at: new Date().toISOString() })
      .eq("id", sessionId);

    return NextResponse.json({ status: "abandoned" });
  } catch (error) {
    console.error("[Session] DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to end session" },
      { status: 500 }
    );
  }
}
