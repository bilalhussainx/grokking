"use client";

import { useState, useEffect } from "react";
import CourseLayout from "@/components/layout/CourseLayout";
import { SidebarModule } from "@/components/layout/Sidebar";
import LessonContent from "./LessonContent";
import LessonNav from "./LessonNav";
import IDEPanel from "@/components/ide/IDEPanel";
import {
  getCompletedLessons,
  getCourseProgress,
  markLessonComplete,
  markLessonIncomplete,
} from "@/lib/progress";

interface LessonPageProps {
  courseTitle: string;
  courseSlug: string;
  modules: SidebarModule[];
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

export default function LessonPage({
  courseTitle,
  courseSlug,
  modules,
  lesson,
  prevLesson,
  nextLesson,
  totalLessons,
}: LessonPageProps) {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set()
  );
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const completed = getCompletedLessons(courseSlug);
    setCompletedLessons(completed);
    setProgress(getCourseProgress(courseSlug, totalLessons));
  }, [courseSlug, totalLessons]);

  const toggleComplete = () => {
    let updated: Set<string>;
    if (completedLessons.has(lesson.id)) {
      updated = markLessonIncomplete(courseSlug, lesson.id);
    } else {
      updated = markLessonComplete(courseSlug, lesson.id);
    }
    setCompletedLessons(updated);
    setProgress(Math.round((updated.size / totalLessons) * 100));
  };

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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          {lesson.title}
        </h1>

        <LessonContent content={lesson.content} />

        {lesson.starterCode && lesson.solutionCode && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Try it yourself
            </h2>
            <IDEPanel
              starterCode={lesson.starterCode}
              solutionCode={lesson.solutionCode}
            />
          </div>
        )}

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
