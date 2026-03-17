import { createAdminSupabase } from '@/lib/supabase-auth';
import { earnGems } from './gems';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  icon: string;
  gemReward: number;
}

export const RARITY_COLORS: Record<string, string> = {
  common: 'border-slate-400 bg-slate-500/10',
  uncommon: 'border-emerald-400 bg-emerald-500/10',
  rare: 'border-blue-400 bg-blue-500/10',
  epic: 'border-purple-400 bg-purple-500/10',
  legendary: 'border-yellow-400 bg-yellow-500/10',
};

export async function checkAndUnlockAchievements(
  userId: string,
  event: { type: string; value?: number | string }
): Promise<Achievement[]> {
  const supabase = createAdminSupabase();

  // Get all achievements
  const { data: allAchievements } = await supabase.from('achievements').select('*');
  if (!allAchievements) return [];

  // Get user's already-unlocked achievements
  const { data: unlocked } = await supabase
    .from('user_achievements')
    .select('achievement_id')
    .eq('user_id', userId);

  const unlockedIds = new Set((unlocked || []).map(u => u.achievement_id));
  const newlyUnlocked: Achievement[] = [];

  for (const ach of allAchievements) {
    if (unlockedIds.has(ach.id)) continue;

    const criteria = ach.criteria as { type: string; count?: number; value?: string; after?: number; before?: number; minutes?: number };
    let earned = false;

    if (criteria.type === event.type) {
      if (criteria.count && typeof event.value === 'number') {
        earned = event.value >= criteria.count;
      } else if (criteria.value && event.value === criteria.value) {
        earned = true;
      } else if (criteria.after && typeof event.value === 'number') {
        earned = event.value >= criteria.after;
      } else if (criteria.before && typeof event.value === 'number') {
        earned = event.value < criteria.before;
      } else if (criteria.minutes && typeof event.value === 'number') {
        earned = event.value >= criteria.minutes;
      }
    }

    if (earned) {
      await supabase.from('user_achievements').insert({
        user_id: userId,
        achievement_id: ach.id,
      });
      await earnGems(userId, ach.gem_reward, `achievement:${ach.id}`);
      newlyUnlocked.push({
        id: ach.id,
        name: ach.name,
        description: ach.description,
        rarity: ach.rarity,
        icon: ach.icon,
        gemReward: ach.gem_reward,
      });
    }
  }

  return newlyUnlocked;
}

export async function getUserAchievements(userId: string): Promise<Achievement[]> {
  const supabase = createAdminSupabase();
  const { data } = await supabase
    .from('user_achievements')
    .select('achievement_id, unlocked_at, achievements(*)')
    .eq('user_id', userId);

  return (data || []).map(d => {
    const ach = d.achievements as any;
    return {
      id: ach.id,
      name: ach.name,
      description: ach.description,
      rarity: ach.rarity,
      icon: ach.icon,
      gemReward: ach.gem_reward,
    };
  });
}
