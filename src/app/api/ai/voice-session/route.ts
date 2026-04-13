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

// Force Node.js runtime — this route uses dynamic imports of node-only libs
// (e.g. @/lib/agent-intelligence, @/lib/trace) that fail under Edge.
export const runtime = "nodejs";
// Disable caching — guest sessions must always hit the handler fresh
export const dynamic = "force-dynamic";

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY || "";
const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY || "";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

// Voice agent LLM brain — OpenRouter primary, Kimi fallback.
// Defaults to Claude Sonnet 4.5 for the most natural voice (Kimi sounds robotic).
// Override per-deployment via OPENROUTER_VOICE_MODEL env var if needed.
const VOICE_LLM_MODEL = process.env.OPENROUTER_VOICE_MODEL || "anthropic/claude-sonnet-4.5";

// Handle CORS preflight — browsers send OPTIONS before POST with credentials
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

// Some clients/proxies probe with GET — return 200 with a hint instead of 405
export async function GET() {
  return NextResponse.json(
    { ok: true, hint: "POST to start a voice session" },
    { status: 200 }
  );
}

/**
 * Returns the Deepgram Voice Agent WebSocket config.
 * Supports persona and voice selection.
 * The browser connects directly to Deepgram's WSS endpoint.
 * Kimi K2 Turbo is the LLM brain (OpenAI-compatible).
 */
