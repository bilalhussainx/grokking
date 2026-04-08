"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { Bot, Send, User, Loader2 } from 'lucide-react';
import { useArena } from '@/contexts/ArenaContext';

interface Message {
  role: 'interviewer' | 'participant';
  content: string;
  ts: number;
}

interface ArenaInterviewerProps {
  roomId?: string;
}

const ACTIVE_IDLE_MS = 30_000;

export function ArenaInterviewer({ roomId: roomIdProp }: ArenaInterviewerProps) {
  const { session } = useArena();
  const roomId = roomIdProp ?? session?.roomId;
  const personaId = session?.personaId;
  const mode = session?.mode ?? 'passive';

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  // Mirror `loading` into a ref so sendTrigger can guard against concurrent
  // requests WITHOUT depending on the loading state. If sendTrigger had
  // `loading` in its deps, its identity would flip on every request and the
  // idle-timer effect (which depends on sendTrigger) would restart the 30s
  // countdown on every send.
  const loadingRef = useRef(false);

  // Send a trigger to the interviewer endpoint
  const sendTrigger = useCallback(
    async (trigger: string, participantMessage?: string) => {
      if (!roomId || !personaId) return;
      if (loadingRef.current) return;

      loadingRef.current = true;
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      abortRef.current?.abort();
      abortRef.current = controller;

      try {
        const res = await fetch('/api/arena/interviewer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomId,
            personaId,
            trigger,
            participantMessage,
          }),
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          if (controller.signal.aborted) return;
          setError(json.error ?? 'Interviewer error');
          return;
        }

        const json: { reply?: string } = await res.json();
        if (controller.signal.aborted) return;
        if (json.reply) {
          setMessages(prev => [
            ...prev,
            { role: 'interviewer', content: json.reply!, ts: Date.now() },
          ]);
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError('Network error');
        }
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [roomId, personaId],
  );

  // Submit user-typed message
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      const text = input.trim();
      if (!text || loading) return;

      setMessages(prev => [
        ...prev,
        { role: 'participant', content: text, ts: Date.now() },
      ]);
      setInput('');
      await sendTrigger('participant_message', text);
    },
    [input, loading, sendTrigger],
  );

  // Active mode: 30s idle timer based on message activity.
  // NOTE (Phase 1 simplification): we reset the timer on message changes only,
  // not on every editor keystroke. Full keystroke tracking is deferred.
  useEffect(() => {
    if (mode !== 'active' || !roomId || !personaId) {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
      return;
    }

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      sendTrigger('idle_30s');
    }, ACTIVE_IDLE_MS);

    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
    };
  }, [mode, roomId, personaId, messages, sendTrigger]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  // Abort any in-flight request on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  if (!roomId || !personaId) {
    return (
      <div className="flex h-full items-center justify-center border-l border-white/[0.06] bg-slate-950/50 p-4 text-xs text-white/30">
        No active session
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col border-l border-white/[0.06] bg-slate-950/50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-2">
        <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/30">
          <Bot className="h-3 w-3" />
          Interviewer
        </span>
        <span
          className={[
            'rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider',
            mode === 'active'
              ? 'bg-amber-500/20 text-amber-300'
              : 'bg-white/5 text-white/40',
          ].join(' ')}
        >
          {mode}
        </span>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-y-auto px-3 py-3"
      >
        {messages.length === 0 && !loading ? (
          <p className="text-xs text-white/30">
            {mode === 'active'
              ? 'Active mode — interviewer will check in if you go idle.'
              : 'Ask the interviewer a question to begin.'}
          </p>
        ) : null}

        {messages.map((m, i) => (
          <div
            key={`${m.ts}-${i}`}
            className={[
              'flex gap-2',
              m.role === 'participant' ? 'flex-row-reverse' : '',
            ].join(' ')}
          >
            <div
              className={[
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                m.role === 'interviewer'
                  ? 'bg-violet-500/20 text-violet-300'
                  : 'bg-sky-500/20 text-sky-300',
              ].join(' ')}
            >
              {m.role === 'interviewer' ? (
                <Bot className="h-3 w-3" />
              ) : (
                <User className="h-3 w-3" />
              )}
            </div>
            <div
              className={[
                'max-w-[80%] rounded-lg px-3 py-2 text-xs leading-relaxed',
                m.role === 'interviewer'
                  ? 'bg-white/[0.04] text-white/80'
                  : 'bg-sky-500/10 text-sky-100',
              ].join(' ')}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Loader2 className="h-3 w-3 animate-spin" />
            Thinking…
          </div>
        )}

        {error && (
          <p className="rounded bg-red-500/10 px-2 py-1 text-xs text-red-300">
            {error}
          </p>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-white/[0.06] px-3 py-2"
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask a question…"
          disabled={loading}
          className="flex-1 rounded-md border border-white/[0.06] bg-slate-900/60 px-2 py-1.5 text-xs text-white placeholder-white/30 outline-none focus:border-violet-500/40 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-md bg-violet-500/20 p-1.5 text-violet-300 transition-colors hover:bg-violet-500/30 disabled:opacity-30"
          title="Send"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
}
