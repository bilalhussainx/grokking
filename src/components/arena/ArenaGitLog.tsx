"use client";

import { useEffect, useState } from 'react';
import { GitCommit } from 'lucide-react';

interface Commit {
  hash: string;
  message: string;
  ts: number;
}

interface ArenaGitLogProps {
  sandboxId: string;
  roomId: string;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function ArenaGitLog({ sandboxId, roomId }: ArenaGitLogProps) {
  const [commits, setCommits] = useState<Commit[]>([]);

  useEffect(() => {
    let cancelled = false;

    const fetchLog = async () => {
      try {
        const res = await fetch('/api/arena/git-log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sandboxId, roomId }),
        });
        if (!res.ok || cancelled) return;
        const { commits: data } = await res.json() as { commits: Commit[] };
        if (!cancelled) setCommits(data ?? []);
      } catch {
        // silently ignore network errors — git log is non-critical
      }
    };

    fetchLog();
    const interval = setInterval(fetchLog, 10_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [sandboxId, roomId]);

  return (
    <div className="border-t border-white/[0.06]">
      <div className="px-3 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
          Git Log
        </span>
      </div>

      <div className="max-h-48 overflow-y-auto px-2 pb-2">
        {commits.length === 0 ? (
          <p className="px-1 py-1 text-xs text-white/20">No commits yet</p>
        ) : (
          commits.slice(0, 8).map(commit => (
            <div
              key={commit.hash}
              className="flex items-start gap-2 rounded px-1 py-1.5 text-xs hover:bg-white/5"
            >
              <GitCommit className="mt-0.5 h-3 w-3 shrink-0 text-violet-400/60" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-white/70">{commit.message}</p>
                <p className="text-[10px] text-white/30">
                  <span className="font-mono">{commit.hash}</span>
                  {' · '}
                  {timeAgo(commit.ts)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
