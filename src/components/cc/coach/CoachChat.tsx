"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { Send, Mic, MicOff, CheckCircle2 } from "lucide-react";
import { useCoachKairos } from "@/contexts/CoachKairosContext";
import { useVoiceAgent, type VoiceAgentCallbacks } from "@/hooks/useVoiceAgent";
import CoachMessage from "./CoachMessage";

// Languages that have full Deepgram WebSocket Voice Agent support (bundled
// STT + LLM + TTS, sub-second). Sarvam languages (hi, pa, etc.) use the
// orchestrated streaming pipeline via the same useVoiceAgent hook — that
// path also works but keep this list for messaging purposes.
const VOICE_SUPPORTED_LANGUAGES = ["en", "es", "fr", "de", "nl", "it", "ja", "hi", "pa", "bn", "ta", "te", "gu", "kn", "ml", "mr", "od"];

// Fallback prompt used only if /api/cc/coach/voice-prompt is unreachable.
// The real prompt is fetched at start time so voice mode honors the user's
// intake state, school list, essay progress, etc.
const COACH_KAIROS_VOICE_FALLBACK_PROMPT = `You are Coach Kairos, an experienced college counselor.
You're having a voice conversation about the student's college applications. Keep replies short
(1-2 sentences). Guide them through intake -> school list -> activity list -> essays -> interviews
-> financial aid. Use their chosen language. No markdown — plain spoken sentences only.`;

