import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { deductCredits, CREDIT_COSTS } from "@/lib/credits";
import {
  getCoachPersona,
  getInterviewerPersona,
  getVoice,
  COACH_PERSONAS,
} from "@/lib/voice-personas";
import { getCoachEnthusiasm } from "@/lib/rewards";

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY || "";
const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY || "";

/**
 * Returns the Deepgram Voice Agent WebSocket config.
 * Supports persona and voice selection.
 * The browser connects directly to Deepgram's WSS endpoint.
 * Kimi K2 Turbo is the LLM brain (OpenAI-compatible).
 * 
 * FIXED ISSUES:
 * 1. Changed agent.think.prompt to agent.think.instructions (correct Deepgram API format)
 * 2. Added proactive behavior instructions
 * 3. Improved lesson context injection
 * 4. Fixed multi-language handling
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

  // Select voice — native-accent voice per language (Deepgram Aura-2 catalog)
  const LANGUAGE_VOICES: Record<string, string> = {
    en: "aura-2-thalia-en",
    es: "aura-2-diana-es",
    fr: "aura-2-agathe-fr",
    de: "aura-2-viktoria-de",
    it: "aura-2-livia-it",
    ja: "aura-2-izanami-ja",
    nl: "aura-2-rhea-nl",
    // Indic languages — Deepgram Agent uses English voice as carrier;
    // the LLM generates text in the target language which Deepgram speaks.
    // For higher quality, these should use Sarvam TTS pipeline.
    hi: "aura-2-thalia-en",
    bn: "aura-2-thalia-en",
    ta: "aura-2-thalia-en",
    te: "aura-2-thalia-en",
    gu: "aura-2-thalia-en",
    kn: "aura-2-thalia-en",
    ml: "aura-2-thalia-en",
    mr: "aura-2-thalia-en",
    pa: "aura-2-thalia-en",
    od: "aura-2-thalia-en",
  };
  const voice = getVoice(voiceId || persona.defaultVoice);
  const voiceModel = language !== "en"
    ? LANGUAGE_VOICES[language] || "aura-2-thalia-en"
    : voice.deepgramModel;

  // Language names for the system prompt
  const LANGUAGE_NAMES: Record<string, string> = {
    en: "English", es: "Spanish", fr: "French", de: "German",
    it: "Italian", ja: "Japanese", nl: "Dutch",
    hi: "Hindi", bn: "Bengali", ta: "Tamil", te: "Telugu",
    gu: "Gujarati", kn: "Kannada", ml: "Malayalam", mr: "Marathi",
    pa: "Punjabi", od: "Odia",
  };
  const langName = LANGUAGE_NAMES[language] || "English";

  // Fetch engagement signals for coach enthusiasm
  let enthusiasmModifier = "";
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayISO = todayStart.toISOString();

    // Parallel DB queries (was sequential — saved 50-100ms)
    const [lessonsResult, profileResult, xpResult] = await Promise.all([
      supabase.from("xp_transactions").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("action", "lesson_complete").gte("created_at", todayISO),
      supabase.from("user_profiles").select("login_streak").eq("id", user.id).single(),
      supabase.from("xp_transactions").select("xp_amount").eq("user_id", user.id).gte("created_at", todayISO),
    ]);
    const lessonsToday = lessonsResult.count;
    const profileData = profileResult.data;
    const xpRows = xpResult.data;

    const xpToday = (xpRows || []).reduce((sum: number, r: { xp_amount: number }) => sum + (r.xp_amount || 0), 0);

    // Estimate minutes active from transaction count (rough: 3 min per transaction)
    const totalTransactions = (xpRows || []).length;
    const minutesActive = totalTransactions * 3;

    const enthusiasm = getCoachEnthusiasm({
      lessonsToday: lessonsToday || 0,
      streakDays: profileData?.login_streak || 0,
      xpToday,
      minutesActive,
    });

    enthusiasmModifier = enthusiasm.modifier;
  } catch {
    // silently continue without enthusiasm modifier
  }

  // Build context-aware prompt with full lesson material
  let systemInstructions = persona.systemPrompt + enthusiasmModifier;

  // ✅ FIX #1: Add proactive behavior instructions
  systemInstructions += `\n\n## PROACTIVE BEHAVIOR
You are a PROACTIVE tutor. Do NOT wait passively for questions. Instead:
- After greeting, immediately reference the current lesson and ask what they'd like to start with
- If they seem stuck or silent for >3 seconds, offer a hint or ask if they need help
- Regularly check understanding by asking questions
- Reference the lesson material naturally in conversation
- Guide them through concepts step-by-step without being asked
- Be conversational and encouraging, like a real human tutor`;

  // Language instruction — teach in the selected language
  if (language !== "en") {
    systemInstructions += `\n\n## LANGUAGE INSTRUCTION
The student has chosen to learn in ${langName}. You MUST:
- Speak and respond entirely in ${langName}
- Explain all concepts in ${langName}
- Use natural ${langName} phrasing and accent
- If the lesson content is in English, translate and explain it in ${langName}
- Only use English for technical terms that have no good translation
- Be as fluent and natural as a native ${langName} speaker`;
  }

  // ✅ FIX #2: Better context injection with clear sections
  if (lessonTitle) {
    systemInstructions += `\n\n## CURRENT LESSON CONTEXT
Course: ${courseTitle || "Unknown"}
Module: ${moduleTitle || "Unknown"}  
Lesson: ${lessonTitle}

YOU MUST reference this lesson when teaching. The student is currently working on "${lessonTitle}". Start by asking what part of this lesson they want to explore.`;
  }

  if (lessonContext?.content) {
    // Truncate to ~4000 chars to stay within prompt limits
    const content = lessonContext.content.slice(0, 4000);
    systemInstructions += `\n\n## LESSON MATERIAL
This is the lesson content the student is studying. Reference specific parts of this material when teaching:

${content}

IMPORTANT: When the student asks about this lesson, quote or reference specific parts of the material above. Don't say "I don't have the lesson content" - you DO have it above!`;
  }

  if (lessonContext?.starterCode) {
    systemInstructions += `\n\n## STARTER CODE
The student has this starter code:
\`\`\`
${lessonContext.starterCode.slice(0, 1500)}
\`\`\`

Reference this code when explaining concepts. Ask them what they're trying to implement.`;
  }

  if (lessonContext?.solutionCode) {
    systemInstructions += `\n\n## SOLUTION CODE (ONLY reveal if student is truly stuck after multiple attempts)
\`\`\`
${lessonContext.solutionCode.slice(0, 1500)}
\`\`\`

Only show this if they explicitly ask for the solution after struggling.`;
  }

  // ✅ FIX #3: More engaging greeting that references lesson
  const lessonRef = lessonTitle ? ` I see you're working on "${lessonTitle}" - ` : " ";
  const greeting = lessonTitle
    ? `${persona.greeting("")}${lessonRef}What would you like to start with?`
    : persona.greeting(lessonTitle);

  // ✅ FIX #4: Use correct Deepgram API format - "instructions" not "prompt"
  // Reference: https://developers.deepgram.com/docs/voice-agent-api
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
          endpointing: 150,  // ms of silence before considering user finished
        },
      },
      think: {
        provider: {
          type: "open_ai",
          model: "kimi-k2-turbo-preview",
          temperature: 0.6,  // Slightly higher for more natural responses
        },
        endpoint: {
          url: "https://api.moonshot.ai/v1/chat/completions",
          headers: {
            authorization: `Bearer ${MOONSHOT_API_KEY}`,
          },
        },
        // ✅ CRITICAL FIX: Use "instructions" not "prompt"
        instructions: systemInstructions,
        // Optional: Add few-shot examples for better context loading
        functions: [],  // Can add function calling later for interactive exercises
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
