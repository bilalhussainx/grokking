import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-auth';
import { getXPProfile } from '@/lib/xp';
import { getUserAchievements } from '@/lib/achievements';
import { getGemBalance } from '@/lib/gems';

export async function GET() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [xp, achievements, gems] = await Promise.all([
    getXPProfile(user.id),
    getUserAchievements(user.id),
    getGemBalance(user.id),
  ]);

  return NextResponse.json({ ...xp, achievements, gems });
}
