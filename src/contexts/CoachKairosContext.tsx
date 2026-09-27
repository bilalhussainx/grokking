"use client";

import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { useCoachVoice } from "@/hooks/useCoachVoice";
import { DEFAULT_COACH_LANGUAGE } from "@/lib/cc/coach-languages";
import { coachErrorMessage } from "@/lib/cc/coach-error-message";

export interface CoachMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  mode: string;
  createdAt: string;
}

export interface CoachSendContext {
  essayId?: string;                 // Pin the coach to a specific essay (supplement vs PS)
  sourceEvent?: "review-landed" | "manual" | "schools-empty-state";
}

interface CoachKairosContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  // Open the drawer in-place for a specific dashboard variant. Seeds an
  // opening assistant message from src/lib/cc/variant-walkthroughs.ts so the
  // student sees a step-by-step plan tailored to their grade / phase rather
  // than the generic senior intake. No-op past the first turn so it doesn't
  // re-seed an ongoing conversation.
  openWithVariant: (variantKey: string) => void;
  // Tell the coach which dashboard variant the user is currently on so
  // ongoing turns include the variant guidance block in the system prompt.
  // Pass null to clear (e.g. when navigating off the dashboard).
  setVariantKey: (variantKey: string | null) => void;
  // Read the active variant for variant-aware UI (e.g. filter "Essay Studio →"
  // chips out for grade 9). Mirrors the ref used by sendMessage but is
  // re-render-safe.
  currentVariantKey: string | null;
  messages: CoachMessage[];
  sendMessage: (text: string, extra?: CoachSendContext) => Promise<void>;
  isStreaming: boolean;
  currentMode: string;
  isLoading: boolean;
  language: string;
  setLanguage: (code: string) => Promise<void>;
  voiceEnabled: boolean;
  setVoiceEnabled: (enabled: boolean) => void;
  isSpeaking: boolean;
  stopSpeaking: () => void;
  // Last TTS failure code, or null if voice played successfully or hasn't
  // run. Codes mirror SpeakResult.reason from useCoachVoice. UI consumers
  // (CoachChat) render a banner when this is non-null.
  ttsError: string | null;
  clearTtsError: () => void;
  familyMode: boolean;
  toggleFamilyMode: (on?: boolean) => void;
  // Append a turn that came from outside the normal sendMessage flow — used
  // by the voice-agent path so transcription + agent reply land in the same
  // message list the text flow uses.
  appendVoiceTurn: (role: "user" | "assistant", content: string) => void;
}

const CoachKairosContext = createContext<CoachKairosContextValue | null>(null);

const LS_LANG_KEY = "coach_kairos_language";
const LS_VOICE_KEY = "coach_kairos_voice_enabled";

