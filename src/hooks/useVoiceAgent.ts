"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useDeepgramAgent } from "./useDeepgramAgent";
import { useOrchestratedVoiceAgent } from "./useOrchestratedVoiceAgent";
import type { VoiceAgentConfig } from "@/lib/language-personas";
import { isSarvamLanguage } from "@/lib/voice-provider-router";

// Re-export types for convenience
export type { VoiceAgentConfig } from "@/lib/language-personas";

export interface VoiceAgentCallbacks {
  onUserMessage?: (text: string) => void;
  onAgentMessage?: (text: string) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: string) => void;
  onGreetingDone?: () => void;
}

export interface VoiceAgentHook {
  isConnected: boolean;
  isConnecting: boolean;
  isSpeaking: boolean;
  micMuted: boolean;
  isGreetingPhase: boolean;
  error: string;
  start: (config: VoiceAgentConfig) => Promise<void>;
  stop: () => void;
  toggleMic: () => void;
  sendPromptUpdate: (prompt: string) => void;
}

/**
 * Voice agent hook — routes to appropriate backend based on language:
 * 
 * - Deepgram Agent (WebSocket): es, fr, zh, de, it, ja
 *   Uses Deepgram STT + Deepgram TTS + Moonshot LLM (bundled)
 *   Best for languages where Deepgram has native voices
 * 
 * - Orchestrated Agent (streaming): hi, pa
 *   Uses Deepgram STT + Sarvam TTS + Moonshot LLM (custom pipeline)
 *   Required for Indic languages where English accent is insufficient
 */
export function useVoiceAgent(callbacks?: VoiceAgentCallbacks): VoiceAgentHook {
  const [currentConfig, setCurrentConfig] = useState<VoiceAgentConfig | null>(null);
  const callbacksRef = useRef(callbacks);
  // Transcript buffer for sub-project 4 session analysis (language tutor only)
  const transcriptRef = useRef<{ role: "user" | "assistant"; content: string }[]>([]);
  const sessionLanguageRef = useRef<string | null>(null);

  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  const handleUserMessage = useCallback((text: string) => {
    if (text?.trim()) transcriptRef.current.push({ role: "user", content: text });
    callbacksRef.current?.onUserMessage?.(text);
  }, []);

  const handleAgentMessage = useCallback((text: string) => {
    if (text?.trim()) transcriptRef.current.push({ role: "assistant", content: text });
    callbacksRef.current?.onAgentMessage?.(text);
  }, []);

  // Deepgram agent for Latin/CJK languages
  const deepgramAgent = useDeepgramAgent({
    onUserMessage: handleUserMessage,
    onAgentMessage: handleAgentMessage,
    onConnect: callbacks?.onConnect,
    onDisconnect: callbacks?.onDisconnect,
    onError: callbacks?.onError,
    onGreetingDone: callbacks?.onGreetingDone,
  });

  // Orchestrated agent for Indic languages
  const orchestratedAgent = useOrchestratedVoiceAgent({
    onUserMessage: handleUserMessage,
    onAgentMessage: handleAgentMessage,
    onConnect: callbacks?.onConnect,
    onDisconnect: callbacks?.onDisconnect,
    onError: callbacks?.onError,
  });

  // Get active agent based on current language
  const activeAgent = currentConfig && isSarvamLanguage(currentConfig.language)
    ? orchestratedAgent
    : deepgramAgent;

  const start = useCallback(async (config: VoiceAgentConfig) => {
    // Always stop any existing session before starting a new one
    deepgramAgent.stop();
    orchestratedAgent.stop();
    setCurrentConfig(config);
    transcriptRef.current = [];
    sessionLanguageRef.current = config.mode === 'interviewer' ? null : config.language;

    // Determine the effective mode for downstream calls.
    // 'interviewer' triggers interview prompt builders in the API routes.
    const isInterviewer = config.mode === 'interviewer';

    if (isSarvamLanguage(config.language)) {
      // Use orchestrated pipeline for Hindi/Punjabi (Sarvam TTS)
      await orchestratedAgent.start({
        language: config.language,
        personaId: config.personaId,
        proficiencyLevel: config.proficiencyLevel,
        lessonTitle: config.lessonTitle,
        lessonContext: config.lessonContext,
        // Interview mode passthrough
        mode: isInterviewer ? 'interviewer' : 'language',
        companyPersonaId: config.companyPersonaId,
        questionPlan: config.questionPlan,
        interviewType: config.interviewType,
      });
    } else {
      // Use Deepgram Agent for Latin/CJK languages
      await deepgramAgent.start({
        lessonTitle: config.lessonTitle,
        moduleTitle: config.moduleTitle,
        courseTitle: config.courseTitle,
        personaId: config.personaId,
        voiceId: config.voiceId,
        // CRITICAL: preserve 'interviewer' mode so the route applies persona + code-mix prompts
        mode: isInterviewer ? 'interviewer' : (config.mode === 'coach' ? 'coach' : 'language'),
        language: config.language,
        systemPrompt: config.systemPrompt,
        proficiencyLevel: config.proficiencyLevel,
        lessonContext: config.lessonContext,
        // Interview mode passthrough
        companyPersonaId: config.companyPersonaId,
        questionPlan: config.questionPlan,
        interviewType: config.interviewType,
      });
    }
  }, [deepgramAgent, orchestratedAgent]);

  const stop = useCallback(() => {
    deepgramAgent.stop();
    orchestratedAgent.stop();
    setCurrentConfig(null);

    // Sub-project 4: fire-and-forget post-session analysis for language tutor.
    // Skipped for interviewer mode (which has its own scoring pipeline).
    const lang = sessionLanguageRef.current;
    const transcript = transcriptRef.current;
    sessionLanguageRef.current = null;
    transcriptRef.current = [];
    if (lang && transcript.length >= 2) {
      fetch("/api/language/analyze-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: lang, transcript }),
      }).catch(() => {});
    }
  }, [deepgramAgent, orchestratedAgent]);

  const toggleMic = useCallback(() => {
    activeAgent.toggleMic();
  }, [activeAgent]);

  const sendPromptUpdate = useCallback((prompt: string) => {
    activeAgent.sendPromptUpdate(prompt);
  }, [activeAgent]);

  return {
    isConnected: activeAgent.isConnected,
    isConnecting: activeAgent.isConnecting,
    isSpeaking: activeAgent.isSpeaking,
    micMuted: activeAgent.micMuted,
    isGreetingPhase: activeAgent.isGreetingPhase || false,
    error: activeAgent.error,
    start,
    stop,
    toggleMic,
    sendPromptUpdate,
  };
}

