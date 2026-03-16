"use client";

import { useState, useEffect } from "react";
import {
  GraduationCap,
  BookOpen,
  Code2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Circle,
  Play,
} from "lucide-react";
import Link from "next/link";
import CourseLayout from "@/components/layout/CourseLayout";
import { SidebarModule } from "@/components/layout/Sidebar";
import LessonContent from "./LessonContent";
import LessonNav from "./LessonNav";
import { useAI } from "@/contexts/AIContext";
import { estimateReadingTime, formatReadingTime } from "@/lib/reading-time";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import ConceptBridges from "./ConceptBridges";
import UnderstandingDepth from "./UnderstandingDepth";
import {
  getCompletedLessons,
  getCourseProgress,
  markLessonComplete,
  markLessonIncomplete,
} from "@/lib/progress";

interface LessonPageProps {
  courseTitle: string;
  courseSlug: string;
  courseDomain?: string;
  modules: SidebarModule[];
  moduleTitle: string;
  lesson: {
    id: string;
    slug: string;
    title: string;
    content: string;
    starterCode?: string;
    solutionCode?: string;
  };
  prevLesson: { slug: string; title: string } | null;
  nextLesson: { slug: string; title: string } | null;
  totalLessons: number;
}

type ContentTab = "lesson" | "resources";

export default function LessonPage({
  courseTitle,
  courseSlug,
  courseDomain,
  modules,
  moduleTitle,
  lesson,
  prevLesson,
  nextLesson,
  totalLessons,
}: LessonPageProps) {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set()
  );
  const [progress, setProgress] = useState(0);
  const [contentTab, setContentTab] = useState<ContentTab>("lesson");
  const { setLessonContext, setCurrentCode, openPanel, isPanelOpen } = useAI();

  const hasExercise = !!(lesson.starterCode && lesson.solutionCode);

  // Keyboard shortcuts: N=next, P=prev, H=toggle coach
  useKeyboardShortcuts({
    courseSlug,
    prevLessonSlug: prevLesson?.slug ?? null,
    nextLessonSlug: nextLesson?.slug ?? null,
    onToggleHint: () => {
      if (isPanelOpen) {
        // Already open, don't close
      } else {
        openPanel();
      }
    },
  });

  useEffect(() => {
    async function loadProgress() {
      const completed = await getCompletedLessons(courseSlug);
      setCompletedLessons(completed);
      const pct = await getCourseProgress(courseSlug, totalLessons);
      setProgress(pct);
    }
    loadProgress();
  }, [courseSlug, totalLessons]);

  useEffect(() => {
    setLessonContext({
      courseSlug: courseSlug,
      lessonSlug: lesson.slug,
      lessonTitle: lesson.title,
      lessonContent: lesson.content,
      moduleTitle: moduleTitle,
      courseTitle: courseTitle,
      starterCode: lesson.starterCode,
      solutionCode: lesson.solutionCode,
    });
    return () => setLessonContext(null);
  }, [
    lesson.id,
    lesson.title,
    lesson.content,
    moduleTitle,
    courseTitle,
    lesson.starterCode,
    lesson.solutionCode,
    setLessonContext,
  ]);

  // No longer auto-opening coach panel — exercises are separate pages now

  const toggleComplete = async () => {
    let updated: Set<string>;
    if (completedLessons.has(lesson.id)) {
      updated = await markLessonIncomplete(courseSlug, lesson.id);
    } else {
      updated = await markLessonComplete(courseSlug, lesson.id);
    }
    setCompletedLessons(updated);
    setProgress(Math.round((updated.size / totalLessons) * 100));
  };

  // ─── Unified Layout: content + optional exercise CTA ───────
  // All lessons render full-width. Exercises open as separate pages.
  return (
    <CourseLayout
      courseTitle={courseTitle}
      courseSlug={courseSlug}
      modules={modules}
      currentLessonId={lesson.id}
      completedLessons={completedLessons}
      progress={progress}
    >
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Module breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-white/40 mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{moduleTitle}</span>
        </div>

        <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
        <p className="text-xs text-white/30 mb-4">
          {formatReadingTime(estimateReadingTime(lesson.content))}
        </p>

        {/* Understanding depth indicator (shows for completed lessons with voice data) */}
        <UnderstandingDepth lessonId={lesson.id} isCompleted={completedLessons.has(lesson.id)} />

        <LessonContent content={lesson.content} courseDomain={courseDomain} />

        {/* Exercise CTA — links to full-screen IDE */}
        {hasExercise && (
          <div className="mt-10 mb-6">
            <Link
              href={`/course/${courseSlug}/${lesson.slug}/exercise`}
              className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600/80 to-blue-600/80 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-base transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 border border-cyan-500/20 group"
            >
              <Code2 className="w-5 h-5" />
              Start Exercise
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-center text-xs text-white/30 mt-2">
              Opens a full-screen coding environment with AI hints and grading
            </p>
          </div>
        )}

        {/* Cross-domain concept bridges */}
        <ConceptBridges lessonId={lesson.id} courseSlug={courseSlug} />

        <LessonNav
          courseSlug={courseSlug}
          prevLesson={prevLesson}
          nextLesson={nextLesson}
          isCompleted={completedLessons.has(lesson.id)}
          onToggleComplete={toggleComplete}
        />
      </div>
    </CourseLayout>
  );
}
