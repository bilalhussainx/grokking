import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase, createAdminSupabase } from '@/lib/supabase-auth';
import { emitScoreEvent, getRunningTotal, SCORE_VALUES } from '@/lib/arena-scoring';

/** Verify the caller is a participant in the given room. */
async function authorizeRoomAccess(roomId: string, userId: string): Promise<boolean> {
  const admin = createAdminSupabase();
  const { data: participant } = await admin
    .from('arena_participants')
    .select('user_id')
    .eq('room_id', roomId)
    .eq('user_id', userId)
    .maybeSingle();
  return !!participant;
}

// POST /api/arena/score — emit a score event and return the updated total
// Body: { roomId, eventType, metadata? }
// NOTE: pointsOverride is intentionally NOT accepted from the client to prevent
// score manipulation. Points are always resolved from SCORE_VALUES by eventType.
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const roomId = typeof body.roomId === 'string' ? body.roomId : null;
  const eventType = typeof body.eventType === 'string' ? body.eventType : null;
  const metadata =
    body.metadata && typeof body.metadata === 'object' && !Array.isArray(body.metadata)
      ? (body.metadata as Record<string, unknown>)
      : undefined;

  if (!roomId || !eventType) {
    return NextResponse.json(
      { error: 'roomId and eventType (string) required' },
      { status: 400 },
    );
  }

  // Reject unknown event types to prevent arbitrary point insertion
  if (!(eventType in SCORE_VALUES)) {
    return NextResponse.json(
      { error: `Unknown eventType: ${eventType}` },
      { status: 400 },
    );
  }

  const allowed = await authorizeRoomAccess(roomId, user.id);
  if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    // pointsOverride is intentionally omitted — clients cannot override point values
    const result = await emitScoreEvent(roomId, user.id, eventType, undefined, metadata);
    return NextResponse.json(result);
  } catch (err) {
    console.error('[arena/score POST]', err);
    return NextResponse.json({ error: 'Score event failed' }, { status: 500 });
  }
}

// GET /api/arena/score?roomId=...
// Returns running score total for the authenticated user in the given room.
export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const roomId = req.nextUrl.searchParams.get('roomId');
  if (!roomId || typeof roomId !== 'string') {
    return NextResponse.json({ error: 'roomId (string) required' }, { status: 400 });
  }

  const allowed = await authorizeRoomAccess(roomId, user.id);
  if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const total = await getRunningTotal(roomId, user.id);
    return NextResponse.json({ total });
  } catch (err) {
    console.error('[arena/score GET]', err);
    return NextResponse.json({ error: 'Failed to fetch score' }, { status: 500 });
  }
}
