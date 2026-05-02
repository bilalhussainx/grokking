"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import FamilyModeMicButton from "./FamilyModeMicButton";
import {
  FAMILY_MODE_STRINGS,
  NO_VOICE_FAMILY_MODE_LANGUAGES,
  type FamilyModeLang,
} from "@/lib/cc/family-mode-strings";
import { getCoachLanguage } from "@/lib/cc/coach-languages";

const IDLE_TIMEOUT_MS = 5 * 60 * 1000;

const RECOGNITION_LOCALE: Record<string, string> = {
  en: "en-US", es: "es-ES", fr: "fr-FR", de: "de-DE", it: "it-IT", nl: "nl-NL", ja: "ja-JP",
  hi: "hi-IN", bn: "bn-IN", ta: "ta-IN", te: "te-IN", gu: "gu-IN", kn: "kn-IN",
  ml: "ml-IN", mr: "mr-IN", pa: "pa-IN", od: "or-IN",
};

type Turn = { role: "parent" | "coach"; content: string };

// SpeechRecognition type isn't in lib.dom.d.ts everywhere yet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RecognitionRef = any;

export default function FamilyModeView({
  language,
  onExit,
}: {
  language: string;
  onExit: () => void;
}) {
  const langInfo = getCoachLanguage(language);
  const strings = FAMILY_MODE_STRINGS[language as FamilyModeLang] ?? FAMILY_MODE_STRINGS.en;

  const [turns, setTurns] = useState<Turn[]>([]);
  const [state, setState] = useState<"idle" | "listening" | "thinking">("idle");
  const [error, setError] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");
  const idleRef = useRef<number | null>(null);
  const recognitionRef = useRef<RecognitionRef>(null);

  // Languages without browser SpeechRecognition (currently: Urdu) get a text
  // input instead of the mic. AUD-P4-001 — keeps Family Mode usable for Urdu
  // parents instead of the previous "button disabled" no-go.
  const textOnly = NO_VOICE_FAMILY_MODE_LANGUAGES.has(language);

  const sendTextMessage = async (transcript: string) => {
    const t = transcript.trim();
    if (!t) return;
    setTurns((prev) => [...prev, { role: "parent", content: t }]);
    setTextInput("");
    setState("thinking");
    try {
      const res = await fetch("/api/cc/coach/family-mode/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: t, language }),
      });
      if (res.ok) {
        const { reply } = await res.json();
        setTurns((prev) => [...prev, { role: "coach", content: reply }]);
      }
    } catch (err) {
      console.warn("[family-mode] text message failed", err);
    } finally {
      setState("idle");
    }
  };

  // Idle timeout — exits after 5 minutes of no input
  useEffect(() => {
    const reset = () => {
      if (idleRef.current) window.clearTimeout(idleRef.current);
      idleRef.current = window.setTimeout(onExit, IDLE_TIMEOUT_MS);
    };
    reset();
    return () => {
      if (idleRef.current) window.clearTimeout(idleRef.current);
    };
  }, [turns, onExit]);

  const startListening = () => {
    setError(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setError("Voice not supported in this browser. Use Chrome, Edge, or Safari.");
      return;
    }
    const rec = new SR();
    recognitionRef.current = rec;
    rec.lang = RECOGNITION_LOCALE[language] ?? "en-US";
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    setState("listening");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = async (e: any) => {
      const transcript: string = e.results?.[0]?.[0]?.transcript ?? "";
      if (!transcript) {
        setState("idle");
        return;
      }
      setTurns((prev) => [...prev, { role: "parent", content: transcript }]);
      setState("thinking");
      try {
        const res = await fetch("/api/cc/coach/family-mode/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: transcript, language }),
        });
        if (res.ok) {
          const { reply } = await res.json();
          setTurns((prev) => [...prev, { role: "coach", content: reply }]);
          if (typeof window !== "undefined" && "speechSynthesis" in window) {
            const utter = new SpeechSynthesisUtterance(reply);
            utter.lang = RECOGNITION_LOCALE[language] ?? "en-US";
            window.speechSynthesis.speak(utter);
          }
        }
      } catch (err) {
        console.warn("[family-mode] message failed", err);
      } finally {
        setState("idle");
      }
    };
    rec.onerror = () => {
      setState("idle");
      setError("Couldn't hear you. Try again.");
    };
    rec.onend = () => {
      // If we never got a result, return to idle
      setState((current) => (current === "listening" ? "idle" : current));
    };
    rec.start();
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-md flex flex-col" lang={language}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <span className="text-xs text-white/60">{langInfo.nativeName}</span>
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-[12px] text-[#D4AF37] hover:text-[#E5C36F]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {strings.handBack}
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-8 overflow-hidden">
        <div className="w-full max-w-md flex flex-col gap-3 max-h-[40vh] overflow-y-auto">
          {turns.slice(-4).map((t, i) => (
            <div
              key={i}
              dir="auto"
              className={`px-4 py-3 rounded-2xl text-[14px] ${
                t.role === "parent"
                  ? "bg-white/10 self-end"
                  : "bg-[#D4AF37]/15 text-[#FAE5A5] self-start"
              }`}
            >
              {t.content}
            </div>
          ))}
        </div>

        {textOnly ? (
          <form
            onSubmit={(e) => { e.preventDefault(); sendTextMessage(textInput); }}
            className="w-full max-w-md flex items-center gap-2"
          >
            <input
              type="text"
              dir="auto"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={strings.typeHere ?? "Type here…"}
              disabled={state === "thinking"}
              className="flex-1 px-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-white text-[14px] placeholder:text-white/35 focus:outline-none focus:border-[#D4AF37]/50 disabled:opacity-40"
            />
            <button
              type="submit"
              disabled={!textInput.trim() || state === "thinking"}
              aria-label={strings.send ?? "Send"}
              className="p-3 rounded-2xl bg-[#D4AF37] text-black hover:bg-[#C4A030] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <FamilyModeMicButton state={state} onTap={startListening} />
        )}
        <p className="text-[13px] text-white/60">
          {state === "thinking"
            ? strings.thinking
            : textOnly
              ? (strings.typeHere ?? strings.tapToSpeak)
              : state === "listening"
                ? strings.listening
                : strings.tapToSpeak}
        </p>
        {error && <p className="text-[12px] text-rose-300">{error}</p>}
      </div>
    </div>
  );
}
