"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { courses } from "@/data";
import { getAllLessons, type Course } from "@/data/types";
import { getLanguageCourse } from "@/data/languages";

export default function CourseOverviewPage() {
  const router = useRouter();
  const params = useParams();
  const courseSlug = params.courseSlug as string;
  const [checked, setChecked] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  const hardcodedCourse = courses.find((c) => c.slug === courseSlug);
  const langCourse = !hardcodedCourse ? getLanguageCourse(courseSlug) : undefined;

  // Timeout: if redirect hasn't happened in 5 seconds, show error
  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Standard course — redirect to first lesson
    if (hardcodedCourse) {
      const allLessons = getAllLessons(hardcodedCourse);
      if (allLessons.length > 0) {
        router.replace(`/course/${courseSlug}/${allLessons[0].slug}`);
      } else {
        setChecked(true);
      }
      return;
    }

    // Language course — redirect to first lesson
    if (langCourse) {
      const firstLesson = langCourse.modules[0]?.lessons[0];
      if (firstLesson) {
        router.replace(`/course/${courseSlug}/${firstLesson.slug}`);
      } else {
        setChecked(true);
      }
      return;
    }

    // Try generated courses
    fetch("/api/courses/generated")
      .then((r) => r.ok ? r.json() : { courses: [] })
      .then((data) => {
        const found = (data.courses as Course[])?.find((c) => c.slug === courseSlug);
        if (found) {
          const allLessons = getAllLessons(found);
          if (allLessons.length > 0) {
            router.replace(`/course/${courseSlug}/${allLessons[0].slug}`);
            return;
          }
        }
        setChecked(true);
      })
      .catch(() => setChecked(true));
  }, [hardcodedCourse, langCourse, courseSlug, router]);

  if (!hardcodedCourse && !langCourse && checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Course not found.
        </p>
      </div>
    );
  }

  if (timedOut) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="text-center space-y-4">
          <p className="text-lg text-white/60">
            Unable to load this course. The redirect took too long.
          </p>
          <a
            href={`/course/${courseSlug}`}
            className="inline-block px-4 py-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 transition-colors"
          >
            Try again
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
      <p className="text-lg text-white/40 animate-pulse">
        Redirecting to first lesson...
      </p>
    </div>
  );
}
