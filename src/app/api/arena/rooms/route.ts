import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase, createAdminSupabase } from '@/lib/supabase-auth';

function generateJoinCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Fix 7: strict type validation on input
  const body = await req.json().catch(() => ({}));
  const challengeId = typeof body.challengeId === 'string' ? body.challengeId : null;
  const personaId = typeof body.personaId === 'string' ? body.personaId : null;
  const settings = body.settings && typeof body.settings === 'object' ? body.settings : null;

  if (!challengeId) {
    return NextResponse.json({ error: 'challengeId (string) required' }, { status: 400 });
  }

  const admin = createAdminSupabase();

  // Fix 4: retry loop on join code unique-constraint violation (Postgres code 23505)
  const MAX_JOIN_CODE_ATTEMPTS = 5;
  let room = null;
  let lastError: unknown = null;
  for (let i = 0; i < MAX_JOIN_CODE_ATTEMPTS; i++) {
    const joinCode = generateJoinCode();
    const { data, error } = await admin
      .from('arena_rooms')
      .insert({
        host_id: user.id,
        challenge_id: challengeId,
        persona_id: personaId ?? 'alex-chen',
        join_code: joinCode,
        status: 'lobby',
        settings: settings ?? {},
      })
      .select()
      .single();

    if (!error) { room = data; break; }
    if ((error as { code?: string }).code !== '23505') { lastError = error; break; } // not a unique violation
    lastError = error;
  }

  if (!room) {
    // Fix 6: no internal error details in response
    console.error('[arena/rooms POST] failed to insert room', lastError);
    return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
  }

  // Fix 9: await participant insert and clean up orphaned room on failure
  const { error: participantErr } = await admin.from('arena_participants').insert({
    room_id: room.id,
    user_id: user.id,
    role: 'host',
  });
  if (participantErr) {
    await admin.from('arena_rooms').delete().eq('id', room.id);
    console.error('[arena/rooms POST] failed to add host as participant', participantErr);
    return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
  }

  return NextResponse.json(room);
}

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const joinCode = req.nextUrl.searchParams.get('joinCode');
  const admin = createAdminSupabase();

  if (joinCode) {
    const { data, error } = await admin
      .from('arena_rooms')
      .select('*')
      .eq('join_code', joinCode.toUpperCase())
      .single();
    if (error || !data) return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    return NextResponse.json(data);
  }

  // List rooms for this user
  const { data } = await admin
    .from('arena_participants')
    .select('room_id')
    .eq('user_id', user.id);
  const roomIds = (data ?? []).map(r => r.room_id);
  if (roomIds.length === 0) return NextResponse.json([]);

  const { data: rooms } = await admin
    .from('arena_rooms')
    .select('*')
    .in('id', roomIds)
    .order('created_at', { ascending: false })
    .limit(20);

  return NextResponse.json(rooms ?? []);
}
