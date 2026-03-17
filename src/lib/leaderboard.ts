import { createAdminSupabase } from '@/lib/supabase-auth';

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

const GROUP_SIZE = 30;

/**
 * Find or create a user's league entry. New users start in Bronze.
 * Assigns the user to an open group (< GROUP_SIZE members) or creates a new one.
 */
export async function getOrCreateLeague(userId: string) {
  const supabase = createAdminSupabase();

  // Check for existing league entry
  const { data: existing } = await supabase
    .from('user_league')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (existing) return existing;

  const league: League = 'bronze';

  // Find an open group in this league
  const { data: openGroup } = await supabase
    .from('league_groups')
    .select('id, member_count')
    .eq('league', league)
    .lt('member_count', GROUP_SIZE)
    .order('member_count', { ascending: false })
    .limit(1)
    .single();

  let groupId: string;

  if (openGroup) {
    groupId = openGroup.id;
    await supabase
      .from('league_groups')
      .update({ member_count: openGroup.member_count + 1 })
      .eq('id', openGroup.id);
  } else {
    // Create a new group
    const { data: newGroup, error } = await supabase
      .from('league_groups')
      .insert({ league, member_count: 1 })
      .select('id')
      .single();
    if (error || !newGroup) throw new Error('Failed to create league group');
    groupId = newGroup.id;
  }

  // Insert user league record
  const { data: record, error } = await supabase
    .from('user_league')
    .insert({
      user_id: userId,
      league,
      group_id: groupId,
      weekly_xp: 0,
    })
    .select('*')
    .single();

  if (error || !record) throw new Error('Failed to create league entry');
  return record;
}

/**
 * Return the user's group members sorted by weekly_xp desc, with rank.
 */
export async function getLeaderboard(userId: string) {
  const supabase = createAdminSupabase();

  const leagueEntry = await getOrCreateLeague(userId);

  // Get all members in the same group
  const { data: members } = await supabase
    .from('user_league')
    .select('user_id, weekly_xp')
    .eq('group_id', leagueEntry.group_id)
    .order('weekly_xp', { ascending: false });

  if (!members) return { league: leagueEntry.league, groupId: leagueEntry.group_id, members: [] };

  // Fetch display names for all members
  const userIds = members.map((m) => m.user_id);
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name')
    .in('id', userIds);

  const nameMap: Record<string, string> = {};
  (profiles || []).forEach((p) => {
    nameMap[p.id] = p.full_name || 'Learner';
  });

  const ranked = members.map((m, i) => ({
    userId: m.user_id,
    name: nameMap[m.user_id] || 'Learner',
    weeklyXP: m.weekly_xp,
    rank: i + 1,
    isCurrentUser: m.user_id === userId,
  }));

  return {
    league: leagueEntry.league as League,
    groupId: leagueEntry.group_id,
    members: ranked,
  };
}

/**
 * Return summary: league, rank, groupSize for a user.
 */
export async function getUserLeague(userId: string): Promise<{ league: League; rank: number; groupSize: number }> {
  const board = await getLeaderboard(userId);
  const me = board.members.find((m) => m.isCurrentUser);
  return {
    league: board.league,
    rank: me?.rank ?? board.members.length,
    groupSize: board.members.length,
  };
}
