"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Trophy, Rocket, LogOut } from 'lucide-react';
import { useArena } from '@/contexts/ArenaContext';

function formatMMSS(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function ArenaTopBar() {
  const router = useRouter();
  const { session, clearSession } = useArena();

  // Initial countdown is derived from the session at mount. To restart the
  // countdown for a new session, the parent should re-mount this component
  // (e.g. via a `key={session.roomId}` prop) — that's intentionally simpler
  // than reconciling state changes inside an effect.
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    () => (session?.durationMin ?? 0) * 60,
  );

  useEffect(() => {
    if (!session) return;
    const tick = setInterval(() => {
      setSecondsRemaining(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(tick);
  }, [session]);

  const handleExit = useCallback(() => {
    clearSession();
    router.push('/arena');
  }, [clearSession, router]);

  if (!session) {
    return (
      <div className="flex h-12 items-center justify-between border-b border-white/[0.06] bg-slate-950/70 px-4">
        <span className="text-xs text-white/30">No active session</span>
      </div>
    );
  }

  const isTimeUp = secondsRemaining === 0;

  return (
    <div className="flex h-12 items-center justify-between border-b border-white/[0.06] bg-slate-950/70 px-4">
      {/* Left: challenge title */}
      <div className="flex min-w-0 items-center gap-3">
        <span className="truncate text-sm font-semibold text-white">
          {session.challengeTitle}
        </span>
        <span className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white/40">
          {session.track}
        </span>
      </div>

      {/* Right: timer, score, deploy, exit */}
      <div className="flex items-center gap-3">
        {/* Timer */}
        <div
          className={[
            'flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-mono',
            isTimeUp
              ? 'border-red-500/40 bg-red-500/10 text-red-300'
              : 'border-white/[0.08] bg-white/[0.03] text-white/80',
          ].join(' ')}
        >
          <Clock className="h-3 w-3" />
          {isTimeUp ? 'TIME' : formatMMSS(secondsRemaining)}
        </div>

        {/* Score */}
        <div className="flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-300">
          <Trophy className="h-3 w-3" />
          {session.score} XP
        </div>

        {/* Deploy (placeholder) */}
        <button
          type="button"
          disabled
          title="Coming soon"
          className="flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-xs text-white/40 opacity-60"
        >
          <Rocket className="h-3 w-3" />
          Deploy
        </button>

        {/* Exit */}
        <button
          type="button"
          onClick={handleExit}
          className="flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-xs text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
        >
          <LogOut className="h-3 w-3" />
          Exit
        </button>
      </div>
    </div>
  );
}