export default function CoachChat() {
  const {
    messages,
    sendMessage,
    isStreaming,
    isLoading,
    language,
    appendVoiceTurn,
    ttsError,
    clearTtsError,
  } = useCoachKairos();

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Inline toast surfaces when the coach actually mutates DB state (e.g.
  // adds schools via the canonical <<actions>> block). Listens to the
  // window event the CoachKairosContext broadcasts after every turn.
  // Auto-dismisses after 4s.
  const [actionToast, setActionToast] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ extracted?: number; actionKinds?: string[] }>).detail;
      const count = detail?.extracted ?? 0;
      if (count > 0) {
        setActionToast(`Added ${count} school${count === 1 ? "" : "s"} to your list`);
      }
    };
    window.addEventListener("kairos:message-complete", handler);
    return () => window.removeEventListener("kairos:message-complete", handler);
  }, []);
  useEffect(() => {
    if (!actionToast) return;
    const t = setTimeout(() => setActionToast(null), 4000);
    return () => clearTimeout(t);
  }, [actionToast]);

  // ------------------------------------------------------------------
  // Voice agent (Deepgram WebSocket / Sarvam orchestrated, bundled STT+LLM+TTS)
  // ------------------------------------------------------------------
  const voiceCallbacks: VoiceAgentCallbacks = useMemo(
    () => ({
      onUserMessage: (text: string) => appendVoiceTurn("user", text),
      onAgentMessage: (text: string) => appendVoiceTurn("assistant", text),
      onError: (err: string) => {
        console.error("[CoachChat] voice agent error:", err);
      },
    }),
    [appendVoiceTurn],
  );

  const voiceAgent = useVoiceAgent(voiceCallbacks);
  const voiceAgentRef = useRef(voiceAgent);
  useEffect(() => {
    voiceAgentRef.current = voiceAgent;
  }, [voiceAgent]);

  // Stop the agent on unmount or language change so we don't leave a
  // stale WebSocket open when the user switches language mid-session.
  useEffect(() => {
    return () => {
      voiceAgentRef.current?.stop();
    };
  }, []);
  useEffect(() => {
    voiceAgentRef.current?.stop();
  }, [language]);

  const startVoice = useCallback(async () => {
    if (voiceAgent.isConnecting || voiceAgent.isConnected) return;
    if (!VOICE_SUPPORTED_LANGUAGES.includes(language)) {
      console.warn("[CoachChat] voice not supported for", language);
      return;
    }
    // Fetch the dynamic Coach Kairos system prompt so voice mode honors the
    // user's intake stage, school list, essay progress, etc. Fall back to a
    // generic prompt if the endpoint is unreachable.
    let systemPrompt = COACH_KAIROS_VOICE_FALLBACK_PROMPT;
    try {
      const res = await fetch("/api/cc/coach/voice-prompt");
      if (res.ok) {
        const data = (await res.json()) as { systemPrompt?: string };
        if (data.systemPrompt && data.systemPrompt.length > 100) {
          systemPrompt = data.systemPrompt;
        }
      }
    } catch (err) {
      console.warn("[CoachChat] voice-prompt fetch failed; using fallback", err);
    }

    await voiceAgent.start({
      personaId: "coach-kairos",
      systemPrompt,
      voiceProvider: "deepgram",
      voiceId: "aura-2-thalia-en",
      language,
      mode: "coach",
    });
  }, [voiceAgent, language]);

  const stopVoice = useCallback(() => {
    voiceAgent.stop();
  }, [voiceAgent]);

  const handleMicClick = useCallback(() => {
    if (voiceAgent.isConnected || voiceAgent.isConnecting) {
      stopVoice();
    } else {
      void startVoice();
    }
  }, [voiceAgent.isConnected, voiceAgent.isConnecting, startVoice, stopVoice]);

  // ------------------------------------------------------------------
  // Text submit (unchanged)
  // ------------------------------------------------------------------
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isStreaming) return;
    // Stop voice mode if active — mixing typed + voice turns muddles the
    // WebSocket conversation memory, so the typed flow takes over.
    if (voiceAgent.isConnected) stopVoice();
    setInput("");
    await sendMessage(text);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const voiceActive = voiceAgent.isConnected || voiceAgent.isConnecting;

  return (
    <>
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-[#D4AF37]" />
          </div>
        )}

        {!isLoading && messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-white/30 text-sm">Coach Kairos is ready to help.</p>
            <p className="text-white/20 text-xs mt-1">Type or tap the mic to speak.</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <CoachMessage
            key={msg.id}
            role={msg.role}
            content={msg.content}
            isStreaming={isStreaming && i === messages.length - 1 && msg.role === "assistant"}
          />
        ))}
      </div>

      {voiceActive && (
        <div className="mx-4 mb-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/25 text-[11px] text-rose-300 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
          {voiceAgent.isConnecting
            ? "Connecting voice…"
            : voiceAgent.isSpeaking
              ? "Coach is speaking… tap mic to interrupt"
              : voiceAgent.micMuted
                ? "Mic muted — tap mic to resume"
                : "Listening… speak in your language"}
        </div>
      )}

      {voiceAgent.error && (
        <div className="mx-4 mb-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-[11px] text-amber-300">
          {voiceAgent.error}
        </div>
      )}

      {ttsError && (
        <div className="mx-4 mb-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/25 text-[11px] text-rose-300 flex items-center gap-2">
          <span>
            Voice playback failed
            {ttsError === "TTS_EMPTY_AUDIO"
              ? " — Hindi voice glitched, try another reply"
              : ttsError.startsWith("VOICE_UNSUPPORTED:")
                ? ` — voice not yet supported for this language`
                : ttsError === "AUDIO_PLAY_FAILED"
                  ? " — your browser blocked audio playback"
                  : ""}
            .
          </span>
          <button
            onClick={clearTtsError}
            className="ml-auto underline hover:text-rose-200"
            type="button"
          >
            Dismiss
          </button>
        </div>
      )}

      {actionToast && (
        <div className="mx-4 mb-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-[11px] text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{actionToast}</span>
          <Link href="/schools" className="ml-auto underline hover:text-emerald-200">
            Open list →
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-white/10 shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            dir="auto"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={voiceActive ? "Voice mode — or type to switch" : "Ask Coach Kairos…"}
            disabled={isStreaming}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
          />

          <button
            type="button"
            onClick={handleMicClick}
            disabled={isStreaming || !VOICE_SUPPORTED_LANGUAGES.includes(language)}
            title={
              !VOICE_SUPPORTED_LANGUAGES.includes(language)
                ? "Voice not supported for this language"
                : voiceActive
                  ? "Stop voice"
                  : "Speak to Coach Kairos"
            }
            className={`px-3 py-2.5 rounded-xl border transition-all disabled:opacity-40 ${
              voiceActive
                ? "bg-rose-500/15 border-rose-500/40 text-rose-300 hover:bg-rose-500/20"
                : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            {voiceActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="px-3 py-2.5 rounded-xl bg-[#D4AF37] text-black disabled:opacity-40 transition-all hover:bg-[#C4A030]"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </>
  );
}
