"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Moon, Sun, Menu, BookOpen } from "lucide-react";
import clsx from "clsx";

interface TopNavProps {
  courseTitle?: string;
  progress?: number;
  onToggleSidebar?: () => void;
}

export default function TopNav({
  courseTitle,
  progress = 0,
  onToggleSidebar,
}: TopNavProps) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const isDark =
      stored === "dark" ||
      (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <nav className="sticky top-0 z-50 h-14 flex items-center justify-between px-4 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)]">
      {/* Left section */}
      <div className="flex items-center gap-3 min-w-0">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs">
            G
          </div>
          <span className="text-lg font-bold tracking-tight">Grokking</span>
        </Link>

        {courseTitle && (
          <>
            <span className="hidden sm:block text-[var(--muted-foreground)]">/</span>
            <div className="hidden sm:flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] truncate">
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{courseTitle}</span>
            </div>
          </>
        )}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {courseTitle && (
          <div className="hidden sm:flex items-center gap-2.5">
            <div className="w-28 h-1.5 bg-[var(--muted)] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
            <span className="text-xs font-medium text-[var(--muted-foreground)] tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>
        )}

        <button
          onClick={toggleDarkMode}
          className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun className="w-[18px] h-[18px]" />
          ) : (
            <Moon className="w-[18px] h-[18px]" />
          )}
        </button>
      </div>
    </nav>
  );
}
