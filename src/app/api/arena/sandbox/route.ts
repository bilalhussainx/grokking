import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase, createAdminSupabase } from '@/lib/supabase-auth';
import { provisionSandbox, teardownSandbox } from '@/lib/arena-sandbox';
import { getChallenge } from '@/data/arena-challenges';

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { roomId } = await req.json();
  if (!roomId) return NextResponse.json({ error: 'roomId required' }, { status: 400 });

  const admin = createAdminSupabase();

  // Verify user is in this room
  const { data: participant } = await admin
    .from('arena_participants')
    .select('role')
    .eq('room_id', roomId)
    .eq('user_id', user.id)
    .single();
  if (!participant) return NextResponse.json({ error: 'Not in room' }, { status: 403 });

  // Get challenge starter repo
  const { data: room } = await admin
    .from('arena_rooms')
    .select('challenge_id')
    .eq('id', roomId)
    .single();

  const challenge = room?.challenge_id ? getChallenge(room.challenge_id) : undefined;

  try {
    const sandboxId = await provisionSandbox(challenge?.starterRepo);

    // Store sandbox ID on participant
    await admin
      .from('arena_participants')
      .update({ sandbox_id: sandboxId })
      .eq('room_id', roomId)
      .eq('user_id', user.id);

    // Update room status to active
    await admin
      .from('arena_rooms')
      .update({ status: 'active', starts_at: new Date().toISOString(), sandbox_id: sandboxId })
      .eq('id', roomId);

    return NextResponse.json({ sandboxId });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { sandboxId } = await req.json();
  if (!sandboxId) return NextResponse.json({ error: 'sandboxId required' }, { status: 400 });

  await teardownSandbox(sandboxId);
  return NextResponse.json({ ok: true });
}
