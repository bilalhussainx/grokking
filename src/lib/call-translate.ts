// Streaming translation pipeline: STT → Translate → TTS
// Used by the call bridge to translate audio between two callers

const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY || "";
const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY || "";

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English", es: "Spanish", fr: "French", de: "German",
  it: "Italian", nl: "Dutch", ja: "Japanese",
};

const DEEPGRAM_TTS_VOICES: Record<string, string> = {
  en: "aura-2-thalia-en",
  es: "aura-2-diana-es",
  fr: "aura-2-agathe-fr",
  de: "aura-2-viktoria-de",
  it: "aura-2-livia-it",
  nl: "aura-2-rhea-nl",
  ja: "aura-2-izanami-ja",
};

/**
 * Translate text from one language to another using Moonshot (streaming).
 */
export async function translateText(
  text: string,
  fromLang: string,
  toLang: string
): Promise<string> {
  if (fromLang === toLang) return text;
  if (!text.trim()) return "";

  const fromName = LANGUAGE_NAMES[fromLang] || fromLang;
  const toName = LANGUAGE_NAMES[toLang] || toLang;

  const res = await fetch("https://api.moonshot.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MOONSHOT_API_KEY}`,
    },
    body: JSON.stringify({
      model: "kimi-k2-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a real-time translator. Translate the following ${fromName} text to ${toName}. Output ONLY the translation, nothing else. Keep it natural and conversational. Preserve tone and intent.`,
        },
        { role: "user", content: text },
      ],
      max_tokens: 200,
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    console.error("[CallTranslate] Translation failed:", res.status);
    return text; // Fallback: return original
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || text;
}

/**
 * Generate TTS audio from text using Deepgram.
 * Returns audio as ArrayBuffer (linear16 PCM).
 */
export async function textToSpeech(
  text: string,
  language: string
): Promise<ArrayBuffer | null> {
  if (!text.trim()) return null;

  const voice = DEEPGRAM_TTS_VOICES[language] || DEEPGRAM_TTS_VOICES.en;

  const res = await fetch(
    `https://api.deepgram.com/v1/speak?model=${voice}&encoding=mulaw&sample_rate=8000&container=none`,
    {
      method: "POST",
      headers: {
        Authorization: `Token ${DEEPGRAM_API_KEY}`,
        "Content-Type": "text/plain",
      },
      body: text,
    }
  );

  if (!res.ok) {
    console.error("[CallTranslate] TTS failed:", res.status);
    return null;
  }

  return res.arrayBuffer();
}

/**
 * Full pipeline: translate text and generate speech in target language.
 * Returns mulaw 8kHz audio buffer ready for Twilio.
 */
export async function translateAndSpeak(
  text: string,
  fromLang: string,
  toLang: string
): Promise<{ translatedText: string; audio: ArrayBuffer | null }> {
  const translatedText = await translateText(text, fromLang, toLang);
  const audio = await textToSpeech(translatedText, toLang);
  return { translatedText, audio };
}

export { LANGUAGE_NAMES, DEEPGRAM_TTS_VOICES };
