"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { courses } from "@/data";
import { getAllLessons } from "@/data/types";
import {
  ArrowLeft, Code, FileText, GripVertical, Plus, ChevronDown, ChevronRight, Sparkles,
} from "lucide-react";
import { useState } from "react";

export default function CourseEditorPage() {
  const params = useParams();
  const courseSlug = params.courseId as string;
  const course = courses.find((c) => c.slug === courseSlug);

  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  if (!course) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--muted-foreground)]">Course not found.</p>
        <Link href="/admin" className="text-blue-400 text-sm mt-2 inline-block hover:underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin"
          className="p-2 rounded-lg text-[var(--muted-foreground)] hover:bg-white/[0.06] hover:text-[var(--foreground)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{course.icon}</span>
            <h1 className="text-2xl font-bold">{course.title}</h1>
          </div>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            {course.modules.length} modules · {getAllLessons(course).length} lessons
          </p>
        </div>
      </div>

      {/* Modules */}
      <div className="space-y-3">
        {course.modules.map((mod, modIndex) => {
          const isExpanded = expandedModules.has(mod.id);
          return (
            <div
              key={mod.id}
              className="rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden"
            >
              {/* Module Header */}
              <button
                onClick={() => toggleModule(mod.id)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-bold">
                  {modIndex + 1}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-sm font-semibold">{mod.title}</h3>
                  <p className="text-[11px] text-[var(--muted-foreground)]">
                    {mod.lessons.length} lessons · {mod.description}
                  </p>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-[var(--muted-foreground)]" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)]" />
                )}
              </button>

              {/* Lessons List */}
              {isExpanded && (
                <div className="border-t border-white/[0.06]">
                  {mod.lessons.map((lesson, lessonIndex) => (
                    <Link
                      key={lesson.id}
                      href={`/admin/courses/${courseSlug}/lessons/${lesson.slug}`}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.04] transition-colors border-b border-white/[0.04] last:border-b-0"
                    >
                      <GripVertical className="w-3.5 h-3.5 text-[var(--muted-foreground)]/40" />
                      <span className="text-[11px] text-[var(--muted-foreground)] w-6 text-right tabular-nums">
                        {lessonIndex + 1}
                      </span>
                      {lesson.starterCode ? (
                        <Code className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                      )}
                      <span className="flex-1 text-sm text-[var(--foreground)]">
                        {lesson.title}
                      </span>
                      <span className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider">
                        {lesson.starterCode ? "exercise" : "lesson"}
                      </span>
                    </Link>
                  ))}

                  {/* Add Lesson Button */}
                  <Link
                    href={`/admin/courses/${courseSlug}/lessons/new?moduleId=${mod.id}`}
                    className="flex items-center gap-2 px-4 py-2.5 text-[var(--muted-foreground)] hover:text-blue-400 hover:bg-blue-500/[0.05] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">Add lesson</span>
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
