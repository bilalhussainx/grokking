"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, BookOpen, FileText, X } from "lucide-react";
import { courses } from "@/data";
import type { Course } from "@/data/types";

interface SearchResult {
  type: "course" | "lesson";
  title: string;
  subtitle: string;
  icon: string;
  href: string;
  tier?: "free" | "pro";
}

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Build search index once
  const searchIndex = useMemo(() => {
    const items: SearchResult[] = [];

    for (const course of courses) {
      // Add course entry
      items.push({
        type: "course",
        title: course.title,
        subtitle: course.domain?.replace(/-/g, " ") ?? course.tier,
        icon: course.icon,
        href: `/course/${course.slug}`,
        tier: course.tier,
      });

      // Add lesson entries
      for (const mod of course.modules) {
        for (const lesson of mod.lessons) {
          items.push({
            type: "lesson",
            title: lesson.title,
            subtitle: `${course.icon} ${course.title} › ${mod.title}`,
            icon: course.icon,
            href: `/course/${course.slug}/${lesson.slug}`,
            tier: course.tier,
          });
        }
      }
    }

    return items;
  }, []);

  // Filter results
  const results = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();
    const courseResults: SearchResult[] = [];
    const lessonResults: SearchResult[] = [];

    for (const item of searchIndex) {
      const match =
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q);

      if (!match) continue;

      if (item.type === "course" && courseResults.length < 5) {
        courseResults.push(item);
      } else if (item.type === "lesson" && lessonResults.length < 8) {
        lessonResults.push(item);
      }

      if (courseResults.length >= 5 && lessonResults.length >= 8) break;
    }

    return [...courseResults, ...lessonResults];
  }, [query, searchIndex]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Global keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
    }

    function handleCustomOpen() {
      setIsOpen(true);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-global-search", handleCustomOpen);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-global-search", handleCustomOpen);
    };
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navigate = useCallback(
    (href: string) => {
      setIsOpen(false);
      router.push(href);
    },
    [router]
  );

  // Keyboard navigation inside modal
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        navigate(results[selectedIndex].href);
      }
    },
    [results, selectedIndex, navigate]
  );

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selected = listRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      );
      selected?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  const courseResults = results.filter((r) => r.type === "course");
  const lessonResults = results.filter((r) => r.type === "lesson");

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
      onClick={() => setIsOpen(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg mx-4 rounded-2xl bg-slate-900/95 border border-white/10 shadow-2xl shadow-black/50 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses and lessons..."
            className="flex-1 bg-transparent text-white text-sm placeholder-slate-500 outline-none"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          className="max-h-[50vh] overflow-y-auto py-2"
        >
          {query.trim() === "" && (
            <div className="px-4 py-8 text-center text-slate-500 text-sm">
              Search {courses.length}+ courses and thousands of lessons...
            </div>
          )}

          {query.trim() !== "" && results.length === 0 && (
            <div className="px-4 py-8 text-center text-slate-500 text-sm">
              No results for &ldquo;{query}&rdquo;
            </div>
          )}

          {courseResults.length > 0 && (
            <>
              <div className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Courses
              </div>
              {courseResults.map((result) => {
                const globalIdx = results.indexOf(result);
                return (
                  <button
                    key={result.href}
                    data-index={globalIdx}
                    onClick={() => navigate(result.href)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      globalIdx === selectedIndex
                        ? "bg-blue-500/15 text-white"
                        : "text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    <span className="text-xl shrink-0">{result.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {result.title}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {result.subtitle}
                      </div>
                    </div>
                    {result.tier === "pro" && (
                      <span className="px-1.5 py-0.5 rounded bg-yellow-500/15 text-yellow-400 text-[10px] font-semibold shrink-0">
                        PRO
                      </span>
                    )}
                    <BookOpen className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  </button>
                );
              })}
            </>
          )}

          {lessonResults.length > 0 && (
            <>
              <div className="px-4 py-1.5 mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Lessons
              </div>
              {lessonResults.map((result) => {
                const globalIdx = results.indexOf(result);
                return (
                  <button
                    key={result.href}
                    data-index={globalIdx}
                    onClick={() => navigate(result.href)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      globalIdx === selectedIndex
                        ? "bg-blue-500/15 text-white"
                        : "text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {result.title}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {result.subtitle}
                      </div>
                    </div>
                    {result.tier === "pro" && (
                      <span className="px-1.5 py-0.5 rounded bg-yellow-500/15 text-yellow-400 text-[10px] font-semibold shrink-0">
                        PRO
                      </span>
                    )}
                  </button>
                );
              })}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-white/[0.06] text-[10px] text-slate-600">
          <span>
            <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 font-mono">↑↓</kbd>{" "}
            Navigate
          </span>
          <span>
            <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 font-mono">↵</kbd>{" "}
            Open
          </span>
          <span>
            <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 font-mono">Esc</kbd>{" "}
            Close
          </span>
        </div>
      </div>
    </div>
  );
}
