// Voice Provider Router — Deepgram-First Architecture
// Primary: Deepgram STT (Nova-3) + TTS (Aura-2) + Moonshot API (Kimi K2)
// Fallback TTS: Sarvam (Punjabi/Hindi)
// Self-hosted (Whisper + Kokoro) deferred to Phase 3

import type { ProficiencyLevel } from './language-personas';

// ============================================
// Provider Types
// ============================================

export type STTProvider = 'deepgram' | 'sarvam';
export type TTSProvider = 'deepgram' | 'sarvam' | 'google';
export type LLMProvider = 'moonshot-api' | 'gemini';

export interface VoiceProviderConfig {
  stt: {
    provider: STTProvider;
    model?: string;
    endpoint?: string;
  };
  tts: {
    provider: TTSProvider;
    voiceId: string;
    model?: string;
    endpoint?: string;
  };
  llm: {
    provider: LLMProvider;
    model: string;
    apiKey?: string;
  };
  tier: 1 | 2;
  estimatedCostPerMinute: number;
}

// ============================================
// Language Routing
// ============================================

// ============================================
// Full Language Support — 17 languages
// ============================================

// Deepgram Aura-2 TTS: 7 languages with native-accent voices
const DEEPGRAM_TTS_LANGUAGES = ['en', 'es', 'fr', 'de', 'nl', 'it', 'ja'];

// Sarvam Bulbul v3 TTS: 11 Indic languages
const SARVAM_LANGUAGES = ['hi', 'bn', 'ta', 'te', 'gu', 'kn', 'ml', 'mr', 'pa', 'od', 'en-IN'];

// Languages where STT routes to Deepgram nova-3 (50+ languages including
// Urdu/Hebrew/Persian added January 2026) and TTS routes to Google Cloud
// because neither Sarvam Bulbul v3 nor Deepgram Aura-2 covers them.
// Picked to match the top international student source countries
// sending applicants to US/UK/Canadian universities:
//   ur — Pakistan
//   zh — China (#1 source globally)
//   ko — South Korea
//   ar — Gulf states (Saudi Arabia, UAE, Egypt, Jordan)
//   vi — Vietnam
//   pt — Brazil
//   ru — Russia / CIS
//   tr — Turkey
// Requires GOOGLE_CLOUD_CREDENTIALS env var (service-account JSON).
const GOOGLE_TTS_LANGUAGES = ['ur', 'zh', 'ko', 'ar', 'vi', 'pt', 'ru', 'tr'];

export function isSarvamLanguage(lang: string): boolean {
  return SARVAM_LANGUAGES.includes(lang);
}

export function isGoogleTtsLanguage(lang: string): boolean {
  return GOOGLE_TTS_LANGUAGES.includes(lang);
}

// BCP-47 mapping for Google Cloud TTS. Each entry is the language code
// app-side → BCP-47 locale that Google publishes a voice for. Verified
// via scripts/list-urdu-voices.mjs against the live listVoices() API.
//
// Notes:
//  - ur: Routes through hi-IN (Hindi Wavenet) instead of ur-IN (Standard).
//    Google has not published Wavenet/Neural2/Chirp3-HD for ur-IN as of
//    2026-05; ur-IN-Standard-A is concatenative + robotic, and an English
//    voice mispronounces Nastaliq. Spoken Hindi/Urdu (Hindustani) are
//    mutually intelligible — feeding the Urdu reply into the hi-IN voice
//    after a Nastaliq → Devanagari transliteration (see
//    src/lib/voice/urdu-to-devanagari.ts) gives Pakistani Urdu speakers
//    a natural-sounding native voice. Switch back to 'ur-IN' if/when
//    Google ships a Chirp3-HD Urdu voice.
//  - zh: Mandarin is published as cmn-CN, not zh-CN.
//  - ar: ar-XA is Google's pan-Arabic locale (covers Gulf states +
//    North Africa with a neutral MSA accent).
export const GOOGLE_TTS_LANG_CODES: Record<string, string> = {
  ur: 'hi-IN',
  zh: 'cmn-CN',
  ko: 'ko-KR',
  ar: 'ar-XA',
  vi: 'vi-VN',
  pt: 'pt-BR',
  ru: 'ru-RU',
  tr: 'tr-TR',
};

