"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Phone, PhoneOff, ChevronLeft, Volume2, Settings, MessageSquare, Code, BookOpen, Briefcase, MessagesSquare } from "lucide-react";
import { useVoiceAgent, type VoiceAgentCallbacks } from "@/hooks/useVoiceAgent";
import { getLanguagePersonas, getDefaultPersona, getSupportedLanguages, type LanguagePersona } from "@/lib/language-personas";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import SignupPrompt from "@/components/auth/SignupPrompt";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
}

export default function TalkPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--background)] flex items-center justify-center"><div className="text-slate-500 animate-pulse">Loading...</div></div>}>
      <TalkPageInner />
    </Suspense>
  );
}

function TalkPageInner() {
  const searchParams = useSearchParams();
  const preselectedLang = searchParams.get("lang");
  const { user } = useAuth();
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);

  // State
  const [step, setStep] = useState<"select" | "topic" | "talking">(preselectedLang ? "topic" : "select");
  const [selectedLang, setSelectedLang] = useState(preselectedLang || "");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [customTopic, setCustomTopic] = useState("");
  const [selectedPersona, setSelectedPersona] = useState<LanguagePersona | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionTime, setSessionTime] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Timer
  useEffect(() => {
    if (step !== "talking") return;
    const timer = setInterval(() => setSessionTime((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, [step]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  // Voice agent callbacks
  const callbacks: VoiceAgentCallbacks = {
    onUserMessage: useCallback((text: string) => {
      setMessages((prev) => [
        ...prev,
        { id: `u-${Date.now()}`, role: "user", text, timestamp: new Date() },
      ]);
    }, []),
    onAgentMessage: useCallback((text: string) => {
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", text, timestamp: new Date() },
      ]);
    }, []),
  };

  const agent = useVoiceAgent(callbacks);

  // Auto-start if language preselected
  useEffect(() => {
    if (preselectedLang && !selectedPersona) {
      const persona = getDefaultPersona(preselectedLang);
      setSelectedPersona(persona);
      setSelectedLang(preselectedLang);
    }
  }, [preselectedLang, selectedPersona]);

  const selectLanguage = useCallback((lang: string) => {
    const persona = getDefaultPersona(lang);
    setSelectedPersona(persona);
    setSelectedLang(lang);
    setSelectedTopic(null);
    setCustomTopic("");
    setStep("topic");
  }, []);

  const startConversation = useCallback(
    async (topic: string) => {
      const lang = selectedLang;
      const persona = selectedPersona || getDefaultPersona(lang);
      setStep("talking");

      // Build topic-aware system prompt
      let systemPrompt = persona.systemPrompt;
      if (topic) {
        systemPrompt = `The user wants to discuss: "${topic}". Guide the conversation around this topic while staying in your tutor role.\n\n${systemPrompt}`;
      } else {
        systemPrompt = `The user chose to chat freely. Start by asking them what they would like to learn about today.\n\n${systemPrompt}`;
      }

      // Show 3-2-1 countdown
      setCountdown(3);
      await new Promise(r => setTimeout(r, 1000));
      setCountdown(2);
      await new Promise(r => setTimeout(r, 1000));
      setCountdown(1);
      await new Promise(r => setTimeout(r, 1000));
      setCountdown(null);

      try {
        // Mark daily mission "talk to AI tutor" — auto-detect
        const { markMissionComplete } = await import("@/lib/dailyMissions");
        markMissionComplete("voice-tutor");

        await agent.start({
          personaId: persona.id,
          systemPrompt,
          voiceProvider: persona.defaultVoice.provider as "kokoro" | "sarvam" | "deepgram",
          voiceId: persona.defaultVoice.voiceId,
          language: lang,
          proficiencyLevel: "A1",
        });
      } catch (err) {
        console.error("Failed to start voice agent:", err);
      }
    },
    [agent, selectedLang, selectedPersona]
  );

  const endConversation = useCallback(() => {
    agent.stop();

    // Save conversation checkpoint if there are messages and user is authenticated
    if (messages.length > 0 && user) {
      fetch('/api/language/session', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetLanguage: selectedLang,
          transcript: messages.map(m => ({ role: m.role, text: m.text, timestamp: m.timestamp.toISOString() })),
          currentTopicId: `${selectedLang}-beginner-greetings`, // TODO: get from course progress
          currentTopicName: 'Greetings',
          nextTopicId: `${selectedLang}-beginner-personal-info`,
          nextTopicName: 'Personal Information',
        }),
      }).catch(console.error);
    }

    // Show signup prompt for guest users after their session
    if (!user && messages.length > 0) {
      setShowSignupPrompt(true);
    }

    setStep("select");
    setMessages([]);
    setSessionTime(0);
    setSelectedPersona(null);
    setSelectedLang("");
    setSelectedTopic(null);
    setCustomTopic("");
  }, [agent, messages, selectedLang, user]);

  // ─── Guest Signup Prompt (renders on any step) ───
  const signupPromptOverlay = (
    <SignupPrompt
      show={showSignupPrompt}
      onDismiss={() => setShowSignupPrompt(false)}
      title="Good conversation."
      message="Sign up to save your progress and get unlimited sessions."
    />
  );

  // ─── Select Language Screen ───
  if (step === "select") {
    const languages = [
      { code: "en", name: "English", flag: "\u{1F1FA}\u{1F1F8}", native: "English" },
      { code: "es", name: "Spanish", flag: "\u{1F1EA}\u{1F1F8}", native: "Espa\u00F1ol" },
      { code: "fr", name: "French", flag: "\u{1F1EB}\u{1F1F7}", native: "Fran\u00E7ais" },
      { code: "de", name: "German", flag: "\u{1F1E9}\u{1F1EA}", native: "Deutsch" },
      { code: "it", name: "Italian", flag: "\u{1F1EE}\u{1F1F9}", native: "Italiano" },
      { code: "nl", name: "Dutch", flag: "\u{1F1F3}\u{1F1F1}", native: "Nederlands" },
      { code: "ja", name: "Japanese", flag: "\u{1F1EF}\u{1F1F5}", native: "\u65E5\u672C\u8A9E" },
      { code: "hi", name: "Hindi", flag: "\u{1F1EE}\u{1F1F3}", native: "\u0939\u093F\u0928\u094D\u0926\u0940" },
    ];

    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col">
        {signupPromptOverlay}
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-800/50">
          <Link href="/" className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold text-white">Who do you want to talk to?</h1>
        </div>

        {/* Language Grid */}
        <div className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full">
          <motion.div
            className="grid grid-cols-2 gap-3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
            }}
          >
            {languages.map((lang) => (
              <motion.button
                key={lang.code}
                onClick={() => selectLanguage(lang.code)}
                className="flex items-center gap-4 p-5 rounded-2xl bg-slate-800/40 border border-slate-700/40 hover:bg-slate-800/70 hover:border-slate-600 transition-all text-left"
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="text-3xl">{lang.flag}</span>
                <div>
                  <div className="text-white font-medium">{lang.name}</div>
                  <div className="text-slate-500 text-sm">{lang.native}</div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>
    );
  }

  // ─── Topic Selection Screen ───
  if (step === "topic") {
    const langName = { es: "Spanish", fr: "French", de: "German", it: "Italian", nl: "Dutch", ja: "Japanese", hi: "Hindi", en: "English" }[selectedLang] || selectedLang;
    const topicSuggestions = [
      { label: "Help me with coding", icon: Code, value: "Help me with coding" },
      { label: "Practice conversation", icon: MessageSquare, value: "Practice conversation" },
      { label: "Explain a concept", icon: BookOpen, value: "Explain a concept" },
      { label: "Interview prep", icon: Briefcase, value: "Interview prep" },
      { label: "Just chat freely", icon: MessagesSquare, value: "" },
    ];

    const activeTopic = customTopic || (selectedTopic ?? "");
    const canStart = selectedTopic !== null || customTopic.length > 0;

    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-800/50">
          <button
            onClick={() => {
              setStep("select");
              setSelectedTopic(null);
              setCustomTopic("");
            }}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-white">What would you like to learn about?</h1>
            <p className="text-sm text-slate-500">{langName} session</p>
          </div>
        </div>

        {/* Topic Selection */}
        <div className="flex-1 px-4 py-8 max-w-lg mx-auto w-full">
          <motion.div
            className="space-y-3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
            }}
          >
            {topicSuggestions.map((topic) => {
              const isActive = selectedTopic === topic.value && customTopic.length === 0;

              return (
                <motion.button
                  key={topic.label}
                  onClick={() => {
                    setSelectedTopic(topic.value);
                    setCustomTopic("");
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                    isActive
                      ? "bg-violet-500/15 border-violet-500/40 text-white"
                      : "bg-slate-800/60 backdrop-blur-xl border-white/10 text-slate-300 hover:bg-slate-800/80 hover:border-white/20"
                  }`}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isActive
                      ? "bg-violet-500/20 text-violet-400"
                      : "bg-slate-700/50 text-slate-400"
                  }`}>
                    <topic.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium">{topic.label}</span>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Custom topic input */}
          <div className="mt-6">
            <input
              type="text"
              value={customTopic}
              onChange={(e) => {
                setCustomTopic(e.target.value);
                if (e.target.value.length > 0) {
                  setSelectedTopic(e.target.value);
                } else {
                  setSelectedTopic(null);
                }
              }}
              placeholder="Or type your own topic..."
              className="w-full px-4 py-3 rounded-xl bg-slate-800/60 backdrop-blur-xl border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 transition-all"
            />
          </div>

          {/* Start button */}
          <motion.button
            onClick={() => startConversation(activeTopic)}
            disabled={!canStart}
            className="w-full mt-8 py-4 rounded-xl font-semibold text-white transition-all bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Start Talking
          </motion.button>
        </div>
      </div>
    );
  }

  // ─── Talking Screen ───
  const persona = selectedPersona;
  const langName = { es: "Spanish", fr: "French", de: "German", it: "Italian", nl: "Dutch", zh: "Mandarin", hi: "Hindi", pa: "Punjabi", ja: "Japanese", en: "English" }[selectedLang] || selectedLang;

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col relative">
      {/* Countdown overlay */}
      {countdown !== null && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[var(--background)]/95">
          <div className="text-center">
            <motion.div
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="text-8xl font-bold text-[#f0a855]"
            >
              {countdown}
            </motion.div>
            <p className="text-lg text-slate-400 mt-4">Get ready to speak...</p>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <button
            onClick={endConversation}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="text-sm font-medium text-white">
              {persona?.name || "Language Tutor"}
            </div>
            <div className="text-xs text-slate-500">{langName}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-500">{formatTime(sessionTime)}</span>
          {agent.isConnected && (
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-blue-500/20 text-blue-100 rounded-br-md"
                    : "bg-slate-800/60 text-slate-200 rounded-bl-md"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {agent.isSpeaking && (
          <motion.div
            className="flex justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800/60 rounded-bl-md">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-500">Speaking...</span>
            </div>
          </motion.div>
        )}

        {/* Listening indicator — when agent is not speaking and mic is on */}
        {agent.isConnected && !agent.isSpeaking && !agent.micMuted && (
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-xs font-medium text-indigo-400">Listening — speak when ready</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="border-t border-slate-800/50 px-4 py-6">
        <div className="flex items-center justify-center gap-6">
          {/* Mute Toggle */}
          <motion.button
            onClick={agent.toggleMic}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              agent.micMuted
                ? "bg-slate-700 text-slate-400"
                : "bg-slate-800 text-white"
            }`}
            whileTap={{ scale: 0.9 }}
          >
            {agent.micMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </motion.button>

          {/* End Call */}
          <motion.button
            onClick={endConversation}
            className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500/40 text-red-400 flex items-center justify-center hover:bg-red-500/30 transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <PhoneOff className="w-7 h-7" />
          </motion.button>

          {/* Volume (placeholder) */}
          <motion.button
            className="w-14 h-14 rounded-full bg-slate-800 text-white flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
          >
            <Volume2 className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Status */}
        <div className="text-center mt-4">
          <p className="text-xs text-slate-500">
            {agent.isConnecting
              ? "Connecting..."
              : agent.isConnected
              ? agent.micMuted
                ? "Mic muted — tap to unmute"
                : "Listening..."
              : agent.error || "Tap a language to start"}
          </p>
        </div>
      </div>
    </div>
  );
}
