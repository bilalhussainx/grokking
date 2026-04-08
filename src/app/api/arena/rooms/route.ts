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

  const { challengeId, personaId, settings } = await req.json();
  if (!challengeId || !personaId) {
    return NextResponse.json({ error: 'challengeId and personaId required' }, { status: 400 });
  }

  const admin = createAdminSupabase();
  const { data, error } = await admin
    .from('arena_rooms')
    .insert({
      host_id: user.id,
      challenge_id: challengeId,
      persona_id: personaId,
      join_code: generateJoinCode(),
      status: 'lobby',
      settings: settings ?? {},
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Add host as participant
  await admin.from('arena_participants').insert({
    room_id: data.id,
    user_id: user.id,
    role: 'host',
  });

  return NextResponse.json(data);
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
