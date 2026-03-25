"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  GraduationCap,
  BookOpen,
  Code2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Circle,
  Play,
  Crown,
  Lock,
} from "lucide-react";
import Link from "next/link";
import CourseLayout from "@/components/layout/CourseLayout";
import { SidebarModule } from "@/components/layout/Sidebar";
import LessonContent from "./LessonContent";
import LessonNav from "./LessonNav";
import { useAI } from "@/contexts/AIContext";
import { useXP } from "@/contexts/XPContext";
import { useAIState } from "@/contexts/AIStateContext";
import { estimateReadingTime, formatReadingTime } from "@/lib/reading-time";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import ConceptBridges from "./ConceptBridges";
import UnderstandingDepth from "./UnderstandingDepth";
// Podcast, Slides, PDF temporarily disabled
// import PodcastPlayer from "./PodcastPlayer";
// import DownloadPDF from "./DownloadPDF";
// import SlideButton from "./SlideButton";
import DidYouKnowCard from "@/components/gamification/DidYouKnowCard";
import QuizCard from "@/components/gamification/QuizCard";
import {
  getCompletedLessons,
  getCourseProgress,
  markLessonComplete,
  markLessonIncomplete,
} from "@/lib/progress";

interface PreviewBanner {
  currentIndex: number;
  freeTotal: number;
  remaining: number;
  totalLessons: number;
}

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
  previewBanner?: PreviewBanner;
  lockedLessonIndex?: number;
}

type ContentTab = "lesson" | "resources";

/** Deterministic boolean from a slug string — returns true ~50% of the time */
function seededChance(slug: string): boolean {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % 2 === 0;
}

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
  previewBanner,
  lockedLessonIndex,
}: LessonPageProps) {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set()
  );
  const [progress, setProgress] = useState(0);
  const [contentTab, setContentTab] = useState<ContentTab>("lesson");
  const { setLessonContext, setCurrentCode, openPanel, isPanelOpen } = useAI();
  const { earnXP } = useXP();
  const { setCurrentLesson, clearCurrentLesson } = useAIState();

  // Gamification overlays
  const [showDidYouKnow, setShowDidYouKnow] = useState(false);
  const [didYouKnowFact, setDidYouKnowFact] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  const hasExercise = !!(lesson.starterCode && lesson.solutionCode);

  // Find current lesson's index within its module (for quiz trigger)
  const lessonIndexInModule = useMemo(() => {
    const currentModule = modules.find((m) =>
      m.lessons.some((l) => l.id === lesson.id)
    );
    if (!currentModule) return 0;
    return currentModule.lessons.findIndex((l) => l.id === lesson.id);
  }, [modules, lesson.id]);

  // Current module for completion checks
  const currentModule = useMemo(
    () => modules.find((m) => m.lessons.some((l) => l.id === lesson.id)),
    [modules, lesson.id]
  );

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
    // Also feed AIState for all agents
    setCurrentLesson(courseTitle, moduleTitle, lesson.title, lesson.content, lesson.starterCode);
    return () => { setLessonContext(null); clearCurrentLesson(); };
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

  // "Did You Know?" — fetch or load cached fact on lesson mount
  useEffect(() => {
    const cacheKey = `dyk_${lesson.slug}`;
    const shouldShow = seededChance(lesson.slug);
    if (!shouldShow) return;

    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setDidYouKnowFact(cached);
      setShowDidYouKnow(true);
      return;
    }

    // Fetch from AI
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/ai/coach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: `Generate one fascinating "did you know" fact specifically about the topic "${lesson.title}" from the course "${courseTitle}". The lesson covers: ${lesson.content.slice(0, 500)}. Give ONE surprising fact directly related to THIS topic. One sentence only. No quotes or prefix. Do NOT give a generic coding fact.`,
              },
            ],
          }),
        });
        if (!res.ok || cancelled) return;
        const text = await res.text();
        // The coach API may stream — grab the full text
        const fact = text.trim().replace(/^"|"$/g, "");
        if (!cancelled && fact.length > 10) {
          localStorage.setItem(cacheKey, fact);
          setDidYouKnowFact(fact);
          setShowDidYouKnow(true);
        }
      } catch {
        // Silently skip — DYK is non-critical
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [lesson.slug, lesson.title, courseTitle]);

  // No longer auto-opening coach panel — exercises are separate pages now

  const toggleComplete = useCallback(async () => {
    let updated: Set<string>;
    const wasCompleted = completedLessons.has(lesson.id);

    if (wasCompleted) {
      updated = await markLessonIncomplete(courseSlug, lesson.id);
    } else {
      updated = await markLessonComplete(courseSlug, lesson.id);

      // --- XP rewards ---
      // 1. Lesson complete
      await earnXP("lesson_complete", lesson.slug);

      // 2. Check module completion
      if (currentModule) {
        const allModuleLessonsDone = currentModule.lessons.every((l) =>
          updated.has(l.id)
        );
        if (allModuleLessonsDone) {
          await earnXP("module_complete", currentModule.id);
        }
      }

      // 3. Check course completion
      const allLessonIds = modules.flatMap((m) => m.lessons.map((l) => l.id));
      const allCourseDone = allLessonIds.every((id) => updated.has(id));
      if (allCourseDone) {
        await earnXP("course_complete", courseSlug);
      }

      // 4. Show quiz after every 3rd lesson in a module
      if (lessonIndexInModule % 3 === 2) {
        setShowQuiz(true);
      }
    }

    setCompletedLessons(updated);
    setProgress(Math.round((updated.size / totalLessons) * 100));
  }, [
    completedLessons,
    lesson.id,
    lesson.slug,
    courseSlug,
    currentModule,
    modules,
    totalLessons,
    lessonIndexInModule,
    earnXP,
  ]);

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

        {/* Preview banner for free users viewing pro course lessons */}
        {previewBanner && (
          <div className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Crown className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-white/70">
                Free preview — lesson {previewBanner.currentIndex + 1} of {previewBanner.freeTotal}.
                {previewBanner.remaining > 0
                  ? ` ${previewBanner.remaining} free lesson${previewBanner.remaining > 1 ? "s" : ""} remaining.`
                  : " This is your last free lesson."}
              </span>
            </div>
            <Link
              href="/pricing"
              className="shrink-0 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold hover:from-amber-400 hover:to-orange-400 transition-all"
            >
              Unlock all {previewBanner.totalLessons} lessons — $15/mo
            </Link>
          </div>
        )}

        <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
        <p className="text-xs text-white/30 mb-4">
          {formatReadingTime(estimateReadingTime(lesson.content))}
        </p>

        {/* Understanding depth indicator (shows for completed lessons with voice data) */}
        <UnderstandingDepth lessonId={lesson.id} isCompleted={completedLessons.has(lesson.id)} />

        {/* Did You Know inline banner — above content, not blocked by translate bar */}
        {showDidYouKnow && didYouKnowFact && (
          <DidYouKnowCard
            fact={didYouKnowFact}
            lessonSlug={lesson.slug}
            onDismiss={() => setShowDidYouKnow(false)}
          />
        )}

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

      {/* Gamification overlays */}

      {showQuiz && (
        <QuizCard
          lessonTitle={lesson.title}
          lessonSlug={lesson.slug}
          onClose={() => setShowQuiz(false)}
        />
      )}
    </CourseLayout>
  );
}
