import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "../helpers";
import { deductCredits, CREDIT_COSTS } from "@/lib/credits";
import { buildCoachContext, getAgentPrompt, type AgentType } from "@/lib/cc/coach-agents";
import { routeMessage, buildClassificationPrompt, parseClassification } from "@/lib/cc/coach-router";

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

function streamFromSSE(body: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  return new ReadableStream({
    async pull(controller) {
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) { controller.close(); return; }
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;
          const data = trimmed.slice(6);
          if (data === "[DONE]") { controller.close(); return; }
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) controller.enqueue(encoder.encode(content));
          } catch { /* skip malformed */ }
        }
      }
    },
    cancel() { reader.cancel(); },
  });
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

    // Route the message
    let agent = routeMessage(message, coachCtx, context?.page);
    if (!agent) {
      agent = await classifyWithLLM(message, coachCtx.profileCompletionPct);
    }

    console.log(`[CC Coach] Agent: ${agent} | Profile: ${coachCtx.profileCompletionPct}% | Page: ${context?.page || "?"}`);

    const systemPrompt = getAgentPrompt(agent, coachCtx);
    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...((conversationHistory || []).map((m) => ({
        role: (m.role === "assistant" ? "assistant" : "user") as "assistant" | "user",
        content: m.content,
      }))),
      { role: "user" as const, content: message },
    ];

    // Try OpenRouter first
    if (OPENROUTER_API_KEY) {
      try {
        const resp = await fetch(OPENROUTER_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "HTTP-Referer": "https://kairos.ai",
            "X-Title": "Kairos.ai Coach",
          },
          body: JSON.stringify({
            model: "openai/gpt-4o-mini",
            messages,
            stream: true,
            temperature: 0.7,
            max_tokens: 400,
          }),
        });

        if (resp.ok && resp.body) {
          return new Response(streamFromSSE(resp.body), {
            headers: {
              "Content-Type": "text/plain; charset=utf-8",
              "X-Coach-Agent": agent,
            },
          });
        }
      } catch (err) {
        console.error("[CC Coach] OpenRouter failed:", err);
      }
    }

    // Fallback: Moonshot
    if (MOONSHOT_API_KEY) {
      try {
        const resp = await fetch(MOONSHOT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${MOONSHOT_API_KEY}`,
          },
          body: JSON.stringify({
            model: MOONSHOT_MODEL,
            messages,
            stream: true,
            temperature: 0.7,
            max_tokens: 400,
          }),
        });

        if (resp.ok && resp.body) {
          return new Response(streamFromSSE(resp.body), {
            headers: {
              "Content-Type": "text/plain; charset=utf-8",
              "X-Coach-Agent": agent,
            },
          });
        }
      } catch (err) {
        console.error("[CC Coach] Moonshot failed:", err);
      }
    }

    // Final fallback: Gemini
    const { getGeminiModel } = await import("@/lib/gemini");
    const model = getGeminiModel(systemPrompt);
    const chatHistory = (conversationHistory || []).map((m) => ({
      role: (m.role === "assistant" ? "model" : "user") as "model" | "user",
      parts: [{ text: m.content }],
    }));
    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessageStream(message);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });

    return new Response(stream, {
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
