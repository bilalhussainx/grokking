"use client";

import { useEffect, useState } from "react";
import { LEAGUE_ICONS, LEAGUE_COLORS, type League } from "@/lib/leaderboard";

interface Member {
  userId: string;
  name: string;
  weeklyXP: number;
  rank: number;
  isCurrentUser: boolean;
}

interface LeaderboardData {
  league: League;
  groupId: string;
  members: Member[];
}

export default function LeagueBoard() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/xp/leaderboard")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-3 p-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-12 bg-white/5 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!data || data.members.length === 0) {
    return (
      <div className="text-center py-12 text-white/40">
        No leaderboard data yet. Start earning XP!
      </div>
    );
  }

  const total = data.members.length;
  const promoteThreshold = Math.min(10, Math.floor(total * 0.33));
  const demoteThreshold = Math.max(total - 5, Math.ceil(total * 0.83));

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* League header */}
      <div className="text-center mb-6">
        <div className="text-4xl mb-1">{LEAGUE_ICONS[data.league]}</div>
        <h2 className={`text-xl font-bold capitalize ${LEAGUE_COLORS[data.league]}`}>
          {data.league} League
        </h2>
        <p className="text-sm text-white/40 mt-1">{total} learners in this group</p>
      </div>

      {/* Member list */}
      <div className="space-y-1">
        {data.members.map((member) => {
          const isPromote = member.rank <= promoteThreshold;
          const isDemote = member.rank >= demoteThreshold;

          return (
            <div
              key={member.userId}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                member.isCurrentUser
                  ? "bg-blue-500/15 border border-blue-500/30"
                  : "bg-white/[0.03] border border-transparent hover:bg-white/[0.06]"
              }`}
            >
              {/* Rank */}
              <span className="w-8 text-right text-sm font-mono text-white/50">
                {member.rank}
              </span>

              {/* Promote/demote indicator */}
              <span className="w-4 text-center text-xs">
                {isPromote && <span className="text-emerald-400 font-bold">{'\u2191'}</span>}
                {isDemote && <span className="text-red-400 font-bold">{'\u2193'}</span>}
              </span>

              {/* Avatar initial */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  member.isCurrentUser
                    ? "bg-blue-500/30 text-blue-300"
                    : "bg-white/10 text-white/70"
                }`}
              >
                {member.name.charAt(0).toUpperCase()}
              </div>

              {/* Name */}
              <span
                className={`flex-1 text-sm truncate ${
                  member.isCurrentUser ? "text-white font-semibold" : "text-white/80"
                }`}
              >
                {member.name}
                {member.isCurrentUser && (
                  <span className="ml-2 text-xs text-blue-400">(you)</span>
                )}
              </span>

              {/* Weekly XP */}
              <span className="text-sm font-semibold text-amber-400">
                {member.weeklyXP.toLocaleString()} XP
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 text-xs text-white/40">
        <span>
          <span className="text-emerald-400">{'\u2191'}</span> Promotion zone
        </span>
        <span>
          <span className="text-red-400">{'\u2193'}</span> Demotion zone
        </span>
      </div>
    </div>
  );
}
