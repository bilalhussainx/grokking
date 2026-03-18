"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { courses } from "@/data";
import { findLesson, toSidebarModules, getAllLessons, type Course } from "@/data/types";
import { getLanguageCourse } from "@/data/languages";
import { useAuth } from "@/contexts/AuthContext";
import LessonPage from "@/components/lesson/LessonPage";
import LanguageLessonPage from "@/components/language/LanguageLessonPage";
import PaywallModal from "@/components/pricing/PaywallModal";

export default function LessonRoute() {
  const params = useParams();
  const courseSlug = params.courseSlug as string;
  const lessonSlug = params.lessonSlug as string;
  const { profile } = useAuth();
  const [showPaywall, setShowPaywall] = useState(false);
  const [generatedCourse, setGeneratedCourse] = useState<Course | null>(null);
  const [loadingGenerated, setLoadingGenerated] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // First try hardcoded courses
  const hardcodedCourse = courses.find((c) => c.slug === courseSlug);

  // Check for language courses
  const languageCourse = getLanguageCourse(courseSlug);

  // If not found in hardcoded, fetch from generated courses with timeout
  useEffect(() => {
    if (hardcodedCourse || generatedCourse || languageCourse) return;
    setLoadingGenerated(true);

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
      setLoadError(true);
      setLoadingGenerated(false);
    }, 5000);

    fetch("/api/courses/generated", { signal: controller.signal })
      .then((r) => r.ok ? r.json() : { courses: [] })
      .then((data) => {
        const found = (data.courses as Course[])?.find((c) => c.slug === courseSlug);
        if (found) setGeneratedCourse(found);
      })
      .catch(() => {
        if (!controller.signal.aborted) setLoadError(true);
      })
      .finally(() => {
        clearTimeout(timeout);
        setLoadingGenerated(false);
      });

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [courseSlug, hardcodedCourse, generatedCourse, languageCourse]);

  const course = hardcodedCourse || generatedCourse || languageCourse;

  if (loadingGenerated && !course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="animate-pulse text-white/40">Loading course...</div>
      </div>
    );
  }

  if (loadError && !course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="text-center space-y-4">
          <p className="text-lg text-white/60">Failed to load course data.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Course not found.
        </p>
      </div>
    );
  }

  // Handle language courses differently
  if (languageCourse) {
    // Find lesson in language course
    const langModule = languageCourse.modules.find(m => 
      m.lessons.some(l => l.slug === lessonSlug)
    );
    const langLesson = langModule?.lessons.find(l => l.slug === lessonSlug);
    
    if (!langModule || !langLesson) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
          <p className="text-lg text-gray-500 dark:text-gray-400">Lesson not found.</p>
        </div>
      );
    }
    
    // Find prev/next lessons
    const allLessons = languageCourse.modules.flatMap(m => m.lessons);
    const lessonIndex = allLessons.findIndex(l => l.slug === lessonSlug);
    const prevLesson = lessonIndex > 0 ? allLessons[lessonIndex - 1] : null;
    const nextLesson = lessonIndex < allLessons.length - 1 ? allLessons[lessonIndex + 1] : null;
    
    return (
      <LanguageLessonPage
        course={languageCourse}
        lesson={langLesson}
        module={{ id: langModule.id, title: langModule.title }}
        prevLesson={prevLesson}
        nextLesson={nextLesson}
      />
    );
  }

  const result = findLesson(course as Course, lessonSlug);

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Lesson not found.
        </p>
      </div>
    );
  }

  // Course access check: free users can preview first 3 lessons of pro courses
  const FREE_PREVIEW_LESSONS = 3;
  const userRole = profile?.role || "student";
  const isProUser = userRole === "pro" || userRole === "admin" || userRole === "teacher";
  const isProCourse = 'tier' in course && course.tier === "pro";

  // Determine if this specific lesson is locked (beyond the free preview window)
  const allCourseLessons = getAllLessons(course as Course);
  const currentLessonIndex = allCourseLessons.findIndex(l => l.slug === lessonSlug);
  const isLessonLocked = isProCourse && !isProUser && currentLessonIndex >= FREE_PREVIEW_LESSONS;

  if (isLessonLocked && !showPaywall) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <PaywallModal
          courseTitle={course.title}
          trigger="course_locked"
          onClose={() => window.history.back()}
        />
      </div>
    );
  }

  const { lesson, module, prevLesson, nextLesson } = result;
  const allLessons = getAllLessons(course as Course);

  // For preview lessons in pro courses, show an upgrade banner
  const isPreviewLesson = isProCourse && !isProUser && currentLessonIndex < FREE_PREVIEW_LESSONS;
  const remainingPreview = FREE_PREVIEW_LESSONS - currentLessonIndex - 1;

  return (
    <>
      <LessonPage
        courseSlug={courseSlug}
        courseTitle={course.title}
        courseDomain={(course as Course).domain}
        modules={toSidebarModules(course as Course)}
        moduleTitle={module.title}
        lesson={lesson}
        prevLesson={prevLesson ? { slug: prevLesson.slug, title: prevLesson.title } : null}
        nextLesson={nextLesson ? { slug: nextLesson.slug, title: nextLesson.title } : null}
        totalLessons={allLessons.length}
        previewBanner={isPreviewLesson ? {
          currentIndex: currentLessonIndex,
          freeTotal: FREE_PREVIEW_LESSONS,
          remaining: remainingPreview,
          totalLessons: allLessons.length,
        } : undefined}
        lockedLessonIndex={isProCourse && !isProUser ? FREE_PREVIEW_LESSONS : undefined}
      />
      {showPaywall && (
        <PaywallModal
          courseTitle={course.title}
          trigger="course_locked"
          onClose={() => setShowPaywall(false)}
        />
      )}
    </>
  );
}
