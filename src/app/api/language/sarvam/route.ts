import { NextRequest, NextResponse } from "next/server";
import { getLanguagePersona, getDefaultPersona, type ProficiencyLevel } from "@/lib/language-personas";
import { getConversationCheckpoint, buildResumeContext, updateConversationCheckpoint } from "@/lib/language-agent";
import type { ConversationCheckpoint } from "@/data/language-types";

const SARVAM_API_KEY = process.env.SARVAM_API_KEY || "";
const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY || "";
const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY || "";

// Languages routed to this orchestrated pipeline
// Hindi + Punjabi: Sarvam TTS has native voices
// Urdu: Sarvam doesn't support Urdu TTS, but we keep it here for Deepgram STT + LLM
const SARVAM_LANGUAGES = ['hi', 'pa'];

// Sarvam TTS speaker mapping — verified valid bulbul:v3 speakers
const SARVAM_SPEAKERS: Record<string, string> = {
  hi: 'priya',     // Hindi female voice
  pa: 'simran',    // Punjabi female voice
};

// Language code mapping for Sarvam TTS API
const SARVAM_TTS_LANG_MAP: Record<string, string> = {
  hi: 'hi-IN',
  pa: 'pa-IN',
};

// Languages where Deepgram Nova-3 supports STT
const DEEPGRAM_STT_LANGUAGES = ['hi', 'ur'];
// Languages where Sarvam saaras:v3 handles STT (Deepgram doesn't support Punjabi)
const SARVAM_STT_LANGUAGES = ['pa'];

/**
 * Transcribe audio — routes to Deepgram or Sarvam based on language support
 */
async function transcribeAudio(audioBlob: Blob, language: string): Promise<string> {
  if (SARVAM_STT_LANGUAGES.includes(language)) {
    return transcribeWithSarvam(audioBlob, language);
  }
  return transcribeWithDeepgram(await audioBlob.arrayBuffer(), language);
}

/**
 * Transcribe audio using Deepgram Nova-3 STT
 * Supports: hi, ur, and many other languages
 */
async function transcribeWithDeepgram(audioBuffer: ArrayBuffer, language: string): Promise<string> {
  if (!DEEPGRAM_API_KEY) throw new Error('Deepgram API key not configured');

  const response = await fetch(
    `https://api.deepgram.com/v1/listen?model=nova-3&language=${language}&smart_format=true`,
    {
      method: 'POST',
      headers: {
        Authorization: `Token ${DEEPGRAM_API_KEY}`,
        'Content-Type': 'audio/webm',
      },
      body: audioBuffer,
    }
  );

  if (!response.ok) {
    const err = await response.text();
    console.error('[Deepgram STT] Error:', err);
    throw new Error(`STT failed: ${response.status}`);
  }

  const data = await response.json();
  return data.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
}

/**
 * Transcribe audio using Sarvam saaras:v3 STT
 * Required for: Punjabi (pa) — not supported by Deepgram
 */
