'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useConversation } from '@elevenlabs/react';
import {
  GraduationCap, Lightbulb, MessageCircle, Trophy, Timer,
  Send, Mic, MicOff, Phone, PhoneOff, FileText,
} from 'lucide-react';
import { useAI } from '@/contexts/AIContext';
import { saveSessionNote } from '@/lib/sessionNotes';

interface CoachMessage {
  id: string;
  role: 'coach' | 'user';
  text: string;
  type?: 'encouraging' | 'teaching' | 'hint' | 'celebrating' | 'user';
  timestamp: Date;
}

// Agent ID from ElevenLabs dashboard — set in .env.local
const AGENT_ID = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || '';
console.log('[Coach] Agent ID:', AGENT_ID ? AGENT_ID.slice(0, 15) + '...' : 'NOT SET');

export default function AICoach() {
  const { lessonContext, currentCode } = useAI();
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [hintsGiven, setHintsGiven] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);
  const [voiceConnecting, setVoiceConnecting] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [sessionStart] = useState(Date.now());
  const [sessionTime, setSessionTime] = useState('00:00');
  const [lastCodeLength, setLastCodeLength] = useState(0);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [lastLessonId, setLastLessonId] = useState('');
  const [micMuted, setMicMuted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const codeChangeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hintsRef = useRef(0);

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

  // ElevenLabs Conversational AI hook — pass micMuted as controlled state
  const conversation = useConversation({
    micMuted,
    onConnect: () => {
      console.log('[Voice] Connected to ElevenLabs');
      setVoiceConnecting(false);
    },
    onDisconnect: (details) => {
      console.log('[Voice] Disconnected', details);
      setVoiceConnecting(false);
    },
    onMessage: (msg) => {
      console.log('[Voice] Message:', msg);
      // Transcriptions and agent replies come through here
      if (msg.source === 'user' && msg.message) {
        addMessage(msg.message, 'user', 'user');
      } else if (msg.source === 'ai' && msg.message) {
        addMessage(msg.message, 'coach', 'teaching');
      }
    },
    onError: (err) => {
      console.error('[Voice] Error:', err);
      setVoiceConnecting(false);
    },
    onStatusChange: (status) => {
      console.log('[Voice] Status:', status);
    },
  });

  // Start voice conversation
  const startVoice = useCallback(async () => {
    if (voiceConnecting || conversation.status === 'connected') return;

    if (!AGENT_ID) {
      addMessage(
        'Voice agent not configured. Add NEXT_PUBLIC_ELEVENLABS_AGENT_ID to .env.local. Create an agent at elevenlabs.io → Agents Platform.',
        'coach',
        'teaching'
      );
      return;
    }

    setVoiceConnecting(true);
    console.log('[Voice] Starting voice session with agent:', AGENT_ID);

    try {
      // Request mic permission and test audio level
      const testStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(testStream);
      const analyser = audioCtx.createAnalyser();
      source.connect(analyser);
      const data = new Uint8Array(analyser.fftSize);
      let maxLevel = 0;
      for (let i = 0; i < 10; i++) {
        await new Promise(r => setTimeout(r, 100));
        analyser.getByteTimeDomainData(data);
        const level = Math.max(...Array.from(data).map(v => Math.abs(v - 128)));
        maxLevel = Math.max(maxLevel, level);
      }
      console.log('[Voice] Mic test — max audio level:', maxLevel, maxLevel < 3 ? '⚠️ NO AUDIO DETECTED' : '✅ Audio OK');
      testStream.getTracks().forEach(t => t.stop());
      audioCtx.close();

      // Start the ElevenLabs conversation session directly with agentId
      const conversationId = await conversation.startSession({
        agentId: AGENT_ID,
        connectionType: 'websocket',
      });
      console.log('[Voice] Session started:', conversationId);

      // Send lesson context after connection is established
      const ctx = lessonContextRef.current;
      if (ctx?.lessonTitle) {
        conversation.sendContextualUpdate(
          `The student is working on "${ctx.lessonTitle}" in "${ctx.moduleTitle}" (${ctx.courseTitle}). Keep responses short (1-3 sentences). Be warm and helpful. Give progressive hints, never the full answer immediately.`
        );
      }
    } catch (err) {
      console.error('[Voice] Failed to start:', err);
      setVoiceConnecting(false);
      addMessage(`Voice connection failed: ${err}. Try the text chat below.`, 'coach', 'encouraging');
    }
  }, [voiceConnecting, conversation, addMessage]);

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

  // Stop voice conversation
  const stopVoice = useCallback(async () => {
    // Save notes before ending
    saveNotes();
    try {
      await conversation.endSession();
    } catch {
      // Already disconnected
    }
    setVoiceConnecting(false);
  }, [conversation, saveNotes]);

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

      // If in voice mode, send as text message to voice agent
      if (conversation.status === 'connected') {
        conversation.sendUserMessage(event);
        addMessage(event, 'user', 'user');
        return;
      }

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
    [conversation, addMessage]
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
  }, [lessonContext, lastLessonId, saveNotes]);

  // Welcome greeting (text mode only)
  useEffect(() => {
    if (!lessonContext || hasGreeted || conversation.status === 'connected') return;
    setHasGreeted(true);
    const timer = setTimeout(() => {
      sendEvent(
        `Student just opened "${lessonContext.lessonTitle}" in "${lessonContext.moduleTitle}". Welcome them warmly. Be concise.`,
        'encouraging'
      );
    }, 800);
    return () => clearTimeout(timer);
  }, [lessonContext, hasGreeted, sendEvent, conversation.status]);

  // Code activity detection (text mode only)
  useEffect(() => {
    if (!currentCode || !lessonContext) return;
    const codeLen = currentCode.length;
    const diff = codeLen - lastCodeLength;
    if (diff > 40 && lastCodeLength > 0) {
      if (codeChangeTimeout.current) clearTimeout(codeChangeTimeout.current);
      codeChangeTimeout.current = setTimeout(() => {
        if (!isStreamingRef.current && conversation.status !== 'connected') {
          sendEvent(
            `Student added ~${diff} chars of code. Brief encouraging comment. Don't repeat yourself.`,
            'encouraging'
          );
        }
      }, 8000);
    }
    setLastCodeLength(codeLen);
  }, [currentCode, lastCodeLength, lessonContext, sendEvent, conversation.status]);

  const handleHint = () => {
    hintsRef.current += 1;
    setHintsGiven(hintsRef.current);
    const level = hintsRef.current;
    const text = `Give me a hint${level > 1 ? ` (hint #${level})` : ''}`;
    if (conversation.status === 'connected') {
      conversation.sendUserMessage(text);
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
    if (conversation.status === 'connected') {
      conversation.sendUserMessage('Can you explain the core concept?');
      addMessage('Can you explain the core concept?', 'user', 'user');
    } else {
      sendEvent('Explain the core concept. Use an analogy if helpful.', 'teaching');
    }
  };

  const handleCelebrate = () => {
    if (conversation.status === 'connected') {
      conversation.sendUserMessage('I solved it!');
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

    if (conversation.status === 'connected') {
      conversation.sendUserMessage(text);
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

  // Cleanup on unmount only
  const conversationRef = useRef(conversation);
  conversationRef.current = conversation;
  const saveNotesRef = useRef(saveNotes);
  saveNotesRef.current = saveNotes;
  useEffect(() => {
    return () => {
      saveNotesRef.current();
      if (conversationRef.current.status === 'connected') {
        conversationRef.current.endSession().catch(() => {});
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

  const isVoiceActive = conversation.status === 'connected';
  const agentSpeaking = conversation.isSpeaking;

  return (
    <div className="flex flex-col h-full bg-[var(--background)]">
      {/* Header */}
      <div className="p-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-sm shadow-lg shadow-blue-500/20">
            🎓
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white">Coach Alex</h3>
            <p className="text-[11px] text-white/40">
              {voiceConnecting ? '🔄 Connecting...' :
               isVoiceActive && agentSpeaking ? '🔊 Speaking...' :
               isVoiceActive ? '🎙️ Voice Mode — Speak!' :
               'AI Coding Coach'}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
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
      <div className="px-3 py-2 border-b border-white/[0.06] flex items-center gap-2">
        {!isVoiceActive && !voiceConnecting ? (
          <button
            onClick={startVoice}
            className="flex-1 py-2 bg-gradient-to-r from-blue-500/20 to-violet-500/20 hover:from-blue-500/30 hover:to-violet-500/30 text-white rounded-lg flex items-center justify-center gap-2 transition-all text-xs font-semibold border border-blue-500/20"
          >
            <Phone className="w-3.5 h-3.5 text-blue-400" />
            <span>Start Voice Conversation</span>
          </button>
        ) : voiceConnecting ? (
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
              onClick={() => setMicMuted(!micMuted)}
              className={`p-2 rounded-lg transition-colors ${
                micMuted
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
              title={micMuted ? 'Unmute mic' : 'Mute mic'}
            >
              {micMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
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
                    {micMuted ? 'Mic muted' : 'Listening...'}
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.length === 0 && !isStreaming && !isVoiceActive && (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
            <GraduationCap className="w-8 h-8 mb-2" />
            <p className="text-xs">Click "Start Voice Conversation" to talk with Coach Alex</p>
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
      <div className="px-3 py-2 border-t border-white/[0.06] flex gap-1.5">
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

      {/* Chat Input (works in both modes) */}
      <form onSubmit={handleUserMessage} className="p-3 border-t border-white/[0.06]">
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
