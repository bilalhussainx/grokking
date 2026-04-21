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

export function useSpeechToText(languageCode: string = "en") {
  const [isListening, setIsListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [supported, setSupported] = useState<boolean | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const finalHandlerRef = useRef<((text: string) => void) | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR =
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition;
    setSupported(!!SR);
  }, []);

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
      };

      rec.onerror = () => {
        // ignore; onend will fire
      };

      rec.onend = () => {
        setIsListening(false);
        setInterim("");
        const text = accumulatedFinal.trim();
        if (text && finalHandlerRef.current) {
          finalHandlerRef.current(text);
        }
      };

      recognitionRef.current = rec;
      try {
        rec.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    },
    [languageCode]
  );

  const stop = useCallback(() => {
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