export function CoachKairosProvider({ children }: { children: React.ReactNode }) {
  const { user, profile } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentMode, setCurrentMode] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguageState] = useState<string>(DEFAULT_COACH_LANGUAGE);
  const [voiceEnabled, setVoiceEnabledState] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const [familyMode, setFamilyMode] = useState(false);
  // Active dashboard variant — set by AdaptiveDashboard via setVariantKey or
  // openWithVariant. Null elsewhere so the API doesn't apply variant guidance
  // when the student is on, say, an essay page (the variant is dashboard-
  // scoped). Stored in a ref because we need to read it inside sendMessage
  // without re-creating the function on every variant change. Mirrored to
  // state for re-render-safe UI consumers (chip filtering).
  const variantKeyRef = useRef<string | null>(null);
  const [currentVariantKey, setCurrentVariantKey] = useState<string | null>(null);
  const proactiveSent = useRef(false);
  const historyLoaded = useRef(false);

  const { speak, stop: stopSpeakingImpl } = useCoachVoice();

  // Load preferences
  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedLang = localStorage.getItem(LS_LANG_KEY);
    const storedVoice = localStorage.getItem(LS_VOICE_KEY);
    if (storedLang) setLanguageState(storedLang);
    if (storedVoice === "true") setVoiceEnabledState(true);
  }, []);

  // Mirror the active coach language to <html lang>. Browsers, screen readers,
  // and the [lang="ur"] RTL CSS rule all key off this attribute.
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  // Listen to the TopNav picker's coach-language-change event so picking a
  // language anywhere in the app updates the coach in real-time.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onChange = (e: Event) => {
      const code = (e as CustomEvent<string>).detail;
      if (typeof code === "string" && code) setLanguageState(code);
    };
    window.addEventListener("coach-language-change", onChange);
    return () => window.removeEventListener("coach-language-change", onChange);
  }, []);

  useEffect(() => {
    if (!user) return;
    fetch("/api/cc/profile/voice")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.language) {
          setLanguageState(data.language);
          if (typeof window !== "undefined") {
            localStorage.setItem(LS_LANG_KEY, data.language);
          }
        }
      })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!user || historyLoaded.current) return;
    historyLoaded.current = true;
    setIsLoading(true);
    fetch("/api/cc/coach/history")
      .then((res) => res.ok ? res.json() : { messages: [] })
      .then((data) => {
        if (data.messages?.length) {
          setMessages(
            data.messages.map((m: { id: string; role: string; content: string; mode: string; created_at: string }) => ({
              id: m.id,
              role: m.role as "assistant" | "user",
              content: m.content,
              mode: m.mode,
              createdAt: m.created_at,
            }))
          );
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [user]);

  useEffect(() => {
    if (!user || proactiveSent.current || isLoading) return;
    if (messages.length > 0) {
      proactiveSent.current = true;
      return;
    }
    if (pathname === "/") {
      const timer = setTimeout(() => {
        if (!proactiveSent.current) {
          proactiveSent.current = true;
          setIsOpen(true);
          sendProactiveMessage();
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user, pathname, messages.length, isLoading]);

  // Deep-link params. `?coach=open` pops the coach; `?focus=intake` additionally
  // forces intake mode + seeds the opening assistant message so the legacy
  // /onboarding redirect lands the user in a conversational intake.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const wantsOpen = params.get("coach") === "open";
    const focus = params.get("focus");

    if (!wantsOpen && !focus) return;

    if (wantsOpen) setIsOpen(true);

    if (focus === "intake") {
      setIsOpen(true);
      setCurrentMode("intake");
      // Seed a proactive intake message only if conversation is empty. Wait for
      // history load to settle (isLoading=false, messages.length=0) to avoid
      // racing the history fetch — re-run the effect via proactiveSent gate.
      if (!proactiveSent.current && !isLoading && messages.length === 0) {
        proactiveSent.current = true;
        sendMessageInternal("hi");
      }
    }

    const url = new URL(window.location.href);
    url.searchParams.delete("coach");
    url.searchParams.delete("focus");
    window.history.replaceState({}, "", url.pathname + (url.search || ""));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  async function sendProactiveMessage() {
    await sendMessageInternal("hi");
  }

  const setLanguage = useCallback(async (code: string) => {
    setLanguageState(code);
    if (typeof window !== "undefined") {
      localStorage.setItem(LS_LANG_KEY, code);
    }
    if (user) {
      try {
        await fetch("/api/cc/profile/voice", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ language: code }),
        });
      } catch {
        // non-fatal
      }
    }
  }, [user]);

  const setVoiceEnabled = useCallback((enabled: boolean) => {
    setVoiceEnabledState(enabled);
    if (typeof window !== "undefined") {
      localStorage.setItem(LS_VOICE_KEY, String(enabled));
    }
    if (!enabled) {
      stopSpeakingImpl();
      setIsSpeaking(false);
    }
  }, [stopSpeakingImpl]);

  const stopSpeaking = useCallback(() => {
    stopSpeakingImpl();
    setIsSpeaking(false);
  }, [stopSpeakingImpl]);

  const sendMessage = useCallback(async (text: string, extra?: CoachSendContext) => {
    await sendMessageInternal(text, extra);
  }, [pathname, voiceEnabled, language]);

  async function sendMessageInternal(text: string, extra?: CoachSendContext) {
    const userMsg: CoachMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      mode: currentMode,
      createdAt: new Date().toISOString(),
    };

    if (text !== "hi" || messages.length > 0) {
      setMessages((prev) => [...prev, userMsg]);
    }

    setIsStreaming(true);

    const assistantMsg: CoachMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
      mode: currentMode,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, assistantMsg]);

    let finalContent = "";
    // Captured from the SSE `done` frame at end of stream. Task 4 of
    // the Coach Action Execution Reliability plan extends the route's
    // done frame with `extracted` (count of DB rows added) and `actionKinds`
    // (which canonical actions the LLM emitted). Declared at function
    // scope so the post-try broadcast (below) can read them.
    let extracted = 0;
    let actionKinds: string[] = [];

    try {
      const res = await fetch("/api/cc/coach/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          page_context: pathname,
          essay_id: extra?.essayId,
          source_event: extra?.sourceEvent,
          variant_key: variantKeyRef.current,
        }),
      });

      if (!res.ok || !res.body) {
        const errorBody = res.ok ? null : await res.json().catch(() => null);
        const content = coachErrorMessage(res.status, errorBody);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsg.id
              ? { ...m, content }
              : m
          )
        );
        setIsStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.done) {
              if (typeof data.extracted === "number") extracted = data.extracted;
              if (Array.isArray(data.actionKinds)) actionKinds = data.actionKinds as string[];
              break;
            }
            if (data.mode) setCurrentMode(data.mode);
            if (data.text) {
              finalContent += data.text;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsg.id
                    ? { ...m, content: m.content + data.text }
                    : m
                )
              );
            }
          } catch {
            // skip malformed
          }
        }
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsg.id
            ? { ...m, content: "Connection error. Please try again." }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }

    // Broadcast a completion event so data-backed pages (/schools, /cc/essays,
    // activities optimizer, dashboard, etc.) can refetch state that the coach
    // mutated server-side via runCoachExtraction. `extracted` is the count of
    // schools added in this turn (0 when no DB writes happened); `actionKinds`
    // names the canonical actions the LLM emitted (e.g. ["add_schools"]).
    // Listeners can use these to decide whether the event is relevant.
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("kairos:message-complete", {
          detail: {
            mode: currentMode,
            content: finalContent,
            source: extra?.sourceEvent ?? null,
            extracted,
            actionKinds,
          },
        })
      );
    }

    if (voiceEnabled && finalContent.trim()) {
      setIsSpeaking(true);
      speak(finalContent, language)
        .then((res) => {
          if (!res.ok && res.reason) setTtsError(res.reason);
          else setTtsError(null);
        })
        .catch((err) => {
          console.error("[CoachKairos] speak() threw unexpectedly:", err);
          setTtsError("AUDIO_PLAY_FAILED");
        })
        .finally(() => setIsSpeaking(false));
    }
  }

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const setVariantKey = useCallback((variantKey: string | null) => {
    variantKeyRef.current = variantKey;
    setCurrentVariantKey(variantKey);
  }, []);

  const openWithVariant = useCallback(async (variantKey: string) => {
    variantKeyRef.current = variantKey;
    setCurrentVariantKey(variantKey);
    setIsOpen(true);
    // Don't overwrite an in-flight load.
    if (isLoading) return;
    // Don't reseed an ongoing conversation — just open the drawer.
    if (messages.length > 0) return;
    proactiveSent.current = true;
    const { getWalkthroughSeed, fillGreeting } = await import("@/lib/cc/variant-walkthroughs");
    const seed = getWalkthroughSeed(variantKey as Parameters<typeof getWalkthroughSeed>[0]);
    setCurrentMode(seed.mode);

    // Substitute the student's first name into the {name} slot.
    const firstName = profile?.full_name?.trim().split(/\s+/)[0] ?? null;
    let opening = fillGreeting(seed.greeting, firstName);

    // Translate to the user's chosen coach language. Keep English as a
    // free no-op; for any other language, hit /api/language/translate.
    // If translation fails (network, credit balance, anything), fall
    // back to the English string — degrading gracefully beats blocking
    // the open. Costs 1 credit per translated open; cheap UX win for
    // non-English speakers.
    if (language && language !== "en") {
      try {
        const res = await fetch("/api/language/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: opening, fromLang: "en", toLang: language }),
        });
        if (res.ok) {
          const data = (await res.json()) as { translatedText?: string };
          if (data.translatedText) opening = data.translatedText;
        }
      } catch {
        // non-fatal — keep English fallback
      }
    }

    setMessages([
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: opening,
        mode: seed.mode,
        createdAt: new Date().toISOString(),
      },
    ]);
  }, [messages.length, isLoading, profile?.full_name, language]);

  const toggleFamilyMode = useCallback((on?: boolean) => {
    setFamilyMode((prev) => (on === undefined ? !prev : on));
  }, []);

  const appendVoiceTurn = useCallback((role: "user" | "assistant", content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;
    // Local state — show the turn in the chat immediately.
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role,
        content: trimmed,
        mode: "voice",
        createdAt: new Date().toISOString(),
      },
    ]);
    // Server persistence + extraction. The Deepgram Voice Agent runs its
    // LLM inside Deepgram's WebSocket, so our /api/cc/coach/message route
    // never sees the conversation. Without this POST, voice turns vanish
    // on reload AND the LLM-emitted <<actions>> block never reaches the
    // school-extraction pipeline.
    //
    // For assistant turns we also broadcast kairos:message-complete with
    // the schoolsAddedCount returned by the route — this is the same event
    // the text flow fires, so the existing /schools refetch listener and
    // the CoachChat toast both light up exactly as they do for typed turns.
    // Without this broadcast the voice flow had no parity with text:
    // schools would land in the DB but the open /schools page wouldn't
    // refetch until the user navigated away and back.
    fetch("/api/cc/coach/voice-turn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, content: trimmed }),
    })
      .then(async (res) => {
        if (!res.ok || role !== "assistant") return;
        const data = (await res.json().catch(() => null)) as
          | { schoolsAddedCount?: number }
          | null;
        const extracted = data?.schoolsAddedCount ?? 0;
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("kairos:message-complete", {
              detail: {
                mode: "voice",
                content: trimmed,
                source: null,
                extracted,
                actionKinds: extracted > 0 ? ["add_schools"] : [],
              },
            }),
          );
        }
      })
      .catch((err) => {
        console.warn("[CoachKairos] voice-turn persist failed (non-fatal):", err);
      });
  }, []);

  return (
    <CoachKairosContext.Provider
      value={{
        isOpen, open, close, toggle, openWithVariant, setVariantKey, currentVariantKey,
        messages, sendMessage, isStreaming, currentMode, isLoading,
        language, setLanguage, voiceEnabled, setVoiceEnabled,
        isSpeaking, stopSpeaking,
        ttsError, clearTtsError: () => setTtsError(null),
        familyMode, toggleFamilyMode,
        appendVoiceTurn,
      }}
    >
      {children}
    </CoachKairosContext.Provider>
  );
}

export function useCoachKairos() {
  const ctx = useContext(CoachKairosContext);
  if (!ctx) throw new Error("useCoachKairos must be used within CoachKairosProvider");
  return ctx;
}
