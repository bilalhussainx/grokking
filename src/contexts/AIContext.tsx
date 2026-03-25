"use client";

import { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from "react";
import { AIMode, AIMessage, LessonContext } from "@/types/ai";

/**
 * AI Event Bus — components emit events, Coach subscribes.
 * This eliminates race conditions between LessonPage setting context
 * and Coach reading it.
 */
export type AIEvent =
  | { type: "LESSON_OPENED"; lesson: LessonContext }
  | { type: "LESSON_CLOSED" }
  | { type: "CODE_CHANGED"; code: string; diff: number }
  | { type: "USER_IDLE"; seconds: number }
  | { type: "USER_SPOKE"; text: string }
  | { type: "COURSE_OPENED"; courseSlug: string; courseTitle: string }
  | { type: "NAVIGATION"; from: string; to: string };

type AIEventListener = (event: AIEvent) => void;

interface AIContextValue {
  // Chat state
  messages: AIMessage[];
  addMessage: (msg: AIMessage) => void;
  clearMessages: () => void;
  isStreaming: boolean;
  setIsStreaming: (v: boolean) => void;

  // Mode
  mode: AIMode;
  setMode: (m: AIMode) => void;

  // Panel visibility
  isPanelOpen: boolean;
  togglePanel: () => void;
  openPanel: () => void;
  closePanel: () => void;

  // Lesson context (still here for backward compat)
  lessonContext: LessonContext | null;
  setLessonContext: (ctx: LessonContext | null) => void;

  // Current code in IDE
  currentCode: string;
  setCurrentCode: (code: string) => void;

  // Event bus
  emit: (event: AIEvent) => void;
  subscribe: (listener: AIEventListener) => () => void;
}

const AICtx = createContext<AIContextValue | null>(null);

export function AIProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [mode, setMode] = useState<AIMode>("tutor");
  const [isPanelOpen, setIsPanelOpen] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('coach-panel-open') === 'true';
    return false;
  });
  const [lessonContext, setLessonContextState] = useState<LessonContext | null>(null);
  const [currentCode, setCurrentCode] = useState("");

  // Event bus
  const listenersRef = useRef<Set<AIEventListener>>(new Set());

  const emit = useCallback((event: AIEvent) => {
    listenersRef.current.forEach((listener) => {
      try { listener(event); } catch (err) { console.error("[AI Event Bus] Listener error:", err); }
    });
  }, []);

  const subscribe = useCallback((listener: AIEventListener) => {
    listenersRef.current.add(listener);
    return () => { listenersRef.current.delete(listener); };
  }, []);

  // Wrapper that also emits events when lesson context changes
  const setLessonContext = useCallback((ctx: LessonContext | null) => {
    setLessonContextState(ctx);
    if (ctx) {
      emit({ type: "LESSON_OPENED", lesson: ctx });
    } else {
      emit({ type: "LESSON_CLOSED" });
    }
  }, [emit]);

  const addMessage = useCallback((msg: AIMessage) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const clearMessages = useCallback(() => setMessages([]), []);
  const togglePanel = useCallback(() => setIsPanelOpen((p) => {
    const next = !p;
    localStorage.setItem('coach-panel-open', String(next));
    return next;
  }), []);
  const openPanel = useCallback(() => {
    setIsPanelOpen(true);
    localStorage.setItem('coach-panel-open', 'true');
  }, []);
  const closePanel = useCallback(() => {
    setIsPanelOpen(false);
    localStorage.setItem('coach-panel-open', 'false');
  }, []);

  return (
    <AICtx.Provider
      value={{
        messages, addMessage, clearMessages,
        isStreaming, setIsStreaming,
        mode, setMode,
        isPanelOpen, togglePanel, openPanel, closePanel,
        lessonContext, setLessonContext,
        currentCode, setCurrentCode,
        emit, subscribe,
      }}
    >
      {children}
    </AICtx.Provider>
  );
}

export function useAI() {
  const ctx = useContext(AICtx);
  if (!ctx) throw new Error("useAI must be used within AIProvider");
  return ctx;
}
