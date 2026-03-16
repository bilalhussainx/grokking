import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { deductCredits, CREDIT_COSTS } from "@/lib/credits";
import {
  getCoachPersona,
  getInterviewerPersona,
  getVoice,
  COACH_PERSONAS,
} from "@/lib/voice-personas";

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY || "";
const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY || "";

/**
 * Returns the Deepgram Voice Agent WebSocket config.
 * Supports persona and voice selection.
 * The browser connects directly to Deepgram's WSS endpoint.
 * Kimi K2 Turbo is the LLM brain (OpenAI-compatible).
 */
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ok = await deductCredits(user.id, CREDIT_COSTS.voice_session, "voice_session");
  if (!ok) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
  }

  if (!DEEPGRAM_API_KEY) {
    return Response.json({ error: "Deepgram API key not configured" }, { status: 500 });
  }

  const body = await req.json().catch(() => ({}));
  const {
    lessonTitle,
    moduleTitle,
    courseTitle,
    personaId,
    voiceId,
    mode = "coach", // "coach" | "interviewer"
    language = "en",
    lessonContext,
  } = body;

  // Select persona
  const persona =
    mode === "interviewer"
      ? getInterviewerPersona(personaId || "interviewer-mentor")
      : getCoachPersona(personaId || "alex");

  // Select voice — use native-accent voice for the selected language
  const LANGUAGE_VOICES: Record<string, string> = {
    en: "aura-2-thalia-en",
    es: "aura-2-diana-es",
    fr: "aura-2-agathe-fr",
    de: "aura-2-viktoria-de",
    it: "aura-2-livia-it",
    ja: "aura-2-izanami-ja",
    nl: "aura-2-rhea-nl",
    zh: "aura-2-izanami-ja", // TODO: Chinese-specific voice when available
    hi: "aura-2-thalia-en",  // Hindi uses Sarvam pipeline, not Deepgram TTS
  };
  const voice = getVoice(voiceId || persona.defaultVoice);
  const voiceModel = language !== "en"
    ? LANGUAGE_VOICES[language] || "aura-2-thalia-en"
    : voice.deepgramModel;

  // Language names for the system prompt
  const LANGUAGE_NAMES: Record<string, string> = {
    en: "English", es: "Spanish", fr: "French", de: "German",
    it: "Italian", ja: "Japanese", nl: "Dutch", hi: "Hindi", zh: "Mandarin Chinese",
  };
  const langName = LANGUAGE_NAMES[language] || "English";

  // Build context-aware prompt with full lesson material
  let contextPrompt = persona.systemPrompt;

  // Language instruction — teach in the selected language
  if (language !== "en") {
    contextPrompt += `\n\n## LANGUAGE INSTRUCTION\nThe student has chosen to learn in ${langName}. You MUST:\n- Speak and respond entirely in ${langName}\n- Explain all concepts in ${langName}\n- Use natural ${langName} phrasing and accent — do NOT read ${langName} words with English pronunciation\n- If the lesson content is in English, translate and explain it in ${langName}\n- Only use English for technical terms that have no good translation`;
  }

  if (lessonTitle) {
    contextPrompt += `\n\nCURRENT LESSON: ${courseTitle || "Course"} > ${moduleTitle || ""} > ${lessonTitle}`;
  }
  if (lessonContext?.content) {
    // Truncate to ~4000 chars to stay within prompt limits
    const content = lessonContext.content.slice(0, 4000);
    contextPrompt += `\n\n## LESSON MATERIAL\nThe student is studying the following lesson. Reference this material when teaching, explaining concepts, or answering questions:\n\n${content}`;
  }
  if (lessonContext?.starterCode) {
    contextPrompt += `\n\n## STARTER CODE\n\`\`\`\n${lessonContext.starterCode.slice(0, 1500)}\n\`\`\``;
  }
  if (lessonContext?.solutionCode) {
    contextPrompt += `\n\n## SOLUTION CODE (only reveal if student is truly stuck)\n\`\`\`\n${lessonContext.solutionCode.slice(0, 1500)}\n\`\`\``;
  }

  const greeting = persona.greeting(lessonTitle);

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
      language: language || "en",
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
          url: "https://api.moonshot.ai/v1/chat/completions",
          headers: {
            authorization: `Bearer ${MOONSHOT_API_KEY}`,
          },
        },
        prompt: contextPrompt,
      },
      speak: {
        provider: {
          type: "deepgram",
          model: voiceModel,
        },
      },
      greeting,
    },
  };

  return Response.json({
    url: "wss://agent.deepgram.com/v1/agent/converse",
    key: DEEPGRAM_API_KEY,
    settings,
    persona: { id: persona.id, name: persona.name },
    voice: { id: voice.id, name: voice.name },
  });
}
