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
}

export interface VoiceAgentHook {
  isConnected: boolean;
  isConnecting: boolean;
  isSpeaking: boolean;
  micMuted: boolean;
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

  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  // Deepgram agent for Latin/CJK languages
  const deepgramAgent = useDeepgramAgent({
    onUserMessage: callbacks?.onUserMessage,
    onAgentMessage: callbacks?.onAgentMessage,
    onConnect: callbacks?.onConnect,
    onDisconnect: callbacks?.onDisconnect,
    onError: callbacks?.onError,
  });

  // Orchestrated agent for Indic languages
  const orchestratedAgent = useOrchestratedVoiceAgent({
    onUserMessage: callbacks?.onUserMessage,
    onAgentMessage: callbacks?.onAgentMessage,
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

    if (isSarvamLanguage(config.language)) {
      // Use orchestrated pipeline for Hindi/Punjabi
      await orchestratedAgent.start({
        language: config.language,
        personaId: config.personaId,
        proficiencyLevel: config.proficiencyLevel,
      });
    } else {
      // Use Deepgram Agent for Latin/CJK
      await deepgramAgent.start({
        lessonTitle: config.lessonTitle,
        moduleTitle: config.moduleTitle,
        courseTitle: config.courseTitle,
        personaId: config.personaId,
        voiceId: config.voiceId,
        mode: 'language',
        language: config.language,
        systemPrompt: config.systemPrompt,
        proficiencyLevel: config.proficiencyLevel,
      });
    }
  }, [deepgramAgent, orchestratedAgent]);

  const stop = useCallback(() => {
    deepgramAgent.stop();
    orchestratedAgent.stop();
    setCurrentConfig(null);
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
