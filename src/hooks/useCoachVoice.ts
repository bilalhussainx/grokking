"use client";

import { useCallback, useRef } from "react";

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

  const speak = useCallback(async (englishText: string, language: string): Promise<void> => {
    if (!englishText.trim()) return;
    stop();
    cancelRef.current = false;
    playingRef.current = true;

    const chunks = chunkText(englishText);

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

        if (!ttsRes.ok) continue;
        const blob = await ttsRes.blob();
        if (cancelRef.current) break;

        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;

        await new Promise<void>((resolve) => {
          audio.onended = () => {
            URL.revokeObjectURL(url);
            resolve();
          };
          audio.onerror = () => {
            URL.revokeObjectURL(url);
            resolve();
          };
          audio.play().catch(() => resolve());
        });
      }
    } finally {
      playingRef.current = false;
      audioRef.current = null;
    }
  }, [stop]);

  return { speak, stop, isPlaying: () => playingRef.current };
}
