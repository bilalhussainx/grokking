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
import { useScrollCoach } from '@/hooks/useScrollCoach';

// ---------- Teaching mode logic ----------
type TeachingMode = 'standard' | 'challenge' | 'story' | 'speed-round';

function getTeachingMode(lessonTitle: string): TeachingMode {
  const hash = lessonTitle.split('').reduce((a, c) => a + c.charCodeAt(0), 0) + new Date().getDate();
  const roll = hash % 100;
  if (roll < 60) return 'standard';
  if (roll < 80) return 'challenge';
  if (roll < 90) return 'story';
  return 'speed-round';
}

// ---------- Coach mode (hybrid voice lifecycle) ----------
type CoachMode = 'greeting' | 'text-monitoring' | 'voice-active' | 'celebrating';

interface CoachMessage {
  id: string;
  role: 'coach' | 'user';
  text: string;
  type?: 'encouraging' | 'teaching' | 'hint' | 'celebrating' | 'user' | 'scroll';
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

  // --- Hybrid voice lifecycle state ---
  const [coachMode, setCoachMode] = useState<CoachMode>('text-monitoring');
  const coachModeRef = useRef<CoachMode>('text-monitoring');
  useEffect(() => { coachModeRef.current = coachMode; }, [coachMode]);

  // --- Variable teaching style ---
  const [teachingMode, setTeachingMode] = useState<TeachingMode>('standard');

  // --- Scroll coach (active only in text-monitoring mode) ---
  const { messages: scrollMessages, reset: resetScrollMessages } = useScrollCoach(coachMode === 'text-monitoring');

