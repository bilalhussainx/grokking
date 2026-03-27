"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Flame, CheckCircle, Star, Gem } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useXP } from "@/contexts/XPContext";
import { useCourseProgress } from "@/hooks/useCourseProgress";

export default function LearningStats() {
  const { profile } = useAuth();
  const { level, gems } = useXP();
  const courseProgress = useCourseProgress();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  if (!profile) return null;

  const streak = profile.login_streak || 0;
  const coursesCompleted = Object.values(courseProgress).filter((p) => p >= 100).length;
  const coursesStarted = Object.values(courseProgress).filter((p) => p > 0).length;

  if (streak === 0 && coursesStarted === 0) return null;

  const stats = [
    { icon: Star, label: `Level ${level}`, value: level, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", ring: "ring-violet-500/10" },
    { icon: Flame, label: "Streak", value: streak, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", ring: "ring-orange-500/10" },
    { icon: Gem, label: "Gems", value: gems, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", ring: "ring-purple-500/10" },
    { icon: CheckCircle, label: "Complete", value: coursesCompleted, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", ring: "ring-emerald-500/10" },
  ];

  return (
    <div ref={ref} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: i * 0.08, ease: [0.25, 0.4, 0.25, 1] }}
            whileHover={{ scale: 1.03, y: -2 }}
            className={`group flex flex-col items-center gap-2 py-5 rounded-xl ${stat.bg} border ${stat.border} hover:ring-2 ${stat.ring} transition-shadow cursor-default`}
          >
            <div className={`w-9 h-9 rounded-lg ${stat.bg} border ${stat.border} flex items-center justify-center`}>
              <Icon className={`w-4.5 h-4.5 ${stat.color}`} />
            </div>
            <span className={`text-2xl font-bold tabular-nums ${stat.color}`}>{stat.value}</span>
            <span className="text-[11px] text-[var(--muted-foreground)] font-medium">{stat.label}</span>
          </motion.div>
        );
      })}
    </div>
  );
}
