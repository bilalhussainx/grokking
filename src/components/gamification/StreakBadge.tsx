"use client";

import { Flame } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getFlameColor, FLAME_COLORS, FLAME_BG_COLORS } from "@/lib/streaks-constants";

/**
 * Compact streak display for TopNav.
 * Flame color changes at milestone thresholds:
 *   orange (default) -> blue (7+) -> purple (30+) -> gold (100+)
 * Pulsing glow animation at 30+ day streaks.
 */
export default function StreakBadge() {
  const { profile } = useAuth();

  if (!profile) return null;

  const streak = profile.login_streak || 0;
  if (streak <= 0) return null;

  const flameColor = getFlameColor(streak);
  const textClass = FLAME_COLORS[flameColor] || FLAME_COLORS.orange;
  const bgClass = FLAME_BG_COLORS[flameColor] || FLAME_BG_COLORS.orange;
  const shouldPulse = streak >= 30;

  return (
    <div className="hidden sm:flex items-center gap-3">
      <div
        className={`flex items-center gap-1 px-2 py-1 rounded-lg border ${bgClass} ${textClass} text-xs font-semibold ${shouldPulse ? "animate-pulse" : ""}`}
        title={`${streak}-day learning streak!`}
      >
        <Flame className="w-3.5 h-3.5" />
        {streak}
      </div>
    </div>
  );
}