/**
 * Convenience hook for language learning.
 * Loads persona config from API and provides a startWithLesson helper.
 */
export function useLanguageVoiceAgent(
  language: string,
  personaId: string,
  proficiencyLevel?: string,
  callbacks?: VoiceAgentCallbacks
) {
  const agent = useVoiceAgent(callbacks);
  const [isReady, setIsReady] = useState(false);
  const [config, setConfig] = useState<VoiceAgentConfig | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const resp = await fetch(
          `/api/language/persona-config?language=${language}&personaId=${personaId}&proficiencyLevel=${proficiencyLevel || 'A1'}`
        );
        if (resp.ok) {
          const data = await resp.json();
          setConfig(data.config);
          setIsReady(true);
        }
      } catch (err) {
        console.error("[useLanguageVoiceAgent] Failed to load config:", err);
      }
    };
    loadConfig();
  }, [language, personaId, proficiencyLevel]);

  const startWithLesson = useCallback(async (lessonContext?: {
    lessonTitle?: string;
    moduleTitle?: string;
    courseTitle?: string;
  }) => {
    if (!config) return;
    await agent.start({ ...config, ...lessonContext });
  }, [agent, config]);

  return {
    ...agent,
    isReady,
    config,
    startWithLesson,
  };
}

/**
 * Hook for quick practice mode (no specific lesson).
 */
export function useQuickPracticeAgent(
  language: string,
  callbacks?: VoiceAgentCallbacks
) {
  const [personaId, setPersonaId] = useState<string>(`${language}-conversational-default`);
  const [proficiencyLevel, setProficiencyLevel] = useState<string>('A1');

  const agent = useLanguageVoiceAgent(
    language,
    personaId,
    proficiencyLevel,
    callbacks
  );

  return {
    ...agent,
    personaId,
    proficiencyLevel,
    setPersona: setPersonaId,
    setLevel: setProficiencyLevel,
  };
}
