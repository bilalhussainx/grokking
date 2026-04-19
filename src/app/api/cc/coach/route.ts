import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "../helpers";
import { deductCredits, CREDIT_COSTS } from "@/lib/credits";
import { buildCoachContext, getAgentPrompt, type AgentType } from "@/lib/cc/coach-agents";
import { routeMessage, buildClassificationPrompt, parseClassification } from "@/lib/cc/coach-router";
import { streamLLM, type ChatMessage } from "@/lib/cc/llm-stream";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY || "";
const MOONSHOT_URL = "https://api.moonshot.ai/v1/chat/completions";
const MOONSHOT_MODEL = "kimi-k2-turbo-preview";
const CLASSIFIER_MODEL = "openai/gpt-4o-mini";

async function classifyWithLLM(message: string, profilePct: number): Promise<AgentType> {
  const prompt = buildClassificationPrompt(message, profilePct);
  const apiKey = OPENROUTER_API_KEY || MOONSHOT_API_KEY;
  const apiUrl = OPENROUTER_API_KEY ? OPENROUTER_URL : MOONSHOT_URL;
  const model = OPENROUTER_API_KEY ? CLASSIFIER_MODEL : MOONSHOT_MODEL;

  if (!apiKey) return "general";

  try {
    const resp = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        ...(OPENROUTER_API_KEY ? { "HTTP-Referer": "https://kairos.ai" } : {}),
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
        max_tokens: 10,
      }),
    });
    if (!resp.ok) return "general";
    const data = await resp.json();
    const text = data.choices?.[0]?.message?.content || "general";
    return parseClassification(text);
  } catch {
    return "general";
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { user } = auth;

  const ok = await deductCredits(user.id, CREDIT_COSTS.coach_text, "coach_text");
  if (!ok) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
  }

  try {
    const body = await req.json();
    const { message, conversationHistory, context } = body as {
      message: string;
      conversationHistory?: { role: string; content: string }[];
      context?: { page?: string; conversationId?: string };
    };

    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const coachCtx = await buildCoachContext(user.id);

    let agent = routeMessage(message, coachCtx, context?.page);
    if (!agent) {
      agent = await classifyWithLLM(message, coachCtx.profileCompletionPct);
    }

    console.log(`[CC Coach] Agent: ${agent} | Profile: ${coachCtx.profileCompletionPct}% | Page: ${context?.page || "?"}`);

    const systemPrompt = getAgentPrompt(agent, coachCtx);
    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...((conversationHistory || []).map((m) => ({
        role: (m.role === "assistant" ? "assistant" : "user") as "assistant" | "user",
        content: m.content,
      }))),
      { role: "user", content: message },
    ];

    const result = await streamLLM(messages);
    if (!result) {
      return NextResponse.json({ error: "All LLM providers unavailable" }, { status: 503 });
    }

    return new Response(result.stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Coach-Agent": agent,
      },
    });
  } catch (error) {
    console.error("[CC Coach] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Coach unavailable" },
      { status: 500 },
    );
  }
}
