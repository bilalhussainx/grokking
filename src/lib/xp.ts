import { createAdminSupabase } from '@/lib/supabase-auth';

export const XP_ACTIONS: Record<string, number> = {
  lesson_open: 5,
  lesson_complete: 50,
  quiz_correct: 10,
  voice_minute: 20,
  module_complete: 200,
  course_complete: 1000,
  daily_login: 10,
  did_you_know: 5,
  speed_round_correct: 5,
};

export function calculateLevel(totalXp: number): number {
  return Math.max(1, Math.floor(totalXp / 500) + 1);
}

export function xpToNextLevel(totalXp: number): { current: number; needed: number; progress: number } {
  const level = calculateLevel(totalXp);
  const currentLevelXp = (level - 1) * 500;
  const current = totalXp - currentLevelXp;
  const needed = 500;
  return { current, needed, progress: Math.round((current / needed) * 100) };
}

export async function earnXP(userId: string, action: string, refId?: string): Promise<{
  xpEarned: number;
  totalXp: number;
  level: number;
  leveledUp: boolean;
  previousLevel: number;
}> {
  const amount = XP_ACTIONS[action] || 0;
  if (amount === 0) return { xpEarned: 0, totalXp: 0, level: 1, leveledUp: false, previousLevel: 1 };

  const supabase = createAdminSupabase();

  // Get current XP
  const { data: current } = await supabase
    .from('user_xp')
    .select('total_xp, level, weekly_xp')
    .eq('user_id', userId)
    .single();

  const oldXp = current?.total_xp || 0;
  const oldLevel = current?.level || 1;
  const newXp = oldXp + amount;
  const newLevel = calculateLevel(newXp);
  const leveledUp = newLevel > oldLevel;

  // Upsert XP
  await supabase.from('user_xp').upsert({
    user_id: userId,
    total_xp: newXp,
    level: newLevel,
    weekly_xp: (current?.weekly_xp || 0) + amount,
  }, { onConflict: 'user_id' });

  // Log transaction
  await supabase.from('xp_transactions').insert({
    user_id: userId,
    amount,
    action,
    ref_id: refId,
  });

  return { xpEarned: amount, totalXp: newXp, level: newLevel, leveledUp, previousLevel: oldLevel };
}

export async function getXPProfile(userId: string) {
  const supabase = createAdminSupabase();
  const { data } = await supabase
    .from('user_xp')
    .select('total_xp, level, weekly_xp, week_start')
    .eq('user_id', userId)
    .single();

  const totalXp = data?.total_xp || 0;
  const level = data?.level || 1;
  const progress = xpToNextLevel(totalXp);

  return { totalXp, level, weeklyXp: data?.weekly_xp || 0, ...progress };
}
