"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Check, Circle } from "lucide-react";
import clsx from "clsx";

export interface SidebarLesson {
  id: string;
  title: string;
  slug: string;
}

export interface SidebarModule {
  id: string;
  title: string;
  lessons: SidebarLesson[];
}

interface SidebarProps {
  modules: SidebarModule[];
  courseSlug: string;
  currentLessonId?: string;
  completedLessons: Set<string>;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  modules,
  courseSlug,
  currentLessonId,
  completedLessons,
  isOpen,
  onClose,
}: SidebarProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (!currentLessonId) return;
    for (const mod of modules) {
      if (mod.lessons.some((l) => l.id === currentLessonId)) {
        setExpandedModules((prev) => new Set(prev).add(mod.id));
        break;
      }
    }
  }, [currentLessonId, modules]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  const sidebarContent = (
    <div className="w-72 h-full overflow-y-auto bg-[var(--background)] border-r border-[var(--border)]">
      <div className="p-3">
        {modules.map((mod, moduleIndex) => {
          const isExpanded = expandedModules.has(mod.id);
          const completedCount = mod.lessons.filter((l) =>
            completedLessons.has(l.id)
          ).length;
          const allComplete = completedCount === mod.lessons.length && mod.lessons.length > 0;

          return (
            <div key={mod.id} className="mb-0.5">
              <button
                onClick={() => toggleModule(mod.id)}
                className={clsx(
                  "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-colors",
                  "text-sm font-semibold",
                  isExpanded
                    ? "bg-[var(--muted)] text-[var(--foreground)]"
                    : "text-[var(--foreground)] hover:bg-[var(--muted)]"
                )}
              >
                <span className="shrink-0 text-[var(--muted-foreground)]">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </span>
                <span className="flex-1 truncate text-[13px]">
                  {moduleIndex + 1}. {mod.title}
                </span>
                <span
                  className={clsx(
                    "shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                    allComplete
                      ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                      : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                  )}
                >
                  {completedCount}/{mod.lessons.length}
                </span>
              </button>

              <div
                className={clsx(
                  "overflow-hidden transition-all duration-200",
                  isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <div className="py-1 ml-3 border-l border-[var(--border)]">
                  {mod.lessons.map((lesson) => {
                    const isActive = lesson.id === currentLessonId;
                    const isCompleted = completedLessons.has(lesson.id);

                    return (
                      <Link
                        key={lesson.id}
                        href={`/course/${courseSlug}/${lesson.slug}`}
                        onClick={onClose}
                        className={clsx(
                          "flex items-center gap-2 px-3 py-1.5 ml-1 rounded-md text-[13px] transition-all",
                          isActive
                            ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium border-l-2 border-blue-500 -ml-px"
                            : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
                        )}
                      >
                        {isCompleted ? (
                          <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                        ) : (
                          <Circle
                            className={clsx(
                              "w-3.5 h-3.5 shrink-0",
                              isActive
                                ? "text-blue-500"
                                : "text-[var(--border)]"
                            )}
                          />
                        )}
                        <span className="truncate">{lesson.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={clsx(
          "fixed top-14 left-0 bottom-0 z-40 lg:hidden",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block shrink-0">{sidebarContent}</aside>
    </>
  );
}
