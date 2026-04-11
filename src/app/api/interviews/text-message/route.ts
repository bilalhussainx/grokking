// Text-only interview turn endpoint.
// Takes the running conversation + new user message + persona context,
// returns the next interviewer response. No voice involved.
// Uses OpenRouter (Claude Sonnet 4.5) with Kimi fallback — same router
// used by the voice path so quality matches.
//
// Spec: P0 retention fix per kairoslearn_end_to_end_audit_apr7.md (2026-04-07)
// "No text-only interview mode. Blocks ~30% of users without microphone."

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import type { CompanyPersona } from "@/data/interview-personas";
import type { CollegePersona } from "@/data/college-interviewer-personas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY || "";
const MOONSHOT_URL = "https://api.moonshot.ai/v1/chat/completions";
const MOONSHOT_MODEL = "kimi-k2-turbo-preview";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const VOICE_LLM_MODEL = process.env.OPENROUTER_VOICE_MODEL || "anthropic/claude-sonnet-4.5";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

interface TextInterviewBody {
  category: 'tech' | 'college';
  language?: string;
  companyPersonaId?: string;        // tech mode
  collegePersonaId?: string;        // college mode
  applicantProfile?: {              // college mode
    intendedMajor?: string;
    topProjectTitle?: string;
    topProjectDescription?: string;
    recentInfluence?: string;
    whyThisSchool?: string;
  };
  questionPlan?: unknown;
  interviewType?: string;
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  isGreeting?: boolean;             // if true, agent generates first message
  sessionId?: string;
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!OPENROUTER_API_KEY && !MOONSHOT_API_KEY) {
    return NextResponse.json(
      { error: "No LLM API key configured" },
      { status: 500 }
    );
  }

  const body = (await req.json().catch(() => ({}))) as TextInterviewBody;
  const {
    category,
    language = "en",
    companyPersonaId,
    collegePersonaId,
    applicantProfile,
    questionPlan,
    interviewType = "technical",
    conversationHistory = [],
    isGreeting = false,
    sessionId,
  } = body;

  // Load session if provided
  let session = null;
  if (sessionId && user) {
    try {
      const { getSession } = await import("@/lib/interview-session");
      session = await getSession(sessionId, user.id);
    } catch {}
  }

  // Build the system prompt using the same builders the voice path uses
  let systemPrompt = "";
  try {
    if (category === "college" && collegePersonaId) {
      const { getCollegePersona } = await import("@/data/college-interviewer-personas");
      const { buildCollegePersonaPrompt, loadCollegeSessionContext } = await import(
        "@/lib/college-interview-prompt-builders"
      );
      const persona: CollegePersona | null = getCollegePersona(collegePersonaId);
      if (persona) {
        const sessionCtx = user
          ? await loadCollegeSessionContext(user.id, persona.id, persona.school)
          : undefined;
        systemPrompt = buildCollegePersonaPrompt(persona, applicantProfile, sessionCtx);
      }
    } else if (category === "tech" && companyPersonaId) {
      const { getCompanyPersona } = await import("@/data/interview-personas");
      const { buildInterviewerSystemPrompt } = await import("@/lib/interview-prompt-builders");
      const persona: CompanyPersona = getCompanyPersona(companyPersonaId);
      systemPrompt = buildInterviewerSystemPrompt(persona, language);
    }
  } catch (e) {
    console.error("[interviews/text-message] Failed to build persona prompt:", e);
  }

  if (!systemPrompt) {
    systemPrompt = `You are conducting a ${interviewType} interview. Ask one question at a time and adapt to the candidate's answers. Keep responses to 2-4 sentences — this is a text chat, not a lecture.`;
  }

  // Agent context for memory-aware interviews
  let agentContextStr = "";
  if (user) {
    try {
      const { buildAgentContext } = await import("@/lib/agent-context");
      const ctx = await buildAgentContext(user.id, "interviewer", `interview ${companyPersonaId || ""}`, {
        companyId: companyPersonaId,
      });
      agentContextStr = `\n${ctx.promptContext}\n`;
    } catch {}
  }

  // Inject agent context before text mode rules
  if (agentContextStr) {
    systemPrompt += agentContextStr;
  }

  // Append the question plan if provided
  if (questionPlan) {
    try {
      const planJson = typeof questionPlan === "string" ? questionPlan : JSON.stringify(questionPlan);
      systemPrompt += `\n\n## QUESTION PLAN\nUse this as the structure. Adapt follow-ups based on the candidate's answers.\n\n${planJson}`;
    } catch {}
  }

  // Text-mode-specific rules
  systemPrompt += `\n\n## TEXT MODE RULES (CRITICAL)
- This is a TEXT-ONLY interview. The candidate types their answers; you respond in writing.
- Keep responses to 2-4 sentences. Ask ONE question per turn.
- If this is the first turn (greeting), start with your opening line and the first question — don't wait for the candidate to introduce themselves.
- React to what the candidate writes. Ask follow-ups. Push back gently when answers are vague.
- No markdown lists, no bullet points, no asterisks for emphasis. Plain conversational text.
- Don't say "Great answer!" — react authentically with insight or a follow-up question.`;

  // Build the messages array for the LLM
  const messages: Array<{ role: string; content: string }> = [
    { role: "system", content: systemPrompt },
  ];

  if (isGreeting && conversationHistory.length === 0) {
    // First turn — kick off with a direct prompt
    messages.push({
      role: "user",
      content: "Begin the interview now. Greet me with your opening line and ask the first question.",
    });
  } else {
    // Append the running conversation
    messages.push(...conversationHistory.slice(-20));
  }

  // OpenRouter primary, Kimi fallback
  const useOpenRouter = !!OPENROUTER_API_KEY;
  const llmUrl = useOpenRouter ? OPENROUTER_URL : MOONSHOT_URL;
  const llmKey = useOpenRouter ? OPENROUTER_API_KEY : MOONSHOT_API_KEY;
  const llmModel = useOpenRouter ? VOICE_LLM_MODEL : MOONSHOT_MODEL;

  try {
    const llmRes = await fetch(llmUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${llmKey}`,
      },
      body: JSON.stringify({
        model: llmModel,
        messages,
        stream: false,
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!llmRes.ok) {
      const errText = await llmRes.text().catch(() => "");
      console.error("[text-message] LLM error:", llmRes.status, errText);
      return NextResponse.json(
        { error: `LLM API error: ${llmRes.status}` },
        { status: 502 }
      );
    }

    const llmData = await llmRes.json();
    const reply: string = llmData.choices?.[0]?.message?.content?.trim() || "";

    // Record turn in session (fire-and-forget)
    if (session && sessionId && user) {
      const lastUserMsg = conversationHistory[conversationHistory.length - 1]?.content || "";
      import("@/lib/interview-session").then(({ recordTurn }) => {
        recordTurn(sessionId, lastUserMsg, reply).catch(() => {});
      }).catch(() => {});
    }

    if (!reply) {
      return NextResponse.json(
        { error: "Empty response from interviewer" },
        { status: 500 }
      );
    }

    // Trace authenticated turns
    if (user) {
      console.log(`[text-message] user=${user.id.slice(0, 8)} category=${category} persona=${companyPersonaId || collegePersonaId || "generic"}`);
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("[text-message] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
