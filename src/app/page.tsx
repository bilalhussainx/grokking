"use client";
import { proMonthlyLabel } from "@/lib/pricing";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { BookOpen, ArrowRight, Sparkles, Star, Target, Users, Building2, MessageSquare, Code2, Globe, GraduationCap, Zap, Shield, Brain, Server, Clock, Trophy, ClipboardList, Share2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAI } from "@/contexts/AIContext";
import { useCoachKairos } from "@/contexts/CoachKairosContext";
import { useXP } from "@/contexts/XPContext";
import { courses } from "@/data";
import { getAllLanguageCourses } from "@/data/languages";
import type { Course } from "@/data/types";
import { useRouter } from "next/navigation";
import { useCourseProgress } from "@/hooks/useCourseProgress";
import ProgressRing from "@/components/ui/ProgressRing";
import WelcomeModal from "@/components/onboarding/WelcomeModal";
import DashboardWalkthrough from "@/components/onboarding/DashboardWalkthrough";
import KairosLogo from "@/components/ui/SamsaraLogo";
import OnboardingChecklist from "@/components/cc/dashboard/OnboardingChecklist";
import CounselorDashboard from "@/components/cc/dashboard/CounselorDashboard";
import AppShell from "@/components/nav/AppShell";
import type { SidebarGrade } from "@/components/nav/Sidebar";
import DaybreakHomepage from "@/components/marketing/daybreak/DaybreakHomepage";


const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const item = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] as const } },
};

// Professional spring configs
const springSmooth = { type: "spring" as const, stiffness: 100, damping: 20, mass: 0.8 };
const springSnappy = { type: "spring" as const, stiffness: 300, damping: 30 };