async function transcribeWithSarvam(audioBlob: Blob, language: string): Promise<string> {
  if (!SARVAM_API_KEY) throw new Error('Sarvam API key not configured');

  const sarvamLangMap: Record<string, string> = {
    hi: 'hi-IN',
    pa: 'pa-IN',
    ur: 'ur-IN',
  };

  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.webm');
  formData.append('model', 'saaras:v3');
  formData.append('language_code', sarvamLangMap[language] || 'hi-IN');

  const response = await fetch('https://api.sarvam.ai/speech-to-text', {
    method: 'POST',
    headers: {
      'api-subscription-key': SARVAM_API_KEY,
    },
    body: formData,
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('[Sarvam STT] Error:', err);
    throw new Error(`Sarvam STT failed: ${response.status}`);
  }

  const data = await response.json();
  return data.transcript || '';
}

/**
 * Call Moonshot (Kimi K2) to generate a conversational response
 */
async function generateLLMResponse(
  userMessage: string,
  language: string,
  personaId?: string,
  proficiencyLevel?: string,
  conversationHistory?: Array<{ role: string; content: string }>,
  modeContext?: string
): Promise<string> {
  if (!MOONSHOT_API_KEY) {
    console.warn('[Sarvam] No Moonshot API key, echoing input');
    return userMessage;
  }

  const persona = personaId
    ? getLanguagePersona(personaId) || getDefaultPersona(language)
    : getDefaultPersona(language);

  const level = (proficiencyLevel || 'A1') as ProficiencyLevel;
  const rule = persona.adaptiveRules.find(r => {
    const levels: ProficiencyLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const idx = levels.indexOf(level);
    const lo = levels.indexOf(r.levelRange[0]);
    const hi = levels.indexOf(r.levelRange[1]);
    return idx >= lo && idx <= hi;
  }) || persona.adaptiveRules[0];

  const systemPrompt = `${persona.systemPrompt}

ADAPTIVE RULES for ${level} student:
- Native language ratio: ${(rule.nativeLanguageRatio * 100).toFixed(0)}% English, ${((1 - rule.nativeLanguageRatio) * 100).toFixed(0)}% target language
- Correction intensity: ${rule.correctionIntensity}
- Speech speed: ${rule.speechSpeed}
- Vocabulary complexity: ${rule.vocabularyComplexity}

IMPORTANT: You are having a voice conversation. Keep responses natural, concise (1-3 sentences), and conversational. Respond primarily in the target language (${language}) mixed with English based on the native language ratio above.${modeContext ? '\n\n' + modeContext : ''}`;

  const messages: Array<{ role: string; content: string }> = [
    { role: 'system', content: systemPrompt },
  ];

  if (conversationHistory && conversationHistory.length > 0) {
    messages.push(...conversationHistory.slice(-10));
  }

  messages.push({ role: 'user', content: userMessage });

  const response = await fetch('https://api.moonshot.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${MOONSHOT_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'kimi-k2-turbo-preview',
      messages,
      temperature: 0.7,
      max_tokens: 150, // Keep short for voice — reduces latency
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('[Sarvam LLM] Moonshot error:', err);
    throw new Error(`LLM failed: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || userMessage;
}

/**
 * POST /api/language/sarvam
 *
 * Full orchestrated voice pipeline for Indic languages:
 * 1. Receives audio blob from browser MediaRecorder
 * 2. Transcribes via Deepgram Nova-3 STT
 * 3. Generates response via Moonshot LLM (Kimi K2)
 * 4. Synthesizes speech via Sarvam TTS (Bulbul v3)
 * 5. Returns transcript + response text + audio
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const language = formData.get('language') as string;
    const audioBlob = formData.get('audio') as Blob | null;
    const transcript = formData.get('transcript') as string | null;
    const personaId = formData.get('personaId') as string | null;
    const proficiencyLevel = formData.get('proficiencyLevel') as string | null;
    const historyJson = formData.get('conversationHistory') as string | null;
    const mode = (formData.get('mode') as string | null) || 'free-form';
    const userId = formData.get('userId') as string | null;
    const lessonVocab = formData.get('lessonVocab') as string | null;
    const lessonGrammar = formData.get('lessonGrammar') as string | null;
    const lessonPhrases = formData.get('lessonPhrases') as string | null;

    if (!language) {
      return NextResponse.json(
        { error: "Missing required field: language" },
        { status: 400 }
      );
    }

    if (!SARVAM_LANGUAGES.includes(language)) {
      return NextResponse.json(
        { error: `Language ${language} not routed to orchestrated pipeline.` },
        { status: 400 }
      );
    }

    // Parse conversation history
    let conversationHistory: Array<{ role: string; content: string }> | undefined;
    if (historyJson) {
      try { conversationHistory = JSON.parse(historyJson); } catch {}
    }

    // Step 1: Get transcript — either from audio (Deepgram/Sarvam STT) or direct text
    let userTranscript = transcript || '';
    if (audioBlob && audioBlob.size > 0) {
      userTranscript = await transcribeAudio(audioBlob, language);
    }

    if (!userTranscript.trim()) {
      return NextResponse.json({
        transcript: '',
        responseText: '',
        audioBase64: '',
      });
    }

    // Build mode-specific context
    let modeContext = '';

    if (mode === 'free-form' && userId) {
      const checkpoint = await getConversationCheckpoint(userId, language);
      if (checkpoint) {
        modeContext = buildResumeContext(checkpoint);
      } else {
        // Create initial checkpoint for returning users
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
        await updateConversationCheckpoint(userId, language, initialCheckpoint);
      }
    } else if (mode === 'placement') {
      modeContext = `## PLACEMENT TEST MODE
You are conducting a language placement assessment. Your goal is to EVALUATE the student's proficiency, NOT teach.
- Start with simple greetings and gradually increase complexity
- Test grammar, vocabulary, pronunciation awareness, and cultural knowledge
- Ask open-ended questions that reveal proficiency level
- Do NOT correct mistakes — just note them internally
- After 8-10 exchanges, assess their level (A1-C2) based on CEFR descriptors
- Keep a natural conversational tone — this should feel like a chat, not an exam`;
    } else if (mode === 'lesson-practice') {
      const vocab = lessonVocab ? JSON.parse(lessonVocab) : [];
      const grammar = lessonGrammar ? JSON.parse(lessonGrammar) : [];
      const phrases = lessonPhrases ? JSON.parse(lessonPhrases) : [];
      modeContext = `## LESSON PRACTICE MODE
Focus this conversation on practicing the current lesson material.
- Target vocabulary: ${vocab.join(', ') || 'General'}
- Grammar focus: ${grammar.join(', ') || 'General'}
- Target phrases: ${phrases.join(', ') || 'General'}
- Create scenarios where the student must use these words and structures
- Gently redirect if the conversation drifts too far from the lesson material`;
    }

    // Step 2: Generate LLM response via Moonshot
    const responseText = await generateLLMResponse(
      userTranscript,
      language,
      personaId || undefined,
      proficiencyLevel || undefined,
      conversationHistory,
      modeContext || undefined
    );

    // Step 3: Synthesize speech via Sarvam TTS (only hi/pa supported)
    let audioBase64 = '';
    const speaker = SARVAM_SPEAKERS[language];
    const targetLang = SARVAM_TTS_LANG_MAP[language];

    if (speaker && targetLang && SARVAM_API_KEY) {
      const ttsResponse = await fetch('https://api.sarvam.ai/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-subscription-key': SARVAM_API_KEY,
        },
        body: JSON.stringify({
          text: responseText,
          target_language_code: targetLang,
          speaker: speaker,
          model: 'bulbul:v3',
          pace: 1.0,
          speech_sample_rate: 22050,
          output_audio_codec: 'mp3',
        }),
      });

      if (!ttsResponse.ok) {
        const error = await ttsResponse.text();
        console.error('[Sarvam TTS] Error:', error);
      } else {
        const ttsData = await ttsResponse.json();
        audioBase64 = ttsData.audios?.[0] || '';
        if (!audioBase64) {
          // Sarvam Bulbul-v3 silent-output bug — 200 OK with empty audios.
          // Log so we have a signal when responses audibly fail.
          console.warn('[Sarvam TTS] empty audios — possible Bulbul-v3 silent output', {
            language, textLength: responseText.length,
          });
        }
      }
    } else {
      console.warn(`[Sarvam] No TTS support for language: ${language}`);
    }

    return NextResponse.json({
      transcript: userTranscript,
      responseText,
      audioBase64,
    });

  } catch (error) {
    console.error("[Sarvam Pipeline] Error:", error);
    return NextResponse.json(
      { error: "Processing failed", details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET /api/language/sarvam — health check
 */
export async function GET() {
  // Need at least Sarvam + Moonshot. Deepgram is needed for Hindi STT but not Punjabi.
  const healthy = !!SARVAM_API_KEY && !!MOONSHOT_API_KEY;
  return NextResponse.json({
    healthy,
    languages: SARVAM_LANGUAGES,
    sarvam_configured: !!SARVAM_API_KEY,
    moonshot_configured: !!MOONSHOT_API_KEY,
    deepgram_configured: !!DEEPGRAM_API_KEY,
  });
}
