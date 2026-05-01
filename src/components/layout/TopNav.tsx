"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Moon,
  Sun,
  Menu,
  BookOpen,
  LogOut,
  Mic,
  Crown,
  Search,
  MessageSquare,
  Library,
  Building2,
  Calendar,
  MoreHorizontal,
  Settings,
  Target,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTopNav } from "@/contexts/TopNavContext";
import { useTheme } from "@/contexts/ThemeContext";
import CreditBadge from "@/components/auth/CreditBadge";
import { KairosLogoIcon } from "@/components/ui/SamsaraLogo";
import TopNavLanguagePicker from "@/components/layout/TopNavLanguagePicker";

interface TopNavProps {
  courseTitle?: string;
  progress?: number;
  onToggleSidebar?: () => void;
}

// Secondary feature shortcuts that used to crowd the nav. Moved into a
// dropdown so the bar stays readable. Order = importance to a logged-in
// applicant on a daily basis.
const MORE_LINKS: { href: string; label: string; icon: typeof BookOpen; cap?: string }[] = [
  { href: "/talk", label: "Voice talk", icon: Mic, cap: "Open a voice session" },
  { href: "/cc/dashboard", label: "Coach Kairos dashboard", icon: BookOpen, cap: "Adaptive home" },
  { href: "/applications", label: "Applications", icon: Calendar, cap: "Deadlines + tracker" },
  { href: "/my-schools", label: "School list", icon: Building2 },
  { href: "/career/interviews", label: "Career interviews", icon: Target, cap: "Tech interview prep" },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/glossary", label: "Glossary", icon: Library },
];

export default function TopNav({
  courseTitle: propCourseTitle,
  progress: propProgress = 0,
  onToggleSidebar: propOnToggleSidebar,
}: TopNavProps) {
  const { user, profile, signOut } = useAuth();
  const { overrides } = useTopNav();
  const { isDark, toggle: toggleDarkMode } = useTheme();
  const pathname = usePathname();
  const showAutosave = pathname?.startsWith("/cc") ?? false;

  const courseTitle = propCourseTitle ?? overrides.courseTitle;
  const progress = propCourseTitle ? propProgress : (overrides.progress ?? 0);
  const onToggleSidebar = propOnToggleSidebar ?? overrides.onToggleSidebar;

  // Dropdown state (More + Avatar)
  const [moreOpen, setMoreOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement | null>(null);
  const avatarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (moreRef.current && !moreRef.current.contains(t)) setMoreOpen(false);
      if (avatarRef.current && !avatarRef.current.contains(t)) setAvatarOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMoreOpen(false);
        setAvatarOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setMoreOpen(false);
    setAvatarOpen(false);
  }, [pathname]);

  const initial = ((user?.user_metadata as Record<string, unknown> | undefined)?.full_name as string | undefined ?? user?.email ?? "U")
    .toString()
    .charAt(0)
    .toUpperCase();

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
          <span className="text-lg font-bold tracking-tight hidden sm:inline text-white">
            Kairos<span className="text-amber-400">.ai</span>
          </span>
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

      {/* Right section — minimal: language, billing, search, more, avatar */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {showAutosave && (
          <span
            className="hidden md:inline-flex items-center gap-1.5 font-mono text-[11px] text-white/45"
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

        {user && <TopNavLanguagePicker className="hidden md:inline-block" />}

        {user && <CreditBadge />}

        {/* Upgrade for free users */}
        {user && profile?.role === "student" && (
          <Link
            href="/pricing"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-semibold hover:bg-[#C4A030] transition-all"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Upgrade</span>
          </Link>
        )}

        {/* Search (Cmd+K) — always visible */}
        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent("open-global-search"));
          }}
          className="flex items-center gap-2 px-2.5 sm:px-3 py-2 sm:py-1.5 min-h-[40px] sm:min-h-0 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs hover:bg-white/10 hover:text-[#D4AF37] transition-all"
          title="Search (Ctrl+K)"
          aria-label="Search"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Search</span>
          <kbd className="hidden md:inline ml-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono">
            ⌘K
          </kbd>
        </button>

        {/* More dropdown — consolidates the secondary feature links */}
        {user && (
          <div ref={moreRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setMoreOpen((v) => !v);
                setAvatarOpen(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 text-xs hover:bg-white/10 hover:text-[#D4AF37] transition-all"
              aria-haspopup="menu"
              aria-expanded={moreOpen}
              title="More"
            >
              <MoreHorizontal className="w-4 h-4" />
              <span className="hidden lg:inline">More</span>
            </button>

            {moreOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-2 z-50 min-w-[260px] rounded-xl bg-[#0a0a0a] border border-white/10 shadow-2xl overflow-hidden"
              >
                {MORE_LINKS.map((l) => {
                  const Ic = l.icon;
                  const active = pathname?.startsWith(l.href);
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      role="menuitem"
                      className={
                        "flex items-start gap-3 px-3.5 py-2.5 text-sm transition-colors " +
                        (active
                          ? "bg-[#D4AF37]/10 text-[#D4AF37]"
                          : "text-white/80 hover:bg-white/5 hover:text-[#D4AF37]")
                      }
                    >
                      <Ic className="w-4 h-4 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium">{l.label}</div>
                        {l.cap && (
                          <div className="text-[11px] text-white/45 mt-0.5 leading-snug">
                            {l.cap}
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Avatar dropdown — settings, feedback, sign out, theme */}
        {user && (
          <div ref={avatarRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setAvatarOpen((v) => !v);
                setMoreOpen(false);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8B7355] text-black text-xs font-bold shadow-md shadow-[#D4AF37]/20 hover:ring-2 hover:ring-[#D4AF37]/50 transition-all"
              aria-haspopup="menu"
              aria-expanded={avatarOpen}
              aria-label="Account menu"
            >
              {initial}
            </button>

            {avatarOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-2 z-50 min-w-[220px] rounded-xl bg-[#0a0a0a] border border-white/10 shadow-2xl overflow-hidden"
              >
                <div className="px-3.5 py-3 border-b border-white/5">
                  {(() => {
                    const meta = user.user_metadata as Record<string, unknown> | undefined;
                    const fullName = typeof meta?.full_name === "string" ? meta.full_name : null;
                    return (
                      <>
                        <div className="text-[13px] text-white/90 font-medium truncate">
                          {fullName ?? user.email}
                        </div>
                        {fullName && user.email && (
                          <div className="text-[11.5px] text-white/45 truncate mt-0.5">
                            {user.email}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>

                <Link
                  href="/settings"
                  role="menuitem"
                  className="flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] text-white/80 hover:bg-white/5 hover:text-[#D4AF37] transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>

                {typeof window !== "undefined" && !localStorage.getItem("survey-completed") && (
                  // Plain <a> — Next.js <Link> prefetches as RSC and 404s on
                  // static files in public/.
                  <a
                    href="/survey.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => localStorage.setItem("survey-completed", "true")}
                    role="menuitem"
                    className="flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] text-white/80 hover:bg-white/5 hover:text-[#D4AF37] transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Send feedback
                  </a>
                )}

                <button
                  type="button"
                  onClick={toggleDarkMode}
                  role="menuitem"
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] text-white/80 hover:bg-white/5 hover:text-[#D4AF37] transition-colors text-left"
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {isDark ? "Light mode" : "Dark mode"}
                </button>

                <div className="border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => signOut()}
                    role="menuitem"
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] text-rose-300 hover:bg-rose-500/10 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
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
