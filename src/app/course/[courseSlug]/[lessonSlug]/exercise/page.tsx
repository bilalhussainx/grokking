"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { courses } from "@/data";
import { findLesson, type Course } from "@/data/types";
import ExerciseIDE from "@/components/exercise/ExerciseIDE";

export default function ExercisePage() {
  const params = useParams();
  const router = useRouter();
  const courseSlug = params.courseSlug as string;
  const lessonSlug = params.lessonSlug as string;

  const hardcodedCourse = courses.find((c) => c.slug === courseSlug);
  const [generatedCourse, setGeneratedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(!hardcodedCourse);

  useEffect(() => {
    if (hardcodedCourse || generatedCourse) return;
    fetch("/api/courses/generated")
      .then((r) => (r.ok ? r.json() : { courses: [] }))
      .then((data) => {
        const found = (data.courses as Course[])?.find(
          (c) => c.slug === courseSlug
        );
        if (found) setGeneratedCourse(found);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [courseSlug, hardcodedCourse, generatedCourse]);

  const course = hardcodedCourse || generatedCourse;

  if (loading && !course) {
    return (
      <div className="h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="animate-pulse text-white/40">Loading exercise...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="h-screen bg-[var(--background)] flex items-center justify-center">
        <p className="text-white/40">Course not found.</p>
      </div>
    );
  }

  const result = findLesson(course as Course, lessonSlug);

  if (!result) {
    return (
      <div className="h-screen bg-[var(--background)] flex items-center justify-center">
        <p className="text-white/40">Lesson not found.</p>
      </div>
    );
  }

  const { lesson, module, prevLesson, nextLesson } = result;

  if (!lesson.starterCode || !lesson.solutionCode) {
    router.replace(`/course/${courseSlug}/${lessonSlug}`);
    return null;
  }

  return (
    <ExerciseIDE
      courseSlug={courseSlug}
      courseTitle={course.title}
      moduleTitle={module.title}
      lesson={lesson}
      prevLesson={prevLesson}
      nextLesson={nextLesson}
    />
  );
}
