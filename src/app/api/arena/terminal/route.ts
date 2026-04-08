import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase, createAdminSupabase } from '@/lib/supabase-auth';
import { execInSandbox } from '@/lib/arena-sandbox';
import { authorizeRoomAccess } from '@/lib/arena-auth';

export const runtime = 'nodejs';

// Per-request command timeout. Long-running tools like `npm test` should use
// the milestones route, not the terminal.
const TERMINAL_EXEC_TIMEOUT_MS = 20_000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`terminal exec timeout after ${ms}ms`)), ms),
    ),
  ]);
}

export async function POST(req: NextRequest) {
  // 1. Auth — must be a logged-in user
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
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

  // 3. Room membership check — user must be host or participant in this room
  const admin = createAdminSupabase();
  const allowed = await authorizeRoomAccess(admin, user.id, roomId);
  if (!allowed) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  // 4. Verify the sandboxId actually belongs to this room (prevent cross-room sandbox access)
  const { data: room } = await admin
    .from('arena_rooms')
    .select('sandbox_id')
    .eq('id', roomId)
    .maybeSingle();
  if (!room || room.sandbox_id !== sandboxId) {
    return NextResponse.json({ error: 'sandbox does not belong to room' }, { status: 403 });
  }

  // 5. Exec with timeout
  try {
    const result = await withTimeout(execInSandbox(sandboxId, command), TERMINAL_EXEC_TIMEOUT_MS);
    // Return structured output — xterm.js renders it client-side
    return NextResponse.json({
      stdout: result.stdout ?? '',
      stderr: result.stderr ?? '',
      exitCode: result.exitCode ?? 0,
    });
  } catch (err) {
    console.error('[arena/terminal POST]', err);
    return NextResponse.json({ error: 'terminal exec failed' }, { status: 500 });
  }
}
