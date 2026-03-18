import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { deductCredits } from "@/lib/credits";
import { getLanguagePersona, getDefaultPersona, type ProficiencyLevel } from "@/lib/language-personas";
import { buildAgentContext, getConversationCheckpoint, buildResumeContext, updateConversationCheckpoint } from "@/lib/language-agent";
import type { ConversationCheckpoint } from "@/data/language-types";

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY || "";
const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY || "";
const CREDIT_COST_VOICE_MINUTE = 3;

// Deepgram Aura-2 native language voices (verified model IDs)
// Each language gets a native-accent voice so TTS sounds like a real speaker
const DEEPGRAM_VOICES_FEMALE: Record<string, string> = {
  en: "aura-2-thalia-en",
  es: "aura-2-diana-es",       // Peninsular Spanish
  fr: "aura-2-agathe-fr",      // French female
  de: "aura-2-viktoria-de",    // German female
  it: "aura-2-livia-it",       // Italian female
  ja: "aura-2-izanami-ja",     // Japanese female
  nl: "aura-2-rhea-nl",        // Dutch female
};

const DEEPGRAM_VOICES_MALE: Record<string, string> = {
  en: "aura-2-orion-en",
  es: "aura-2-javier-es",      // Mexican Spanish male
  fr: "aura-2-hector-fr",      // French male
  de: "aura-2-julius-de",      // German male
  it: "aura-2-dionisio-it",    // Italian male
  ja: "aura-2-fujin-ja",       // Japanese male
  nl: "aura-2-sander-nl",      // Dutch male
};

