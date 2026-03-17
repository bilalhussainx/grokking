import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-auth';
import { getLeaderboard } from '@/lib/leaderboard';

export async function GET() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const board = await getLeaderboard(user.id);
    return NextResponse.json(board);
  } catch (err) {
    console.error('Leaderboard error:', err);
    // Return empty data instead of 500 — tables might not exist yet
    return NextResponse.json({ league: 'bronze', rank: 0, groupSize: 0, members: [] });
  }
}
