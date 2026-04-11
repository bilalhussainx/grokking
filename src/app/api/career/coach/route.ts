import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { deductCredits, CREDIT_COSTS } from "@/lib/credits";
import {
  buildCareerContext,
  formatCareerContextForPrompt,
  CAREER_COACH_DIRECTIVE,
} from "@/lib/career-coach";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY || "";
const MOONSHOT_URL = "https://api.moonshot.ai/v1/chat/completions";
const MOONSHOT_MODEL = "kimi-k2-turbo-preview";

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ok = await deductCredits(user.id, CREDIT_COSTS.coach_text, "career_coach");
  if (!ok) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
  }

  try {
    const body = await req.json();
    const { message, history } = body as {
      message: string;
      history?: { role: string; content: string }[];
    };

    if (!message) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    const ctx = await buildCareerContext(user.id);
    const careerBlock = formatCareerContextForPrompt(ctx);

    const messages = [
      { role: "system", content: `${CAREER_COACH_DIRECTIVE}\n\n${careerBlock}` },
      ...((history || []).map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      }))),
      { role: "user", content: message },
    ];

    const useOpenRouter = !!OPENROUTER_API_KEY;
    const apiUrl = useOpenRouter ? OPENROUTER_URL : MOONSHOT_URL;
    const apiKey = useOpenRouter ? OPENROUTER_API_KEY : MOONSHOT_API_KEY;
    const model = useOpenRouter ? "openai/gpt-4o-mini" : MOONSHOT_MODEL;

    if (!apiKey) {
      return NextResponse.json({ error: "No LLM provider configured" }, { status: 503 });
    }

    const llmRes = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        ...(useOpenRouter ? { "HTTP-Referer": "https://kairos.ai", "X-Title": "Kairos.ai Career Coach" } : {}),
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        temperature: 0.6,
        max_tokens: 400,
      }),
    });

    if (!llmRes.ok || !llmRes.body) {
      const errText = await llmRes.text().catch(() => "");
      console.error("[career/coach] LLM error:", llmRes.status, errText);
      return NextResponse.json({ error: "LLM unavailable" }, { status: 502 });
    }

    const reader = llmRes.body.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async pull(controller) {
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            return;
          }
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data: ")) continue;
            const data = trimmed.slice(6);
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) controller.enqueue(encoder.encode(content));
            } catch {
              // skip malformed
            }
          }
        }
      },
      cancel() {
        reader.cancel();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Career coach unavailable";
    console.error("[career/coach] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
