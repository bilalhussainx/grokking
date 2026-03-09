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

  // Auto-expand module containing the current lesson on mount
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
    <div className="w-72 h-full overflow-y-auto bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      <div className="py-4">
        {modules.map((mod, moduleIndex) => {
          const isExpanded = expandedModules.has(mod.id);
          const completedCount = mod.lessons.filter((l) =>
            completedLessons.has(l.id)
          ).length;

          return (
            <div key={mod.id}>
              <button
                onClick={() => toggleModule(mod.id)}
                className={clsx(
                  "w-full flex items-center justify-between px-4 py-2.5 text-left",
                  "text-sm font-semibold text-gray-800 dark:text-gray-200",
                  "hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                )}
              >
                <span className="truncate">
                  {moduleIndex + 1}. {mod.title}
                </span>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {completedCount}/{mod.lessons.length}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="pb-1">
                  {mod.lessons.map((lesson) => {
                    const isActive = lesson.id === currentLessonId;
                    const isCompleted = completedLessons.has(lesson.id);

                    return (
                      <Link
                        key={lesson.id}
                        href={`/course/${courseSlug}/${lesson.slug}`}
                        onClick={onClose}
                        className={clsx(
                          "flex items-center gap-2.5 px-4 py-2 pl-8 text-sm transition-colors",
                          isActive
                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                        )}
                      >
                        {isCompleted ? (
                          <Check className="w-4 h-4 text-green-500 shrink-0" />
                        ) : (
                          <Circle
                            className={clsx(
                              "w-4 h-4 shrink-0",
                              isActive
                                ? "text-blue-500"
                                : "text-gray-300 dark:text-gray-600"
                            )}
                          />
                        )}
                        <span className="truncate">{lesson.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
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
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
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
