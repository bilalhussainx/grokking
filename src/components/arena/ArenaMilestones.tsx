"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { CheckCircle2, Circle, Trophy } from 'lucide-react';

interface MilestoneStatus {
  id: string;
  title: string;
  complete: boolean;
  xp: number;
}

interface ArenaMilestonesProps {
  sandboxId: string;
  challengeId: string;
  roomId: string;
}

const POLL_INTERVAL_MS = 5000;

export function ArenaMilestones({
  sandboxId,
  challengeId,
  roomId,
}: ArenaMilestonesProps) {
  const [statuses, setStatuses] = useState<MilestoneStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const inFlightRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const url =
        `/api/arena/milestones?sandboxId=${encodeURIComponent(sandboxId)}` +
        `&challengeId=${encodeURIComponent(challengeId)}` +
        `&roomId=${encodeURIComponent(roomId)}`;
      const res = await fetch(url, { signal: controller.signal });
      if (controller.signal.aborted) return;

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        if (controller.signal.aborted) return;
        setError(json.error ?? 'Failed to load milestones');
        return;
      }

      const json: { milestones: MilestoneStatus[] } = await res.json();
      if (controller.signal.aborted) return;
      setStatuses(json.milestones ?? []);
      setError(null);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError('Network error');
      }
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  }, [sandboxId, challengeId, roomId]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, POLL_INTERVAL_MS);
    return () => {
      clearInterval(interval);
      abortRef.current?.abort();
    };
  }, [refresh]);

  const completedCount = statuses.filter(s => s.complete).length;
  const totalXp = statuses.reduce(
    (sum, s) => sum + (s.complete ? s.xp : 0),
    0,
  );

  return (
    <div className="flex h-full flex-col border-l border-white/[0.06] bg-slate-950/50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-2">
        <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/30">
          <Trophy className="h-3 w-3" />
          Milestones
        </span>
        <span className="text-[10px] text-white/40">
          {completedCount}/{statuses.length} · {totalXp} XP
        </span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {error ? (
          <p className="px-2 py-2 text-xs text-red-400/70">{error}</p>
        ) : loading && statuses.length === 0 ? (
          <p className="px-2 py-2 text-xs text-white/30">Loading…</p>
        ) : statuses.length === 0 ? (
          <p className="px-2 py-2 text-xs text-white/30">No milestones</p>
        ) : (
          <ul className="space-y-1">
            {statuses.map(m => (
              <li
                key={m.id}
                className={[
                  'flex items-start gap-2 rounded-md px-2 py-2 transition-colors',
                  m.complete
                    ? 'bg-emerald-500/10 text-emerald-200'
                    : 'text-white/60 hover:bg-white/[0.03]',
                ].join(' ')}
              >
                {m.complete ? (
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                ) : (
                  <Circle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/20" />
                )}
                <div className="min-w-0 flex-1">
                  <p
                    className={[
                      'truncate text-xs',
                      m.complete ? 'font-medium' : '',
                    ].join(' ')}
                  >
                    {m.title}
                  </p>
                  <p className="text-[10px] text-white/30">+{m.xp} XP</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
