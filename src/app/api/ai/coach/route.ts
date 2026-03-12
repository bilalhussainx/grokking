import { NextRequest } from "next/server";

const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY || "";
const MOONSHOT_URL = "https://api.moonshot.ai/v1/chat/completions";
const MOONSHOT_MODEL = "kimi-k2-turbo-preview";

const COACH_DIRECTIVE = `You are Coach Alex, an encouraging and intelligent AI coding tutor embedded in the Grokking learning platform.

YOUR PERSONALITY:
- Warm, encouraging, but never patronizing
- You celebrate wins genuinely
- You give progressive hints — never the full answer on first ask
- You speak concisely (2-4 sentences typical)
- You adapt to the student's skill level based on their code
- You use casual, friendly language — like a supportive senior developer

RULES:
- NEVER give the full solution directly unless explicitly asked after 3+ hints
- Keep responses SHORT — 2-3 sentences for encouragement, up to 1 paragraph for explanations
- Reference the specific problem/pattern they're working on
- If you see their code, comment on what's good before suggesting improvements
- When speaking via voice, keep answers EXTRA short (1-2 sentences max)`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      event,
      lessonTitle,
      moduleTitle,
      courseTitle,
      currentCode,
      starterCode,
      solutionCode,
      hintsGiven,
      history,
    } = body;

    const userPrompt = `[CURRENT LESSON]
Course: ${courseTitle || "Unknown"}
Module: ${moduleTitle || "Unknown"}
Lesson: ${lessonTitle || "Unknown"}
${starterCode ? `Starter Code:\n\`\`\`\n${starterCode}\n\`\`\`` : ""}
${solutionCode ? `Solution (DO NOT reveal unless 3+ hints given):\n\`\`\`\n${solutionCode}\n\`\`\`` : ""}

[STUDENT STATE]
Hints given so far: ${hintsGiven || 0}
${currentCode ? `Student's current code:\n\`\`\`\n${currentCode}\n\`\`\`` : "No code written yet"}

[EVENT]
${event}

Respond concisely as Coach Alex:`;

    const messages = [
      { role: "system", content: COACH_DIRECTIVE },
      ...((history as { role: string; content: string }[]) || []).map(
        (m: { role: string; content: string }) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        })
      ),
      { role: "user", content: userPrompt },
    ];

    // Primary: Kimi K2.5 (fast, streaming)
    if (MOONSHOT_API_KEY) {
      try {
        const kimiRes = await fetch(MOONSHOT_URL, {
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

        if (!kimiRes.ok) {
          const errText = await kimiRes.text();
          console.error("[Coach] Kimi error:", kimiRes.status, errText);
          throw new Error(`Kimi ${kimiRes.status}`);
        }

        if (!kimiRes.body) throw new Error("No body");

        // Transform SSE stream → plain text stream
        const reader = kimiRes.body.getReader();
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
                  if (content) {
                    controller.enqueue(encoder.encode(content));
                  }
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
      } catch (err) {
        console.error("[Coach] Kimi failed, falling back:", err);
      }
    }

    // Fallback: Gemini
    return await fallbackToGemini(body);
  } catch (error: unknown) {
    console.error("[Coach] All failed:", error);
    const message =
      error instanceof Error ? error.message : "Coach unavailable";
    return Response.json({ error: message }, { status: 500 });
  }
}

async function fallbackToGemini(body: Record<string, unknown>) {
  const { getGeminiModel } = await import("@/lib/gemini");
  const {
    event,
    lessonTitle,
    moduleTitle,
    courseTitle,
    currentCode,
    starterCode,
    hintsGiven,
    history,
  } = body as Record<
    string,
    string | number | { role: string; content: string }[] | undefined
  >;

  const prompt = `${COACH_DIRECTIVE}

[CURRENT LESSON]
Course: ${courseTitle || "Unknown"} > ${moduleTitle || "Unknown"} > ${lessonTitle || "Unknown"}
${starterCode ? `Starter: \`\`\`\n${starterCode}\n\`\`\`` : ""}

[STUDENT]
Hints: ${hintsGiven || 0}
${currentCode ? `Code:\n\`\`\`\n${currentCode}\n\`\`\`` : "No code yet"}

[EVENT] ${event}`;

  const model = getGeminiModel(COACH_DIRECTIVE);
  const chatHistory = (
    (history as { role: string; content: string }[]) || []
  ).map((msg) => ({
    role: msg.role === "assistant" ? ("model" as const) : ("user" as const),
    parts: [{ text: msg.content }],
  }));
  const chat = model.startChat({ history: chatHistory });
  const result = await chat.sendMessageStream(prompt);

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
      "Transfer-Encoding": "chunked",
    },
  });
}
