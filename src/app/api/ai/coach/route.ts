import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { deductCredits, CREDIT_COSTS } from "@/lib/credits";
import { storeMemory, searchMemories, extractTopics } from "@/lib/memory";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// Smart model routing: DeepSeek for coding, GPT-4o-mini for everything else
const CODING_DOMAINS = ["computer-science", "programming", "coding-interview", "system-design", "data-structures", "algorithms"];
function pickModel(courseTitle?: string): string {
  const title = (courseTitle || "").toLowerCase();
  const isCoding = CODING_DOMAINS.some(d => title.includes(d)) ||
    title.includes("python") || title.includes("javascript") || title.includes("react") ||
    title.includes("node") || title.includes("dsa") || title.includes("coding") ||
    title.includes("c++") || title.includes("c#") || title.includes("mern") ||
    title.includes("system design") || title.includes("algorithm");
  return isCoding ? "deepseek/deepseek-chat-v3-0324" : "openai/gpt-4o-mini";
}

const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY || "";
const MOONSHOT_URL = "https://api.moonshot.ai/v1/chat/completions";
const MOONSHOT_MODEL = "kimi-k2-turbo-preview";

const COACH_DIRECTIVE = `You are Coach Alex, an encouraging and intelligent AI tutor embedded in the Kairos.ai learning platform.

YOUR PERSONALITY:
- Warm, encouraging, but never patronizing
- You celebrate wins genuinely
- You give progressive hints — never the full answer on first ask
- You speak concisely (2-4 sentences typical)
- You adapt to the student's skill level
- You use casual, friendly language — like a supportive senior developer

BE PROACTIVE:
- When a lesson loads, greet the student and immediately reference what they're learning
- Ask a quick question about the lesson to spark engagement: "So, what do you think about...?"
- If the lesson has code, offer to walk through it together
- If the student seems stuck, don't wait — suggest the next step
- Keep momentum: "Great! Now let's look at..." or "Ready for the next challenge?"
- For non-coding lessons (finance, philosophy, etc.), discuss concepts, ask thought-provoking questions

RULES:
- NEVER give the full solution directly unless explicitly asked after 3+ hints
- Keep responses SHORT — 2-3 sentences for encouragement, up to 1 paragraph for explanations
- Reference the specific lesson/problem they're working on
- If you see their code, comment on what's good before suggesting improvements
- When speaking via voice, keep answers EXTRA short (1-2 sentences max)
- Adapt to the course domain — coding coach for CS, discussion partner for humanities, study buddy for finance`;

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ok = await deductCredits(user.id, CREDIT_COSTS.coach_text, "coach_text");
  if (!ok) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
  }

  try {
    const body = await req.json();
    const {
      event,
      lessonTitle,
      moduleTitle,
      courseTitle,
      lessonContent,
      currentCode,
      starterCode,
      solutionCode,
      hintsGiven,
      history,
      language,
    } = body;

    // RAG Intelligence — fetch everything we know about this user
    let intelligenceContext = "";
    try {
      const { fetchUserIntelligence } = await import("@/lib/agent-intelligence");
      const intel = await fetchUserIntelligence(user.id);
      intelligenceContext = `\n${intel.promptContext}\n`;
    } catch (err) {
      console.warn("[Coach] Intelligence fetch failed:", err);
    }

    // Retrieve relevant memories for context
    let memoryContext = "";
    try {
      const memories = await searchMemories(user.id, `${event} ${lessonTitle || ""}`, {
        courseSlug: body.courseSlug,
        limit: 3,
      });
      if (memories.length > 0) {
        memoryContext = `\n[RELEVANT PAST CONVERSATIONS]\n${memories.map((m) => `- ${m.summary || m.content.slice(0, 100)}`).join("\n")}\n`;
      }
    } catch {}

    // Store the user's message as memory (fire-and-forget)
    storeMemory(user.id, event, {
      courseSlug: body.courseSlug,
      lessonSlug: body.lessonSlug,
      role: "user",
      topics: extractTopics(event),
    }).catch(() => {});

    const userPrompt = `[CURRENT LESSON — THIS IS WHAT THE STUDENT IS LOOKING AT RIGHT NOW]
Course: ${courseTitle || "Unknown"}
Module: ${moduleTitle || "Unknown"}
Lesson: ${lessonTitle || "Unknown"}
${lessonContent ? `\nLESSON CONTENT (the actual text the student is reading):\n${lessonContent}\n` : ""}
${starterCode ? `STARTER CODE:\n\`\`\`\n${starterCode}\n\`\`\`` : ""}
${solutionCode ? `SOLUTION (DO NOT reveal unless 3+ hints given):\n\`\`\`\n${solutionCode}\n\`\`\`` : ""}

