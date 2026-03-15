// Voice Provider Router — Deepgram-First Architecture
// Primary: Deepgram STT (Nova-3) + TTS (Aura-2) + Moonshot API (Kimi K2)
// Fallback TTS: Sarvam (Punjabi/Hindi)
// Self-hosted (Whisper + Kokoro) deferred to Phase 3

import type { ProficiencyLevel } from './language-personas';

// ============================================
// Provider Types
// ============================================

export type STTProvider = 'deepgram' | 'sarvam';
export type TTSProvider = 'deepgram' | 'sarvam';
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

// Deepgram Aura-2 TTS supports these languages natively
const DEEPGRAM_TTS_LANGUAGES = ['en', 'es', 'fr', 'de', 'nl', 'it', 'ja', 'zh'];

// Sarvam for Hindi/Punjabi (TTS + STT for Punjabi)
// Note: Urdu NOT included — Sarvam doesn't support Urdu TTS
const SARVAM_LANGUAGES = ['pa', 'hi'];

export function isSarvamLanguage(lang: string): boolean {
  return SARVAM_LANGUAGES.includes(lang);
}

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
  // Native-accent voices — verified Deepgram Aura-2 model IDs
  const voices: Record<string, string> = {
    en: 'aura-2-thalia-en',
    es: 'aura-2-diana-es',
    fr: 'aura-2-agathe-fr',
    de: 'aura-2-viktoria-de',
    it: 'aura-2-livia-it',
    ja: 'aura-2-izanami-ja',
    // TODO: Verify Chinese voice availability — using Japanese voices as closest fallback
    zh: 'aura-2-izanami-ja',
    nl: 'aura-2-rhea-nl',
  };
  return voices[language] || 'aura-2-thalia-en';
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

export async function synthesizeSpeech(
  text: string,
  providerConfig: VoiceProviderConfig
): Promise<ArrayBuffer> {
  switch (providerConfig.tts.provider) {
    case 'sarvam':
      return synthesizeWithSarvam(text, providerConfig.tts);
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
