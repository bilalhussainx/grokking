"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, CheckCircle, Circle } from "lucide-react";
import clsx from "clsx";

interface LessonNavProps {
  courseSlug: string;
  prevLesson?: { slug: string; title: string } | null;
  nextLesson?: { slug: string; title: string } | null;
  isCompleted: boolean;
  onToggleComplete: () => void;
}

export default function LessonNav({
  courseSlug,
  prevLesson,
  nextLesson,
  isCompleted,
  onToggleComplete,
}: LessonNavProps) {
  return (
    <div className="flex items-center justify-between border-t border-[var(--border)] py-6 mt-10">
      {/* Previous */}
      {prevLesson ? (
        <Link
          href={`/course/${courseSlug}/${prevLesson.slug}`}
          className="group flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span className="max-w-[180px] truncate">{prevLesson.title}</span>
        </Link>
      ) : (
        <div />
      )}

      {/* Mark Complete */}
      <button
        onClick={onToggleComplete}
        className={clsx(
          "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all",
          isCompleted
            ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
            : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20 hover:shadow-blue-600/30 hover:-translate-y-0.5"
        )}
      >
        {isCompleted ? (
          <CheckCircle className="w-4 h-4" />
        ) : (
          <Circle className="w-4 h-4" />
        )}
        {isCompleted ? "Completed" : "Mark Complete"}
      </button>

      {/* Next */}
      {nextLesson ? (
        <Link
          href={`/course/${courseSlug}/${nextLesson.slug}`}
          className="group flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
        >
          <span className="max-w-[180px] truncate">{nextLesson.title}</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
