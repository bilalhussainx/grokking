"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  // Use refs to avoid stale closures
  const finalTextRef = useRef("");
  const interimTextRef = useRef("");

  useEffect(() => {
    const SR =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;
    setIsSupported(!!SR);
  }, []);

  const startListening = useCallback(() => {
    const SR =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;
    if (!SR) return;

    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }

    finalTextRef.current = "";
    interimTextRef.current = "";

    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
      setInterimTranscript("");
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      if (final) {
        finalTextRef.current = final;
        setTranscript(final);
        setInterimTranscript("");
      } else {
        interimTextRef.current = interim;
        setInterimTranscript(interim);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error !== "no-speech" && event.error !== "aborted") {
        console.error("Speech recognition error:", event.error);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      // If we have interim but no final (user stopped mid-sentence), promote interim to final
      if (!finalTextRef.current && interimTextRef.current) {
        finalTextRef.current = interimTextRef.current;
        setTranscript(interimTextRef.current);
        setInterimTranscript("");
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    startListening,
    stopListening,
  };
}

/**
 * Wake word listener — continuously listens for "hey coach" or "coach alex"
 * to open the coach panel.
 */
export function useWakeWord(onWake: () => void) {
  const [isActive, setIsActive] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const restartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isActiveRef = useRef(false);
  const onWakeRef = useRef(onWake);
  onWakeRef.current = onWake;

  useEffect(() => {
    const SR =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;
    setIsSupported(!!SR);
  }, []);

  const createRecognition = useCallback(() => {
    const SR =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;
    if (!SR || !isActiveRef.current) return;

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript.toLowerCase().trim();
        if (
          text.includes("hey coach") ||
          text.includes("coach alex") ||
          text.includes("hey alex") ||
          text.includes("okay coach")
        ) {
          onWakeRef.current();
          // Pause after activation
          recognition.abort();
          if (isActiveRef.current) {
            restartTimeoutRef.current = setTimeout(() => {
              if (isActiveRef.current) createRecognition();
            }, 3000);
          }
          return;
        }
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "not-allowed") {
        setIsActive(false);
        isActiveRef.current = false;
        return;
      }
      // Auto-restart on transient errors
      if (isActiveRef.current) {
        restartTimeoutRef.current = setTimeout(() => {
          if (isActiveRef.current) createRecognition();
        }, 1000);
      }
    };

    recognition.onend = () => {
      // Auto-restart when recognition ends (browser kills after ~60s)
      if (isActiveRef.current) {
        restartTimeoutRef.current = setTimeout(() => {
          if (isActiveRef.current) createRecognition();
        }, 300);
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      // Already running or blocked
    }
  }, []);

  const startWakeListener = useCallback(() => {
    isActiveRef.current = true;
    setIsActive(true);
    createRecognition();
  }, [createRecognition]);

  const stopWakeListener = useCallback(() => {
    isActiveRef.current = false;
    setIsActive(false);
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
    }
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      isActiveRef.current = false;
      if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, []);

  return { isActive, isSupported, startWakeListener, stopWakeListener };
}
