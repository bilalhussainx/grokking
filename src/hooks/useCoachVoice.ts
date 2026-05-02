"use client";

import { useCallback, useRef } from "react";

export interface SpeakResult {
  ok: boolean;
  // Populated when ok=false. Codes:
  //   "TTS_FAILED_<status>"   — /api/language/tts returned non-OK
  //   "TTS_EMPTY_AUDIO"       — Sarvam Bulbul-v3 silent-output bug; blob.size === 0
  //   "AUDIO_PLAY_FAILED"     — browser refused to play (autoplay policy, codec, etc.)
  //   "VOICE_UNSUPPORTED:<lang>" — voice-provider-router rejected the language
  reason?: string;
}

function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_~#>]/g, "")
    .replace(/\n{2,}/g, ". ")
    .replace(/\s+/g, " ")
    .trim();
}

function chunkText(text: string, maxLen = 450): string[] {
  const clean = stripMarkdown(text);
  if (clean.length <= maxLen) return [clean];
  const sentences = clean.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let current = "";
  for (const s of sentences) {
    if ((current + " " + s).trim().length > maxLen) {
      if (current) chunks.push(current.trim());
      current = s;
    } else {
      current = (current + " " + s).trim();
    }
  }
  if (current) chunks.push(current.trim());
  return chunks;
}

export function useCoachVoice() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playingRef = useRef<boolean>(false);
  const cancelRef = useRef<boolean>(false);

  const stop = useCallback(() => {
    cancelRef.current = true;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    playingRef.current = false;
  }, []);

  const speak = useCallback(
    async (englishText: string, language: string): Promise<SpeakResult> => {
      if (!englishText.trim()) return { ok: true };
      stop();
      cancelRef.current = false;
      playingRef.current = true;

      const chunks = chunkText(englishText);
      let lastError: string | null = null;

      try {
        for (const chunk of chunks) {
          if (cancelRef.current) break;

          let spoken = chunk;
          if (language !== "en") {
            try {
              const transRes = await fetch("/api/language/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: chunk, fromLang: "en", toLang: language }),
              });
              if (transRes.ok) {
                const data = await transRes.json();
                if (data.translatedText) spoken = data.translatedText;
              }
            } catch {
              // fall through with english
            }
          }

          if (cancelRef.current) break;

          const ttsRes = await fetch("/api/language/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: spoken.slice(0, 500), language }),
          });

          if (!ttsRes.ok) {
            const errText = await ttsRes.text().catch(() => "");
            // The TTS route surfaces VOICE_UNSUPPORTED:<lang> as a 4xx
            // body. Pass that code through verbatim so the UI can show the
            // right message; otherwise tag with the HTTP status.
            const code = errText.startsWith("VOICE_UNSUPPORTED:")
              ? errText.trim()
              : `TTS_FAILED_${ttsRes.status}`;
            console.error("[useCoachVoice] TTS request failed:", ttsRes.status, errText);
            lastError = code;
            continue;
          }
          const blob = await ttsRes.blob();
          if (blob.size === 0) {
            // Sarvam Bulbul-v3 sometimes returns 200 with an empty audio
            // payload for certain inputs (very short/long, special chars).
            // Surface this so the user knows voice glitched, not just
            // hangs in silence.
            console.warn("[useCoachVoice] TTS returned empty blob — Sarvam silent-output bug?", { language, chunkLen: spoken.length });
            lastError = "TTS_EMPTY_AUDIO";
            continue;
          }
          if (cancelRef.current) break;

          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audioRef.current = audio;

          const playOk = await new Promise<boolean>((resolve) => {
            audio.onended = () => {
              URL.revokeObjectURL(url);
              resolve(true);
            };
            audio.onerror = (e) => {
              URL.revokeObjectURL(url);
              console.error("[useCoachVoice] audio playback error:", e);
              resolve(false);
            };
            audio.play().catch((err) => {
              console.error("[useCoachVoice] audio.play() rejected:", err);
              resolve(false);
            });
          });
          if (!playOk) lastError = "AUDIO_PLAY_FAILED";
        }
      } finally {
        playingRef.current = false;
        audioRef.current = null;
      }

      return lastError ? { ok: false, reason: lastError } : { ok: true };
    },
    [stop],
  );

  return { speak, stop, isPlaying: () => playingRef.current };
}
