"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Moon, Sun, Menu } from "lucide-react";
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
    <nav
      className={clsx(
        "sticky top-0 z-50 h-14 flex items-center justify-between px-4",
        "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700"
      )}
    >
      {/* Left section */}
      <div className="flex items-center gap-3 min-w-0">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <Link
          href="/"
          className="text-xl font-bold text-blue-600 dark:text-blue-400 shrink-0"
        >
          Grokking
        </Link>

        {courseTitle && (
          <span className="hidden sm:block text-sm text-gray-600 dark:text-gray-300 truncate">
            {courseTitle}
          </span>
        )}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {courseTitle && (
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {Math.round(progress)}%
            </span>
          </div>
        )}

        <button
          onClick={toggleDarkMode}
          className="p-1.5 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
      </div>
    </nav>
  );
}
