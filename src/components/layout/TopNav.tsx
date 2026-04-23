"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Menu, BookOpen, LogOut, Mic, Crown, Search, MessageSquare, Star, Gem, GraduationCap, Target, Library, Building2, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTopNav } from "@/contexts/TopNavContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useXP } from "@/contexts/XPContext";
import CreditBadge from "@/components/auth/CreditBadge";
import StreakBadge from "@/components/gamification/StreakBadge";
import { KairosLogoIcon } from "@/components/ui/SamsaraLogo";

interface TopNavProps {
  courseTitle?: string;
  progress?: number;
  onToggleSidebar?: () => void;
}

export default function TopNav({
  courseTitle: propCourseTitle,
  progress: propProgress = 0,
  onToggleSidebar: propOnToggleSidebar,
}: TopNavProps) {
  const { user, profile, signOut } = useAuth();
  const { overrides } = useTopNav();
  const { isDark, toggle: toggleDarkMode } = useTheme();
  const { level, gems, xpMultiplier } = useXP();
  const pathname = usePathname();
  const showAutosave = pathname?.startsWith("/cc") ?? false;

  // Props override context (for backward compat), context overrides defaults
  const courseTitle = propCourseTitle ?? overrides.courseTitle;
  const progress = propCourseTitle ? propProgress : (overrides.progress ?? 0);
  const onToggleSidebar = propOnToggleSidebar ?? overrides.onToggleSidebar;

  return (
    <nav className="sticky top-0 z-50 h-14 flex items-center justify-between px-4 bg-black/90 backdrop-blur-2xl border-b border-white/10">
      {/* Left section */}
      <div className="flex items-center gap-3 min-w-0">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 rounded-lg text-white/60 hover:bg-white/10 hover:text-[#D4AF37] transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <Link href="/" className="flex items-center gap-2 shrink-0">
          <KairosLogoIcon size={28} />
          <span className="text-lg font-bold tracking-tight hidden sm:inline text-white">Kairos<span className="text-amber-400">.ai</span></span>
          <span className="text-lg font-bold tracking-tight sm:hidden text-amber-400">K.</span>
        </Link>

        {courseTitle && (
          <>
            <span className="hidden sm:block text-white/20">/</span>
            <div className="hidden sm:flex items-center gap-1.5 text-sm text-white/60 truncate">
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{courseTitle}</span>
            </div>
          </>
        )}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 sm:gap-3">
        {showAutosave && (
          <span
            className="hidden md:inline-flex items-center gap-1.5 font-mono text-[11px] text-white/50"
            aria-live="polite"
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden />
            saved
          </span>
        )}

        {courseTitle && (
          <div className="hidden sm:flex items-center gap-2.5">
            <div className="w-28 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full progress-gradient rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
            <span className="text-xs font-medium text-white/60 tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>
        )}

        {/* Streak + Level + Gems + Credit Badge */}
        {user && <StreakBadge />}
        {user && (
          <div className="hidden sm:flex items-center gap-1">
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-semibold cursor-default"
              title={`Level ${level}`}
            >
              <Star className="w-3 h-3" /> Lv.{level}
            </div>
            {xpMultiplier > 1 && (
              <div
                className="flex items-center px-1.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold animate-pulse cursor-default"
                title={`${xpMultiplier}x XP multiplier active`}
              >
                {xpMultiplier}x
              </div>
            )}
          </div>
        )}
        {user && (
          <div
            className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-semibold cursor-default"
            title={`${gems} gems`}
          >
            <Gem className="w-3 h-3" /> {gems}
          </div>
        )}
        {user && <CreditBadge />}

        {/* Upgrade button for free users */}
        {user && profile?.role === "student" && (
          <Link
            href="/pricing"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-semibold hover:bg-[#C4A030] transition-all"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Upgrade</span>
          </Link>
        )}

        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent("open-global-search"));
          }}
          className="flex items-center gap-2 px-2.5 sm:px-3 py-2 sm:py-1.5 min-h-[44px] sm:min-h-0 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs hover:bg-white/10 hover:text-[#D4AF37] transition-all"
          title="Search courses and lessons (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden sm:inline ml-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono">
            Ctrl K
          </kbd>
        </button>

        <Link
          href="/college-interviews"
          className="hidden md:flex items-center gap-1.5 px-2.5 sm:px-3 py-2 sm:py-1.5 min-h-[44px] sm:min-h-0 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold hover:bg-[#D4AF37]/25 transition-all"
          title="Practice your college admissions interview"
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>College</span>
        </Link>

        <Link
          href="/career/interviews"
          className="hidden md:flex items-center gap-1.5 px-2.5 sm:px-3 py-2 sm:py-1.5 min-h-[44px] sm:min-h-0 rounded-lg bg-white/[0.04] border border-white/10 text-white/80 text-xs font-medium hover:bg-white/[0.08] transition-all"
          title="Practice your tech interview"
        >
          <Target className="w-3.5 h-3.5" />
          <span>Career</span>
        </Link>

        <Link
          href="/talk"
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 sm:py-1.5 min-h-[44px] sm:min-h-0 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-medium hover:bg-[#D4AF37]/20 transition-all"
          title="Start a voice conversation"
        >
          <Mic className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Talk</span>
        </Link>

        <Link
          href="/courses"
          className="hidden sm:flex p-1.5 rounded-lg text-white/60 hover:bg-white/10 hover:text-[#D4AF37] transition-colors"
          aria-label="Browse Courses"
          title="Browse Courses"
        >
          <BookOpen className="w-[18px] h-[18px]" />
        </Link>

        <Link
          href="/glossary"
          className="hidden sm:flex p-1.5 rounded-lg text-white/60 hover:bg-white/10 hover:text-[#D4AF37] transition-colors"
          aria-label="Glossary"
          title="Glossary"
        >
          <Library className="w-[18px] h-[18px]" />
        </Link>

        <Link
          href="/my-schools"
          className="hidden sm:flex p-1.5 rounded-lg text-white/60 hover:bg-white/10 hover:text-[#D4AF37] transition-colors"
          aria-label="My Schools"
          title="My School List"
        >
          <Building2 className="w-[18px] h-[18px]" />
        </Link>

        <Link
          href="/timeline"
          className="hidden sm:flex p-1.5 rounded-lg text-white/60 hover:bg-white/10 hover:text-[#D4AF37] transition-colors"
          aria-label="Timeline"
          title="Deadlines & Tasks"
        >
          <Calendar className="w-[18px] h-[18px]" />
        </Link>

        <button
          onClick={toggleDarkMode}
          className="hidden sm:flex p-1.5 rounded-lg text-white/60 hover:bg-white/10 hover:text-[#D4AF37] transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDark ? (
            <Sun className="w-[18px] h-[18px]" />
          ) : (
            <Moon className="w-[18px] h-[18px]" />
          )}
        </button>

        {user && (
          <div className="flex items-center gap-2">
            <Link
              href="/settings"
              className="flex h-8 w-8 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8B7355] text-black text-xs font-bold shadow-md shadow-[#D4AF37]/20 hover:ring-2 hover:ring-[#D4AF37]/50 transition-all"
              title="Settings"
            >
              {(user.user_metadata?.full_name || user.email || "U").charAt(0).toUpperCase()}
            </Link>
            {typeof window !== "undefined" && !localStorage.getItem("survey-completed") && (
              // Plain <a> — Next.js <Link> prefetches as RSC and 404s on
              // static files in public/. (Bug fix 2026-04-07)
              <a
                href="/survey.html"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => localStorage.setItem("survey-completed", "true")}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-medium hover:bg-[#D4AF37]/20 transition-colors"
                title="Give feedback"
              >
                <MessageSquare className="w-3 h-3" />
                Feedback
              </a>
            )}
            <button
              onClick={() => signOut()}
              className="hidden sm:flex p-1.5 rounded-lg text-white/60 hover:bg-white/10 hover:text-[#D4AF37] transition-colors"
              aria-label="Log out"
            >
              <LogOut className="w-[18px] h-[18px]" />
            </button>
          </div>
        )}

        {!user && (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden sm:inline-block px-3 py-1.5 rounded-lg text-white/60 text-sm font-medium hover:text-[#D4AF37] hover:bg-white/5 transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-lg bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#C4A030] transition-colors"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
