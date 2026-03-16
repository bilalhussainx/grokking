"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, ChevronLeft, Check, Circle, Search, X, Menu, Home, BookOpen } from "lucide-react";
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
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
      next.has(moduleId) ? next.delete(moduleId) : next.add(moduleId);
      return next;
    });
  };

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const totalCompleted = modules.reduce(
    (sum, m) => sum + m.lessons.filter((l) => completedLessons.has(l.id)).length,
    0
  );
  const progressPercent = totalLessons > 0 ? (totalCompleted / totalLessons) * 100 : 0;

  const filteredModules = searchQuery.trim()
    ? modules
        .map((mod) => ({
          ...mod,
          lessons: mod.lessons.filter((l) =>
            l.title.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((mod) => mod.lessons.length > 0)
    : modules;

  const sidebarContent = (
    <div
      className={clsx(
        "h-full overflow-y-auto bg-[var(--background)] border-r border-white/[0.06] flex flex-col transition-all duration-300",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xs">G</span>
            </div>
            <span className="font-semibold text-sm truncate">Curriculum</span>
          </div>
        )}
        {isCollapsed && (
          <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg flex items-center justify-center mx-auto shadow-sm">
            <span className="text-white font-bold text-xs">G</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex p-1.5 rounded-md hover:bg-white/10 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
        >
          <ChevronLeft
            className={clsx("h-4 w-4 transition-transform duration-300", isCollapsed && "rotate-180")}
          />
        </button>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="px-3 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="Search lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input w-full pl-9 pr-4 py-2 rounded-lg text-xs"
            />
          </div>
        </div>
      )}

      {/* Progress bar */}
      {!isCollapsed && (
        <div className="px-4 py-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-medium text-[var(--muted-foreground)]">Progress</span>
            <span className="text-[10px] font-bold text-[var(--muted-foreground)] tabular-nums">
              {totalCompleted}/{totalLessons}
            </span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full progress-gradient rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Quick nav links */}
      {!isCollapsed && (
        <div className="px-3 pb-2 flex items-center gap-1.5">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-white/[0.04] transition-colors"
          >
            <Home className="w-3 h-3" />
            Home
          </Link>
          <Link
            href="/courses"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-white/[0.04] transition-colors"
          >
            <BookOpen className="w-3 h-3" />
            All Courses
          </Link>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2 py-2 overflow-y-auto">
        {filteredModules.map((mod, moduleIndex) => {
          const isExpanded = expandedModules.has(mod.id);
          const completedCount = mod.lessons.filter((l) => completedLessons.has(l.id)).length;
          const allComplete = completedCount === mod.lessons.length && mod.lessons.length > 0;

          return (
            <div key={mod.id} className="mb-0.5">
              <button
                onClick={() => toggleModule(mod.id)}
                className={clsx(
                  "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-all group",
                  "text-sm",
                  isExpanded
                    ? "bg-white/[0.06] text-[var(--foreground)] font-semibold"
                    : "text-[var(--foreground)] hover:bg-white/[0.04] font-medium"
                )}
                title={isCollapsed ? mod.title : undefined}
              >
                {!isCollapsed && (
                  <>
                    <span className="shrink-0 text-[var(--muted-foreground)]">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </span>
                    <span className="flex-1 truncate text-[13px]">
                      {moduleIndex + 1}. {mod.title}
                    </span>
                    <span
                      className={clsx(
                        "shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                        allComplete
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-white/[0.06] text-[var(--muted-foreground)]"
                      )}
                    >
                      {completedCount}/{mod.lessons.length}
                    </span>
                  </>
                )}
                {isCollapsed && (
                  <span className="mx-auto text-xs font-bold text-[var(--muted-foreground)]">
                    {moduleIndex + 1}
                  </span>
                )}
              </button>

              {!isCollapsed && (
                <div
                  className={clsx(
                    "overflow-hidden transition-all duration-200",
                    isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="py-1 ml-3 border-l border-white/[0.06]">
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
                              ? "sidebar-active-glow bg-blue-500/10 text-blue-400 font-medium -ml-px"
                              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-white/[0.04]"
                          )}
                        >
                          {isCompleted ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle
                              className={clsx(
                                "w-3.5 h-3.5 shrink-0",
                                isActive ? "text-blue-400" : "text-white/20"
                              )}
                            />
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
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
