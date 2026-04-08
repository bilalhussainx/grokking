import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Verify that `userId` is a participant (host, challenger, spectator) in `roomId`.
 * Returns true if authorized, false otherwise.
 *
 * Pass an admin Supabase client — this bypasses RLS intentionally because the
 * RLS policies on arena_participants require auth.uid() which is not available
 * in server-side admin contexts.
 */
export async function authorizeRoomAccess(
  adminSupabase: SupabaseClient,
  userId: string,
  roomId: string,
): Promise<boolean> {
  // First: check if user is the host of the room
  const { data: room } = await adminSupabase
    .from('arena_rooms')
    .select('host_id')
    .eq('id', roomId)
    .maybeSingle();
  if (room?.host_id === userId) return true;

  // Otherwise: check participant membership
  const { data: participant } = await adminSupabase
    .from('arena_participants')
    .select('user_id')
    .eq('room_id', roomId)
    .eq('user_id', userId)
    .maybeSingle();
  return !!participant;
}
