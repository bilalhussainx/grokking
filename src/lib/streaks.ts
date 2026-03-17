import { createAdminSupabase } from '@/lib/supabase-auth';
import { earnGems } from '@/lib/gems';
import { checkAndUnlockAchievements } from '@/lib/achievements';

export interface StreakInfo {
  days: number;
  lastDate: string | null;
  isActive: boolean;
  canFreeze: boolean;
  canRepair: boolean;
  flameColor: string; // 'orange' | 'blue' | 'purple' | 'gold'
}

export function getFlameColor(days: number): string {
  if (days >= 100) return 'gold';
  if (days >= 30) return 'purple';
  if (days >= 7) return 'blue';
  return 'orange';
}

export const FLAME_COLORS: Record<string, string> = {
  orange: 'text-orange-400',
  blue: 'text-blue-400',
  purple: 'text-purple-400',
  gold: 'text-yellow-400',
};

export const FLAME_BG_COLORS: Record<string, string> = {
  orange: 'bg-orange-500/10 border-orange-500/20',
  blue: 'bg-blue-500/10 border-blue-500/20',
  purple: 'bg-purple-500/10 border-purple-500/20',
  gold: 'bg-yellow-500/10 border-yellow-500/20',
};

export async function getStreakInfo(userId: string): Promise<StreakInfo> {
  const supabase = createAdminSupabase();
  const { data } = await supabase
    .from('user_profiles')
    .select('login_streak, last_login_date')
    .eq('id', userId)
    .single();

  const days = data?.login_streak || 0;
  const lastDate = data?.last_login_date || null;
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const isActive = lastDate === today || lastDate === yesterday;
  const canRepair = !isActive && lastDate !== null && daysDiff(lastDate, today) <= 2;
  const canFreeze = isActive && days > 0;

  return { days, lastDate, isActive, canFreeze, canRepair, flameColor: getFlameColor(days) };
}

function daysDiff(date1: string, date2: string): number {
  return Math.abs(Math.floor((new Date(date2).getTime() - new Date(date1).getTime()) / 86400000));
}

export async function freezeStreak(userId: string): Promise<boolean> {
  // Costs 10 gems
  const { spendGems } = await import('./gems');
  const success = await spendGems(userId, 10, 'streak-freeze');
  if (!success) return false;

  // Set last_login_date to today to maintain streak
  const supabase = createAdminSupabase();
  const today = new Date().toISOString().split('T')[0];
  await supabase.from('user_profiles').update({ last_login_date: today }).eq('id', userId);
  return true;
}

export async function repairStreak(userId: string): Promise<boolean> {
  // Costs 20 gems
  const { spendGems } = await import('./gems');
  const success = await spendGems(userId, 20, 'streak-repair');
  if (!success) return false;

  const supabase = createAdminSupabase();
  const today = new Date().toISOString().split('T')[0];
  await supabase.from('user_profiles').update({ last_login_date: today }).eq('id', userId);
  return true;
}

export async function checkStreakMilestones(userId: string, days: number): Promise<void> {
  // Check and award streak milestones
  if (days === 7) {
    await earnGems(userId, 20, 'streak-milestone-7');
    await checkAndUnlockAchievements(userId, { type: 'streak', value: 7 });
  } else if (days === 30) {
    await earnGems(userId, 100, 'streak-milestone-30');
    await checkAndUnlockAchievements(userId, { type: 'streak', value: 30 });
  } else if (days === 100) {
    await earnGems(userId, 500, 'streak-milestone-100');
    await checkAndUnlockAchievements(userId, { type: 'streak', value: 100 });
  }
}