// All supported languages with metadata
export const ALL_SUPPORTED_LANGUAGES = [
  // Deepgram TTS languages
  { code: 'en', name: 'English', native: 'English', flag: '\u{1F1FA}\u{1F1F8}', provider: 'deepgram' as const },
  { code: 'es', name: 'Spanish', native: 'Espa\u00F1ol', flag: '\u{1F1EA}\u{1F1F8}', provider: 'deepgram' as const },
  { code: 'fr', name: 'French', native: 'Fran\u00E7ais', flag: '\u{1F1EB}\u{1F1F7}', provider: 'deepgram' as const },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '\u{1F1E9}\u{1F1EA}', provider: 'deepgram' as const },
  { code: 'nl', name: 'Dutch', native: 'Nederlands', flag: '\u{1F1F3}\u{1F1F1}', provider: 'deepgram' as const },
  { code: 'it', name: 'Italian', native: 'Italiano', flag: '\u{1F1EE}\u{1F1F9}', provider: 'deepgram' as const },
  { code: 'ja', name: 'Japanese', native: '\u65E5\u672C\u8A9E', flag: '\u{1F1EF}\u{1F1F5}', provider: 'deepgram' as const },
  // Sarvam TTS languages (Indic)
  { code: 'hi', name: 'Hindi', native: '\u0939\u093F\u0928\u094D\u0926\u0940', flag: '\u{1F1EE}\u{1F1F3}', provider: 'sarvam' as const },
  { code: 'bn', name: 'Bengali', native: '\u09AC\u09BE\u0982\u09B2\u09BE', flag: '\u{1F1EE}\u{1F1F3}', provider: 'sarvam' as const },
  { code: 'ta', name: 'Tamil', native: '\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD', flag: '\u{1F1EE}\u{1F1F3}', provider: 'sarvam' as const },
  { code: 'te', name: 'Telugu', native: '\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41', flag: '\u{1F1EE}\u{1F1F3}', provider: 'sarvam' as const },
  { code: 'gu', name: 'Gujarati', native: '\u0A97\u0AC1\u0A9C\u0AB0\u0ABE\u0AA4\u0AC0', flag: '\u{1F1EE}\u{1F1F3}', provider: 'sarvam' as const },
  { code: 'kn', name: 'Kannada', native: '\u0C95\u0CA8\u0CCD\u0CA8\u0CA1', flag: '\u{1F1EE}\u{1F1F3}', provider: 'sarvam' as const },
  { code: 'ml', name: 'Malayalam', native: '\u0D2E\u0D32\u0D2F\u0D3E\u0D33\u0D02', flag: '\u{1F1EE}\u{1F1F3}', provider: 'sarvam' as const },
  { code: 'mr', name: 'Marathi', native: '\u092E\u0930\u093E\u0920\u0940', flag: '\u{1F1EE}\u{1F1F3}', provider: 'sarvam' as const },
  { code: 'pa', name: 'Punjabi', native: '\u0A2A\u0A70\u0A1C\u0A3E\u0A2C\u0A40', flag: '\u{1F1EE}\u{1F1F3}', provider: 'sarvam' as const },
  { code: 'od', name: 'Odia', native: '\u0B13\u0B21\u0B3C\u0B3F\u0B06', flag: '\u{1F1EE}\u{1F1F3}', provider: 'sarvam' as const },
  // Google Cloud TTS — top international student source markets (added 2026-05-02)
  { code: 'ur', name: 'Urdu',       native: '\u0627\u0631\u062F\u0648', flag: '\u{1F1F5}\u{1F1F0}', provider: 'google' as const },
  { code: 'zh', name: 'Mandarin',   native: '\u4E2D\u6587', flag: '\u{1F1E8}\u{1F1F3}', provider: 'google' as const },
  { code: 'ko', name: 'Korean',     native: '\uD55C\uAD6D\uC5B4', flag: '\u{1F1F0}\u{1F1F7}', provider: 'google' as const },
  { code: 'ar', name: 'Arabic',     native: '\u0627\u0644\u0639\u0631\u0628\u064A\u0629', flag: '\u{1F1F8}\u{1F1E6}', provider: 'google' as const },
  { code: 'vi', name: 'Vietnamese', native: 'Ti\u1EBFng Vi\u1EC7t', flag: '\u{1F1FB}\u{1F1F3}', provider: 'google' as const },
  { code: 'pt', name: 'Portuguese', native: 'Portugu\u00EAs', flag: '\u{1F1E7}\u{1F1F7}', provider: 'google' as const },
  { code: 'ru', name: 'Russian',    native: '\u0420\u0443\u0441\u0441\u043A\u0438\u0439', flag: '\u{1F1F7}\u{1F1FA}', provider: 'google' as const },
  { code: 'tr', name: 'Turkish',    native: 'T\u00FCrk\u00E7e', flag: '\u{1F1F9}\u{1F1F7}', provider: 'google' as const },
] as const;

