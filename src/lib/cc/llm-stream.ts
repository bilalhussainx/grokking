const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY || "";
const MOONSHOT_URL = "https://api.moonshot.ai/v1/chat/completions";
const MOONSHOT_MODEL = "kimi-k2-turbo-preview";

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export function parseSSEStream(body: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
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

export async function collectStream(body: ReadableStream<Uint8Array>): Promise<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let result = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += decoder.decode(value, { stream: true });
  }
  return result;
}

export async function streamLLM(
  messages: ChatMessage[],
  opts?: { temperature?: number; maxTokens?: number; model?: string }
): Promise<{ stream: ReadableStream<Uint8Array>; provider: string } | null> {
  const temp = opts?.temperature ?? 0.7;
  const maxTokens = opts?.maxTokens ?? 400;

  if (OPENROUTER_API_KEY) {
    try {
      const resp = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://kairos.ai",
          "X-Title": "Kairos.ai",
        },
        body: JSON.stringify({
          model: opts?.model || "openai/gpt-4o-mini",
          messages,
          stream: true,
          temperature: temp,
          max_tokens: maxTokens,
        }),
      });
      if (resp.ok && resp.body) {
        return { stream: parseSSEStream(resp.body), provider: "openrouter" };
      }
    } catch (err) {
      console.error("[LLM] OpenRouter failed:", err);
    }
  }

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
          temperature: temp,
          max_tokens: maxTokens,
        }),
      });
      if (resp.ok && resp.body) {
        return { stream: parseSSEStream(resp.body), provider: "moonshot" };
      }
    } catch (err) {
      console.error("[LLM] Moonshot failed:", err);
    }
  }

  try {
    const { getGeminiModel } = await import("@/lib/gemini");
    const systemMsg = messages.find((m) => m.role === "system")?.content || "";
    const model = getGeminiModel(systemMsg);
    const history = messages
      .filter((m) => m.role !== "system")
      .slice(0, -1)
      .map((m) => ({
        role: (m.role === "assistant" ? "model" : "user") as "model" | "user",
        parts: [{ text: m.content }],
      }));
    const userMsg = messages[messages.length - 1]?.content || "";
    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(userMsg);
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
    return { stream, provider: "gemini" };
  } catch (err) {
    console.error("[LLM] Gemini failed:", err);
  }

  return null;
}

export async function callLLMJSON<T>(
  messages: ChatMessage[],
  opts?: { temperature?: number; maxTokens?: number }
): Promise<T | null> {
  const temp = opts?.temperature ?? 0.3;
  const maxTokens = opts?.maxTokens ?? 1500;
  const apiKey = OPENROUTER_API_KEY || MOONSHOT_API_KEY;
  const apiUrl = OPENROUTER_API_KEY ? OPENROUTER_URL : MOONSHOT_URL;
  const model = OPENROUTER_API_KEY ? "openai/gpt-4o-mini" : MOONSHOT_MODEL;

  if (!apiKey) return null;

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
        messages,
        temperature: temp,
        max_tokens: maxTokens,
      }),
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    const text = data.choices?.[0]?.message?.content || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    return JSON.parse(jsonMatch[0]) as T;
  } catch {
    return null;
  }
}
