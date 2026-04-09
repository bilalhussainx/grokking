"use client";

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArenaProvider } from '@/contexts/ArenaContext';
import { ARENA_CHALLENGES } from '@/data/arena-challenges';

type Track = 'backend' | 'frontend' | 'fullstack' | 'data-science' | 'ml-engineer';
type Mode = 'passive' | 'active';

interface PersonaOption {
  id: string;
  name: string;
  blurb: string;
}

const PERSONA_OPTIONS: PersonaOption[] = [
  { id: 'alex-chen', name: 'Alex Chen', blurb: 'Staff engineer — pragmatic, pushes on edge cases' },
  { id: 'dr-priya-sharma', name: 'Dr. Priya Sharma', blurb: 'Data science lead — rigorous on methodology' },
  { id: 'marcus-johnson', name: 'Marcus Johnson', blurb: 'Frontend architect — cares about UX and perf' },
  { id: 'sara-lin', name: 'Sara Lin', blurb: 'Principal engineer — systems thinker, asks "why"' },
];

const TRACKS: { value: Track; label: string }[] = [
  { value: 'backend', label: 'Backend' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'fullstack', label: 'Full-stack' },
  { value: 'data-science', label: 'Data Science' },
  { value: 'ml-engineer', label: 'ML Engineer' },
];

const DURATIONS = [30, 45, 60] as const;

function LobbyInner() {
  const router = useRouter();
  const [challengeId, setChallengeId] = useState<string>(ARENA_CHALLENGES[0]?.id ?? '');
  const [personaId, setPersonaId] = useState<string>(PERSONA_OPTIONS[0].id);
  const [track, setTrack] = useState<Track>('backend');
  const [mode, setMode] = useState<Mode>('passive');
  const [durationMin, setDurationMin] = useState<number>(45);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedChallenge = useMemo(
    () => ARENA_CHALLENGES.find(c => c.id === challengeId),
    [challengeId],
  );

  async function handleStart(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const roomRes = await fetch('/api/arena/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId,
          personaId,
          settings: { track, mode, durationMin },
        }),
      });
      if (!roomRes.ok) {
        const body = await roomRes.json().catch(() => ({}));
        throw new Error(body.error ?? `Failed to create room (${roomRes.status})`);
      }
      const room = await roomRes.json();
      const roomId: string | undefined = room?.id;
      if (!roomId) throw new Error('Room created but no id returned');

      const sandboxRes = await fetch('/api/arena/sandbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId }),
      });
      if (!sandboxRes.ok && sandboxRes.status !== 409) {
        // 409 = already claimed, session page will handle hydration
        const body = await sandboxRes.json().catch(() => ({}));
        throw new Error(body.error ?? `Failed to provision sandbox (${sandboxRes.status})`);
      }

      router.push(`/arena/${roomId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Arena</h1>
          <p className="mt-2 text-sm text-white/60">
            Live interview sandbox. Pick a challenge, a persona, and go.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleStart} className="space-y-5" data-testid="arena-lobby-form">
          <Field label="Challenge">
            <select
              value={challengeId}
              onChange={e => setChallengeId(e.target.value)}
              data-testid="arena-lobby-challenge"
              className="w-full rounded-lg bg-slate-900/80 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
            >
              {ARENA_CHALLENGES.map(c => (
                <option key={c.id} value={c.id}>
                  {c.title} — {c.difficulty} · {c.durationMin}m
                </option>
              ))}
            </select>
            {selectedChallenge && (
              <p className="mt-1 text-xs text-white/50">
                {selectedChallenge.track} · {selectedChallenge.tags.join(', ')}
              </p>
            )}
          </Field>

          <Field label="Interviewer persona">
            <select
              value={personaId}
              onChange={e => setPersonaId(e.target.value)}
              data-testid="arena-lobby-persona"
              className="w-full rounded-lg bg-slate-900/80 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
            >
              {PERSONA_OPTIONS.map(p => (
                <option key={p.id} value={p.id}>{p.name} — {p.blurb}</option>
              ))}
            </select>
          </Field>

          <Field label="Track">
            <div className="flex flex-wrap gap-2" data-testid="arena-lobby-track">
              {TRACKS.map(t => (
                <button
                  type="button"
                  key={t.value}
                  onClick={() => setTrack(t.value)}
                  className={`rounded-lg px-3 py-1.5 text-xs border transition ${
                    track === t.value
                      ? 'border-indigo-400 bg-indigo-500/20 text-white'
                      : 'border-white/10 bg-white/[0.02] text-white/70 hover:border-white/20'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Mode">
              <div className="flex gap-2" data-testid="arena-lobby-mode">
                {(['passive', 'active'] as Mode[]).map(m => (
                  <button
                    type="button"
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 rounded-lg px-3 py-1.5 text-xs border transition capitalize ${
                      mode === m
                        ? 'border-indigo-400 bg-indigo-500/20 text-white'
                        : 'border-white/10 bg-white/[0.02] text-white/70 hover:border-white/20'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Duration">
              <div className="flex gap-2" data-testid="arena-lobby-duration">
                {DURATIONS.map(d => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setDurationMin(d)}
                    className={`flex-1 rounded-lg px-3 py-1.5 text-xs border transition ${
                      durationMin === d
                        ? 'border-indigo-400 bg-indigo-500/20 text-white'
                        : 'border-white/10 bg-white/[0.02] text-white/70 hover:border-white/20'
                    }`}
                  >
                    {d}m
                  </button>
                ))}
              </div>
            </Field>
          </div>

          <button
            type="submit"
            disabled={submitting || !challengeId}
            className="w-full rounded-lg bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5 text-sm font-medium transition flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <span className="inline-block h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Provisioning sandbox...
              </>
            ) : (
              'Start interview'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wider text-white/50">{label}</span>
      {children}
    </label>
  );
}

export default function ArenaLobbyPage() {
  return (
    <ArenaProvider>
      <LobbyInner />
    </ArenaProvider>
  );
}