// Deepgram voice catalog — multiple voices per language with accents
export const DEEPGRAM_VOICE_CATALOG: Record<string, { id: string; name: string; accent?: string; gender: 'male' | 'female' }[]> = {
  en: [
    { id: 'aura-2-thalia-en', name: 'Thalia', gender: 'female' },
    { id: 'aura-2-orion-en', name: 'Orion', gender: 'male' },
    { id: 'aura-2-luna-en', name: 'Luna', gender: 'female' },
    { id: 'aura-2-arcas-en', name: 'Arcas', gender: 'male' },
    { id: 'aura-2-athena-en', name: 'Athena', gender: 'female' },
    { id: 'aura-2-helios-en', name: 'Helios', gender: 'male' },
    { id: 'aura-2-draco-en', name: 'Draco', accent: 'British', gender: 'male' },
    { id: 'aura-2-pandora-en', name: 'Pandora', accent: 'British', gender: 'female' },
    { id: 'aura-2-hyperion-en', name: 'Hyperion', accent: 'Australian', gender: 'male' },
    { id: 'aura-2-aurora-en', name: 'Aurora', gender: 'female' },
    { id: 'aura-2-zeus-en', name: 'Zeus', gender: 'male' },
    { id: 'aura-2-hera-en', name: 'Hera', gender: 'female' },
  ],
  es: [
    { id: 'aura-2-diana-es', name: 'Diana', accent: 'Spain', gender: 'female' },
    { id: 'aura-2-nestor-es', name: 'N\u00E9stor', accent: 'Spain', gender: 'male' },
    { id: 'aura-2-estrella-es', name: 'Estrella', accent: 'Mexico', gender: 'female' },
    { id: 'aura-2-javier-es', name: 'Javier', accent: 'Mexico', gender: 'male' },
    { id: 'aura-2-celeste-es', name: 'Celeste', accent: 'Colombia', gender: 'female' },
    { id: 'aura-2-antonia-es', name: 'Antonia', accent: 'Argentina', gender: 'female' },
    { id: 'aura-2-aquila-es', name: 'Aquila', accent: 'Bilingual EN/ES', gender: 'female' },
  ],
  fr: [
    { id: 'aura-2-agathe-fr', name: 'Agathe', gender: 'female' },
    { id: 'aura-2-hector-fr', name: 'Hector', gender: 'male' },
  ],
  de: [
    { id: 'aura-2-viktoria-de', name: 'Viktoria', gender: 'female' },
    { id: 'aura-2-julius-de', name: 'Julius', gender: 'male' },
    { id: 'aura-2-elara-de', name: 'Elara', gender: 'female' },
    { id: 'aura-2-fabian-de', name: 'Fabian', gender: 'male' },
  ],
  nl: [
    { id: 'aura-2-rhea-nl', name: 'Rhea', gender: 'female' },
    { id: 'aura-2-sander-nl', name: 'Sander', gender: 'male' },
    { id: 'aura-2-beatrix-nl', name: 'Beatrix', gender: 'female' },
    { id: 'aura-2-lars-nl', name: 'Lars', gender: 'male' },
  ],
  it: [
    { id: 'aura-2-livia-it', name: 'Livia', gender: 'female' },
    { id: 'aura-2-elio-it', name: 'Elio', gender: 'male' },
    { id: 'aura-2-cinzia-it', name: 'Cinzia', gender: 'female' },
    { id: 'aura-2-flavio-it', name: 'Flavio', gender: 'male' },
  ],
  ja: [
    { id: 'aura-2-izanami-ja', name: 'Izanami', gender: 'female' },
    { id: 'aura-2-fujin-ja', name: 'Fujin', gender: 'male' },
    { id: 'aura-2-uzume-ja', name: 'Uzume', gender: 'female' },
    { id: 'aura-2-ebisu-ja', name: 'Ebisu', gender: 'male' },
  ],
};

