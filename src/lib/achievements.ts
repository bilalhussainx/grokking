import { createAdminSupabase } from '@/lib/supabase-auth';
import { earnGems } from './gems';

// Client-safe types and constants moved to achievements-types.ts to avoid
// pulling next/headers (server-only) into client bundles.
export type { Achievement } from './achievements-types';
export { RARITY_COLORS } from './achievements-types';
import type { Achievement } from './achievements-types';

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
