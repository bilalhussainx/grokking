// Client-safe leaderboard constants — no server imports
export type League = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export const LEAGUE_ORDER: League[] = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];

export const LEAGUE_ICONS: Record<League, string> = {
  bronze: '\u{1F949}',
  silver: '\u{1F948}',
  gold: '\u{1F947}',
  platinum: '\u{1F4A0}',
  diamond: '\u{1F48E}',
};

export const LEAGUE_COLORS: Record<League, string> = {
  bronze: 'text-amber-600',
  silver: 'text-slate-300',
  gold: 'text-yellow-400',
  platinum: 'text-cyan-300',
  diamond: 'text-violet-400',
};