// Cinematic scroll-reveal with multiple animation variants
type RevealDirection = "up" | "left" | "right" | "scale" | "blur";
function ScrollReveal({ children, className = "", delay = 0, direction = "up", stagger = false }: {
  children: React.ReactNode; className?: string; delay?: number; direction?: RevealDirection; stagger?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const directionMap: Record<RevealDirection, { initial: Record<string, number | string>; animate: Record<string, number | string> }> = {
    up: { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 } },
    left: { initial: { opacity: 0, x: -60 }, animate: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: 60 }, animate: { opacity: 1, x: 0 } },
    scale: { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 } },
    blur: { initial: { opacity: 0, filter: "blur(12px)" }, animate: { opacity: 1, filter: "blur(0px)" } },
  };
  const d = directionMap[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={d.initial}
      animate={isInView ? d.animate : {}}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// Word-by-word cinematic reveal (opacity + Y slide per word)
function BlurReveal({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          className={`inline-block mr-[0.25em] ${className}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: delay + i * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

// Staggered children reveal for grids
function StaggerReveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: delay } } }}
    >
      {children}
    </motion.div>
  );
}
const staggerChild = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const } },
};

// Animated counter for stats
// Static counter — no animation, always shows correct values
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  return <span>{target}{suffix}</span>;
}

// Map onboarding interest IDs to actual course domain values
const INTEREST_TO_DOMAIN: Record<string, string[]> = {
  coding: ['computer-science'],
  'ai-ml': ['computer-science'],
  'system-design': ['computer-science'],
  'interview-prep': ['computer-science'],
  finance: ['finance-business'],
  languages: ['language'],
  religion: ['religious-studies', 'philosophy'],
  'personal-growth': ['health-wellness', 'philosophy', 'political-strategy'],
};

// Map interest IDs to keyword patterns for finer matching within domains
const INTEREST_TO_KEYWORDS: Record<string, string[]> = {
  coding: ['python', 'javascript', 'react', 'node', 'web', 'c++', 'c#', 'game', 'mern'],
  'ai-ml': ['ai', 'ml', 'machine learning', 'neural', 'rag', 'prompt', 'agent', 'claude'],
  'system-design': ['system design', 'api design', 'concurrency'],
  'interview-prep': ['interview', 'coding interview', 'behavioral', 'dsa'],
  finance: ['finance', 'accounting', 'economics', 'investing', 'banking', 'stock', 'fintech'],
  languages: ['french', 'spanish', 'hindi', 'chinese', 'japanese', 'english', 'german'],
  religion: ['islam', 'christian', 'buddhism', 'hinduism', 'judaism', 'sikh', 'sufi', 'taoism', 'confuci', 'ahmadiyya', 'stoic'],
  'personal-growth': ['leadership', 'negotiation', 'mental health', 'meditation', 'mindfulness', 'psychology', 'entrepreneurship'],
};

/** Score a course's relevance to user interests (0-10) */
function scoreCourse(course: { title: string; slug: string; domain?: string; description: string }, interests: string[]): number {
  if (interests.length === 0) return 0;
  let score = 0;
  const title = course.title.toLowerCase();
  const slug = course.slug.toLowerCase();
  const desc = course.description.toLowerCase();

  for (const interest of interests) {
    // Domain match = strong signal
    const domains = INTEREST_TO_DOMAIN[interest] || [];
    if (course.domain && domains.includes(course.domain)) score += 3;

    // Keyword match in title/slug = precise match
    const keywords = INTEREST_TO_KEYWORDS[interest] || [];
    for (const kw of keywords) {
      if (title.includes(kw) || slug.includes(kw)) { score += 4; break; }
      if (desc.includes(kw)) { score += 1; break; }
    }
  }
  return Math.min(score, 10);
}

interface DashboardSummary {
  setup: {
    hasIntakeCompleted: boolean;
    hasSchools: boolean;
    hasPersonalStatement: boolean;
    hasActivities: boolean;
    hasSupplementsStarted: boolean;
    profileCompletion: number;
    firstName: string | null;
    hasGPA: boolean;
  };
  schools: Parameters<typeof CounselorDashboard>[0]["schools"];
  personalStatement: Parameters<typeof CounselorDashboard>[0]["personalStatement"];
  activities: { logged: number; optimized: number; topThree: { id: string; label: string; impactScore: number | null }[] };
  brief: string | null;
  hasMetCoach: boolean;
}

export default function HomePage() {
  const { user, profile, credits, loading } = useAuth();
  const { earnXP } = useXP();
  const { openPanel } = useAI();
  const coachKairos = useCoachKairos();
  const router = useRouter();
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  // Variant key for the walkthrough — derived from grade_level + transfer
  // flag so grade-9 students don't see "Draft your personal statement" steps.
  // AUD-P1-004 (OpenClaw 2026-05-02).
  const [walkthroughVariant, setWalkthroughVariant] = useState<string | undefined>(undefined);
  const courseProgress = useCourseProgress();

  // Get ALL courses user has started (progress > 0, not 100%), sorted by progress desc
  const inProgressCourses = courses
    .filter((c) => {
      const p = courseProgress[c.slug];
      return p && p > 0 && p < 100;
    })
    .sort((a, b) => (courseProgress[b.slug] ?? 0) - (courseProgress[a.slug] ?? 0));

  // Signed-out visitors get the Daybreak homepage after auth resolves.
  // Signed-in dashboard/intake effects below retain their existing behavior.

  // Logged-in + onboarded users → /cc/dashboard (the canonical adaptive
  // dashboard). The legacy CounselorDashboard at / is kept around for
  // signed-in but not-yet-onboarded users so they can still see the
  // intake-coach handoff. Preserve any non-intake query params on the way
  // through; drop focus=intake since onboarded users shouldn't re-enter it.
  useEffect(() => {
    if (loading || !user) return;
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("focus") === "intake") return; // intake-coach mode stays here
    const onboarded = localStorage.getItem("onboarding_complete") === "true";
    if (!onboarded) return;
    const search = params.toString();
    router.replace(search ? `/cc/dashboard?${search}` : "/cc/dashboard");
  }, [loading, user, router]);

  // Load user preferences — always sync from Supabase on login
  useEffect(() => {
    // Try localStorage first for instant load
    const cachedInterests = localStorage.getItem('learning-interests');
    if (cachedInterests) {
      try { setUserInterests(JSON.parse(cachedInterests)); } catch {}
    }

    if (!user) return;

    // Fetch grade + transfer flag to pick the walkthrough step list. Cheap
    // single-row read; falls back to undefined (= senior copy) on failure.
    fetch("/api/cc/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const grade = d?.profile?.grade_level as number | null;
        const isTransfer = d?.profile?.is_transfer_student as boolean | null;
        if (isTransfer) setWalkthroughVariant("transfer");
        else if (grade === 9) setWalkthroughVariant("g9");
        else if (grade === 10) setWalkthroughVariant("g10");
        else if (grade === 11) setWalkthroughVariant("junior");
        else if (grade === 12) setWalkthroughVariant("senior_writing");
      })
      .catch(() => {});

    // Always fetch from Supabase to restore preferences (handles new devices/browsers)
    fetch('/api/user/preferences')
      .then(r => r.ok ? r.json() : null)
      .then(prefs => {
        if (!prefs) return;

        if (prefs.onboarding_completed) {
          localStorage.setItem('onboarding_complete', 'true');
          // Restore ALL preferences to localStorage
          if (prefs.native_language) localStorage.setItem('native-language', prefs.native_language);
          if (prefs.instruction_language) localStorage.setItem('coach-language', prefs.instruction_language);
          if (prefs.learning_style) localStorage.setItem('learning-style', prefs.learning_style);
          if (prefs.communication_mode) localStorage.setItem('comm-mode', prefs.communication_mode);
          if (prefs.english_fluency) localStorage.setItem('english-fluency', prefs.english_fluency);
          if (prefs.learning_interests) {
            localStorage.setItem('learning-interests', JSON.stringify(prefs.learning_interests));
            setUserInterests(prefs.learning_interests);
          }
        } else {
          // Onboarding not completed — open the coach in intake mode.
          // The legacy /onboarding wizard now just redirects back here, so
          // we skip the middleman. Guard against pushing when the browser
          // is already at the intake URL, otherwise we'd hit a loop.
          //
          // Target /cc/dashboard so returning-but-not-fully-onboarded users
          // land on the same adaptive dashboard as everyone else (the new
          // surface), not the legacy "/" CounselorDashboard. The dashboard
          // reads ?focus=intake and shows the OnboardingChecklist when
          // onboarding is incomplete; it shows the full counselor view
          // otherwise. Single landing page, single mental model.
          const sp = new URLSearchParams(window.location.search);
          const alreadyAtIntake =
            sp.get('coach') === 'open' && sp.get('focus') === 'intake';
          if (!alreadyAtIntake) {
            router.replace('/cc/dashboard?coach=open&focus=intake');
          }
        }
      })
      .catch(() => {});
  }, [user]);

  // Quietly award daily-login XP once per day (no UI — gamification moved off dashboard)
  useEffect(() => {
    if (!user) return;
    const today = new Date().toISOString().slice(0, 10);
    const lastDate = localStorage.getItem("last-login-xp-date");
    if (lastDate === today) return;
    localStorage.setItem("last-login-xp-date", today);
    earnXP("daily_login");
  }, [user, earnXP]);

  // Fetch counselor dashboard summary
  useEffect(() => {
    if (!user) {
      setDashboardLoading(false);
      return;
    }
    setDashboardLoading(true);
    fetch("/api/cc/dashboard/summary")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setDashboard(data);
      })
      .catch(() => {})
      .finally(() => setDashboardLoading(false));
  }, [user]);

  // The legacy `walkthroughVariant` state already fetches grade_level +
  // is_transfer_student to drive the variant-aware DashboardWalkthrough.
  // Reuse the same value as the Sidebar's `grade` prop so the nav rail
  // matches the user's variant on the root home surface (which renders
  // the CounselorDashboard, not the new AdaptiveDashboard).
  //
  // Sidebar + CommandPalette are mounted here because src/app/cc/layout.tsx
  // only wraps /cc/* routes — the root `/` lands on this page directly.
  // Logged-out users redirect to /landing via the effect above and never
  // see the chrome.
  const sidebarGrade: SidebarGrade = (walkthroughVariant as SidebarGrade | undefined) ?? "unknown";
  // Hide app chrome when the URL marks intake-coach mode — the coach drawer
  // is the focal point of that flow; competing with a nav rail dilutes it.
  // Returning users without onboarding_completed land here on every visit
  // until they finish, so this guard fires for them too.
  const isIntakeCoachMode =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("focus") === "intake";
  const showAppShell = Boolean(user && !loading) && !isIntakeCoachMode;

  if (!loading && !user) return <DaybreakHomepage />;

  const homeContent = (
    <div className="min-h-screen bg-[var(--background)]">
      {/* First-time welcome modal */}
      {user && <WelcomeModal userName={profile?.full_name} />}

      <motion.div
        className="max-w-5xl mx-auto px-4 pt-16 pb-20"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* ====================================================================
            NON-LOGGED-IN EXPERIENCE — redirect to /landing (handled by effect above).
            Render a minimal placeholder while the redirect resolves.
            ==================================================================== */}
        {!user && !loading && (
          <div
            className="flex items-center justify-center py-24 text-white/30 text-sm"
            aria-live="polite"
          >
            Loading…
          </div>
        )}


        {/* ====================================================================
            LOGGED-IN EXPERIENCE
            ==================================================================== */}

        {/* Compact header for logged-in users — tiny eyebrow + icon rail.
            Hero space is ceded to the counselor brief in CounselorDashboard. */}
        {user && (
          <motion.div variants={item} className="mb-6 pt-2">
            <div className="flex items-center justify-between gap-3 mb-3">
              <span className="text-[11px] text-white/40 tracking-wide">
                {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                {profile?.full_name ? ` · Hi, ${profile.full_name.split(" ")[0]}` : ""}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => coachKairos.open()}
                data-tour="coach"
                className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-semibold hover:bg-[#F4D03F] transition-colors flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Coach
              </button>
              {[
                { href: "/schools", icon: Building2, label: "Schools", tour: "schools", style: "border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10" },
                { href: "/cc/activities-optimizer", icon: Target, label: "Activities", tour: "activities", style: "border border-white/15 text-white/80 hover:border-[#D4AF37]/40 hover:bg-white/5" },
                { href: "/cc/essays", icon: BookOpen, label: "Essays", tour: "essays", style: "border border-white/15 text-white/80 hover:border-[#D4AF37]/40 hover:bg-white/5" },
                { href: "/college-interviews", icon: GraduationCap, label: "Interview", tour: "interview", style: "border border-white/15 text-white/70 hover:border-[#D4AF37]/40 hover:bg-white/5" },
                { href: "/cc/share-settings", icon: Globe, label: "Share", tour: "share", style: "border border-white/15 text-white/70 hover:border-[#D4AF37]/40 hover:bg-white/5" },
              ].map((action) => {
                const ActionIcon = action.icon;
                return (
                  <Link
                    key={action.label}
                    href={action.href}
                    data-tour={action.tour}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${action.style}`}
                  >
                    <ActionIcon className="w-3.5 h-3.5" />
                    {action.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}

        {user && <DashboardWalkthrough variantKey={walkthroughVariant} />}


        {/* Continue where you left off — shown above missions when relevant.
            Per audit 2026-04-07: "Continue where you left off section missing" */}
        {user && inProgressCourses.length > 0 && (
          <motion.div variants={item} className="mb-6">
            <Link
              href={`/course/${inProgressCourses[0].slug}`}
              className="block rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-r from-[#1a1610] to-[#141414] p-5 hover:border-[#D4AF37]/60 transition-all group"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{inProgressCourses[0].icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-[#D4AF37] mb-1 font-semibold">Continue where you left off</p>
                  <h3 className="text-lg font-bold text-white truncate">{inProgressCourses[0].title}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden max-w-xs">
                      <div
                        className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] rounded-full"
                        style={{ width: `${courseProgress[inProgressCourses[0].slug] || 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-white/50">{Math.round(courseProgress[inProgressCourses[0].slug] || 0)}% complete</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>
        )}

        {/* Counselor-view dashboard — onboarding checklist for new users,
            per-school progress for returning users. Replaces old gamification
            stack (streak/missions/achievements) as of 2026-04-20. */}
        {user && (
          <motion.div variants={item} className="mb-12">
            {dashboardLoading && !dashboard ? (
              <div className="space-y-4">
                <div className="h-8 w-1/2 bg-white/5 rounded animate-pulse" />
                <div className="h-32 bg-white/5 rounded-2xl animate-pulse" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="h-48 bg-white/5 rounded-2xl animate-pulse" />
                  <div className="h-48 bg-white/5 rounded-2xl animate-pulse" />
                </div>
              </div>
            ) : dashboard ? (
              (() => {
                const { setup, schools, personalStatement, activities, brief, hasMetCoach } = dashboard;
                const isReturning =
                  setup.hasSchools && (setup.hasPersonalStatement || setup.hasSupplementsStarted || setup.hasActivities);
                return isReturning ? (
                  <CounselorDashboard
                    firstName={setup.firstName}
                    brief={brief}
                    briefLoading={false}
                    schools={schools}
                    personalStatement={personalStatement}
                    activities={{ logged: activities.logged, optimized: activities.optimized }}
                    onOpenCoach={() => coachKairos.open()}
                  />
                ) : (
                  <OnboardingChecklist
                    firstName={setup.firstName}
                    status={{
                      hasMetCoach,
                      hasIntakeCompleted: setup.hasIntakeCompleted,
                      hasSchools: setup.hasSchools,
                      hasPersonalStatement: setup.hasPersonalStatement,
                      hasActivities: setup.hasActivities,
                      hasSupplementsStarted: setup.hasSupplementsStarted,
                    }}
                    onOpenCoach={() => coachKairos.open()}
                  />
                );
              })()
            ) : null}
          </motion.div>
        )}

        {/* Trial banner — show when user is on a free pro trial */}
        {user && profile?.role === "pro" && profile?.trial_ends_at && (
          <motion.div variants={item} className="mb-8">
            <div className="rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-orange-500/5 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-white">
                  You&#39;re on a free 7-day Pro trial
                </p>
                <p className="text-xs text-white/50 mt-0.5">
                  Pro access and {credits} credits expire on{" "}
                  <span className="text-amber-400 font-medium">
                    {new Date(profile.trial_ends_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </span>
                  . Subscribe to keep full access to all courses, AI coaching, and credits.
                </p>
              </div>
              <Link
                href="/pricing"
                className="shrink-0 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold hover:from-amber-400 hover:to-orange-400 transition-all"
              >
                Subscribe — {proMonthlyLabel()}
              </Link>
            </div>
          </motion.div>
        )}

        {/* ── LOGGED-IN SECTION 2: Application Tools Grid ── */}
        {user && (
          <motion.div variants={item} className="mb-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 text-[#D4AF37] text-xs font-medium mb-4">
                <GraduationCap className="w-3.5 h-3.5" />
                Your Application Toolkit
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Everything You Need
              </h2>
              <p className="text-base text-white/50 max-w-xl mx-auto">
                AI-powered tools for every part of your college application.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: BookOpen, label: "Essay Studio", desc: "AI-guided brainstorming, outlining, and draft coaching for personal statements and supplementals.", href: "/cc/essays" },
                { icon: Target, label: "Interview Prep", desc: "Practice with 10 Ivy+ alumni AI personas. Harvard, Yale, Stanford, MIT, and more.", href: "/college-interviews" },
                { icon: Building2, label: "School List Builder", desc: "Get a reach/match/safety list with chancing estimates based on your profile.", href: "/schools" },
                { icon: ClipboardList, label: "Activities Optimizer", desc: "AI rewrites, impact scoring, and optimal ordering for your Common App activities.", href: "/cc/activities-optimizer" },
                { icon: Users, label: "Recommendations Coach", desc: "Build brag sheets, draft ask emails, and track each recommender's confirmation.", href: "/cc/recommenders" },
                { icon: Share2, label: "Counselor Share Link", desc: "One link to share essays, activities, school list, and scores with counselors and parents.", href: "/cc/share-settings" },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <Link key={card.label} href={card.href}>
                    <motion.div
                      className="group relative overflow-hidden rounded-2xl bg-[#141414] border border-white/10 hover:border-[#D4AF37]/40 p-6 cursor-pointer h-full min-h-[140px] transition-all"
                      whileHover={{ scale: 1.03, y: -4 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      <div className="w-12 h-12 rounded-xl border border-[#D4AF37]/20 flex items-center justify-center mb-4 bg-[#D4AF37]/10 text-[#D4AF37]">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h4 className="text-white font-semibold text-base mb-1.5">{card.label}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed mb-4">{card.desc}</p>
                      <div className="flex items-center gap-1.5 text-sm font-medium text-[#D4AF37] group-hover:gap-2.5 transition-all">
                        Open <ArrowRight className="w-4 h-4" />
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── LOGGED-IN SECTION 3: Continue Learning ── */}
        {user && inProgressCourses.length > 0 && (
          <motion.div variants={item} className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-white/70" />
                Continue Learning
              </h3>
              <span className="text-xs text-slate-600">{inProgressCourses.length} course{inProgressCourses.length > 1 ? "s" : ""} in progress</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {inProgressCourses.map((course) => {
                const progress = courseProgress[course.slug] ?? 0;
                const encouragement = progress >= 75 ? "Almost there." : progress >= 50 ? "Halfway there." : progress >= 25 ? "Great start." : "Keep going.";
                return (
                  <Link key={course.slug} href={`/course/${course.slug}`}>
                    <div className="rounded-xl bg-[#141414] border border-white/10 p-4 hover:border-[#D4AF37]/40 transition-all cursor-pointer h-full">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-3xl">{course.icon}</span>
                        <ProgressRing progress={progress} size={36} strokeWidth={2.5} />
                      </div>
                      <div className="text-sm font-semibold text-white mb-1">{course.title}</div>
                      <div className="w-full h-1.5 bg-slate-700/50 rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full bg-[#D4AF37] rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">{Math.round(progress)}% complete</span>
                        <span className="text-xs text-[#D4AF37] font-medium">{encouragement}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── LOGGED-IN SECTION 6: Featured Courses (compact -- 4 recommended) ── */}
        {user && (() => {
          const scored = courses.map(c => ({ course: c, score: scoreCourse(c, userInterests) }));
          const topCourses = userInterests.length > 0
            ? scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score).map(s => s.course).slice(0, 4)
            : courses.filter(c => c.tier === 'free').slice(0, 4);
          return topCourses.length > 0 ? (
            <motion.div variants={item} className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Recommended Courses
                </h3>
                <Link href="/courses" className="text-xs text-[#D4AF37] hover:text-[#C4A030] transition-colors flex items-center gap-1">
                  Browse all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {topCourses.map((course) => (
                  <Link key={course.id} href={`/course/${course.slug}`}>
                    <motion.div
                      className="group rounded-xl bg-[#141414] border border-white/10 hover:border-[#D4AF37]/40 p-4 cursor-pointer h-full transition-all"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{course.icon}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${course.tier === 'pro' ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20' : 'border-white/20 text-white/70'}`}>
                          {course.tier === 'pro' ? 'Pro' : 'Free'}
                        </span>
                      </div>
                      <h4 className="text-white text-sm font-semibold mb-1">{course.title}</h4>
                      <p className="text-slate-400 text-xs line-clamp-2">{course.description}</p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          ) : null;
        })()}

        {/* ── LOGGED-IN SECTION 7: Languages ── */}
        {user && (() => {
          const langCourses = getAllLanguageCourses().filter(
            (c) => (c.language === "es" || c.language === "fr") && c.proficiencyLevel === "A1"
          );
          if (langCourses.length === 0) return null;
          const FLAGS: Record<string, string> = {
            es: "\u{1F1EA}\u{1F1F8}", fr: "\u{1F1EB}\u{1F1F7}", hi: "\u{1F1EE}\u{1F1F3}",
            en: "\u{1F1EC}\u{1F1E7}",
          };
          return (
            <motion.div variants={item} className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Languages
                </h3>
                <Link href="/courses" className="text-xs text-[#D4AF37] hover:text-[#C4A030] transition-colors flex items-center gap-1">
                  All courses <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {langCourses.map((course) => {
                  const lessonCount = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
                  return (
                    <Link key={course.id} href={`/course/${course.slug}`}>
                      <motion.div
                        className="group rounded-xl bg-[#141414] border border-emerald-500/20 hover:border-emerald-500/40 p-4 cursor-pointer h-full transition-all"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-2xl">{FLAGS[course.language] || course.icon}</span>
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {course.proficiencyLevel}
                          </span>
                        </div>
                        <h4 className="text-white text-sm font-semibold mb-1 group-hover:text-emerald-400 transition-colors">
                          {course.title}
                        </h4>
                        <p className="text-slate-400 text-xs line-clamp-2 mb-2">{course.description}</p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-600">
                          <span>{course.modules.length} modules</span>
                          <span>&middot;</span>
                          <span>{lessonCount} lessons</span>
                          <span>&middot;</span>
                          <span>{course.estimatedHours}h</span>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          );
        })()}

        {/* Testimonials removed — will add real user feedback when available */}
      </motion.div>
    </div>
  );

  // Logged-in users get the app shell (sidebar + cmd-K palette) wrapped
  // around the home dashboard. Logged-out users fall through to the
  // /landing redirect handled above; render `homeContent` naked while
  // the redirect resolves.
  if (!showAppShell) return homeContent;
  return <AppShell grade={sidebarGrade}>{homeContent}</AppShell>;
}
