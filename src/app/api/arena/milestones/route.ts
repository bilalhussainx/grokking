import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase, createAdminSupabase } from '@/lib/supabase-auth';
import { authorizeRoomAccess } from '@/lib/arena-auth';
import { checkAllMilestones } from '@/lib/arena-milestones';
import { getChallenge } from '@/data/arena-challenges';
import { execInSandbox } from '@/lib/arena-sandbox';

const TEST_TIMEOUT_MS = 15_000;
const EXEC_TIMEOUT_MS = 5_000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`exec timeout after ${ms}ms`)), ms),
    ),
  ]);
}

// GET /api/arena/milestones?sandboxId=...&challengeId=...&roomId=...
// Returns current milestone completion statuses by running detectors against the sandbox.
export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const sandboxId = searchParams.get('sandboxId');
  const challengeId = searchParams.get('challengeId');
  const roomId = searchParams.get('roomId');

  if (!sandboxId || typeof sandboxId !== 'string') {
    return NextResponse.json({ error: 'sandboxId (string) required' }, { status: 400 });
  }
  if (!challengeId || typeof challengeId !== 'string') {
    return NextResponse.json({ error: 'challengeId (string) required' }, { status: 400 });
  }

  // Authorization: roomId is optional but if provided we verify participation.
  // If not provided, we fall back to sandbox-level ownership check via arena_participants.
  if (roomId) {
    const admin = createAdminSupabase();
    const allowed = await authorizeRoomAccess(admin, user.id, roomId);
    if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  } else {
    // No roomId — verify via participant sandbox ownership
    const admin = createAdminSupabase();
    const { data: participantOwner } = await admin
      .from('arena_participants')
      .select('user_id')
      .eq('sandbox_id', sandboxId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (!participantOwner) {
      // Also check room-level sandbox ownership
      const { data: room } = await admin
        .from('arena_rooms')
        .select('id')
        .eq('sandbox_id', sandboxId)
        .maybeSingle();

      if (room) {
        const { data: roomParticipant } = await admin
          .from('arena_participants')
          .select('user_id')
          .eq('room_id', room.id)
          .eq('user_id', user.id)
          .maybeSingle();
        if (!roomParticipant) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      } else {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }
  }

  const challenge = getChallenge(challengeId);
  if (!challenge) {
    return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
  }

  let filesResult: { stdout: string };
  let testResult: { stdout: string };
  let gitResult: { stdout: string };

  try {
    [filesResult, testResult, gitResult] = await Promise.all([
      withTimeout(
        execInSandbox(
          sandboxId,
          'find /workspace -not -path "*/node_modules/*" -not -path "*/.git/*" -type f | sed "s|/workspace/||"',
        ),
        EXEC_TIMEOUT_MS,
      ),
      withTimeout(
        execInSandbox(sandboxId, 'cd /workspace && npm test 2>&1 | tail -20'),
        TEST_TIMEOUT_MS,
      ).catch(() => ({ stdout: '', stderr: '', exitCode: 1 })),
      withTimeout(
        execInSandbox(
          sandboxId,
          'cd /workspace && git log --format="%H|%at|%s" 2>/dev/null | head -20',
        ),
        EXEC_TIMEOUT_MS,
      ).catch(() => ({ stdout: '', stderr: '', exitCode: 0 })),
    ]);
  } catch (err) {
    console.error('[arena/milestones GET] sandbox exec failed', err);
    return NextResponse.json({ error: 'Sandbox query failed' }, { status: 500 });
  }

  const files = filesResult.stdout.split('\n').filter(Boolean);
  const commitMessages = gitResult.stdout
    .split('\n')
    .filter(l => l.includes('|'))
    .map(l => l.split('|')[2] ?? '');

  // Resolve preview URL from room if roomId is provided
  let previewUrl: string | undefined;
  if (roomId) {
    const admin = createAdminSupabase();
    const { data: room } = await admin
      .from('arena_rooms')
      .select('preview_url')
      .eq('id', roomId)
      .maybeSingle();
    previewUrl = (room as { preview_url?: string } | null)?.preview_url ?? undefined;
  }

  try {
    const statuses = await checkAllMilestones(challenge.milestones, {
      files,
      lastTestOutput: testResult.stdout,
      commitMessages,
      previewUrl,
    });
    return NextResponse.json({ milestones: statuses });
  } catch (err) {
    console.error('[arena/milestones GET] checkAllMilestones failed', err);
    return NextResponse.json({ error: 'Milestone check failed' }, { status: 500 });
  }
}