  // Inject scroll messages as coach bubbles
  const lastScrollCountRef = useRef(0);
  useEffect(() => {
    if (scrollMessages.length > lastScrollCountRef.current) {
      const newMsgs = scrollMessages.slice(lastScrollCountRef.current);
      for (const sm of newMsgs) {
        const scrollMsg: CoachMessage = {
          id: `scroll-${Date.now()}-${Math.random()}`,
          role: 'coach',
          text: sm.text,
          type: 'scroll',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, scrollMsg]);
      }
      lastScrollCountRef.current = scrollMessages.length;
    }
  }, [scrollMessages]);

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
    }).catch(() => {});
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
    onGreetingDone: () => {
      console.log('[Coach] Greeting done — transitioning to text-monitoring');
      // After greeting is delivered, disconnect voice and enter text-monitoring
      if (coachModeRef.current === 'greeting') {
        // Small delay to let the audio finish playing
        setTimeout(() => {
          deepgramRef.current?.stop();
          setCoachMode('text-monitoring');
        }, 1500);
      }
    },
  }), [addMessage]);

  const deepgram = useVoiceAgent(voiceCallbacks);
  const deepgramRef = useRef(deepgram);
  useEffect(() => { deepgramRef.current = deepgram; }, [deepgram]);

  // Languages supported by Deepgram voice (non-Indic only)
  const VOICE_SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'nl', 'it', 'ja'];

  // Start voice conversation via Deepgram
  const startVoice = useCallback(async () => {
    if (deepgram.isConnecting || deepgram.isConnected) return;

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

  // Start voice for re-engagement (user taps mic or speaks)
  const startVoiceReengage = useCallback(async () => {
    if (deepgram.isConnecting || deepgram.isConnected) return;

    let voiceLang = coachLanguage;
    if (!VOICE_SUPPORTED_LANGUAGES.includes(coachLanguage)) {
      voiceLang = 'en';
    }

    const ctx = lessonContextRef.current;
    const persona = getCoachPersona(selectedPersona);
    // Override system prompt to not re-greet
    const reengagePrompt = `${persona.systemPrompt}\n\nIMPORTANT: The student was reading and decided to talk. Don't re-greet them. Start with something like "I'm here — what's on your mind?" and respond to their question.`;

    setCoachMode('voice-active');
    await deepgram.start({
      personaId: selectedPersona,
      systemPrompt: reengagePrompt,
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

  // Start voice for celebration
  const startVoiceCelebrate = useCallback(async () => {
    if (deepgram.isConnecting || deepgram.isConnected) return;

    let voiceLang = coachLanguage;
    if (!VOICE_SUPPORTED_LANGUAGES.includes(coachLanguage)) {
      voiceLang = 'en';
    }

    const ctx = lessonContextRef.current;
    const persona = getCoachPersona(selectedPersona);
    const celebratePrompt = `${persona.systemPrompt}\n\nIMPORTANT: The student just completed the lesson! Congratulate them enthusiastically, mention what they learned, and optionally ask a quick quiz question to reinforce the concept.`;

    setCoachMode('celebrating');
    await deepgram.start({
      personaId: selectedPersona,
      systemPrompt: celebratePrompt,
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
    setCoachMode('text-monitoring');
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
            language: coachLanguage,
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
    setCoachMode('text-monitoring');
    resetScrollMessages();
    lastScrollCountRef.current = 0;

    // Determine teaching mode for this lesson
    setTeachingMode(getTeachingMode(lessonContext.lessonTitle));

    // Auto-open coach panel when a new lesson loads so the student sees the greeting
    openPanel();
  }, [lessonContext, lastLessonId, saveNotes, openPanel, resetScrollMessages]);

  // LESSON START HOOK — fires every time a new lesson opens
  // Always sends a text greeting immediately (reliable, no voice dependency)
  const autoStartLessonRef = useRef<string | null>(null);
  useEffect(() => {
    if (!lessonContext) return;
    const lessonKey = `${lessonContext.courseTitle}/${lessonContext.lessonTitle}`;
    if (autoStartLessonRef.current === lessonKey) return;
    if (hasGreeted) return;
    autoStartLessonRef.current = lessonKey;
    setHasGreeted(true);
    setCoachMode('text-monitoring');
    openPanel();

    // Immediate text greeting — no delay, no voice dependency
    const contentPreview = lessonContext.lessonContent?.slice(0, 500) || "";
    const hasCodingExercise = !!(lessonContext.starterCode);

    // Small delay to ensure lessonContextRef is updated
    const timer = setTimeout(() => {
      sendEvent(
        `[LESSON_START HOOK] The student just opened a new lesson.
Course: ${lessonContext.courseTitle}
Module: ${lessonContext.moduleTitle}
Lesson: ${lessonContext.lessonTitle}
Has coding exercise: ${hasCodingExercise ? "YES — there's starter code to work with" : "NO — this is a reading/concept lesson"}
Lesson content preview: "${contentPreview}"

YOUR TASK: Greet the student by name. Reference THIS SPECIFIC lesson topic (not generic). ${hasCodingExercise ? "Ask if they want to walk through the code or try it themselves first." : "Highlight the most interesting concept from the preview and ask a thought-provoking question about it."} Keep it to 2-3 sentences. Be warm, specific, and engaging.`,
        'encouraging'
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [lessonContext, hasGreeted, openPanel, sendEvent]);

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

  // SILENCE DETECTION — if user is inactive for 45s, Coach proactively engages
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const silenceCountRef = useRef(0);
  useEffect(() => {
    if (!lessonContext || !hasGreeted) return;

    // Reset silence timer on any user activity
    const resetSilence = () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        if (isStreamingRef.current || deepgram.isConnected) return;
        silenceCountRef.current += 1;
        const count = silenceCountRef.current;

        const prompts = [
          `The student has been reading silently for 45 seconds. Check in naturally — ask if they have any questions about what they're reading, or offer to explain a concept from the lesson. Keep it short and warm.`,
          `Still quiet. Share one interesting insight or "did you know" fact from the lesson content. Make it engaging and end with a question.`,
          `The student seems to be deeply focused on reading. Give them space but offer: "Take your time — I'm here whenever you want to discuss anything or try an exercise."`,
        ];
        const prompt = prompts[Math.min(count - 1, prompts.length - 1)];
        sendEvent(prompt, 'teaching');
      }, 45000);
    };

    resetSilence();
    // Reset on user typing or code changes
    window.addEventListener("keydown", resetSilence);
    window.addEventListener("click", resetSilence);
    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      window.removeEventListener("keydown", resetSilence);
      window.removeEventListener("click", resetSilence);
    };
  }, [lessonContext, hasGreeted, sendEvent, deepgram.isConnected]);

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
      // Reconnect voice for celebration
      addMessage('I solved it!', 'user', 'user');
      startVoiceCelebrate().catch(() => {
        sendEvent('Student solved it! Celebrate and suggest next steps.', 'celebrating');
      });
    }
  };

  // Handle "Tap to talk" — reconnect voice in re-engage mode
  const handleTapToTalk = () => {
    if (coachMode === 'text-monitoring') {
      startVoiceReengage().catch(() => {
        console.warn('[Coach] Voice re-engage failed');
      });
    }
  };

  const handleUserMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isStreamingRef.current) return;
    const text = userInput.trim();
    setUserInput('');

    if (deepgram.isConnected) {
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
    const onVoice = () => {
      if (!deepgram.isConnected) {
        if (coachMode === 'text-monitoring') {
          handleTapToTalk();
        } else {
          startVoice();
        }
      } else {
        stopVoice();
      }
    };
    const onMessage = (e: Event) => {
      const text = (e as CustomEvent).detail;
      if (text && typeof text === 'string') {
        setUserInput(text);
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
  }, [deepgram.isConnected, coachMode]);

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
      case 'scroll': return 'border-cyan-500/40 bg-cyan-500/5';
      default: return 'border-blue-500/40 bg-blue-500/5';
    }
  };

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'encouraging': return '\u{1F31F}';
      case 'teaching': return '\u{1F4DA}';
      case 'hint': return '\u{1F4A1}';
      case 'celebrating': return '\u{1F389}';
      case 'scroll': return '\u{1F4D6}';
      default: return '\u{1F4AC}';
    }
  };

  const isVoiceActive = deepgram.isConnected;
  const agentSpeaking = deepgram.isSpeaking;

  // Mode status label
  const getModeLabel = () => {
    switch (coachMode) {
      case 'greeting': return '\u{1F3A4} Greeting...';
      case 'text-monitoring': return '\u{1F4D6} Reading along...';
      case 'voice-active': return '\u{1F3A4} Listening...';
      case 'celebrating': return '\u{1F389} Celebrating!';
    }
  };

  // Teaching mode indicator
  const getTeachingModeIndicator = () => {
    switch (teachingMode) {
      case 'challenge':
        return <span className="text-[10px] text-amber-400 font-semibold">{'\u26A1'} Challenge Mode — 2x XP!</span>;
      case 'story':
        return <span className="text-[10px] text-emerald-400 font-semibold">{'\u{1F4D6}'} Story Time</span>;
      case 'speed-round':
        return <span className="text-[10px] text-cyan-400 font-semibold">{'\u{1F3C3}'} Speed Round</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-[var(--background)]">
      {/* Header */}
      <div className="p-3 border-b border-white/[0.06] shrink-0">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-xs shadow-lg shadow-blue-500/20">
            {'\u{1F393}'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white">{getCoachPersona(selectedPersona).name}</h3>
            <p className="text-[10px] text-white/40">
              {getModeLabel()}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px]">
            <Timer className="w-3 h-3 text-blue-400" />
            <span className="text-blue-400 font-mono">{sessionTime}</span>
          </div>
        </div>
        {/* Teaching mode indicator + lesson info */}
        <div className="flex items-center gap-2">
          {lessonContext && (
            <div className="text-[10px] text-white/30 truncate flex-1">
              {lessonContext.moduleTitle} {'\u2192'} {lessonContext.lessonTitle}
            </div>
          )}
          {getTeachingModeIndicator()}
        </div>
        {/* Challenge mode XP badge */}
        {teachingMode === 'challenge' && (
          <div className="mt-1 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded text-[10px] text-amber-400 font-semibold inline-block">
            2x XP Active!
          </div>
        )}
      </div>

      {/* Voice Control Bar */}
      <div className="px-3 py-2 border-b border-white/[0.06] flex items-center gap-2 shrink-0">
        {coachMode === 'text-monitoring' && !deepgram.isConnecting ? (
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
                  {/* English first */}
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
                  {/* Indic languages */}
                  <div className="px-2 py-1 text-[9px] text-white/20 uppercase tracking-wider border-t border-white/[0.06] mt-1">
                    Indic Languages — Voice & Chat Coming Soon via Sarvam AI
                  </div>
                  {ALL_SUPPORTED_LANGUAGES.filter(l => !VOICE_SUPPORTED_LANGUAGES.includes(l.code) && l.code !== 'en' && (l.code as string) !== 'en-IN').map(lang => (
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
            {/* Tap to Talk button (replaces "Start Voice Conversation" in text-monitoring mode) */}
            <button
              onClick={handleTapToTalk}
              className="flex-1 py-2 bg-gradient-to-r from-blue-500/20 to-violet-500/20 hover:from-blue-500/30 hover:to-violet-500/30 text-white rounded-lg flex items-center justify-center gap-2 transition-all text-xs font-semibold border border-blue-500/20"
            >
              <Mic className="w-3.5 h-3.5 text-blue-400" />
              <span>Tap to talk</span>
            </button>
          </div>
        ) : deepgram.isConnecting || coachMode === 'greeting' ? (
          <button
            disabled
            className="flex-1 py-2 bg-amber-500/10 text-amber-400 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold border border-amber-500/20"
          >
            <div className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <span>{coachMode === 'greeting' ? 'Greeting...' : 'Connecting...'}</span>
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
                    {deepgram.micMuted ? 'Mic muted' : coachMode === 'celebrating' ? 'Celebrating!' : 'Listening...'}
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
        {messages.length === 0 && !isStreaming && !isVoiceActive && coachMode === 'text-monitoring' && (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
            <GraduationCap className="w-8 h-8 mb-2" />
            <p className="text-xs">Coach Alex is reading along with you</p>
            <p className="text-[10px] mt-1">Tap the mic or type below to chat</p>
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
                    {msg.type === 'scroll' ? 'reading along' : msg.type || 'coach'}
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
