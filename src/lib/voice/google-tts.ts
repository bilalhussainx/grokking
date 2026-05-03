// src/lib/voice/google-tts.ts
// Google Cloud Text-to-Speech wrapper for languages not covered by
// Sarvam Bulbul v3 or Deepgram Aura-2. Currently used for Urdu (ur-IN)
// only — Google only ships Urdu under the Indian locale; the script is
// identical across India + Pakistan with only minor accent differences,
// so this voice reads natural for Pakistani users too. Sarvam saaras:v3
// doesn't support Urdu STT either, so the pipeline routes Urdu to:
//   STT  → Deepgram nova-3 (added Urdu support January 2026)
//   TTS  → Google Cloud (this file)
//
// Credentials: env var GOOGLE_CLOUD_CREDENTIALS holds the service-account
// JSON minified onto a single line. The client is lazily constructed so
// dev environments without the var don't crash on import.

import textToSpeech, {
  type protos,
  TextToSpeechClient,
} from "@google-cloud/text-to-speech";

let cachedClient: TextToSpeechClient | null = null;

function getClient(): TextToSpeechClient {
  if (cachedClient) return cachedClient;
  const raw = process.env.GOOGLE_CLOUD_CREDENTIALS;
  if (!raw) {
    throw new Error(
      "GOOGLE_CLOUD_CREDENTIALS env var not set — required for Google Cloud TTS (Urdu).",
    );
  }
  let credentials: { client_email?: string; private_key?: string };
  try {
    credentials = JSON.parse(raw);
  } catch (err) {
    throw new Error(
      `GOOGLE_CLOUD_CREDENTIALS is not valid JSON: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
  if (!credentials.client_email || !credentials.private_key) {
    throw new Error(
      "GOOGLE_CLOUD_CREDENTIALS missing client_email or private_key — re-download the service account JSON.",
    );
  }
  cachedClient = new textToSpeech.TextToSpeechClient({ credentials });
  return cachedClient;
}

export interface GoogleTtsOptions {
  // BCP-47 language code, e.g. "ur-IN", "ar-EG".
  languageCode: string;
  // Specific voice name (overrides default voice for the language).
  // List: https://cloud.google.com/text-to-speech/docs/voices
  voiceName?: string;
  // FEMALE | MALE | NEUTRAL — used when voiceName is not specified.
  gender?: "FEMALE" | "MALE" | "NEUTRAL";
  // 0.25 - 4.0; 1.0 = normal pace. Slightly slower (0.95) reads better
  // for non-native listeners. Default 0.95 in this app.
  speakingRate?: number;
}

// Default voices per language. Standard tier is free up to 1M
// chars/month — well above our expected per-language volume. Voice
// availability verified via scripts/list-urdu-voices.mjs (2026-05-02).
// All defaults are female, Standard tier — upgrade to Wavenet/Chirp3-HD
// in DEFAULT_VOICES later if voice quality becomes a concern.
const DEFAULT_VOICES: Record<string, string> = {
  "ur-IN": "ur-IN-Standard-A",  // Pakistan/India — Pakistani students
  "cmn-CN": "cmn-CN-Standard-A", // Mainland China (Mandarin)
  "ko-KR": "ko-KR-Standard-A",   // South Korea
  "ar-XA": "ar-XA-Standard-A",   // Multi-region Arabic — Gulf states
  "vi-VN": "vi-VN-Standard-A",   // Vietnam
  "pt-BR": "pt-BR-Standard-A",   // Brazil
  "ru-RU": "ru-RU-Standard-A",   // Russia/CIS
  "tr-TR": "tr-TR-Standard-A",   // Turkey
};

export async function synthesizeWithGoogle(
  text: string,
  opts: GoogleTtsOptions,
): Promise<ArrayBuffer> {
  if (!text.trim()) {
    throw new Error("synthesizeWithGoogle: text is empty");
  }
  const client = getClient();

  const voiceName =
    opts.voiceName ?? DEFAULT_VOICES[opts.languageCode] ?? undefined;

  const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
    input: { text },
    voice: {
      languageCode: opts.languageCode,
      ...(voiceName ? { name: voiceName } : {}),
      ...(opts.gender && !voiceName ? { ssmlGender: opts.gender } : {}),
    },
    audioConfig: {
      audioEncoding: "MP3",
      speakingRate: opts.speakingRate ?? 0.95,
    },
  };

  const [response] = await client.synthesizeSpeech(request);
  const audio = response.audioContent;
  if (!audio) {
    throw new Error("Google Cloud TTS returned empty audioContent");
  }
  // audioContent comes back as a Node Buffer (or Uint8Array). Normalize
  // to ArrayBuffer so downstream consumers (Deepgram + Sarvam paths) get
  // the same type.
  if (audio instanceof Uint8Array) {
    return audio.buffer.slice(
      audio.byteOffset,
      audio.byteOffset + audio.byteLength,
    ) as ArrayBuffer;
  }
  // string fallback (base64) — re-decode to bytes.
  const binary = Buffer.from(audio as string, "base64");
  return binary.buffer.slice(
    binary.byteOffset,
    binary.byteOffset + binary.byteLength,
  ) as ArrayBuffer;
}

// Convenience export for the common Urdu case.
export async function synthesizeUrduSpeech(text: string): Promise<ArrayBuffer> {
  return synthesizeWithGoogle(text, { languageCode: "ur-IN" });
}