[STUDENT STATE]
Hints given so far: ${hintsGiven || 0}
${currentCode ? `Student's current code:\n\`\`\`\n${currentCode}\n\`\`\`` : "No code written yet"}

[EVENT — what just happened]
${event}
${memoryContext}

CRITICAL: You have the FULL lesson content above. Reference SPECIFIC concepts, terms, and examples from it. Never say generic things like "good stuff" or "keep going." Always tie your response to the actual material.`;

    // Add language instruction if user chose a non-English language
    const langNames: Record<string, string> = { fr: "French", es: "Spanish", de: "German", hi: "Hindi", zh: "Mandarin", ja: "Japanese", it: "Italian", nl: "Dutch", pa: "Punjabi", pt: "Portuguese", ko: "Korean", ar: "Arabic", tr: "Turkish", ru: "Russian", ur: "Urdu" };
    const langInstruction = language && language !== "en"
      ? `\n\nLANGUAGE: The student prefers explanations in ${langNames[language] || language}. Respond primarily in ${langNames[language] || language} with key technical terms in English. If explaining code, use ${langNames[language] || language} for the explanation but keep code and variable names in English.`
      : "";

    const messages = [
      { role: "system", content: COACH_DIRECTIVE + intelligenceContext + langInstruction },
      ...((history as { role: string; content: string }[]) || []).map(
        (m: { role: string; content: string }) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        })
      ),
      { role: "user", content: userPrompt },
    ];

    // Primary: OpenRouter GPT-4o-mini (best quality/cost for tutoring)
    // Fallback: Kimi K2 Turbo (cheaper, faster, less personality)
    const useOpenRouter = !!OPENROUTER_API_KEY;
    const apiUrl = useOpenRouter ? OPENROUTER_URL : MOONSHOT_URL;
    const apiKey = useOpenRouter ? OPENROUTER_API_KEY : MOONSHOT_API_KEY;
    const model = useOpenRouter ? pickModel(courseTitle) : MOONSHOT_MODEL;
    const providerName = useOpenRouter ? `OpenRouter/${model.split("/")[1]}` : "Kimi";
    console.log(`[Coach] Using ${providerName} for "${courseTitle || "unknown course"}"`);

    if (apiKey) {
      try {
        const llmRes = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            ...(useOpenRouter ? { "HTTP-Referer": "https://kairos.ai", "X-Title": "Kairos.ai Coach" } : {}),
          },
          body: JSON.stringify({
            model,
            messages,
            stream: true,
            temperature: 0.7,
            max_tokens: 300,
          }),
        });

        if (!llmRes.ok) {
          const errText = await llmRes.text();
          console.error(`[Coach] ${providerName} error:`, llmRes.status, errText);
          // If OpenRouter fails, try Kimi as fallback
          if (useOpenRouter && MOONSHOT_API_KEY) {
            console.log("[Coach] Falling back to Kimi...");
            throw new Error(`${providerName} ${llmRes.status}`);
          }
          throw new Error(`${providerName} ${llmRes.status}`);
        }

        if (!llmRes.body) throw new Error("No body");

        // Transform SSE stream → plain text stream
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
        console.error(`[Coach] ${providerName} failed:`, err);

        // If OpenRouter failed, try Kimi as second fallback
        if (useOpenRouter && MOONSHOT_API_KEY) {
          try {
            const kimiRes = await fetch(MOONSHOT_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${MOONSHOT_API_KEY}` },
              body: JSON.stringify({ model: MOONSHOT_MODEL, messages, stream: true, temperature: 0.7, max_tokens: 300 }),
            });
            if (kimiRes.ok && kimiRes.body) {
              const reader = kimiRes.body.getReader();
              const decoder = new TextDecoder();
              const encoder = new TextEncoder();
              const stream = new ReadableStream({
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
                      try { const p = JSON.parse(data); const c = p.choices?.[0]?.delta?.content; if (c) controller.enqueue(encoder.encode(c)); } catch {}
                    }
                  }
                },
                cancel() { reader.cancel(); },
              });
              return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
            }
          } catch (kimiErr) {
            console.error("[Coach] Kimi fallback also failed:", kimiErr);
          }
        }
      }
    }

    // Final fallback: Gemini
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
