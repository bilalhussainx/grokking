"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Moon, Sun, Menu, BookOpen, LogOut, PenTool, Mic } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const isDark =
      stored === "light" ? false : true;
    setDarkMode(isDark);
    document.documentElement.classList.toggle("light", !isDark);
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("light", !next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <nav className="sticky top-0 z-50 h-14 flex items-center justify-between px-4 bg-[var(--background)]/60 backdrop-blur-2xl border-b border-white/[0.06]">
      {/* Left section */}
      <div className="flex items-center gap-3 min-w-0">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 rounded-lg text-[var(--muted-foreground)] hover:bg-white/10 hover:text-[var(--foreground)] transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 text-white font-bold text-xs shadow-md shadow-blue-500/20">
            G
          </div>
          <span className="text-lg font-bold tracking-tight">Grokking</span>
        </Link>

        {courseTitle && (
          <>
            <span className="hidden sm:block text-white/20">/</span>
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
            <div className="w-28 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full progress-gradient rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
            <span className="text-xs font-medium text-[var(--muted-foreground)] tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>
        )}

        <Link
          href="/interviews"
          className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:bg-white/10 hover:text-[var(--foreground)] transition-colors"
          aria-label="Mock Interviews"
          title="Mock Interviews"
        >
          <Mic className="w-[18px] h-[18px]" />
        </Link>

        <Link
          href="/admin"
          className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:bg-white/10 hover:text-[var(--foreground)] transition-colors"
          aria-label="Course Editor"
          title="Course Editor"
        >
          <PenTool className="w-[18px] h-[18px]" />
        </Link>

        <button
          onClick={toggleDarkMode}
          className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:bg-white/10 hover:text-[var(--foreground)] transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun className="w-[18px] h-[18px]" />
          ) : (
            <Moon className="w-[18px] h-[18px]" />
          )}
        </button>

        {user && (
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-white text-xs font-bold shadow-md shadow-violet-500/20">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={() => { logout(); window.location.href = "/login"; }}
              className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:bg-white/10 hover:text-[var(--foreground)] transition-colors"
              aria-label="Log out"
            >
              <LogOut className="w-[18px] h-[18px]" />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
