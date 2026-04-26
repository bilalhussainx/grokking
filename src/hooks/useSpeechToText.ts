"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface SpeechRecognitionLike {
  start(): void;
  stop(): void;
  abort(): void;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [index: number]: { transcript: string };
    };
  };
}

const LANG_MAP: Record<string, string> = {
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT",
  nl: "nl-NL",
  ja: "ja-JP",
  hi: "hi-IN",
};

// How long to wait after the last interim result before auto-stopping the
// recognition. 2500ms is forgiving enough for natural between-word pauses
// (e.g. "bonjour, comme ça va") while still feeling responsive.
const SILENCE_AUTO_STOP_MS = 2500;
// Maximum time to wait BEFORE the user starts talking. If they tap mic and
// don't speak in 8s, give up.
const MAX_INITIAL_WAIT_MS = 8000;

export function useSpeechToText(languageCode: string = "en") {
  const [isListening, setIsListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [supported, setSupported] = useState<boolean | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const finalHandlerRef = useRef<((text: string) => void) | null>(null);
  const silenceTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR =
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition;
    setSupported(!!SR);
  }, []);

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current != null) {
      window.clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  const start = useCallback(
    (onFinal: (text: string) => void) => {
      if (typeof window === "undefined") return;
      const SR =
        (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition;
      if (!SR) return;

      finalHandlerRef.current = onFinal;

      const rec = new SR();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = LANG_MAP[languageCode] || "en-US";

      let accumulatedFinal = "";
      let lastInterim = "";
      let hasReceivedSpeech = false;

      // Reset the silence timer on every interim/final result. The first
      // result also flips us out of "waiting for speech" mode so subsequent
      // resets use the shorter SILENCE_AUTO_STOP_MS rather than the longer
      // initial-wait timeout.
      const armSilenceTimer = (timeout: number) => {
        clearSilenceTimer();
        silenceTimerRef.current = window.setTimeout(() => {
          try {
            rec.stop();
          } catch {
            // ignore
          }
        }, timeout);
      };

      rec.onresult = (event: SpeechRecognitionEventLike) => {
        let interimText = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          if (result.isFinal) {
            accumulatedFinal += transcript + " ";
          } else {
            interimText += transcript;
          }
        }
        setInterim(interimText);
        if (interimText) lastInterim = interimText;
        hasReceivedSpeech = true;
        armSilenceTimer(SILENCE_AUTO_STOP_MS);
      };

      rec.onerror = () => {
        // ignore; onend will fire
      };

      rec.onend = () => {
        clearSilenceTimer();
        setIsListening(false);
        setInterim("");
        // Prefer accumulated final results, but fall back to the last interim
        // we saw if the browser cut off before finalising. Chrome with
        // continuous=true sometimes drops pending interims when stop() fires,
        // which would otherwise truncate "bonjour comme ça va" to "bon".
        const finalText = accumulatedFinal.trim();
        const fallback = lastInterim.trim();
        // Use whichever is longer — final is authoritative when present, but
        // a long interim is better than a short final fragment.
        const text = finalText.length >= fallback.length ? finalText : fallback;
        if (text && finalHandlerRef.current) {
          finalHandlerRef.current(text);
        }
        // suppress unused-warning — kept for future "drop silent recordings" logic
        void hasReceivedSpeech;
      };

      recognitionRef.current = rec;
      try {
        rec.start();
        setIsListening(true);
        // Arm the long initial-wait timer; once the user starts speaking
        // onresult will swap to the shorter silence timer.
        armSilenceTimer(MAX_INITIAL_WAIT_MS);
      } catch {
        setIsListening(false);
      }
    },
    [languageCode]
  );

  const stop = useCallback(() => {
    clearSilenceTimer();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  useEffect(() => {
    return () => {
      clearSilenceTimer();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  return { isListening, interim, supported, start, stop };
}
