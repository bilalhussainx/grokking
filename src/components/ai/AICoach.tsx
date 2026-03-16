'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  GraduationCap, Lightbulb, MessageCircle, Trophy, Timer,
  Send, Mic, MicOff, Phone, PhoneOff, ChevronDown,
} from 'lucide-react';
import { useAI } from '@/contexts/AIContext';
import { saveSessionNote } from '@/lib/sessionNotes';
import { useVoiceAgent, type VoiceAgentCallbacks } from '@/hooks/useVoiceAgent';
import {
  COACH_PERSONAS, VOICES,
  getSavedCoachPersona, saveCoachPersona,
  getSavedVoice, saveVoicePreference,
  getCoachPersona, getVoice,
} from '@/lib/voice-personas';
import { ALL_SUPPORTED_LANGUAGES } from '@/lib/voice-provider-router';

interface CoachMessage {
  id: string;
  role: 'coach' | 'user';
  text: string;
  type?: 'encouraging' | 'teaching' | 'hint' | 'celebrating' | 'user';
  timestamp: Date;
}

export default function AICoach() {
  const { lessonContext, currentCode, openPanel } = useAI();
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [hintsGiven, setHintsGiven] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [sessionStart] = useState(Date.now());
  const [sessionTime, setSessionTime] = useState('00:00');
  const [lastCodeLength, setLastCodeLength] = useState(0);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [lastLessonId, setLastLessonId] = useState('');
  const [selectedPersona, setSelectedPersona] = useState(() => getSavedCoachPersona());
  const [selectedVoice, setSelectedVoice] = useState(() => getSavedVoice());
  const [coachLanguage, setCoachLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      // Prefer explicit coach-language, fall back to native-language from signup
      return localStorage.getItem('coach-language') || localStorage.getItem('native-language') || 'en';
    }
    return 'en';
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const codeChangeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hintsRef = useRef(0);
  const voiceSessionStartRef = useRef<number | null>(null);

  // Track voice session usage analytics
  const sendAnalytics = useCallback((voiceUsed: boolean) => {
    const ctx = lessonContextRef.current;
    const duration = voiceSessionStartRef.current
      ? Math.round((Date.now() - voiceSessionStartRef.current) / 1000)
      : 0;

    fetch('/api/user/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionType: 'coach',
        language: coachLanguage,
        durationSeconds: duration,
        courseSlug: ctx?.courseSlug || null,
        lessonSlug: ctx?.lessonSlug || null,
        messageCount: messagesRef.current.length,
        voiceUsed,
        coachPersona: selectedPersona,
      }),
    }).catch(() => {}); // Best-effort, non-blocking
  }, [coachLanguage, selectedPersona]);

  // Refs to avoid stale closures
  const isStreamingRef = useRef(false);
  const messagesRef = useRef<CoachMessage[]>([]);
  const lessonContextRef = useRef(lessonContext);
  const currentCodeRef = useRef(currentCode);

  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { lessonContextRef.current = lessonContext; }, [lessonContext]);
  useEffect(() => { currentCodeRef.current = currentCode; }, [currentCode]);

  const addMessage = useCallback((text: string, role: 'coach' | 'user', type: CoachMessage['type']) => {
    if (!text.trim()) return;
    const msg: CoachMessage = {
      id: `${role}-${Date.now()}-${Math.random()}`,
      role,
      text: text.trim(),
      type,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, msg]);
  }, []);

  // Deepgram Voice Agent hook
  const voiceCallbacks: VoiceAgentCallbacks = useMemo(() => ({
    onUserMessage: (text: string) => {
      addMessage(text, 'user', 'user');
    },
    onAgentMessage: (text: string) => {
      addMessage(text, 'coach', 'teaching');
    },
    onConnect: () => {
      console.log('[Coach] Voice agent connected');
      voiceSessionStartRef.current = Date.now();
    },
    onDisconnect: () => {
      console.log('[Coach] Voice agent disconnected');
    },
    onError: (err: string) => {
      console.error('[Coach] Voice agent error:', err);
    },
  }), [addMessage]);

  const deepgram = useVoiceAgent(voiceCallbacks);

  // Languages supported by Deepgram voice (non-Indic only)
  const VOICE_SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'nl', 'it', 'ja'];

  // Start voice conversation via Deepgram
  const startVoice = useCallback(async () => {
    if (deepgram.isConnecting || deepgram.isConnected) return;

    // If coach language isn't supported by Deepgram TTS, fall back to English
    // but keep the LLM instruction to explain in the user's language via text
    let voiceLang = coachLanguage;
    if (!VOICE_SUPPORTED_LANGUAGES.includes(coachLanguage)) {
      voiceLang = 'en';
      addMessage(
        `Voice mode for ${ALL_SUPPORTED_LANGUAGES.find(l => l.code === coachLanguage)?.name || coachLanguage} is coming soon. Using English voice for now — you can still type in your language and Coach will respond in text.`,
        'coach', 'teaching'
      );
    }

    const ctx = lessonContextRef.current;
    const persona = getCoachPersona(selectedPersona);
    await deepgram.start({
      personaId: selectedPersona,
      systemPrompt: persona.systemPrompt,
      voiceProvider: 'deepgram',
      voiceId: selectedVoice,
      language: voiceLang,
      mode: 'coach',
      lessonTitle: ctx?.lessonTitle,
      moduleTitle: ctx?.moduleTitle,
      courseTitle: ctx?.courseTitle,
      lessonContext: ctx ? {
        lessonId: ctx.lessonSlug || '',
        lessonTitle: ctx.lessonTitle,
        targetPhrases: [],
        vocabulary: [],
        grammarFocus: [],
        content: ctx.lessonContent,
        starterCode: ctx.starterCode,
        solutionCode: ctx.solutionCode,
      } : undefined,
    });
  }, [deepgram, selectedPersona, selectedVoice, coachLanguage]);

  // Save session notes from current messages
  const saveNotes = useCallback(() => {
    const ctx = lessonContextRef.current;
    const msgs = messagesRef.current;
    if (!ctx || msgs.length < 2) return;

    const coachMessages = msgs.filter(m => m.role === 'coach' && m.text.length > 10);
    if (coachMessages.length === 0) return;

    const keyPoints = coachMessages
      .map(m => {
        const firstSentence = m.text.split(/[.!?]\s/)[0];
        return firstSentence.length > 120 ? firstSentence.slice(0, 120) + '...' : firstSentence;
      })
      .filter((v, i, arr) => arr.indexOf(v) === i)
      .slice(0, 6);

    const userQuestions = msgs.filter(m => m.role === 'user').length;
    const summary = `Discussed "${ctx.lessonTitle}" with Coach Alex. ${userQuestions} question${userQuestions !== 1 ? 's' : ''} asked, ${coachMessages.length} response${coachMessages.length !== 1 ? 's' : ''} received. Topics covered: ${keyPoints.slice(0, 3).join('; ')}.`;

    saveSessionNote({
      id: `note-${Date.now()}`,
      courseSlug: ctx.courseSlug || '',
      courseTitle: ctx.courseTitle,
      lessonSlug: ctx.lessonSlug || '',
      lessonTitle: ctx.lessonTitle,
      moduleTitle: ctx.moduleTitle,
      summary,
      keyPoints,
      timestamp: Date.now(),
      messages: msgs.map(m => ({ role: m.role, text: m.text })),
    });
  }, []);

  // Stop voice conversation + send usage analytics
  const stopVoice = useCallback(() => {
    saveNotes();
    sendAnalytics(true);
    voiceSessionStartRef.current = null;
    deepgram.stop();
  }, [deepgram, saveNotes, sendAnalytics]);

  // Send code context updates to Deepgram agent periodically
  useEffect(() => {
    if (!deepgram.isConnected) return;

    const interval = setInterval(() => {
      const code = currentCodeRef.current;
      if (code) {
        deepgram.sendPromptUpdate(
          `The student's current code:\n\`\`\`\n${code}\n\`\`\`\nObserve their progress. If they seem stuck, offer a gentle nudge.`
        );
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [deepgram.isConnected, deepgram]);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - sessionStart) / 1000);
      const mins = Math.floor(elapsed / 60);
      const secs = elapsed % 60;
      setSessionTime(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionStart]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send event to coach API (text mode), stream response
  const sendEvent = useCallback(
    async (event: string, type: CoachMessage['type'] = 'encouraging') => {
      if (isStreamingRef.current || !lessonContextRef.current) return;

      isStreamingRef.current = true;
      setIsStreaming(true);

      const ctx = lessonContextRef.current;
      const history = messagesRef.current
        .filter((m) => m.text.length > 0)
        .slice(-10)
        .map((m) => ({
          role: m.role === 'coach' ? 'assistant' : 'user',
          content: m.text,
        }));

      const msgId = Date.now().toString();
      setMessages((prev) => [...prev, {
        id: msgId, role: 'coach', text: '', type, timestamp: new Date(),
      }]);

      let fullText = '';
      try {
        const res = await fetch('/api/ai/coach', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event,
            lessonTitle: ctx.lessonTitle,
            moduleTitle: ctx.moduleTitle,
            courseTitle: ctx.courseTitle,
            currentCode: currentCodeRef.current,
            starterCode: ctx.starterCode,
            solutionCode: ctx.solutionCode,
            hintsGiven: hintsRef.current,
            history,
          }),
        });

        if (!res.ok) throw new Error(`API ${res.status}`);
        const reader = res.body?.getReader();
        if (!reader) throw new Error('No stream');
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullText += chunk;
          setMessages((prev) =>
            prev.map((m) => m.id === msgId ? { ...m, text: m.text + chunk } : m)
          );
        }
      } catch {
        fullText = "I'm here to help!";
        setMessages((prev) =>
          prev.map((m) => m.id === msgId ? { ...m, text: fullText } : m)
        );
      } finally {
        isStreamingRef.current = false;
        setIsStreaming(false);
      }
    },
    []
  );

  // Reset on lesson change
  useEffect(() => {
    if (!lessonContext) return;
    const lessonId = lessonContext.lessonTitle;
    if (lessonId === lastLessonId) return;

    // Save notes from previous lesson before clearing
    if (lastLessonId && messagesRef.current.length >= 2) {
      saveNotes();
    }

    setLastLessonId(lessonId);
    setMessages([]);
    messagesRef.current = [];
    setHasGreeted(false);
    setHintsGiven(0);
    hintsRef.current = 0;
    setLastCodeLength(0);

    // Auto-open coach panel when a new lesson loads so the student sees the greeting
    openPanel();
  }, [lessonContext, lastLessonId, saveNotes, openPanel]);

  // Auto-start voice coach when a lesson opens — Coach Alex greets and listens
  const autoStartLessonRef = useRef<string | null>(null);
  useEffect(() => {
    if (!lessonContext) return;
    // Only auto-start once per unique lesson
    const lessonKey = `${lessonContext.courseTitle}/${lessonContext.lessonTitle}`;
    if (autoStartLessonRef.current === lessonKey) return;
    if (hasGreeted) return; // Already greeted for this lesson via the reset effect
    autoStartLessonRef.current = lessonKey;
    setHasGreeted(true);

    // Open the panel and auto-start voice after a brief delay
    openPanel();
    const timer = setTimeout(async () => {
      try {
        // Stop any existing voice session before starting new one
        if (deepgram.isConnected) deepgram.stop();
        await startVoice();
        console.log("[Coach] Auto-started voice for lesson:", lessonContext.lessonTitle);
      } catch (err) {
        console.warn("[Coach] Voice auto-start failed, using text:", err);
        // Voice failed (no mic, etc.) — fall back to text greeting
        const hasCodingExercise = !!(lessonContext.starterCode);
        sendEvent(
          hasCodingExercise
            ? `Student just opened "${lessonContext.lessonTitle}" in "${lessonContext.moduleTitle}". This lesson has a coding exercise. Welcome them, briefly introduce what the exercise is about, and ask if they want a walkthrough or to jump into coding.`
            : `Student just opened "${lessonContext.lessonTitle}" in "${lessonContext.moduleTitle}". Welcome them, preview what the lesson covers, and ask: "Want me to walk you through the key points, or would you prefer to read first and ask questions?"`,
          'encouraging'
        );
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [lessonContext, hasGreeted, openPanel, startVoice, sendEvent, deepgram]);

  // Code activity detection (text mode only)
  useEffect(() => {
    if (!currentCode || !lessonContext) return;
    const codeLen = currentCode.length;
    const diff = codeLen - lastCodeLength;
    if (diff > 40 && lastCodeLength > 0) {
      if (codeChangeTimeout.current) clearTimeout(codeChangeTimeout.current);
      codeChangeTimeout.current = setTimeout(() => {
        if (!isStreamingRef.current && !deepgram.isConnected) {
          sendEvent(
            `Student added ~${diff} chars of code. Brief encouraging comment. Don't repeat yourself.`,
            'encouraging'
          );
        }
      }, 8000);
    }
    setLastCodeLength(codeLen);
  }, [currentCode, lastCodeLength, lessonContext, sendEvent, deepgram.isConnected]);

  const handleHint = () => {
    hintsRef.current += 1;
    setHintsGiven(hintsRef.current);
    const level = hintsRef.current;
    const text = `Give me a hint${level > 1 ? ` (hint #${level})` : ''}`;
    if (deepgram.isConnected) {
      deepgram.sendPromptUpdate(`The student is asking for hint #${level}. ${
        level === 1 ? 'Give a gentle nudge.' : level === 2 ? 'Give specific direction.' :
        level === 3 ? 'Give a detailed approach.' : 'Give a near-complete walkthrough.'
      }`);
      addMessage(text, 'user', 'user');
    } else {
      sendEvent(
        `Student requested hint #${level}. ${
          level === 1 ? 'Gentle nudge.' : level === 2 ? 'Specific direction.' :
          level === 3 ? 'Detailed approach.' : 'Near-complete walkthrough.'
        }`, 'hint'
      );
    }
  };

  const handleExplain = () => {
    if (deepgram.isConnected) {
      deepgram.sendPromptUpdate('The student is asking you to explain the core concept. Use an analogy if helpful.');
      addMessage('Can you explain the core concept?', 'user', 'user');
    } else {
      sendEvent('Explain the core concept. Use an analogy if helpful.', 'teaching');
    }
  };

  const handleCelebrate = () => {
    if (deepgram.isConnected) {
      deepgram.sendPromptUpdate('The student just solved the problem! Celebrate their achievement and suggest what to try next.');
      addMessage('I solved it!', 'user', 'user');
    } else {
      sendEvent('Student solved it! Celebrate and suggest next steps.', 'celebrating');
    }
  };

  const handleUserMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isStreamingRef.current) return;
    const text = userInput.trim();
    setUserInput('');

    if (deepgram.isConnected) {
      // In voice mode, inject user text as context update
      deepgram.sendPromptUpdate(`The student typed this message: "${text}". Respond to it.`);
      addMessage(text, 'user', 'user');
    } else {
      const userMsg: CoachMessage = {
        id: `user-${Date.now()}`, role: 'user', text, type: 'user', timestamp: new Date(),
      };
      setMessages((prev) => {
        const updated = [...prev, userMsg];
        messagesRef.current = updated;
        return updated;
      });
      await sendEvent(`Student asks: "${text}"`, 'teaching');
    }
  };

  // Listen for events from the top bar
  useEffect(() => {
    const onHint = () => handleHint();
    const onExplain = () => handleExplain();
    const onCelebrate = () => handleCelebrate();
    const onVoice = () => { if (!deepgram.isConnected) startVoice(); else stopVoice(); };
    const onMessage = (e: Event) => {
      const text = (e as CustomEvent).detail;
      if (text && typeof text === 'string') {
        setUserInput(text);
        // Trigger form submit programmatically
        setTimeout(() => {
          const form = document.querySelector('[data-coach-form]') as HTMLFormElement;
          if (form) form.requestSubmit();
        }, 50);
      }
    };

    window.addEventListener('coach:hint', onHint);
    window.addEventListener('coach:explain', onExplain);
    window.addEventListener('coach:celebrate', onCelebrate);
    window.addEventListener('coach:voice', onVoice);
    window.addEventListener('coach:message', onMessage);

    return () => {
      window.removeEventListener('coach:hint', onHint);
      window.removeEventListener('coach:explain', onExplain);
      window.removeEventListener('coach:celebrate', onCelebrate);
      window.removeEventListener('coach:voice', onVoice);
      window.removeEventListener('coach:message', onMessage);
    };
  }, [deepgram.isConnected]);

  // Cleanup on unmount — save notes + send analytics
  const saveNotesRef = useRef(saveNotes);
  const sendAnalyticsRef = useRef(sendAnalytics);
  saveNotesRef.current = saveNotes;
  sendAnalyticsRef.current = sendAnalytics;
  useEffect(() => {
    return () => {
      saveNotesRef.current();
      if (voiceSessionStartRef.current) {
        sendAnalyticsRef.current(true);
      }
    };
  }, []);

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'encouraging': return 'border-emerald-500/40 bg-emerald-500/5';
      case 'teaching': return 'border-amber-500/40 bg-amber-500/5';
      case 'hint': return 'border-violet-500/40 bg-violet-500/5';
      case 'celebrating': return 'border-pink-500/40 bg-pink-500/5';
      default: return 'border-blue-500/40 bg-blue-500/5';
    }
  };

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'encouraging': return '🌟';
      case 'teaching': return '📚';
      case 'hint': return '💡';
      case 'celebrating': return '🎉';
      default: return '💬';
    }
  };

  const isVoiceActive = deepgram.isConnected;
  const agentSpeaking = deepgram.isSpeaking;

  return (
    <div className="flex flex-col h-full min-h-0 bg-[var(--background)]">
      {/* Header */}
      <div className="p-3 border-b border-white/[0.06] shrink-0">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-xs shadow-lg shadow-blue-500/20">
            🎓
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white">{getCoachPersona(selectedPersona).name}</h3>
            <p className="text-[10px] text-white/40">
              {deepgram.isConnecting ? 'Connecting...' :
               isVoiceActive && agentSpeaking ? 'Speaking...' :
               isVoiceActive ? 'Voice Mode' :
               'AI Coding Coach'}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px]">
            <Timer className="w-3 h-3 text-blue-400" />
            <span className="text-blue-400 font-mono">{sessionTime}</span>
          </div>
        </div>
        {lessonContext && (
          <div className="text-[10px] text-white/30 truncate">
            {lessonContext.moduleTitle} → {lessonContext.lessonTitle}
          </div>
        )}
      </div>

      {/* Voice Control Bar */}
      <div className="px-3 py-2 border-b border-white/[0.06] flex items-center gap-2 shrink-0">
        {!isVoiceActive && !deepgram.isConnecting ? (
          <div className="flex-1 flex items-center gap-1.5">
            {/* Language Picker */}
            <div className="relative">
              <button
                onClick={() => setShowLangPicker(!showLangPicker)}
                className="px-2 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-xs flex items-center gap-1.5 transition-colors"
                title="Coach language"
              >
                <span>{ALL_SUPPORTED_LANGUAGES.find(l => l.code === coachLanguage)?.flag || '\u{1F310}'}</span>
                <ChevronDown className="w-3 h-3 text-white/40" />
              </button>
              {showLangPicker && (
                <div className="absolute top-full left-0 mt-1 bg-slate-900 border border-white/[0.1] rounded-lg shadow-xl z-[100] py-1 min-w-[160px] max-h-[280px] overflow-y-auto">
                  {/* English first — always available, always default */}
                  <button
                    onClick={() => {
                      setCoachLanguage('en');
                      localStorage.setItem('coach-language', 'en');
                      setShowLangPicker(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-white/[0.06] transition-colors border-b border-white/[0.06] ${
                      coachLanguage === 'en' ? 'text-blue-400 bg-blue-500/5' : 'text-white/80'
                    }`}
                  >
                    <span>{'\u{1F1FA}\u{1F1F8}'}</span>
                    <span className="font-medium">English</span>
                    <span className="text-[9px] text-white/30 ml-auto">default</span>
                  </button>
                  {/* Voice-supported languages */}
                  <div className="px-2 py-1 text-[9px] text-white/20 uppercase tracking-wider">Voice Available</div>
                  {ALL_SUPPORTED_LANGUAGES.filter(l => VOICE_SUPPORTED_LANGUAGES.includes(l.code) && l.code !== 'en').map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setCoachLanguage(lang.code);
                        localStorage.setItem('coach-language', lang.code);
                        setShowLangPicker(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-xs flex items-center gap-2 hover:bg-white/[0.06] transition-colors ${
                        coachLanguage === lang.code ? 'text-blue-400' : 'text-white/70'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                  {/* Indic languages — text only for now */}
                  <div className="px-2 py-1 text-[9px] text-white/20 uppercase tracking-wider border-t border-white/[0.06] mt-1">Text Only (Voice Coming Soon)</div>
                  {ALL_SUPPORTED_LANGUAGES.filter(l => !VOICE_SUPPORTED_LANGUAGES.includes(l.code) && l.code !== 'en' && l.code !== 'en-IN').map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setCoachLanguage(lang.code);
                        localStorage.setItem('coach-language', lang.code);
                        setShowLangPicker(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-xs flex items-center gap-2 hover:bg-white/[0.06] transition-colors ${
                        coachLanguage === lang.code ? 'text-blue-400' : 'text-white/50'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Start Button */}
            <button
              onClick={startVoice}
              className="flex-1 py-2 bg-gradient-to-r from-blue-500/20 to-violet-500/20 hover:from-blue-500/30 hover:to-violet-500/30 text-white rounded-lg flex items-center justify-center gap-2 transition-all text-xs font-semibold border border-blue-500/20"
            >
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>Start Voice Conversation</span>
            </button>
          </div>
        ) : deepgram.isConnecting ? (
          <button
            disabled
            className="flex-1 py-2 bg-amber-500/10 text-amber-400 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold border border-amber-500/20"
          >
            <div className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <span>Connecting...</span>
          </button>
        ) : (
          <>
            {/* Mic mute toggle */}
            <button
              onClick={() => deepgram.toggleMic()}
              className={`p-2 rounded-lg transition-colors ${
                deepgram.micMuted
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
              title={deepgram.micMuted ? 'Unmute mic' : 'Mute mic'}
            >
              {deepgram.micMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Voice activity indicator */}
            <div className="flex-1 flex items-center justify-center gap-2">
              {agentSpeaking ? (
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    <span className="w-1 h-3 bg-blue-400 rounded-full animate-pulse" />
                    <span className="w-1 h-4 bg-violet-400 rounded-full animate-pulse" style={{ animationDelay: '0.15s' }} />
                    <span className="w-1 h-2.5 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                    <span className="w-1 h-3.5 bg-violet-400 rounded-full animate-pulse" style={{ animationDelay: '0.45s' }} />
                  </div>
                  <span className="text-[11px] text-blue-400 font-medium">Coach is speaking...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-[11px] text-emerald-400 font-medium">
                    {deepgram.micMuted ? 'Mic muted' : 'Listening...'}
                  </span>
                </div>
              )}
            </div>

            {/* Hang up */}
            <button
              onClick={stopVoice}
              className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors border border-red-500/30"
              title="End voice session"
            >
              <PhoneOff className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Error bar */}
      {deepgram.error && (
        <div className="px-3 py-2 bg-red-500/10 border-b border-red-500/20 flex items-center gap-2 shrink-0">
          <span className="text-xs text-red-400">{deepgram.error}</span>
          <button
            onClick={startVoice}
            className="ml-auto text-xs text-red-400 underline hover:text-red-300"
          >
            Reconnect
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto min-h-0 p-3 space-y-2">
        {messages.length === 0 && !isStreaming && !isVoiceActive && (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
            <GraduationCap className="w-8 h-8 mb-2" />
            <p className="text-xs">Click &quot;Start Voice Conversation&quot; to talk with Coach Alex</p>
            <p className="text-[10px] mt-1">or use text chat below</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.role === 'user' ? (
              <div className="flex justify-end">
                <div className="bg-blue-500/15 border border-blue-500/20 rounded-lg px-3 py-2 max-w-[85%]">
                  <p className="text-xs text-white/80 leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ) : (
              <div className={`p-2.5 rounded-lg border-l-2 ${getTypeColor(msg.type)}`}>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-sm">{getTypeIcon(msg.type)}</span>
                  <span className="text-[10px] text-white/30 uppercase tracking-wider font-medium">
                    {msg.type || 'coach'}
                  </span>
                </div>
                <p className="text-white/80 text-xs leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                  {isStreaming && messages[messages.length - 1]?.id === msg.id && (
                    <span className="inline-block w-1.5 h-3.5 bg-blue-400 ml-0.5 animate-pulse" />
                  )}
                </p>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-3 py-2 border-t border-white/[0.06] flex gap-1.5 shrink-0">
        <button onClick={handleHint} disabled={isStreaming}
          className="flex-1 py-1.5 bg-violet-500/15 hover:bg-violet-500/25 text-violet-400 rounded-lg flex items-center justify-center gap-1 transition-colors text-[11px] font-semibold disabled:opacity-30">
          <Lightbulb className="w-3 h-3" />
          Hint{hintsGiven > 0 ? ` (${hintsGiven})` : ''}
        </button>
        <button onClick={handleExplain} disabled={isStreaming}
          className="flex-1 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] text-white/50 hover:text-white/70 rounded-lg flex items-center justify-center gap-1 transition-colors text-[11px] font-medium disabled:opacity-30">
          <MessageCircle className="w-3 h-3" />
          Explain
        </button>
        <button onClick={handleCelebrate} disabled={isStreaming}
          className="flex-1 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 rounded-lg flex items-center justify-center gap-1 transition-colors text-[11px] font-semibold disabled:opacity-30">
          <Trophy className="w-3 h-3" />
          Solved!
        </button>
      </div>

      {/* Chat Input */}
      <form data-coach-form onSubmit={handleUserMessage} className="p-3 border-t border-white/[0.06] shrink-0">
        <div className="flex gap-2">
          <input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={isVoiceActive ? "Type to Coach Alex (or just speak)..." : "Ask Coach Alex anything..."}
            disabled={isStreaming}
            className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/40 disabled:opacity-50"
          />
          <button type="submit" disabled={isStreaming || !userInput.trim()}
            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg px-2.5 transition-colors disabled:opacity-30">
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
