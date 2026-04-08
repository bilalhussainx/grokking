import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase, createAdminSupabase } from '@/lib/supabase-auth';
import { provisionSandbox, teardownSandbox } from '@/lib/arena-sandbox';
import { getChallenge } from '@/data/arena-challenges';

// Used as an atomic lock while provisioning is in flight.
// Once provisioning succeeds this is replaced with the real sandboxId.
const PROVISIONING_PLACEHOLDER = '__provisioning__';

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Fix 7: strict type validation on input
  const body = await req.json().catch(() => ({}));
  const roomId = typeof body.roomId === 'string' ? body.roomId : null;
  if (!roomId) {
    return NextResponse.json({ error: 'roomId (string) required' }, { status: 400 });
  }

  const admin = createAdminSupabase();

  // Verify user is in this room
  const { data: participant } = await admin
    .from('arena_participants')
    .select('role')
    .eq('room_id', roomId)
    .eq('user_id', user.id)
    .single();
  if (!participant) return NextResponse.json({ error: 'Not in room' }, { status: 403 });

  // Fix 2: atomic compare-and-swap — set sandbox_id to placeholder only if currently NULL.
  // This prevents two simultaneous POST requests from both provisioning a sandbox.
  const { data: claimed, error: claimErr } = await admin
    .from('arena_rooms')
    .update({ sandbox_id: PROVISIONING_PLACEHOLDER })
    .eq('id', roomId)
    .is('sandbox_id', null)
    .select('id, challenge_id')
    .maybeSingle();

  if (claimErr || !claimed) {
    // Fix 5: room-not-found is also handled here (claim returns null)
    return NextResponse.json(
      { error: 'Room sandbox already claimed or not found' },
      { status: 409 },
    );
  }

  const challenge = claimed.challenge_id ? getChallenge(claimed.challenge_id) : undefined;

  // Fix 3: provision, then wrap DB writes in try/catch with compensating teardown
  let sandboxId: string;
  try {
    sandboxId = await provisionSandbox(challenge?.starterRepo);
  } catch (err) {
    // Release the lock so the client can retry
    await admin.from('arena_rooms').update({ sandbox_id: null }).eq('id', roomId);
    // Fix 6: no internal error details in response; Fix 8: log server-side
    console.error('[arena/sandbox POST] provision failed', err);
    return NextResponse.json({ error: 'Sandbox provisioning failed' }, { status: 500 });
  }

  try {
    await admin
      .from('arena_rooms')
      .update({
        sandbox_id: sandboxId,
        status: 'active',
        starts_at: new Date().toISOString(),
      })
      .eq('id', roomId);

    await admin
      .from('arena_participants')
      .update({ sandbox_id: sandboxId })
      .eq('room_id', roomId)
      .eq('user_id', user.id);
  } catch (dbErr) {
    // Fix 3: compensating teardown on DB failure
    console.error('[arena/sandbox POST] DB update failed after provision, tearing down', dbErr);
    try {
      await teardownSandbox(sandboxId);
    } catch (tdErr) {
      console.error('[arena/sandbox POST] compensating teardown failed', tdErr);
    }
    await admin.from('arena_rooms').update({ sandbox_id: null }).eq('id', roomId);
    return NextResponse.json({ error: 'Sandbox setup failed' }, { status: 500 });
  }

  return NextResponse.json({ sandboxId });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sandboxId = searchParams.get('sandboxId');
  if (!sandboxId) return NextResponse.json({ error: 'sandboxId required' }, { status: 400 });

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Fix 1: authorization check — caller must be the room host OR the participant
  // whose sandbox_id matches.
  const admin = createAdminSupabase();

  const { data: room } = await admin
    .from('arena_rooms')
    .select('id, host_id, sandbox_id')
    .eq('sandbox_id', sandboxId)
    .maybeSingle();

  const { data: participantOwner } = await admin
    .from('arena_participants')
    .select('user_id, room_id')
    .eq('sandbox_id', sandboxId)
    .eq('user_id', user.id)
    .maybeSingle();

  const isHost = room?.host_id === user.id;
  const isOwner = !!participantOwner;

  if (!isHost && !isOwner) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    await teardownSandbox(sandboxId);
    if (room) {
      await admin
        .from('arena_rooms')
        .update({ sandbox_id: null, status: 'finished' })
        .eq('id', room.id);
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    // Fix 6: no internal error details in response; Fix 8: log server-side
    console.error('[arena/sandbox DELETE] teardown failed', err);
    return NextResponse.json({ error: 'Teardown failed' }, { status: 500 });
  }
}
