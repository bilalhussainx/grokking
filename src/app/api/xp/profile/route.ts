import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-auth';
import { getXPProfile } from '@/lib/xp';
import { getUserAchievements } from '@/lib/achievements';
import { getGemBalance } from '@/lib/gems';

export async function GET() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const [xp, achievements, gems] = await Promise.all([
      getXPProfile(user.id),
      getUserAchievements(user.id),
      getGemBalance(user.id),
    ]);
    return NextResponse.json({ ...xp, achievements, gems });
  } catch (err) {
    console.error('XP profile error:', err);
    // Return defaults if tables don't exist yet
    return NextResponse.json({ totalXp: 0, level: 1, weeklyXp: 0, current: 0, needed: 500, progress: 0, achievements: [], gems: 0 });
  }
}
