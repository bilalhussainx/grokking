// Client-safe streak constants — no server imports

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
