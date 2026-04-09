"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArenaProvider, useArena } from '@/contexts/ArenaContext';
import ArenaLayout from '@/components/arena/ArenaLayout';
import { getChallenge } from '@/data/arena-challenges';

interface ArenaRoomRow {
  id: string;
  challenge_id: string;
  persona_id: string;
  sandbox_id: string | null;
  status: string;
  settings: {
    track?: 'backend' | 'frontend' | 'fullstack' | 'data-science' | 'ml-engineer';
    mode?: 'passive' | 'active';
    durationMin?: number;
  } | null;
}

type HydrateState =
  | { kind: 'loading' }
  | { kind: 'ready' }
  | { kind: 'not-found' }
  | { kind: 'error'; message: string };

function SessionInner({ roomId }: { roomId: string }) {
  const { session, setSession } = useArena();
  const [state, setState] = useState<HydrateState>({ kind: 'loading' });
  const hydrationStartedRef = useRef(false);

  useEffect(() => {
    if (hydrationStartedRef.current) return;
    hydrationStartedRef.current = true;

    const ac = new AbortController();

    (async () => {
      try {
        // 1) Fetch all user rooms and find ours
        const roomsRes = await fetch('/api/arena/rooms', { signal: ac.signal });
        if (!roomsRes.ok) {
          throw new Error(`Failed to load rooms (${roomsRes.status})`);
        }
        const roomsJson = await roomsRes.json();
        const rooms: ArenaRoomRow[] = Array.isArray(roomsJson)
          ? roomsJson
          : Array.isArray(roomsJson?.rooms)
            ? roomsJson.rooms
            : [];
        const room = rooms.find(r => r.id === roomId);
        if (!room) {
          setState({ kind: 'not-found' });
          return;
        }

        // 2) Provision sandbox if missing
        let sandboxId = room.sandbox_id && room.sandbox_id !== '__provisioning__'
          ? room.sandbox_id
          : null;

        if (!sandboxId) {
          const provRes = await fetch('/api/arena/sandbox', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              roomId,
              challengeId: room.challenge_id,
              track: room.settings?.track,
            }),
            signal: ac.signal,
          });
          if (provRes.ok) {
            const prov = await provRes.json();
            sandboxId = prov.sandboxId;
          } else if (provRes.status === 409) {
            // Already claimed — poll once more for the real id
            const refetchRes = await fetch('/api/arena/rooms', { signal: ac.signal });
            const refetchJson = await refetchRes.json();
            const refreshed: ArenaRoomRow[] = Array.isArray(refetchJson)
              ? refetchJson
              : Array.isArray(refetchJson?.rooms)
                ? refetchJson.rooms
                : [];
            const updated = refreshed.find(r => r.id === roomId);
            sandboxId = updated?.sandbox_id && updated.sandbox_id !== '__provisioning__'
              ? updated.sandbox_id
              : null;
          } else {
            const body = await provRes.json().catch(() => ({}));
            throw new Error(body.error ?? `Sandbox provisioning failed (${provRes.status})`);
          }
        }

        if (!sandboxId) {
          throw new Error('Sandbox not available');
        }

        // 3) Resolve challenge metadata
        const challenge = getChallenge(room.challenge_id);
        const challengeTitle = challenge?.title ?? room.challenge_id;
        const durationMin = room.settings?.durationMin ?? challenge?.durationMin ?? 45;
        const track = room.settings?.track ?? challenge?.track ?? 'backend';
        const mode = room.settings?.mode ?? 'passive';

        if (ac.signal.aborted) return;

        setSession({
          roomId,
          sandboxId,
          personaId: room.persona_id,
          challengeId: room.challenge_id,
          challengeTitle,
          durationMin,
          score: 0,
          mode,
          track,
        });
        setState({ kind: 'ready' });
      } catch (err) {
        if (ac.signal.aborted) return;
        setState({
          kind: 'error',
          message: err instanceof Error ? err.message : 'Failed to load session',
        });
      }
    })();

    return () => {
      ac.abort();
    };
  }, [roomId, setSession]);

  if (state.kind === 'not-found') {
    return (
      <CenteredMessage>
        <h1 className="text-xl font-semibold">Session not found</h1>
        <p className="mt-2 text-sm text-white/60">
          This room doesn&apos;t exist or you don&apos;t have access to it.
        </p>
        <Link
          href="/arena"
          className="mt-4 inline-block rounded-lg bg-indigo-500 hover:bg-indigo-400 px-4 py-2 text-sm font-medium"
        >
          Back to lobby
        </Link>
      </CenteredMessage>
    );
  }

  if (state.kind === 'error') {
    return (
      <CenteredMessage>
        <h1 className="text-xl font-semibold">Couldn&apos;t load session</h1>
        <p className="mt-2 text-sm text-red-300">{state.message}</p>
        <Link
          href="/arena"
          className="mt-4 inline-block rounded-lg bg-indigo-500 hover:bg-indigo-400 px-4 py-2 text-sm font-medium"
        >
          Back to lobby
        </Link>
      </CenteredMessage>
    );
  }

  if (state.kind === 'loading' || !session) {
    return (
      <CenteredMessage>
        <span className="inline-block h-6 w-6 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        <p className="mt-3 text-sm text-white/60">Loading session...</p>
      </CenteredMessage>
    );
  }

  return <ArenaLayout />;
}

function CenteredMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="text-center">{children}</div>
    </div>
  );
}

export default function ArenaSessionPage() {
  const params = useParams<{ roomId: string }>();
  const roomId = typeof params?.roomId === 'string' ? params.roomId : '';

  return (
    <ArenaProvider>
      <SessionInner roomId={roomId} />
    </ArenaProvider>
  );
}
