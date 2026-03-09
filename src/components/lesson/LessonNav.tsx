"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
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
    <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 py-6 mt-8">
      {/* Left: Previous lesson */}
      {prevLesson ? (
        <Link
          href={`/course/${courseSlug}/${prevLesson.slug}`}
          className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="max-w-[180px] truncate">{prevLesson.title}</span>
        </Link>
      ) : (
        <div />
      )}

      {/* Center: Mark Complete toggle */}
      <button
        onClick={onToggleComplete}
        className={clsx(
          "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
          isCompleted
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : "bg-blue-600 text-white hover:bg-blue-700"
        )}
      >
        <CheckCircle className="w-4 h-4" />
        {isCompleted ? "Completed" : "Mark Complete"}
      </button>

      {/* Right: Next lesson */}
      {nextLesson ? (
        <Link
          href={`/course/${courseSlug}/${nextLesson.slug}`}
          className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <span className="max-w-[180px] truncate">{nextLesson.title}</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
