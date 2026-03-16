"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Brain, RefreshCw, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface FadingLesson {
  lessonId: string;
  lessonTitle: string;
  courseId: string;
  domain: string;
  daysSinceCompletion: number;
  fadingScore: number;
}

/**
 * Shows a gentle alert when knowledge is fading on completed lessons.
 * Displays on the homepage for logged-in users.
 */
export default function ForgettingAlert() {
  const { user } = useAuth();
  const [fading, setFading] = useState<FadingLesson[]>([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Don't show if dismissed this session
    if (sessionStorage.getItem("forgetting_dismissed")) return;

    async function fetchFading() {
      try {
        const res = await fetch("/api/ai/forgetting");
        if (!res.ok) return;
        const data = await res.json();
        setFading(data.fading ?? []);
      } catch {
        // Silently fail
      }
    }
    fetchFading();
  }, [user]);

  if (!user || fading.length === 0 || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("forgetting_dismissed", "true");
  };

  const topFading = fading[0];

  return (
    <div className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-4 relative">
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1 rounded text-amber-500/40 hover:text-amber-400 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-amber-500/10">
          <Brain className="w-4 h-4 text-amber-400" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--foreground)] mb-1">
            Knowledge fading
          </p>
          <p className="text-xs text-[var(--muted-foreground)] mb-3">
            You completed <strong className="text-[var(--foreground)]">{topFading.lessonTitle}</strong>
            {" "}{topFading.daysSinceCompletion} days ago but haven&apos;t revisited the concepts.
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/course/${topFading.courseId}/${topFading.lessonId}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-400 text-xs font-medium hover:bg-amber-500/25 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Quick refresher
            </Link>

            {fading.length > 1 && (
              <span className="text-[10px] text-[var(--muted-foreground)]">
                +{fading.length - 1} more fading
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
