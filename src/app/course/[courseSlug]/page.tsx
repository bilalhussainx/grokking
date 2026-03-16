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

  const hardcodedCourse = courses.find((c) => c.slug === courseSlug);
  const langCourse = !hardcodedCourse ? getLanguageCourse(courseSlug) : undefined;

  useEffect(() => {
    // Standard course — redirect to first lesson
    if (hardcodedCourse) {
      const allLessons = getAllLessons(hardcodedCourse);
      if (allLessons.length > 0) {
        router.replace(`/course/${courseSlug}/${allLessons[0].slug}`);
      }
      return;
    }

    // Language course — redirect to first lesson
    if (langCourse) {
      const firstLesson = langCourse.modules[0]?.lessons[0];
      if (firstLesson) {
        router.replace(`/course/${courseSlug}/${firstLesson.slug}`);
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
  }, [hardcodedCourse, courseSlug, router]);

  if (!hardcodedCourse && !langCourse && checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Course not found.
        </p>
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
