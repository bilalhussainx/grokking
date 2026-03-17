"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import type { Achievement } from "@/components/gamification/AchievementToast";
import { rollVariableReward, type RewardEvent } from "@/lib/rewards";

interface XPProfile {
  xp: number;
  level: number;
  gems: number;
  achievements: Achievement[];
}

interface XPContextValue {
  xp: number;
  level: number;
  gems: number;
  achievements: Achievement[];
  earnXP: (action: string, refId?: string) => Promise<void>;
  showXPFlyUp: number;
  lastXPAmount: number;
  pendingAchievements: Achievement[];
  dismissAchievement: () => void;
  refreshProfile: () => Promise<void>;
  xpMultiplier: number;
  pendingReward: RewardEvent | null;
  dismissReward: () => void;
}

const XPContext = createContext<XPContextValue | null>(null);

export function useXP() {
  const ctx = useContext(XPContext);
  if (!ctx) throw new Error("useXP must be used within XPProvider");
  return ctx;
}

export function XPProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<XPProfile>({
    xp: 0,
    level: 1,
    gems: 0,
    achievements: [],
  });
  const [showXPFlyUp, setShowXPFlyUp] = useState(0);
  const [lastXPAmount, setLastXPAmount] = useState(0);
  const [pendingAchievements, setPendingAchievements] = useState<Achievement[]>([]);
  const [actionCount, setActionCount] = useState(0);
  const [xpMultiplier, setXpMultiplier] = useState(1);
  const [pendingReward, setPendingReward] = useState<RewardEvent | null>(null);
  const { play } = useSoundEffect();

  const refreshProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/xp/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch {
      // silently fail — profile will stay at defaults
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const dismissReward = useCallback(() => {
    setPendingReward(null);
  }, []);

  const earnXP = useCallback(
    async (action: string, refId?: string) => {
      try {
        // Apply multiplier: if xpMultiplier > 1, tell the server to multiply
        const multiplier = xpMultiplier;

        const res = await fetch("/api/xp/earn", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, refId, multiplier }),
        });

        if (!res.ok) return;

        const data = await res.json();
        const xpGained = data.xpGained ?? 0;
        const newAchievements: Achievement[] = data.achievements ?? [];
        const previousLevel = profile.level;

        setProfile((prev) => ({
          ...prev,
          xp: data.xp ?? prev.xp + xpGained,
          level: data.level ?? prev.level,
          gems: data.gems ?? prev.gems,
          achievements: data.allAchievements ?? prev.achievements,
        }));

        // Trigger XP fly-up
        if (xpGained > 0) {
          setLastXPAmount(xpGained);
          setShowXPFlyUp((prev) => prev + 1);
          play("xp-gain");
        }

        // Level up sound
        if (data.level && data.level > previousLevel) {
          play("level-up");
        }

        // Queue new achievements as toasts
        if (newAchievements.length > 0) {
          play("achievement");
          setPendingAchievements((prev) => [...prev, ...newAchievements]);
        }

        // Reset multiplier after use (it was a one-shot)
        if (multiplier > 1) {
          setXpMultiplier(1);
        }

        // Roll for variable reward
        const newCount = actionCount + 1;
        setActionCount(newCount);

        // Use a simple ID for seeding — grab from localStorage or fallback
        const userId = typeof window !== "undefined"
          ? localStorage.getItem("user-id") || "anon"
          : "anon";
        const reward = rollVariableReward(userId, newCount);

        if (reward.type !== "none") {
          setPendingReward(reward);
          play(reward.sound);

          // Apply variable reward effects
          if (reward.type === "bonus-xp" && reward.amount) {
            // Award bonus XP via a separate call
            fetch("/api/xp/earn", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "variable_bonus", refId: `bonus-${newCount}` }),
            }).then((r) => {
              if (r.ok) refreshProfile();
            });
          } else if (reward.type === "mystery-gem" && reward.amount) {
            // Award gems
            setProfile((prev) => ({
              ...prev,
              gems: prev.gems + (reward.amount ?? 0),
            }));
          } else if (reward.type === "xp-multiplier") {
            setXpMultiplier(reward.amount ?? 3);
          } else if (reward.type === "jackpot") {
            // Award 200 XP + 50 gems
            setProfile((prev) => ({
              ...prev,
              gems: prev.gems + 50,
            }));
            fetch("/api/xp/earn", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "jackpot_bonus", refId: `jackpot-${newCount}` }),
            }).then((r) => {
              if (r.ok) refreshProfile();
            });
          }
        }
      } catch {
        // silently fail
      }
    },
    [profile.level, play, xpMultiplier, actionCount, refreshProfile]
  );

  const dismissAchievement = useCallback(() => {
    setPendingAchievements((prev) => prev.slice(1));
  }, []);

  return (
    <XPContext.Provider
      value={{
        xp: profile.xp,
        level: profile.level,
        gems: profile.gems,
        achievements: profile.achievements,
        earnXP,
        showXPFlyUp,
        lastXPAmount,
        pendingAchievements,
        dismissAchievement,
        refreshProfile,
        xpMultiplier,
        pendingReward,
        dismissReward,
      }}
    >
      {children}
    </XPContext.Provider>
  );
}
