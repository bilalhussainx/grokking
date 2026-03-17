"use client";

import { useState } from "react";
import { LEAGUE_ICONS, type League } from "@/lib/leaderboard";
import { Flame, Share2 } from "lucide-react";

export type CardFrame = "minimal" | "neon" | "gold" | "holographic";
export type CardBG = "gradient" | "space" | "forest" | "ocean" | "circuit";

interface ProfileCardProps {
  name: string;
  league: League;
  level: number;
  xp: number;
  xpToNext: number;
  streak: number;
  achievements: { icon: string }[];
  frame?: CardFrame;
  background?: CardBG;
}

const FRAME_STYLES: Record<CardFrame, string> = {
  minimal: "border border-white/20",
  neon: "border-2 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)]",
  gold: "border-[3px] border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.25)]",
  holographic:
    "border-2 border-transparent bg-clip-padding [background-image:linear-gradient(var(--card-bg),var(--card-bg)),linear-gradient(135deg,#f97316,#ec4899,#8b5cf6,#06b6d4,#22c55e,#f97316)] [background-origin:border-box] [background-clip:padding-box,border-box] animate-holo",
};

const BG_STYLES: Record<CardBG, string> = {
  gradient: "bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900",
  space: "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950",
  forest: "bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900",
  ocean: "bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900",
  circuit: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
};

export default function ProfileCard({
  name,
  league,
  level,
  xp,
  xpToNext,
  streak,
  achievements,
  frame = "minimal",
  background = "gradient",
}: ProfileCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const progress = xpToNext > 0 ? Math.min((xp / xpToNext) * 100, 100) : 100;
  const top3 = achievements.slice(0, 3);

  return (
    <div
      className={`relative w-[300px] h-[400px] rounded-2xl overflow-hidden ${BG_STYLES[background]} ${FRAME_STYLES[frame]}`}
      style={{ "--card-bg": "#0f172a" } as React.CSSProperties}
    >
      {/* Decorative elements for space bg */}
      {background === "space" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: 0.3 + Math.random() * 0.5,
              }}
            />
          ))}
        </div>
      )}

      {/* Circuit pattern for circuit bg */}
      {background === "circuit" && (
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 300 400">
            <path d="M50 0 V100 H150 V200 H250" stroke="currentColor" strokeWidth="1" fill="none" className="text-cyan-400" />
            <path d="M0 300 H100 V200 H200 V100 H300" stroke="currentColor" strokeWidth="1" fill="none" className="text-cyan-400" />
            <circle cx="150" cy="200" r="3" className="fill-cyan-400" />
            <circle cx="100" cy="300" r="3" className="fill-cyan-400" />
            <circle cx="250" cy="100" r="3" className="fill-cyan-400" />
          </svg>
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center justify-between h-full p-6">
        {/* Top section: league badge */}
        <div className="text-center">
          <span className="text-3xl">{LEAGUE_ICONS[league]}</span>
          <p className="text-xs text-white/40 uppercase tracking-widest mt-1">
            {league} league
          </p>
        </div>

        {/* Center: name + level */}
        <div className="text-center space-y-3">
          {/* Level circle */}
          <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto">
            <span className="text-2xl font-bold text-white">{level}</span>
          </div>

          <h3 className="text-lg font-bold text-white truncate max-w-[250px]">
            {name}
          </h3>

          {/* XP progress bar */}
          <div className="w-full">
            <div className="flex justify-between text-xs text-white/40 mb-1">
              <span>{xp.toLocaleString()} XP</span>
              <span>{xpToNext.toLocaleString()} XP</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Streak */}
          {streak > 0 && (
            <div className="flex items-center justify-center gap-1 text-orange-400">
              <Flame className="w-4 h-4" />
              <span className="text-sm font-semibold">{streak} day streak</span>
            </div>
          )}
        </div>

        {/* Bottom: achievements + share */}
        <div className="w-full">
          {/* Top 3 achievements */}
          {top3.length > 0 && (
            <div className="flex justify-center gap-2 mb-3">
              {top3.map((a, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-lg"
                >
                  {a.icon}
                </div>
              ))}
            </div>
          )}

          {/* Share button */}
          <div className="relative flex justify-center">
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white/60 hover:text-white/80 text-xs transition-colors"
              onClick={() => {
                setShowTooltip(true);
                setTimeout(() => setShowTooltip(false), 2000);
              }}
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
            {showTooltip && (
              <div className="absolute -top-8 px-2 py-1 rounded bg-slate-700 text-xs text-white/80 whitespace-nowrap">
                Coming soon
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