// Sarvam speaker catalog — all available speakers
export const SARVAM_SPEAKER_CATALOG = [
  'shubh', 'aditya', 'ritu', 'priya', 'neha', 'rahul', 'pooja', 'rohan',
  'simran', 'kavya', 'amit', 'dev', 'ishita', 'shreya', 'anand', 'tanya',
] as const;

// Sarvam language codes (BCP-47 for API)
export const SARVAM_LANGUAGE_CODES: Record<string, string> = {
  hi: 'hi-IN', bn: 'bn-IN', ta: 'ta-IN', te: 'te-IN',
  gu: 'gu-IN', kn: 'kn-IN', ml: 'ml-IN', mr: 'mr-IN',
  pa: 'pa-IN', od: 'od-IN', 'en-IN': 'en-IN',
};

const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY;

// ============================================
// Provider Router
// ============================================

export interface RouterOptions {
  language: string;
  voiceId?: string;
}

export function getVoiceProviderConfig(options: RouterOptions): VoiceProviderConfig {
  const { language, voiceId } = options;

  // Tier 3: Hybrid pipeline — Deepgram STT + Google Cloud TTS for
  // languages neither Deepgram Aura-2 nor Sarvam Bulbul v3 covers
  // (Urdu, Mandarin, Korean, Arabic, Vietnamese, Portuguese, Russian,
  // Turkish — top international student source markets). Deepgram
  // nova-3 covers all of these for STT.
  if (GOOGLE_TTS_LANGUAGES.includes(language)) {
    const googleLocale = GOOGLE_TTS_LANG_CODES[language];
    if (!googleLocale) {
      throw new Error(`VOICE_UNSUPPORTED:${language}`);
    }
    return {
      stt: { provider: 'deepgram', model: 'nova-3' },
      tts: {
        provider: 'google',
        voiceId: voiceId || googleLocale,
        model: 'google-tts-standard',
      },
      llm: {
        provider: 'moonshot-api',
        model: 'kimi-k2-turbo-preview',
        apiKey: MOONSHOT_API_KEY,
      },
      tier: 2,
      estimatedCostPerMinute: 0.05,
    };
  }

  // Hard-block voice for any other language not in the known providers.
  // Previously this fell through to the English Deepgram default, which
  // played accented English audio of a translated reply — confusing UX.
  // Throw with a known code so useCoachVoice can surface a clear banner.
  if (!DEEPGRAM_TTS_LANGUAGES.includes(language) && !SARVAM_LANGUAGES.includes(language)) {
    if (language && language !== "en" && language !== "unknown") {
      throw new Error(`VOICE_UNSUPPORTED:${language}`);
    }
  }

  // Tier 1: Deepgram STT + TTS for supported languages
  if (DEEPGRAM_TTS_LANGUAGES.includes(language)) {
    return {
      stt: { provider: 'deepgram', model: 'nova-3' },
      tts: {
        provider: 'deepgram',
        voiceId: voiceId || getDefaultDeepgramVoice(language),
        model: 'aura-2',
      },
      llm: {
        provider: 'moonshot-api',
        model: 'kimi-k2-turbo-preview',
        apiKey: MOONSHOT_API_KEY,
      },
      tier: 1,
      estimatedCostPerMinute: 0.05,
    };
  }

  // Tier 2: Deepgram STT + Sarvam TTS for South Asian languages
  if (SARVAM_LANGUAGES.includes(language)) {
    return {
      stt: {
        provider: language === 'pa' ? 'sarvam' : 'deepgram',
        model: language === 'pa' ? undefined : 'nova-3',
      },
      tts: {
        provider: 'sarvam',
        voiceId: voiceId || 'bulbul-v3',
        model: 'bulbul-v3',
      },
      llm: {
        provider: 'moonshot-api',
        model: 'kimi-k2-turbo-preview',
        apiKey: MOONSHOT_API_KEY,
      },
      tier: 2,
      estimatedCostPerMinute: 0.07,
    };
  }

  // Default: Deepgram for unknown languages (STT supports 50+, TTS English fallback)
  return {
    stt: { provider: 'deepgram', model: 'nova-3' },
    tts: {
      provider: 'deepgram',
      voiceId: voiceId || 'aura-2-thalia-en',
      model: 'aura-2',
    },
    llm: {
      provider: 'moonshot-api',
      model: 'kimi-k2-turbo-preview',
      apiKey: MOONSHOT_API_KEY,
    },
    tier: 1,
    estimatedCostPerMinute: 0.05,
  };
}

