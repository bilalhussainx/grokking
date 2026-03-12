"use client";

import { useParams } from "next/navigation";
import { courses } from "@/data";
import { findLesson, toSidebarModules, getAllLessons } from "@/data/types";
import LessonPage from "@/components/lesson/LessonPage";

export default function LessonRoute() {
  const params = useParams();
  const courseSlug = params.courseSlug as string;
  const lessonSlug = params.lessonSlug as string;

  const course = courses.find((c) => c.slug === courseSlug);

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Course not found.
        </p>
      </div>
    );
  }

  const result = findLesson(course, lessonSlug);

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Lesson not found.
        </p>
      </div>
    );
  }

  const { lesson, module, prevLesson, nextLesson } = result;
  const allLessons = getAllLessons(course);

  return (
    <LessonPage
      courseSlug={courseSlug}
      courseTitle={course.title}
      modules={toSidebarModules(course)}
      moduleTitle={module.title}
      lesson={lesson}
      prevLesson={prevLesson ? { slug: prevLesson.slug, title: prevLesson.title } : null}
      nextLesson={nextLesson ? { slug: nextLesson.slug, title: nextLesson.title } : null}
      totalLessons={allLessons.length}
    />
  );
}
