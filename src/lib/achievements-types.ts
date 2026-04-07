// Client-safe achievement types and constants.
// Split from src/lib/achievements.ts which imports server-only supabase-auth.
// Components and pages should import from THIS file, not achievements.ts.

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
