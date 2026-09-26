import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase-auth";
import { earnGems } from "@/lib/gems";
import { LEAGUE_ORDER, type League } from "@/lib/leaderboard";
import { hasAdminSecret } from "@/lib/admin-secret";


const PROMOTE_COUNT = 10;
const DEMOTE_COUNT = 5;

/**
 * POST /api/admin/league-reset — Weekly league reset
 *
 * Requires: x-admin-secret header matching ADMIN_SECRET env var
 *
 * For each league group in the current week:
 *   - Sort members by weekly_xp descending
 *   - Promote top 10 to the next league (unless already diamond)
 *   - Demote bottom 5 to the previous league (unless already bronze)
 *   - Award gems: 1st=50, 2nd=30, 3rd=15
 * Then:
 *   - Reset all user_league.weekly_xp to 0
 *   - Create new league groups for the next week
 */
export async function POST(req: NextRequest) {
  if (!hasAdminSecret(req.headers.get("x-admin-secret"), "ADMIN_SECRET")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createAdminSupabase();

  // Get all league groups
  const { data: groups, error: groupsError } = await supabase
    .from("league_groups")
    .select("id, league, member_count");

  if (groupsError || !groups) {
    return NextResponse.json({ error: "Failed to fetch groups" }, { status: 500 });
  }

  let promoted = 0;
  let demoted = 0;
  let gemsAwarded = 0;

  for (const group of groups) {
    // Get members sorted by weekly_xp desc
    const { data: members } = await supabase
      .from("user_league")
      .select("user_id, weekly_xp, league")
      .eq("group_id", group.id)
      .order("weekly_xp", { ascending: false });

    if (!members || members.length === 0) continue;

    const currentLeague = group.league as League;
    const leagueIdx = LEAGUE_ORDER.indexOf(currentLeague);

    // Award gems to top 3
    const gemRewards = [50, 30, 15];
    for (let i = 0; i < Math.min(3, members.length); i++) {
      if (members[i].weekly_xp > 0) {
        await earnGems(members[i].user_id, gemRewards[i], `league-reward-${i + 1}`);
        gemsAwarded += gemRewards[i];
      }
    }

    // Promote top PROMOTE_COUNT (if not already diamond)
    if (leagueIdx < LEAGUE_ORDER.length - 1) {
      const nextLeague = LEAGUE_ORDER[leagueIdx + 1];
      const toPromote = members.slice(0, Math.min(PROMOTE_COUNT, members.length));
      for (const member of toPromote) {
        if (member.weekly_xp > 0) {
          await supabase
            .from("user_league")
            .update({ league: nextLeague })
            .eq("user_id", member.user_id);
          promoted++;
        }
      }
    }

    // Demote bottom DEMOTE_COUNT (if not already bronze)
    if (leagueIdx > 0) {
      const prevLeague = LEAGUE_ORDER[leagueIdx - 1];
      const toDemote = members.slice(-Math.min(DEMOTE_COUNT, members.length));
      for (const member of toDemote) {
        await supabase
          .from("user_league")
          .update({ league: prevLeague })
          .eq("user_id", member.user_id);
        demoted++;
      }
    }
  }

  // Reset all weekly_xp to 0
  await supabase.from("user_league").update({ weekly_xp: 0 }).gte("weekly_xp", 0);

  // Reassign all users to new groups based on their updated league
  for (const league of LEAGUE_ORDER) {
    const { data: leagueMembers } = await supabase
      .from("user_league")
      .select("user_id")
      .eq("league", league);

    if (!leagueMembers || leagueMembers.length === 0) continue;

    // Create new groups of 30
    const groupSize = 30;
    for (let i = 0; i < leagueMembers.length; i += groupSize) {
      const chunk = leagueMembers.slice(i, i + groupSize);

      const { data: newGroup } = await supabase
        .from("league_groups")
        .insert({
          league,
          member_count: chunk.length,
          week_starting: getNextMonday(),
        })
        .select("id")
        .single();

      if (newGroup) {
        const userIds = chunk.map((m) => m.user_id);
        for (const uid of userIds) {
          await supabase
            .from("user_league")
            .update({ group_id: newGroup.id })
            .eq("user_id", uid);
        }
      }
    }
  }

  return NextResponse.json({
    success: true,
    promoted,
    demoted,
    gemsAwarded,
    message: `League reset complete. ${promoted} promoted, ${demoted} demoted, ${gemsAwarded} gems awarded.`,
  });
}

function getNextMonday(): string {
  const now = new Date();
  const day = now.getDay();
  const daysUntilMonday = day === 0 ? 1 : 8 - day;
  const nextMonday = new Date(now.getTime() + daysUntilMonday * 86400000);
  return nextMonday.toISOString().split("T")[0];
}
