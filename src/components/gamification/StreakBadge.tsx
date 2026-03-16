"use client";

import { Flame, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Compact streak + credits display for TopNav.
 * Shows login streak (flame icon) and credit balance (zap icon).
 */
export default function StreakBadge() {
  const { profile, credits } = useAuth();

  if (!profile) return null;

  const streak = profile.login_streak || 0;

  return (
    <div className="hidden sm:flex items-center gap-3">
      {/* Streak */}
      {streak > 0 && (
        <div
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold"
          title={`${streak}-day learning streak!`}
        >
          <Flame className="w-3.5 h-3.5" />
          {streak}
        </div>
      )}
    </div>
  );
}