// ============================================
// Default Voice Mapping
// ============================================

function getDefaultDeepgramVoice(language: string): string {
  const catalog = DEEPGRAM_VOICE_CATALOG[language];
  if (catalog && catalog.length > 0) return catalog[0].id;
  return 'aura-2-thalia-en'; // English fallback
}

export function getDefaultSarvamSpeaker(): string {
  return 'priya'; // Natural female voice, works across all 11 Indic languages
}

// ============================================
// WebSocket Session Config (for Deepgram Agent)
// ============================================

export interface WebSocketSessionConfig {
  url: string;
  auth?: {
    type: 'token' | 'api_key';
    value: string;
  };
  settings: {
    language: string;
    personaId: string;
    systemPrompt: string;
    proficiencyLevel?: ProficiencyLevel;
    voiceProvider: TTSProvider;
    voiceId: string;
    sttProvider: STTProvider;
    llmProvider: LLMProvider;
    llmModel: string;
  };
}

export function buildWebSocketConfig(
  providerConfig: VoiceProviderConfig,
  options: {
    userId: string;
    sessionToken: string;
    personaId: string;
    systemPrompt: string;
    language: string;
    proficiencyLevel?: ProficiencyLevel;
  }
): WebSocketSessionConfig {
  return {
    url: 'wss://agent.deepgram.com/v1/agent/converse',
    auth: {
      type: 'api_key',
      value: process.env.DEEPGRAM_API_KEY || '',
    },
    settings: {
      language: options.language,
      personaId: options.personaId,
      systemPrompt: options.systemPrompt,
      proficiencyLevel: options.proficiencyLevel,
      voiceProvider: providerConfig.tts.provider,
      voiceId: providerConfig.tts.voiceId,
      sttProvider: providerConfig.stt.provider,
      llmProvider: providerConfig.llm.provider,
      llmModel: providerConfig.llm.model,
    },
  };
}

// ============================================
// Translation (Moonshot API)
// ============================================

export interface TranslationConfig {
  text: string;
  fromLang: string;
  toLang: string;
  context?: string;
}

export async function translate(config: TranslationConfig): Promise<string> {
  return translateWithKimiAPI(config);
}

