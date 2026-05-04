// src/lib/voice/google-tts.ts
// SERVER-ONLY. The @google-cloud/text-to-speech SDK pulls in Node-only
// modules (tls, net via node-fetch + https-proxy-agent), so importing
// this from a client component will crash Turbopack at build time.
// The `import 'server-only'` line below makes the failure loud + early.
import "server-only";
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

// Default voices per language. Upgraded 2026-05-04 from Standard (low-fi
// concatenative) to Wavenet / Neural2 (neural, dramatically more natural).
// Pricing: Standard $4/M chars, Wavenet $16/M, Neural2 $16/M — minor cost
// increase for a major voice quality win on a feature where the audio IS
// the product. Free tier covers 1M Wavenet chars/month + 1M Neural2/month
// which is well above our per-language volume.
//
// Urdu (ur-IN): Google does not publish Wavenet or Neural2 voices for ur-IN
// as of 2026-05; only Standard is available. If/when Chirp3-HD ships for
// Urdu, swap "ur-IN-Standard-A" → "ur-IN-Chirp3-HD-Aoede" here.
//
// Voice resolution follows opts.voiceName → DEFAULT_VOICES[locale] → none
// (Google picks one). To override per-call, pass `voiceName` directly.
const DEFAULT_VOICES: Record<string, string> = {
  // hi-IN: Hindi Wavenet, used for the Urdu pipeline (ur is mapped to
  // hi-IN in voice-provider-router so callers feed transliterated
  // Devanagari → Hindi-Urdu phonetics out the speaker).
  "hi-IN": "hi-IN-Wavenet-A",
  // ur-IN kept as a fallback in case a caller passes the locale directly.
  // Standard tier is the only thing published for ur-IN as of 2026-05.
  "ur-IN": "ur-IN-Standard-A",
  "cmn-CN": "cmn-CN-Wavenet-A",  // Mandarin (Mainland China) — Wavenet
  "ko-KR": "ko-KR-Neural2-A",    // Korean — Neural2 (newest tier available)
  "ar-XA": "ar-XA-Wavenet-A",    // Pan-Arabic — Wavenet
  "vi-VN": "vi-VN-Neural2-A",    // Vietnamese — Neural2
  "pt-BR": "pt-BR-Neural2-A",    // Brazilian Portuguese — Neural2
  "ru-RU": "ru-RU-Wavenet-A",    // Russian — Wavenet
  "tr-TR": "tr-TR-Wavenet-A",    // Turkish — Wavenet
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

/**
 * Streaming variant of synthesizeWithGoogle. Uses Google's bidirectional
 * `streamingSynthesize` RPC, which lets the TTS engine begin emitting MP3
 * frames as soon as the first audio is rendered — instead of buffering the
 * full reply into a single Buffer at the end.
 *
 * Returns an async iterable of MP3 chunks. The chunks are part of a single
 * MP3 stream — callers can either:
 *   (a) concatenate all chunks into one Buffer and decode at the end
 *       (current /api/language/sarvam/stream behavior — small server-side
 *       parallelism win, no client change), OR
 *   (b) forward chunks to the client as they arrive and play them
 *       incrementally via MediaSource / WebAudio (true time-to-first-audio
 *       reduction — Phase 2 follow-up, requires client refactor).
 *
 * Falls back to unary synthesizeWithGoogle if the SDK doesn't expose
 * streamingSynthesize (older versions before 6.x).
 */
export async function* streamingSynthesizeWithGoogle(
  text: string,
  opts: GoogleTtsOptions,
): AsyncGenerator<Buffer, void, unknown> {
  if (!text.trim()) {
    throw new Error("streamingSynthesizeWithGoogle: text is empty");
  }
  const client = getClient();
  const voiceName =
    opts.voiceName ?? DEFAULT_VOICES[opts.languageCode] ?? undefined;

  // streamingSynthesize is a bidirectional RPC. Some SDK builds expose it
  // on the v1 client; older builds keep it under v1beta1. Detect at runtime.
  const clientWithStreaming = client as unknown as {
    streamingSynthesize?: () => NodeJS.ReadWriteStream;
  };
  if (typeof clientWithStreaming.streamingSynthesize !== "function") {
    // SDK doesn't have streaming — fall back to unary and yield once.
    const buf = await synthesizeWithGoogle(text, opts);
    yield Buffer.from(buf);
    return;
  }

  const stream = clientWithStreaming.streamingSynthesize();

  // Send the streaming config as the first message, then the input text,
  // then half-close. The server will respond with audioContent chunks.
  const writable = stream as unknown as {
    write: (msg: unknown) => void;
    end: () => void;
  };
  writable.write({
    streamingConfig: {
      voice: {
        languageCode: opts.languageCode,
        ...(voiceName ? { name: voiceName } : {}),
        ...(opts.gender && !voiceName ? { ssmlGender: opts.gender } : {}),
      },
      streamingAudioConfig: {
        audioEncoding: "MP3",
        speakingRate: opts.speakingRate ?? 0.95,
      },
    },
  });
  writable.write({ input: { text } });
  writable.end();

  for await (const response of stream as AsyncIterable<{
    audioContent?: Uint8Array | string | null;
  }>) {
    const audio = response.audioContent;
    if (!audio) continue;
    if (audio instanceof Uint8Array) {
      yield Buffer.from(audio);
    } else if (typeof audio === "string") {
      yield Buffer.from(audio, "base64");
    }
  }
}
