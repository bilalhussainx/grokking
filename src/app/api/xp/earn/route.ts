import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-auth';
import { earnXP } from '@/lib/xp';
import { checkAndUnlockAchievements } from '@/lib/achievements';

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { action, refId } = await req.json();
  const result = await earnXP(user.id, action, refId);

  // Check achievements based on action
  let achievements: any[] = [];
  if (action === 'lesson_complete') {
    achievements = await checkAndUnlockAchievements(user.id, { type: 'lessons_completed', value: 1 });
  }

  return NextResponse.json({ ...result, achievements });
}
