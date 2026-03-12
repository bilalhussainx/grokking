"use client";

import { useParams, useSearchParams } from "next/navigation";
import { courses } from "@/data";
import LessonEditor from "@/components/editor/LessonEditor";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewLessonPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const courseSlug = params.courseId as string;
  const moduleId = searchParams.get("moduleId") || "";

  const course = courses.find((c) => c.slug === courseSlug);
  if (!course) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--muted-foreground)]">Course not found</p>
      </div>
    );
  }

  const module = course.modules.find((m) => m.id === moduleId);

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
          <h1 className="text-xl font-bold">New Lesson</h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            {module?.title || "Unknown module"} · Creating new lesson
          </p>
        </div>
      </div>

      <LessonEditor
        lesson={null}
        moduleTitle={module?.title || ""}
        courseTitle={course.title}
      />
    </div>
  );
}
