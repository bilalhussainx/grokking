export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function streamChat(
  messages: ChatMessage[],
  onChunk: (text: string) => void,
  signal?: AbortSignal
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return streamFallback(messages, onChunk, signal);

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://kairoslearn.ai",
      "X-Title": "Coach Kairos",
    },
    body: JSON.stringify({
      model: "anthropic/claude-sonnet-4-6",
      messages,
      stream: true,
      max_tokens: 1024,
      temperature: 0.7,
    }),
    signal,
  });

  if (!res.ok) {
    console.error("OpenRouter error:", res.status);
    return streamFallback(messages, onChunk, signal);
  }

  return readSSEStream(res, onChunk);
}

async function readSSEStream(
  res: Response,
  onChunk: (text: string) => void
): Promise<string> {
  const reader = res.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let full = "";
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      if (data === "[DONE]") continue;

      try {
        const parsed = JSON.parse(data);
        const delta = parsed.choices?.[0]?.delta?.content;
        if (delta) {
          full += delta;
          onChunk(delta);
        }
      } catch {
        // skip malformed chunks
      }
    }
  }

  return full;
}

async function streamFallback(
  messages: ChatMessage[],
  onChunk: (text: string) => void,
  signal?: AbortSignal
): Promise<string> {
  const moonshot = process.env.MOONSHOT_API_KEY;
  if (moonshot) {
    try {
      const res = await fetch("https://api.moonshot.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${moonshot}`,
        },
        body: JSON.stringify({
          model: "kimi-k2-0711-preview",
          messages,
          stream: true,
          max_tokens: 1024,
          temperature: 0.7,
        }),
        signal,
      });
      if (res.ok) return readSSEStream(res, onChunk);
    } catch {
      // fall through to Gemini
    }
  }

  const gemini = process.env.GEMINI_API_KEY;
  if (!gemini) throw new Error("No AI provider available");

  const geminiMessages = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.role === "system" ? `[System] ${m.content}` : m.content }],
  }));

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${gemini}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: geminiMessages }),
      signal,
    }
  );

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I had trouble responding. Try again?";
  onChunk(text);
  return text;
}

export async function chatOnce(messages: ChatMessage[]): Promise<string> {
  let result = "";
  await streamChat(messages, (chunk) => { result += chunk; });
  return result;
}