export async function translateWithKimiAPI(config: TranslationConfig): Promise<string> {
  const { text, fromLang, toLang, context } = config;
  const apiKey = process.env.MOONSHOT_API_KEY;

  if (!apiKey) {
    throw new Error('Moonshot API key not configured');
  }

  const response = await fetch('https://api.moonshot.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'kimi-k2-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator fluent in all languages. Translate naturally from ${fromLang} to ${toLang}. Return ONLY the translated text as a complete, natural-sounding phrase or sentence. Never break words into syllables. Never add explanations, notes, or pronunciation guides. Just the clean translation.`,
        },
        {
          role: 'user',
          content: context ? `Context: ${context}\n\nText: "${text}"` : `Text: "${text}"`,
        },
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`Kimi API translation failed: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}

// ============================================
// TTS (Text-to-Speech)
// ============================================

// Server-only TTS dispatcher. Note: the 'google' branch is intentionally
// NOT handled here. Google's @google-cloud/text-to-speech SDK pulls in
// node-fetch + https-proxy-agent which depend on Node's `tls` and `net`
// modules — Turbopack chokes when this module is imported by client code
// (AICoach.tsx, useVoiceAgent.ts). Callers that need 'google' provider
// must import `src/lib/voice/google-tts` directly from a server route.
// See src/app/api/language/tts/route.ts and src/app/api/language/sarvam/
// stream/route.ts for the pattern.
export async function synthesizeSpeech(
  text: string,
  providerConfig: VoiceProviderConfig
): Promise<ArrayBuffer> {
  switch (providerConfig.tts.provider) {
    case 'sarvam':
      return synthesizeWithSarvam(text, providerConfig.tts);
    case 'google':
      throw new Error(
        "synthesizeSpeech: 'google' provider must be handled by the caller — " +
        "import synthesizeWithGoogle from src/lib/voice/google-tts directly. " +
        "Routing this through voice-provider-router pulls Google's SDK into " +
        "client bundles and breaks Turbopack."
      );
    case 'deepgram':
    default:
      return synthesizeWithDeepgram(text, providerConfig.tts);
  }
}

async function synthesizeWithDeepgram(
  text: string,
  config: VoiceProviderConfig['tts']
): Promise<ArrayBuffer> {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) throw new Error('Deepgram API key not configured');

  const response = await fetch(
    `https://api.deepgram.com/v1/speak?model=${config.voiceId || 'aura-2-thalia-en'}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${apiKey}`,
      },
      body: JSON.stringify({ text }),
    }
  );

  if (!response.ok) {
    throw new Error(`Deepgram TTS failed: ${response.status}`);
  }

  return response.arrayBuffer();
}

async function synthesizeWithSarvam(
  text: string,
  config: VoiceProviderConfig['tts'],
  language?: string
): Promise<ArrayBuffer> {
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) throw new Error('Sarvam API key not configured');

  // Map to correct Sarvam language code and speaker (verified valid bulbul:v3 speakers)
  const langCodeMap: Record<string, string> = {
    hi: 'hi-IN', pa: 'pa-IN',
  };
  const speakerMap: Record<string, string> = {
    hi: 'priya', pa: 'simran',
  };
  const targetLang = language ? (langCodeMap[language] || 'hi-IN') : 'hi-IN';
  const speaker = language ? (speakerMap[language] || 'priya') : 'priya';

  const response = await fetch('https://api.sarvam.ai/text-to-speech', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-subscription-key': apiKey,
    },
    body: JSON.stringify({
      text: text,
      target_language_code: targetLang,
      speaker: speaker,
      model: 'bulbul:v3',
      pace: 1.0,
      speech_sample_rate: 22050,
      output_audio_codec: 'mp3',
    }),
  });

  if (!response.ok) {
    throw new Error(`Sarvam TTS failed: ${response.status}`);
  }

  const data = await response.json();
  const base64 = data.audios?.[0];
  if (!base64) throw new Error('No audio returned from Sarvam');

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// ============================================
// LLM (Moonshot API)
// ============================================

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function generateWithMoonshot(
  messages: LLMMessage[],
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
): Promise<string> {
  const apiKey = process.env.MOONSHOT_API_KEY;

  if (!apiKey) {
    throw new Error('Moonshot API key not configured');
  }

  const response = await fetch('https://api.moonshot.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: options?.model || 'kimi-k2-turbo-preview',
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens || 1024,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Moonshot API failed: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}
