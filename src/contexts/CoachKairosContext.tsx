"use client";

import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { useCoachVoice } from "@/hooks/useCoachVoice";
import { DEFAULT_COACH_LANGUAGE } from "@/lib/cc/coach-languages";

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
}

const CoachKairosContext = createContext<CoachKairosContextValue | null>(null);

const LS_LANG_KEY = "coach_kairos_language";
const LS_VOICE_KEY = "coach_kairos_voice_enabled";

export function CoachKairosProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentMode, setCurrentMode] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguageState] = useState<string>(DEFAULT_COACH_LANGUAGE);
  const [voiceEnabled, setVoiceEnabledState] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
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
    if (pathname === "/" || pathname === "/dashboard") {
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("coach") === "open") {
      setIsOpen(true);
      const url = new URL(window.location.href);
      url.searchParams.delete("coach");
      window.history.replaceState({}, "", url.pathname);
    }
  }, []);

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

    try {
      const res = await fetch("/api/cc/coach/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          page_context: pathname,
          essay_id: extra?.essayId,
          source_event: extra?.sourceEvent,
        }),
      });

      if (!res.ok || !res.body) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsg.id
              ? { ...m, content: "Sorry, I had trouble responding. Try again?" }
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
            if (data.done) break;
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

    if (voiceEnabled && finalContent.trim()) {
      setIsSpeaking(true);
      speak(finalContent, language)
        .catch(() => {})
        .finally(() => setIsSpeaking(false));
    }
  }

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <CoachKairosContext.Provider
      value={{
        isOpen, open, close, toggle,
        messages, sendMessage, isStreaming, currentMode, isLoading,
        language, setLanguage, voiceEnabled, setVoiceEnabled,
        isSpeaking, stopSpeaking,
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
