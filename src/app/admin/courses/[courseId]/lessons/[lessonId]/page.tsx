"use client";

import { useParams } from "next/navigation";
import { courses } from "@/data";
import { findLesson } from "@/data/types";
import LessonEditor from "@/components/editor/LessonEditor";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditLessonPage() {
  const params = useParams();
  const courseSlug = params.courseId as string;
  const lessonSlug = params.lessonId as string;

  const course = courses.find((c) => c.slug === courseSlug);
  if (!course) return <NotFound message="Course not found" />;

  const result = findLesson(course, lessonSlug);
  if (!result) return <NotFound message="Lesson not found" />;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href={`/admin/courses/${courseSlug}`}
          className="p-2 rounded-lg text-[var(--muted-foreground)] hover:bg-white/[0.06] hover:text-[var(--foreground)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold">{result.lesson.title}</h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            {result.module.title} · Editing lesson
          </p>
        </div>
      </div>

      <LessonEditor
        lesson={result.lesson}
        moduleTitle={result.module.title}
        courseTitle={course.title}
      />
    </div>
  );
}

function NotFound({ message }: { message: string }) {
  return (
    <div className="text-center py-20">
      <p className="text-[var(--muted-foreground)]">{message}</p>
      <Link href="/admin" className="text-blue-400 text-sm mt-2 inline-block hover:underline">
        Back to dashboard
      </Link>
    </div>
  );
}
