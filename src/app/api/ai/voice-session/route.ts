import { NextRequest } from "next/server";

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY || "";
const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY || "";

const COACH_PROMPT = `You are Coach Alex, an encouraging and intelligent AI coding tutor embedded in the Grokking learning platform.

YOUR PERSONALITY:
- Warm, encouraging, but never patronizing
- You celebrate wins genuinely
- You give progressive hints — never the full answer on first ask
- You speak concisely (1-2 sentences typical, max 120 characters for voice)
- You adapt to the student's skill level based on their code
- You use casual, friendly language — like a supportive senior developer

RULES:
- NEVER give the full solution directly unless explicitly asked after 3+ hints
- Keep responses SHORT — 1-2 sentences for voice
- Reference the specific problem/pattern they're working on
- When speaking via voice, keep answers EXTRA short
- Do not use markdown formatting, code blocks, or special characters
- Use plain conversational language suitable for text-to-speech`;

/**
 * Returns the Deepgram Voice Agent WebSocket config.
 * The browser connects directly to Deepgram's WSS endpoint.
 * Kimi K2 Turbo is the LLM brain (OpenAI-compatible).
 */
export async function POST(req: NextRequest) {
  if (!DEEPGRAM_API_KEY) {
    return Response.json({ error: "Deepgram API key not configured" }, { status: 500 });
  }

  const body = await req.json().catch(() => ({}));
  const { lessonTitle, moduleTitle, courseTitle } = body;

  const contextPrompt = lessonTitle
    ? `${COACH_PROMPT}\n\nCURRENT LESSON: ${courseTitle || "Coding"} > ${moduleTitle || ""} > ${lessonTitle}`
    : COACH_PROMPT;

  // Build the Deepgram Voice Agent settings
  const settings = {
    type: "Settings",
    audio: {
      input: {
        encoding: "linear16",
        sample_rate: 16000,
      },
      output: {
        encoding: "linear16",
        sample_rate: 24000,
        container: "none",
      },
    },
    agent: {
      language: "en",
      listen: {
        provider: {
          type: "deepgram",
          model: "nova-3",
        },
      },
      think: {
        provider: {
          type: "open_ai",
          model: "kimi-k2-turbo-preview",
          temperature: 0.7,
        },
        endpoint: {
          url: "https://api.moonshot.ai/v1",
          headers: {
            authorization: `Bearer ${MOONSHOT_API_KEY}`,
          },
        },
        prompt: contextPrompt,
      },
      speak: {
        provider: {
          type: "deepgram",
          model: "aura-2-odysseus-en",
        },
      },
      greeting: lessonTitle
        ? `Hey! Ready to work on ${lessonTitle}?`
        : "Hey! Ready to code together?",
    },
  };

  return Response.json({
    url: "wss://agent.deepgram.com/v1/agent/converse",
    key: DEEPGRAM_API_KEY,
    settings,
  });
}