export async function POST(req: NextRequest) {
  console.log("[voice-session] POST received");
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  console.log("[voice-session] auth check:", user ? `user=${user.id.slice(0, 8)}` : "guest");

  // Allow guest access for trial sessions — skip credit deduction
  if (user) {
    const ok = await deductCredits(user.id, CREDIT_COSTS.voice_session, "voice_session");
    if (!ok) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
    }
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
    // Interview mode extras
    companyPersonaId,
    questionPlan,
    interviewType,
    // College vertical (spec: 2026-04-07-college-admissions-interviews-design.md)
    category,                  // "tech" | "college"
    collegePersonaId,
    applicantProfile,
  } = body;

  // For college interviews, force English voice. The spec says the interview
  // is conducted in English (matches reality); only the post-interview
  // scorecard is translated to the user's chosen language.
  const effectiveLanguage = (mode === "interviewer" && category === "college") ? "en" : language;

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
  const voiceModel = effectiveLanguage !== "en"
    ? LANGUAGE_VOICES[effectiveLanguage] || "aura-2-thalia-en"
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

  // Fetch engagement signals for coach enthusiasm (authenticated users only)
  let enthusiasmModifier = "";
  if (user) try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayISO = todayStart.toISOString();

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

  // RAG Intelligence — fetch full user context from database (authenticated users only)
  let userProfileContext = "";
  if (user) try {
    const { fetchUserIntelligence } = await import("@/lib/agent-intelligence");
    const intel = await fetchUserIntelligence(user.id);
    userProfileContext = `\n${intel.promptContext}\n`;
  } catch {
    // Fallback to basic profile
    try {
      const { data: userProfile } = await supabase
        .from("user_profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();
      if (userProfile?.full_name) {
        userProfileContext = `\n## STUDENT: ${userProfile.full_name}. Use their name.\n`;
      }
    } catch {}
  }

  // Build context-aware prompt with full lesson material
  let contextPrompt = persona.systemPrompt + enthusiasmModifier + userProfileContext;

  // ── Interview mode: prepend company OR college persona + code-mixing adapter ──
  // (Spec: 2026-04-07-multilingual-interviews-design.md and ...college-admissions...)
  if (mode === "interviewer" && category === "college" && collegePersonaId) {
    // ─── College admissions interview ───
    try {
      const { getCollegePersona } = await import("@/data/college-interviewer-personas");
      const { buildCollegePersonaPrompt, loadCollegeSessionContext } = await import(
        "@/lib/college-interview-prompt-builders"
      );
      const collegePersona = getCollegePersona(collegePersonaId);
      if (collegePersona) {
        const sessionCtx = user
          ? await loadCollegeSessionContext(user.id, collegePersona.id, collegePersona.school)
          : undefined;
        const collegeBlock = buildCollegePersonaPrompt(collegePersona, applicantProfile, sessionCtx);
        contextPrompt = collegeBlock + "\n\n" + userProfileContext;
      }
    } catch (e) {
      console.error("[voice-session] Failed to build college persona prompt, falling back:", e);
    }
  } else if (mode === "interviewer" && companyPersonaId) {
    try {
      const { getCompanyPersona } = await import("@/data/interview-personas");
      const { buildInterviewerSystemPrompt } = await import("@/lib/interview-prompt-builders");
      const companyPersona = getCompanyPersona(companyPersonaId);
      const interviewerBlock = buildInterviewerSystemPrompt(companyPersona, language);
      // Replace the base coach/interviewer persona prompt with the company-specific
      // interviewer block — the company persona is more specific and should win.
      contextPrompt = interviewerBlock + "\n\n" + enthusiasmModifier + userProfileContext;
    } catch (e) {
      console.error("[voice-session] Failed to build company persona prompt, falling back:", e);
      // Fall through to the existing default interviewer prompt
    }
  } else if (mode === "interviewer" && language !== "en") {
    // No company persona, but non-English language — still apply code-mixing adapter
    try {
      const { getInterviewerCodeMixingPrompt } = await import("@/lib/interview-prompt-builders");
      const codeMixBlock = getInterviewerCodeMixingPrompt(language);
      if (codeMixBlock) contextPrompt += "\n\n" + codeMixBlock;
    } catch (e) {
      console.error("[voice-session] Failed to apply code-mixing adapter:", e);
    }
  }

  // Append the question plan when provided (interviewer mode only)
  if (mode === "interviewer" && questionPlan) {
    try {
      const planJson = typeof questionPlan === "string" ? questionPlan : JSON.stringify(questionPlan);
      contextPrompt += `\n\n## QUESTION PLAN\nUse this as the structure for the interview. Adapt follow-ups based on the candidate's answers — do not robotically read them in order. Question text is in English; render it in ${language === "en" ? "English" : "the target language with code-mixing"} when speaking.\n\nInterview type: ${interviewType || "technical"}\n\n${planJson}`;
    } catch {
      // Ignore plan formatting errors
    }
  }

  // Language instruction — teach in the selected language
  if (language !== "en") {
    contextPrompt += `\n\n## LANGUAGE INSTRUCTION\nThe student has chosen to learn in ${langName}. You MUST:\n- Speak and respond entirely in ${langName}\n- Explain all concepts in ${langName}\n- Use natural ${langName} phrasing and accent — do NOT read ${langName} words with English pronunciation\n- If the lesson content is in English, translate and explain it in ${langName}\n- Only use English for technical terms that have no good translation`;
  }

  if (lessonTitle) {
    contextPrompt += `\n\nCURRENT LESSON: ${courseTitle || "Course"} > ${moduleTitle || ""} > ${lessonTitle}`;
  }

  // Proactive teaching instruction
  contextPrompt += `\n\n## PROACTIVE BEHAVIOR (CRITICAL)
You are NOT a passive assistant waiting for questions. You are an ACTIVE tutor. After greeting:
1. Immediately reference the current lesson topic by name
2. Ask the student a thought-provoking question about the material
3. If they seem stuck or silent for a moment, offer to explain the next concept
4. Keep the conversation flowing — always end with a question or a "let's try..."
5. Keep responses to 1-2 sentences for voice. Short and punchy.
Never say "How can I help?" — instead say "So in this lesson we're looking at [topic]. What's your take on [concept]?"`;

  // CRITICAL: No markdown in voice output — TTS reads asterisks/hashes literally
  contextPrompt += `\n\n## OUTPUT FORMAT (CRITICAL — VOICE MODE)
Your responses will be spoken aloud by a text-to-speech engine. You MUST:
- NEVER use markdown formatting: no **bold**, no *italic*, no # headings, no - bullet lists, no \`code backticks\`, no numbered lists with "1."
- Write in plain, natural spoken English (or the target language). Just sentences and paragraphs.
- For emphasis, use word choice and phrasing — not formatting symbols.
- For code references, say them naturally: "the two sum function" not "\`twoSum\`".
- For lists, use natural speech: "First... Second... Third..." not "1. ... 2. ... 3. ..."
- This is a real-time voice conversation. Sound human, not like a document.`;

  if (lessonContext?.content) {
    const content = lessonContext.content.slice(0, 4000);
    contextPrompt += `\n\n## LESSON MATERIAL (USE THIS — the student is reading this right now)\n${content}`;
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
      listen: {
        provider: {
          type: "deepgram",
          model: "nova-3",
        },
      },
      // OpenRouter primary (Claude Sonnet 4.5 — natural conversation),
      // Kimi/Moonshot fallback if OPENROUTER_API_KEY is missing.
      // Spec: 2026-04-07-llm-router-design (Coach Alex parity)
      think: OPENROUTER_API_KEY
        ? {
            provider: {
              type: "open_ai",
              model: VOICE_LLM_MODEL,
            },
            endpoint: {
              url: "https://openrouter.ai/api/v1/chat/completions",
              headers: {
                authorization: `Bearer ${OPENROUTER_API_KEY}`,
              },
            },
            prompt: contextPrompt,
          }
        : {
            provider: {
              type: "open_ai",
              model: "kimi-k2-turbo-preview",
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

  // Trace voice session start (authenticated users only)
  if (user) import("@/lib/trace").then(({ traceGeneration }) => {
    traceGeneration({
      userId: user.id,
      name: "coach-voice-session",
      model: OPENROUTER_API_KEY ? `deepgram-agent/openrouter/${VOICE_LLM_MODEL}` : "deepgram-agent/kimi-k2",
      input: {
        systemPrompt: contextPrompt.slice(0, 2000),
        userMessage: `Voice session started: ${lessonTitle || "no lesson"}`,
        lessonTitle: lessonTitle || undefined,
        courseTitle: courseTitle || undefined,
      },
      metadata: {
        voiceModel,
        language,
        personaId: persona.id,
        hasLessonContent: !!lessonContext?.content,
      },
    });
  }).catch(() => {});

  return Response.json({
    url: "wss://agent.deepgram.com/v1/agent/converse",
    key: DEEPGRAM_API_KEY,
    settings,
    persona: { id: persona.id, name: persona.name },
    voice: { id: voice.id, name: voice.name },
  });
}
