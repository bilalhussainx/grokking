"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useVoiceAgent } from "@/hooks/useVoiceAgent";
import { getLanguagePersonas, getDefaultPersona, type LanguagePersona, type ProficiencyLevel } from "@/lib/language-personas";
import { Mic, MicOff, Phone, PhoneOff, Volume2, User, MessageSquare, BookOpen, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageTutorPanelProps {
  language: string;
  languageName: string;
  lessonTitle?: string;
  moduleTitle?: string;
  courseTitle?: string;
  proficiencyLevel?: ProficiencyLevel;
  targetPhrases?: string[];
  className?: string;
}

interface Message {
  role: "user" | "agent";
  text: string;
  timestamp: Date;
}

export function LanguageTutorPanel({
  language,
  languageName,
  lessonTitle,
  moduleTitle,
  courseTitle,
  proficiencyLevel = "A1",
  targetPhrases = [],
  className,
}: LanguageTutorPanelProps) {
  const [selectedPersona, setSelectedPersona] = useState<LanguagePersona | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showPersonaSelector, setShowPersonaSelector] = useState(false);
  const [dueVocab, setDueVocab] = useState<{ word: string; translation: string; masteryLevel: number }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const voiceAgent = useVoiceAgent({
    onUserMessage: (text) => {
      setMessages((prev) => [...prev, { role: "user", text, timestamp: new Date() }]);
    },
    onAgentMessage: (text) => {
      setMessages((prev) => [...prev, { role: "agent", text, timestamp: new Date() }]);
    },
    onError: (error) => {
      console.error("[LanguageTutor] Voice error:", error);
    },
  });

  // Load default persona and due vocab on mount
  useEffect(() => {
    const loadInitialData = async () => {
      const defaultPersona = getDefaultPersona(language);
      setSelectedPersona(defaultPersona);

      // Fetch due vocabulary
      try {
        const resp = await fetch(`/api/language/vocab/due?language=${language}&limit=5`);
        if (resp.ok) {
          const data = await resp.json();
          setDueVocab(data.vocab || []);
        }
      } catch (err) {
        console.error("[LanguageTutor] Failed to load due vocab:", err);
      }
    };
    loadInitialData();
  }, [language]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStartSession = useCallback(async () => {
    if (!selectedPersona) return;

    // Get persona config from API
    const resp = await fetch(
      `/api/language/persona-config?language=${language}&personaId=${selectedPersona.id}&proficiencyLevel=${proficiencyLevel}`
    );
    
    if (!resp.ok) {
      console.error("[LanguageTutor] Failed to get persona config");
      return;
    }

    const data = await resp.json();
    const voiceConfig = data.config;

    await voiceAgent.start({
      personaId: voiceConfig.personaId,
      systemPrompt: voiceConfig.systemPrompt,
      voiceProvider: voiceConfig.voiceProvider,
      voiceId: voiceConfig.voiceId,
      language: voiceConfig.language || language,
      proficiencyLevel,
      lessonTitle,
      moduleTitle,
      courseTitle,
    });

    // Add greeting to messages
    if (data.greeting) {
      setMessages((prev) => [
        ...prev,
        { role: "agent", text: data.greeting, timestamp: new Date() },
      ]);
    }
  }, [selectedPersona, language, proficiencyLevel, lessonTitle, moduleTitle, courseTitle, voiceAgent]);

  const handleStopSession = useCallback(() => {
    voiceAgent.stop();
  }, [voiceAgent]);

  const personas = getLanguagePersonas(language);

  return (
    <div className={cn("flex flex-col h-full bg-slate-900 border-l border-slate-800", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
            <User className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-medium text-slate-100 text-sm">Language Tutor</h3>
            <p className="text-xs text-slate-400">{languageName} • {proficiencyLevel}</p>
          </div>
        </div>
        
        {voiceAgent.isConnected ? (
          <button
            onClick={handleStopSession}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-xs font-medium"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            End
          </button>
        ) : (
          <button
            onClick={handleStartSession}
            disabled={!selectedPersona || voiceAgent.isConnecting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Phone className="w-3.5 h-3.5" />
            {voiceAgent.isConnecting ? "Connecting..." : "Start"}
          </button>
        )}
      </div>

      {/* Persona Selector */}
      <div className="px-4 py-3 border-b border-slate-800">
        <button
          onClick={() => setShowPersonaSelector(!showPersonaSelector)}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Persona:</span>
            {selectedPersona ? (
              <span className="text-sm text-slate-200">{selectedPersona.name}</span>
            ) : (
              <span className="text-sm text-slate-500">Loading...</span>
            )}
          </div>
          <span className="text-xs text-indigo-400">
            {showPersonaSelector ? "Hide" : "Change"}
          </span>
        </button>

        {showPersonaSelector && (
          <div className="mt-3 space-y-2">
            {personas.map((persona) => (
              <button
                key={persona.id}
                onClick={() => {
                  setSelectedPersona(persona);
                  setShowPersonaSelector(false);
                }}
                className={cn(
                  "w-full text-left p-3 rounded-lg border transition-all",
                  selectedPersona?.id === persona.id
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-slate-700 hover:border-slate-600 bg-slate-800/50"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-200 text-sm">{persona.name}</span>
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    persona.style === "strict" && "bg-amber-500/20 text-amber-400",
                    persona.style === "conversational" && "bg-emerald-500/20 text-emerald-400",
                    persona.style === "patient" && "bg-blue-500/20 text-blue-400"
                  )}>
                    {persona.style}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{persona.description}</p>
                <p className="text-xs text-slate-500 mt-0.5">{persona.culturalBackground}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Voice Status */}
      {voiceAgent.isConnected && (
        <div className="px-4 py-2 border-b border-slate-800 bg-slate-800/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full animate-pulse",
                voiceAgent.isSpeaking ? "bg-emerald-400" : "bg-indigo-400"
              )} />
              <span className="text-xs text-slate-300">
                {voiceAgent.isSpeaking ? "Speaking..." : voiceAgent.micMuted ? "Mic muted" : "Listening..."}
              </span>
            </div>
            <button
              onClick={() => voiceAgent.toggleMic()}
              className={cn(
                "p-1.5 rounded-lg transition-colors",
                voiceAgent.micMuted
                  ? "bg-red-500/20 text-red-400"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              )}
            >
              {voiceAgent.micMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {voiceAgent.error && (
        <div className="px-4 py-2 border-b border-red-500/20 bg-red-500/10">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-red-400" />
            <span className="text-xs text-red-400">{voiceAgent.error}</span>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-slate-500 py-8">
            <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Start a conversation to practice {languageName}</p>
            <p className="text-xs mt-1">Your tutor will adapt to your {proficiencyLevel} level</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={cn(
                "flex gap-2",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === "agent" && (
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-3 h-3 text-indigo-400" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] px-3 py-2 rounded-lg text-sm",
                  msg.role === "user"
                    ? "bg-indigo-500/20 text-indigo-100"
                    : "bg-slate-800 text-slate-200"
                )}
              >
                {msg.text}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Target Phrases */}
      {targetPhrases.length > 0 && (
        <div className="px-4 py-3 border-t border-slate-800 bg-slate-800/30">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-medium text-slate-400">Target Phrases</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {targetPhrases.map((phrase, idx) => (
              <span
                key={idx}
                className="px-2 py-1 rounded-md bg-slate-800 text-xs text-slate-300 border border-slate-700"
              >
                {phrase}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Due Vocabulary */}
      {dueVocab.length > 0 && (
        <div className="px-4 py-3 border-t border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <Volume2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-medium text-slate-400">Due for Review</span>
          </div>
          <div className="space-y-1.5">
            {dueVocab.slice(0, 3).map((vocab, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-2 py-1.5 rounded-md bg-slate-800/50 text-xs"
              >
                <span className="text-slate-200">{vocab.word}</span>
                <span className="text-slate-500">= {vocab.translation}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
