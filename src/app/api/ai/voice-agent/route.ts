import { NextRequest } from "next/server";

const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || "";
const VOICE_ID = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID || "Cz0K1kOv9tD8l0b5Qu53";

// Cache agent ID in memory so we don't recreate every session
let cachedAgentId: string | null = null;

const COACH_PROMPT = `You are Coach Alex, an encouraging and intelligent AI coding tutor embedded in the Grokking learning platform.

YOUR PERSONALITY:
- Warm, encouraging, but never patronizing
- You celebrate wins genuinely
- You give progressive hints — never the full answer on first ask
- You speak concisely (1-2 sentences typical)
- You adapt to the student's skill level
- You use casual, friendly language — like a supportive senior developer

RULES:
- NEVER give the full solution directly unless explicitly asked after 3+ hints
- Keep responses SHORT — 1-3 sentences for voice conversation
- Reference the specific problem/pattern they're working on
- Do not use markdown formatting, code blocks, or special characters
- Use plain conversational language suitable for text-to-speech
- When the student shares code context, reference it specifically`;

async function getOrCreateAgent(lessonContext?: {
  lessonTitle?: string;
  moduleTitle?: string;
  courseTitle?: string;
}): Promise<string> {
  // If we have a cached agent, return it
  if (cachedAgentId) return cachedAgentId;

  const contextLine = lessonContext?.lessonTitle
    ? `\n\nCURRENT LESSON: ${lessonContext.courseTitle || "Coding"} > ${lessonContext.moduleTitle || ""} > ${lessonContext.lessonTitle}`
    : "";

  const greeting = lessonContext?.lessonTitle
    ? `Hey! Ready to work on ${lessonContext.lessonTitle}?`
    : "Hey! Ready to code together?";

  const res = await fetch("https://api.elevenlabs.io/v1/convai/agents/create", {
    method: "POST",
    headers: {
      "xi-api-key": ELEVENLABS_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Coach Alex - Grokking",
      conversation_config: {
        agent: {
          prompt: {
            prompt: COACH_PROMPT + contextLine,
          },
          first_message: greeting,
          language: "en",
        },
        tts: {
          voice_id: VOICE_ID,
        },
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[VoiceAgent] Create agent error:", res.status, err);
    throw new Error(`Failed to create agent: ${res.status}`);
  }

  const data = await res.json();
  cachedAgentId = data.agent_id;
  console.log("[VoiceAgent] Created agent:", cachedAgentId);
  return cachedAgentId!;
}

async function getSignedUrl(agentId: string): Promise<string> {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`,
    {
      method: "GET",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
      },
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("[VoiceAgent] Signed URL error:", res.status, err);
    throw new Error(`Failed to get signed URL: ${res.status}`);
  }

  const data = await res.json();
  return data.signed_url;
}

/**
 * POST /api/ai/voice-agent
 * Creates an ElevenLabs conversational agent (if needed) and returns a signed URL.
 * The client uses this with @elevenlabs/react useConversation hook.
 */
export async function POST(req: NextRequest) {
  if (!ELEVENLABS_API_KEY) {
    return Response.json(
      { error: "ElevenLabs API key not configured" },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => ({}));

  try {
    const agentId = await getOrCreateAgent(body);
    const signedUrl = await getSignedUrl(agentId);

    return Response.json({ signedUrl, agentId });
  } catch (err) {
    console.error("[VoiceAgent] Error:", err);
    // If cached agent is stale, clear and retry once
    if (cachedAgentId) {
      cachedAgentId = null;
      try {
        const agentId = await getOrCreateAgent(body);
        const signedUrl = await getSignedUrl(agentId);
        return Response.json({ signedUrl, agentId });
      } catch (retryErr) {
        return Response.json(
          { error: "Failed to create voice session" },
          { status: 500 }
        );
      }
    }
    return Response.json(
      { error: "Failed to create voice session" },
      { status: 500 }
    );
  }
}
