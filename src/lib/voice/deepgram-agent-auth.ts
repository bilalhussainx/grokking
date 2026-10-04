// The browser talks to Deepgram's Voice Agent directly, and it sends the agent
// settings itself. So neither the Deepgram key nor any LLM key may reach it:
// - auth: a short-lived token from /v1/auth/grant (needs a Member-role key);
// - think: a Deepgram-hosted model, so no LLM endpoint or key is in settings.
// There is no raw-key fallback. If the grant fails, voice is unavailable.

export type DeepgramClientAuth = { scheme: "bearer"; value: string };

const GRANT_URL = "https://api.deepgram.com/v1/auth/grant";
const TOKEN_TTL_SECONDS = 30; // only has to outlive the WebSocket handshake

export async function mintDeepgramClientAuth(apiKey: string): Promise<DeepgramClientAuth | null> {
  if (!apiKey) return null;
  try {
    const res = await fetch(GRANT_URL, {
      method: "POST",
      headers: { Authorization: `Token ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ttl_seconds: TOKEN_TTL_SECONDS }),
    });
    if (!res.ok) {
      console.error(`[deepgram-auth] grant failed with ${res.status}; the key needs the Member role`);
      return null;
    }
    const json = (await res.json()) as { access_token?: unknown };
    return typeof json.access_token === "string" && json.access_token
      ? { scheme: "bearer", value: json.access_token }
      : null;
  } catch (err) {
    console.error("[deepgram-auth] grant request failed", err instanceof Error ? err.message : "");
    return null;
  }
}

// Deepgram-hosted Anthropic models (verified 2026-10-04 against the agent API).
// Haiku for the real-time coach (first token fastest); Sonnet elsewhere.
export const DEEPGRAM_THINK_MODEL_FAST = process.env.DEEPGRAM_THINK_MODEL_FAST || "claude-haiku-4-5";
export const DEEPGRAM_THINK_MODEL = process.env.DEEPGRAM_THINK_MODEL || "claude-sonnet-4-5";

export function managedThink(prompt: string, model: string = DEEPGRAM_THINK_MODEL) {
  return { provider: { type: "anthropic", model }, prompt };
}

export const VOICE_UNAVAILABLE = { error: "Voice is temporarily unavailable. Text chat still works." };
