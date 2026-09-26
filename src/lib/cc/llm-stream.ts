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
          "HTTP-Referer": "https://kairoslearn.com",
          "X-Title": "KairosLearn",
        },
        body: JSON.stringify({
          model: opts?.model || "anthropic/claude-sonnet-4-6",
          messages,
          stream: true,
          temperature: temp,
          max_tokens: maxTokens,
        }),
      });
      if (resp.ok && resp.body) {
        return { stream: parseSSEStream(resp.body), provider: "openrouter" };
      }
      console.error("[LLM] OpenRouter non-ok:", resp.status, await resp.text().catch(() => ""));
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

// Extract one JSON object from model output: tolerates ```json fences and
// leading/trailing prose; returns null for truncated or invalid JSON.
export function extractJsonObject<T>(text: string): T | null {
  const unfenced = text.replace(/^\s*```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");
  const start = unfenced.indexOf("{");
  const end = unfenced.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(unfenced.slice(start, end + 1)) as T;
  } catch {
    return null;
  }
}

// One JSON-object completion. Retries once on transient failures (429/5xx,
// network errors, unparseable output) and logs every failure reason; before
// this, every failure became a silent null and a blank 500 upstream.
// jsonMode asks the provider for a guaranteed JSON object; it's opt-in
// because OpenAI rejects json_object mode when no message mentions JSON.
export async function callLLMJSON<T>(
  messages: ChatMessage[],
  opts?: { temperature?: number; maxTokens?: number; label?: string; jsonMode?: boolean }
): Promise<T | null> {
  const temp = opts?.temperature ?? 0.3;
  const maxTokens = opts?.maxTokens ?? 1500;
  const apiKey = OPENROUTER_API_KEY || MOONSHOT_API_KEY;
  const apiUrl = OPENROUTER_API_KEY ? OPENROUTER_URL : MOONSHOT_URL;
  const model = OPENROUTER_API_KEY ? "openai/gpt-4o-mini" : MOONSHOT_MODEL;
  const tag = `[callLLMJSON${opts?.label ? `:${opts.label}` : ""}]`;

  if (!apiKey) {
    console.error(`${tag} no LLM API key configured`);
    return null;
  }

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const resp = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          ...(OPENROUTER_API_KEY ? { "HTTP-Referer": "https://kairoslearn.com" } : {}),
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: temp,
          max_tokens: maxTokens,
          ...(opts?.jsonMode && OPENROUTER_API_KEY ? { response_format: { type: "json_object" } } : {}),
        }),
      });
      if (!resp.ok) {
        console.error(`${tag} attempt ${attempt}: HTTP ${resp.status}`);
        if (resp.status === 429 || resp.status >= 500) continue;
        return null;
      }
      const data = await resp.json();
      const text: string = data.choices?.[0]?.message?.content || "";
      const parsed = extractJsonObject<T>(text);
      if (parsed !== null) return parsed;
      console.error(
        `${tag} attempt ${attempt}: unparseable output (finish=${data.choices?.[0]?.finish_reason}, chars=${text.length})`,
      );
    } catch (err) {
      console.error(`${tag} attempt ${attempt}: ${String(err).slice(0, 200)}`);
    }
  }
  return null;
}
