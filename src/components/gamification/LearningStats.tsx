"use client";

import { Flame, BookOpen, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCourseProgress } from "@/hooks/useCourseProgress";

/**
 * Learning stats card for the homepage.
 * Shows streak, courses started, lessons completed.
 */
export default function LearningStats() {
  const { profile } = useAuth();
  const courseProgress = useCourseProgress();

  if (!profile) return null;

  const streak = profile.login_streak || 0;
  const coursesStarted = Object.values(courseProgress).filter((p) => p > 0).length;
  const coursesCompleted = Object.values(courseProgress).filter((p) => p >= 100).length;

  // Don't show if user hasn't started anything
  if (streak === 0 && coursesStarted === 0) return null;

  const stats = [
    {
      icon: Flame,
      label: "Day Streak",
      value: streak,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
    },
    {
      icon: BookOpen,
      label: "Courses Started",
      value: coursesStarted,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      icon: CheckCircle,
      label: "Completed",
      value: coursesCompleted,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`flex flex-col items-center gap-1.5 py-4 rounded-xl ${stat.bg} border ${stat.border}`}
          >
            <Icon className={`w-5 h-5 ${stat.color}`} />
            <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
            <span className="text-[11px] text-[var(--muted-foreground)]">{stat.label}</span>
          </div>
        );
      })}
    </div>
  );
}