/**
 * POST /api/language/voice-session
 *
 * Creates a Deepgram Voice Agent session for language learning.
 * Returns the same format as /api/ai/voice-session (url, key, settings)
 * so useDeepgramAgent can connect directly.
 */
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!DEEPGRAM_API_KEY) {
    return NextResponse.json({ error: "Deepgram API key not configured" }, { status: 500 });
  }

  const body = await req.json().catch(() => ({}));
  const {
    language,
    personaId,
    proficiencyLevel = "A1",
    lessonTitle,
    scenario,
    mode: rawMode,
    lessonContext: clientLessonContext,
  } = body as {
    language?: string;
    personaId?: string;
    proficiencyLevel?: string;
    lessonTitle?: string;
    scenario?: string;
    mode?: 'free-form' | 'lesson-practice' | 'placement';
    lessonContext?: { lessonId: string; lessonTitle: string; targetPhrases: string[]; vocabulary: string[]; grammarFocus: string[]; content?: string };
  };

  const mode = rawMode || (lessonTitle ? 'lesson-practice' : 'free-form');

  if (!language) {
    return NextResponse.json(
      { error: "Missing required field: language" },
      { status: 400 }
    );
  }

  // Deduct credits
  const ok = await deductCredits(user.id, CREDIT_COST_VOICE_MINUTE, "voice_session_start");
  if (!ok) {
    return NextResponse.json(
      { error: "Insufficient credits. Voice sessions cost 3 credits per minute." },
      { status: 402 }
    );
  }

  try {
    // Get persona
    const persona = personaId
      ? getLanguagePersona(personaId) || getDefaultPersona(language)
      : getDefaultPersona(language);
    const languageName = persona.languageName || language;

    // Resolve lesson context — prefer client-provided context (has vocab/grammar)
    const effectiveLessonContext = clientLessonContext
      ? clientLessonContext
      : lessonTitle
        ? {
            lessonId: "",
            lessonTitle,
            targetPhrases: [] as string[],
            vocabulary: [] as string[],
            grammarFocus: [] as string[],
          }
        : undefined;

    // Build RAG context (includes checkpoint automatically)
    const agentContext = await buildAgentContext({
      userId: user.id,
      targetLanguage: language,
      lessonContext: effectiveLessonContext,
      persona,
    });

    // Mode-specific system prompt additions
    let modePromptAddition = '';

    if (mode === 'free-form') {
      // Fetch checkpoint for free-form resume context
      const checkpoint = await getConversationCheckpoint(user.id, language);
      if (checkpoint) {
        modePromptAddition = buildResumeContext(checkpoint);
      } else if (agentContext.profile.totalPracticeMinutes > 0) {
        // User has practiced before but no checkpoint — create initial one
        const initialCheckpoint: ConversationCheckpoint = {
          schemaVersion: 1,
          lastTopicId: 'general-greeting',
          lastTopicName: 'Greetings and Introductions',
          topicProgress: 'started',
          nextTopicId: 'daily-routines',
          nextTopicName: 'Daily Routines',
          lastExchangeSummary: '',
          vocabInProgress: [],
          mistakePatterns: [],
          totalExchangesOnTopic: 0,
          lastSessionTimestamp: new Date().toISOString(),
        };
        await updateConversationCheckpoint(user.id, language, initialCheckpoint);
      }
    } else if (mode === 'placement') {
      modePromptAddition = `
## PLACEMENT TEST MODE
You are conducting a language placement assessment. Your goal is to EVALUATE the student's proficiency, NOT teach.
- Start with simple greetings and gradually increase complexity
- Test grammar, vocabulary, pronunciation awareness, and cultural knowledge
- Ask open-ended questions that reveal proficiency level
- Do NOT correct mistakes — just note them internally
- After 8-10 exchanges, assess their level (A1-C2) based on CEFR descriptors
- Keep a natural conversational tone — this should feel like a chat, not an exam`;
    } else if (mode === 'lesson-practice' && effectiveLessonContext) {
      const contentSnippet = (effectiveLessonContext as { content?: string }).content
        ? `\n- Lesson content the student is reading:\n${(effectiveLessonContext as { content?: string }).content!.slice(0, 1500)}`
        : '';
      modePromptAddition = `
## LESSON PRACTICE MODE
You are helping the student practice the current lesson material. Be proactive — guide them through the lesson.
- Lesson title: ${effectiveLessonContext.lessonTitle || 'Current lesson'}
- Target vocabulary: ${effectiveLessonContext.vocabulary.join(', ') || 'General'}
- Grammar focus: ${effectiveLessonContext.grammarFocus.join(', ') || 'General'}
- Target phrases: ${effectiveLessonContext.targetPhrases.join(', ') || 'General'}${contentSnippet}

APPROACH:
- After greeting, proactively introduce the lesson topic and teach key vocabulary
- Say each new word/phrase in the target language, then explain in English
- Ask the student to repeat after you
- Create mini-scenarios using the lesson vocabulary
- If the student speaks English, understand them and respond with a mix of English explanation + target language practice
- Keep a ratio: ~60% target language, ~40% English for A1/A2 students
- Be encouraging — celebrate attempts even if pronunciation isn't perfect`;
    }

    // Pick a native-language voice — must match the target language
    const lang = language as string;
    // Use persona's configured voice if available, otherwise default for language
    const personaVoiceId = persona.defaultVoice?.voiceId;
    const deepgramVoice = personaVoiceId
      || DEEPGRAM_VOICES_FEMALE[lang]
      || DEEPGRAM_VOICES_FEMALE.en;
    console.log(`[voice-session] Language: ${lang}, Voice: ${deepgramVoice}, Persona: ${persona.id}`);

    // Build greeting
    const level = proficiencyLevel as ProficiencyLevel;
    const userName = user.user_metadata?.full_name || undefined;
    const greeting = persona.greeting(level, userName);

    // Combine system prompt with mode-specific additions
    const fullSystemPrompt = agentContext.systemPromptContext
      + (modePromptAddition ? '\n' + modePromptAddition : '')
      + `\n\nIMPORTANT: Start the conversation with this greeting: "${greeting}". Say it naturally as your first response when the user connects.`
      + `\n\nSPEECH RECOGNITION NOTE: The student is a language learner. Their speech may be transcribed imperfectly — accented ${languageName} words may appear as English phonetic approximations. Be generous in interpreting what they say. If the transcription looks like a phonetic attempt at a ${languageName} word, acknowledge it as such and help with pronunciation. Never say "I didn't understand" — always try to work with what they said.`;

    // Build Deepgram Voice Agent settings (same format as Coach Alex)
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
            // Use 'multi' for advanced learners who mostly speak the target language
            // Use 'en' for beginners who mostly speak English with some target language
            language: (proficiencyLevel === "B2" || proficiencyLevel === "C1" || proficiencyLevel === "C2") ? "multi" : "en",
            // Lower endpointing threshold so STT doesn't wait too long for "perfect" speech
            endpointing: 300,
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
          prompt: fullSystemPrompt,
        },
        speak: {
          provider: {
            type: "deepgram",
            model: deepgramVoice,
          },
        },
      },
    };

    // Log session start
    await supabase
      .from("language_sessions")
      .insert({
        user_id: user.id,
        target_language: language,
        persona_id: persona.id,
        scenario: scenario || "free_practice",
        lesson_id: lessonTitle || null,
        duration_seconds: 0,
        transcript: [],
        mistakes_found: [],
        new_vocab: [],
        proficiency_delta: 0,
        agent_summary: "",
      })
      .then(() => {});

    // Return SAME format as /api/ai/voice-session
    return NextResponse.json({
      url: "wss://agent.deepgram.com/v1/agent/converse",
      key: DEEPGRAM_API_KEY,
      settings,
      persona: {
        id: persona.id,
        name: persona.name,
        greeting,
      },
      credits: {
        deducted: CREDIT_COST_VOICE_MINUTE,
        perMinute: CREDIT_COST_VOICE_MINUTE,
      },
    });
  } catch (error) {
    console.error("[Language Voice Session] Error:", error);

    // Refund credits on error
    await supabase.rpc("add_credits", {
      p_user_id: user.id,
      p_amount: CREDIT_COST_VOICE_MINUTE,
      p_action: "voice_session_refund",
    });

    return NextResponse.json(
      { error: "Failed to start voice session", details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET /api/language/voice-session/health
 */
export async function GET() {
  return NextResponse.json({
    healthy: !!DEEPGRAM_API_KEY && !!MOONSHOT_API_KEY,
    services: {
      deepgram: !!DEEPGRAM_API_KEY,
      moonshot: !!MOONSHOT_API_KEY,
    },
  });
}
