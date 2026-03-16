"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export type VoiceState = "idle" | "listening" | "thinking" | "speaking";

interface Opts {
  onTranscript?: (role: "user" | "assistant", text: string) => void;
}

/**
 * Voice conversation hook using:
 * - Web Speech API (SpeechRecognition) for STT — bypasses getUserMedia entirely
 * - /api/ai/coach (Kimi K2) for LLM responses
 * - Deepgram TTS for speaking responses
 *
 * This avoids the Realtek/Edge muted mic issue since SpeechRecognition
 * uses the browser's own mic access path, not Web Audio API.
 */
export function useVoiceConversation({ onTranscript }: Opts = {}) {
  const [state, setState] = useState<VoiceState>("idle");
  const [isLive, setIsLive] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [debugLog, setDebugLog] = useState("");

  const liveRef = useRef(false);
  const onTranscriptRef = useRef(onTranscript);
  onTranscriptRef.current = onTranscript;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const contextRef = useRef<{
    lessonTitle?: string;
    moduleTitle?: string;
    courseTitle?: string;
  }>({});
  // Accumulate conversation history for multi-turn
  const historyRef = useRef<{ role: string; content: string }[]>([]);

  // Check if Web Speech API is available
  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const log = useCallback((msg: string) => {
    console.log("[Voice]", msg);
    setDebugLog(msg);
  }, []);

  /** Speak text using ElevenLabs TTS */
  const speak = useCallback(
    async (text: string) => {
      setState("speaking");
      log("Speaking...");

      try {
        const res = await fetch("/api/ai/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        if (!res.ok) throw new Error(`TTS ${res.status}`);

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        currentAudioRef.current = audio;

        await new Promise<void>((resolve) => {
          audio.onended = () => {
            URL.revokeObjectURL(url);
            currentAudioRef.current = null;
            resolve();
          };
          audio.onerror = () => {
            URL.revokeObjectURL(url);
            currentAudioRef.current = null;
            resolve();
          };
          audio.play().catch(() => resolve());
        });
      } catch (err) {
        log("TTS error: " + err);
      }

      // Resume listening after speaking
      if (liveRef.current) {
        setState("listening");
        log("Listening...");
        recognitionRef.current?.start();
      }
    },
    [log]
  );

  /** Send user's speech to coach API and speak the response */
  const processUserSpeech = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      setState("thinking");
      log("Thinking...");
      onTranscriptRef.current?.("user", text);

      // Add to history
      historyRef.current.push({ role: "user", content: text });

      try {
        const ctx = contextRef.current;
        const res = await fetch("/api/ai/coach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: `Student says (via voice): "${text}"`,
            lessonTitle: ctx.lessonTitle || "",
            moduleTitle: ctx.moduleTitle || "",
            courseTitle: ctx.courseTitle || "",
            hintsGiven: 0,
            history: historyRef.current.slice(-10),
          }),
        });

        if (!res.ok) throw new Error(`Coach ${res.status}`);

        // Read the streamed response fully
        const reader = res.body?.getReader();
        if (!reader) throw new Error("No stream");
        const decoder = new TextDecoder();
        let full = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          full += decoder.decode(value, { stream: true });
        }

        if (full.trim()) {
          onTranscriptRef.current?.("assistant", full.trim());
          historyRef.current.push({ role: "assistant", content: full.trim() });
          await speak(full.trim());
        }
      } catch (err) {
        log("Coach error: " + err);
        if (liveRef.current) {
          setState("listening");
          recognitionRef.current?.start();
        }
      }
    },
    [log, speak]
  );

  /** Start live voice session */
  const startLive = useCallback(
    (lessonContext?: {
      lessonTitle?: string;
      moduleTitle?: string;
      courseTitle?: string;
    }) => {
      if (liveRef.current || !isSupported) return;
      liveRef.current = true;
      setIsLive(true);
      historyRef.current = [];
      contextRef.current = lessonContext || {};
      log("Starting voice session...");

      const SpeechRecognition =
        (window as unknown as { SpeechRecognition?: typeof window.SpeechRecognition }).SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition?: typeof window.SpeechRecognition }).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        log("Speech recognition not supported");
        liveRef.current = false;
        setIsLive(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false; // Stop after each utterance
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognitionRef.current = recognition;

      recognition.onstart = () => {
        setState("listening");
        log("Listening...");
      };

      recognition.onresult = (event: any) => {
        let interim = "";
        let final = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript;
          } else {
            interim += transcript;
          }
        }
        if (interim) {
          setInterimText(interim);
          log("Hearing: " + interim.slice(0, 40));
        }
        if (final) {
          setInterimText("");
          log("Heard: " + final.slice(0, 60));
          processUserSpeech(final);
        }
      };

      recognition.onerror = (event: any) => {
        // "no-speech" and "aborted" are normal — just restart
        if (event.error === "no-speech" || event.error === "aborted") {
          if (liveRef.current) {
            try { recognition.start(); } catch { /* already started */ }
          }
          return;
        }
        log("Speech error: " + event.error);
        console.error("[Voice] Recognition error:", event.error);
      };

      recognition.onend = () => {
        // Auto-restart if session is still live and not processing
        if (liveRef.current && state !== "thinking" && state !== "speaking") {
          try {
            recognition.start();
          } catch {
            // Already started or other issue
          }
        }
      };

      // Greet and start listening
      const greeting = lessonContext?.lessonTitle
        ? `Hey! Ready to work on ${lessonContext.lessonTitle}?`
        : "Hey! Ready to code together?";

      onTranscriptRef.current?.("assistant", greeting);
      historyRef.current.push({ role: "assistant", content: greeting });

      speak(greeting).then(() => {
        // speak() already restarts recognition after it finishes
      });
    },
    [isSupported, log, processUserSpeech, speak, state]
  );

  /** Stop session */
  const stopLive = useCallback(() => {
    liveRef.current = false;
    setIsLive(false);
    setState("idle");
    setInterimText("");
    setDebugLog("");

    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
  }, []);

  /** Interrupt speaking */
  const interrupt = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    setState("listening");
    log("Interrupted");
    if (liveRef.current && recognitionRef.current) {
      try { recognitionRef.current.start(); } catch { /* already started */ }
    }
  }, [log]);

  // Cleanup on unmount
  useEffect(
    () => () => {
      liveRef.current = false;
      if (recognitionRef.current) recognitionRef.current.abort();
      if (currentAudioRef.current) currentAudioRef.current.pause();
    },
    []
  );

  return {
    state,
    isLive,
    interimText,
    debugLog,
    isSupported,
    startLive,
    stopLive,
    interrupt,
  };
}
