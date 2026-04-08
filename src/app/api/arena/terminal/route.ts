import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase, createAdminSupabase } from '@/lib/supabase-auth';
import { execInSandbox } from '@/lib/arena-sandbox';

export const runtime = 'nodejs';

// Per-request command timeout. Long-running tools like `npm test` should use
// the milestones route, not the terminal.
const TERMINAL_EXEC_TIMEOUT_MS = 20_000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`terminal exec timeout after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

export async function POST(req: NextRequest) {
  // 1. Auth — must be a logged-in user
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Parse + validate body
  let body: { roomId?: unknown; sandboxId?: unknown; command?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }
  const { roomId, sandboxId, command } = body;
  if (typeof roomId !== 'string' || typeof sandboxId !== 'string' || typeof command !== 'string') {
    return NextResponse.json({ error: 'roomId, sandboxId, command required' }, { status: 400 });
  }
  if (command.length === 0 || command.length > 2000) {
    return NextResponse.json({ error: 'command length must be 1..2000' }, { status: 400 });
  }

  // 3. Atomic auth + sandbox binding — fetch host_id and sandbox_id in one query,
  //    then verify membership and sandbox ownership from the same snapshot.
  //    This closes the TOCTOU window between a separate membership check and
  //    a separate sandbox-binding check.
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
    // Not the host — must be a participant in the same room snapshot.
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

  // TODO(phase2): serialize concurrent exec against the same sandboxId
  //   — currently two room members can fire overlapping commands. The Vercel
  //   Sandbox SDK handles parallel exec, but the scoring/milestone pipeline
  //   assumes serial command execution. Consider per-sandbox in-flight lock.

  // 4. Exec with timeout — ExecResult types exitCode as number, trust it
  try {
    const result = await withTimeout(execInSandbox(sandboxId, command), TERMINAL_EXEC_TIMEOUT_MS);
    return NextResponse.json({
      stdout: result.stdout ?? '',
      stderr: result.stderr ?? '',
      exitCode: result.exitCode,
    });
  } catch (err) {
    console.error('[arena/terminal POST]', err);
    return NextResponse.json({ error: 'terminal exec failed' }, { status: 500 });
  }
}
