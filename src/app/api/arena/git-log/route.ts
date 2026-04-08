import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase, createAdminSupabase } from '@/lib/supabase-auth';
import { getGitLog } from '@/lib/arena-sandbox';

export const runtime = 'nodejs';

// Parity with /api/arena/terminal which uses 20 s for exec; git log is simpler,
// so 5 s is sufficient and prevents hanging connections on unresponsive sandboxes.
const GIT_LOG_TIMEOUT_MS = 5_000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`git-log timeout after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

interface Commit {
  hash: string;
  message: string;
  ts: number;
}

/** Parse raw git log output (--format="%H|%at|%s" --shortstat) into Commit[]. */
function parseGitLog(raw: string): Commit[] {
  const commits: Commit[] = [];

  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    // Format lines: <40-char-hex>|<unix-timestamp>|<subject>
    // Stat lines start with digits or spaces — skip them.
    const match = trimmed.match(/^([0-9a-f]{7,40})\|(\d+)\|(.*)$/i);
    if (!match) continue;

    const [, fullHash, tsStr, message] = match;
    commits.push({
      hash: fullHash.slice(0, 7),
      ts: parseInt(tsStr, 10) * 1000,
      message: message.trim() || '(no message)',
    });

    if (commits.length >= 50) break;
  }

  return commits;
}

export async function POST(req: NextRequest) {
  // 1. Auth — must be a logged-in user
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Parse + validate body
  let body: { roomId?: unknown; sandboxId?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }
  const { roomId, sandboxId } = body;
  if (typeof roomId !== 'string' || typeof sandboxId !== 'string') {
    return NextResponse.json({ error: 'roomId and sandboxId required' }, { status: 400 });
  }

  // 3. Atomic auth + sandbox binding (same pattern as /api/arena/terminal)
  const admin = createAdminSupabase();
  const { data: room } = await admin
    .from('arena_rooms')
    .select('host_id, sandbox_id')
    .eq('id', roomId)
    .maybeSingle();

  if (!room) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  if (room.sandbox_id !== sandboxId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  if (room.host_id !== user.id) {
    // Not the host — verify participant membership
    const { data: participant } = await admin
      .from('arena_participants')
      .select('user_id')
      .eq('room_id', roomId)
      .eq('user_id', user.id)
      .maybeSingle();
    if (!participant) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  // 4. Fetch git log with timeout — return empty array on any error (no git history is valid)
  try {
    const raw = await withTimeout(getGitLog(sandboxId), GIT_LOG_TIMEOUT_MS);
    const commits = parseGitLog(raw);
    return NextResponse.json({ commits });
  } catch {
    // Fresh sandbox with no commits, git not initialised, timeout, etc.
    return NextResponse.json({ commits: [] });
  }
}
