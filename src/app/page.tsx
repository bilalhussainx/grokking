"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mic, BookOpen, ArrowRight, Sparkles, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useXP } from "@/contexts/XPContext";
import { courses } from "@/data";
import type { Course } from "@/data/types";
import { ALL_SUPPORTED_LANGUAGES } from "@/lib/voice-provider-router";
import { useRouter } from "next/navigation";
import LearningStats from "@/components/gamification/LearningStats";
import { useCourseProgress } from "@/hooks/useCourseProgress";
import ProgressRing from "@/components/ui/ProgressRing";
import ForgettingAlert from "@/components/gamification/ForgettingAlert";
import VariableReward from "@/components/gamification/VariableReward";
import { getDailyLoginReward } from "@/lib/rewards";
import SamsaraLogo from "@/components/ui/SamsaraLogo";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};
const item = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

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

function FeaturedCourses({ interests = [] }: { interests?: string[] }) {
  const hasInterests = interests.length > 0;

  // Score all courses by relevance
  const scored = courses.map(c => ({ course: c, score: scoreCourse(c, interests) }));
  const recommended = hasInterests
    ? scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score).map(s => s.course).slice(0, 9)
    : [];
  const recommendedIds = new Set(recommended.map(c => c.id));

  // Remaining courses not in recommended
  const remaining = courses.filter(c => !recommendedIds.has(c.id));
  const premium = remaining.filter(c => c.tier === 'pro').slice(0, 6);
  const free = remaining.filter(c => c.tier === 'free').slice(0, 6);

  return (
    <motion.div variants={item} className="mb-16">
      {/* Recommended for You */}
      {recommended.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            Recommended for You
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommended.map((course) => (
              <CourseCard key={course.id} course={course} accent="violet" />
            ))}
          </div>
        </div>
      )}

      {/* More to Explore — Premium */}
      {premium.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            {hasInterests ? "More to Explore" : "Premium Courses"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {premium.map((course) => (
              <CourseCard key={course.id} course={course} accent="amber" />
            ))}
          </div>
        </div>
      )}

      {/* Free Courses */}
      {free.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Free Courses
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {free.map((course) => (
              <CourseCard key={course.id} course={course} accent="emerald" />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

/** Reusable course card */
function CourseCard({ course, accent }: { course: { id: string; slug: string; icon: string; title: string; description: string; tier: string; domain?: string; level?: string }; accent: "violet" | "amber" | "emerald" }) {
  const colors = {
    violet: { border: "border-violet-500/20 hover:border-violet-500/40", bg: "from-violet-500/5", badge: "bg-violet-500/15 text-violet-400 border-violet-500/20", tag: "bg-violet-500/10 text-violet-400" },
    amber: { border: "border-yellow-500/20 hover:border-yellow-500/40", bg: "from-yellow-500/5", badge: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20", tag: "bg-slate-700/50 text-slate-400" },
    emerald: { border: "border-emerald-500/20 hover:border-emerald-500/40", bg: "from-emerald-500/5", badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20", tag: "bg-slate-700/50 text-slate-400" },
  }[accent];

  return (
    <Link href={`/course/${course.slug}`}>
      <motion.div
        className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${colors.bg} via-slate-800/80 to-slate-900/80 border ${colors.border} p-5 cursor-pointer h-full transition-all`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className={`absolute top-3 right-3 px-2 py-0.5 rounded-full ${colors.badge} text-xs font-semibold border`}>
          {course.tier === 'pro' ? 'Premium' : 'Free'}
        </div>
        <div className="text-3xl mb-3">{course.icon}</div>
        <h4 className="text-white font-semibold">{course.title}</h4>
        <p className="text-slate-400 text-sm mt-1 line-clamp-2">{course.description}</p>
        <div className="flex items-center gap-2 mt-3">
          {course.domain && (
            <span className={`px-2 py-0.5 rounded ${colors.tag} text-xs`}>
              {course.domain.replace(/-/g, ' ')}
            </span>
          )}
          {course.level && (
            <span className="px-2 py-0.5 rounded bg-slate-700/50 text-slate-400 text-xs">{course.level}</span>
          )}
        </div>
      </motion.div>
    </Link>
  );
}

export default function HomePage() {
  const { user, profile, credits } = useAuth();
  const { earnXP, showXPFlyUp, lastXPAmount, pendingReward, dismissReward } = useXP();
  const router = useRouter();
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [dailyXPAwarded, setDailyXPAwarded] = useState(false);
  const [dailyLoginReward, setDailyLoginReward] = useState<{ gems: number; xp: number; message: string; isJackpot: boolean } | null>(null);
  const courseProgress = useCourseProgress();

  // Get ALL courses user has started (progress > 0, not 100%), sorted by progress desc
  const inProgressCourses = courses
    .filter((c) => {
      const p = courseProgress[c.slug];
      return p && p > 0 && p < 100;
    })
    .sort((a, b) => (courseProgress[b.slug] ?? 0) - (courseProgress[a.slug] ?? 0));

  // Load user preferences — always sync from Supabase on login
  useEffect(() => {
    // Try localStorage first for instant load
    const cachedInterests = localStorage.getItem('learning-interests');
    if (cachedInterests) {
      try { setUserInterests(JSON.parse(cachedInterests)); } catch {}
    }

    if (!user) return;

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
          // Onboarding not completed — redirect to onboarding
          router.push('/onboarding');
        }
      })
      .catch(() => {});
  }, [user]);

  // Award escalating daily login rewards once per day
  useEffect(() => {
    if (!user) return;
    const today = new Date().toISOString().slice(0, 10);
    const lastDate = localStorage.getItem("last-login-xp-date");
    if (lastDate === today) return;

    // Track consecutive login days
    const lastLoginDate = localStorage.getItem("last-login-date");
    let consecutiveDay = parseInt(localStorage.getItem("login-consecutive-day") || "0", 10);

    if (lastLoginDate) {
      const lastD = new Date(lastLoginDate);
      const todayD = new Date(today);
      const diffMs = todayD.getTime() - lastD.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        consecutiveDay += 1;
      } else if (diffDays > 1) {
        consecutiveDay = 1; // streak broken, restart
      }
    } else {
      consecutiveDay = 1; // first login
    }

    localStorage.setItem("last-login-date", today);
    localStorage.setItem("last-login-xp-date", today);
    localStorage.setItem("login-consecutive-day", String(consecutiveDay));

    const reward = getDailyLoginReward(consecutiveDay);
    setDailyLoginReward(reward);

    earnXP("daily_login").then(() => setDailyXPAwarded(true));
  }, [user, earnXP]);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Variable reward popup */}
      <VariableReward reward={pendingReward} onDismiss={dismissReward} />

      {/* XP fly-up on daily login */}
      {showXPFlyUp > 0 && dailyXPAwarded && (
        <motion.div
          key={showXPFlyUp}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
          initial={{ opacity: 1, y: 0, scale: 1 }}
          animate={{ opacity: 0, y: -60, scale: 1.3 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          onAnimationComplete={() => setDailyXPAwarded(false)}
        >
          <div className={`px-4 py-2 rounded-xl border font-bold text-lg shadow-lg ${
            dailyLoginReward?.isJackpot
              ? "bg-yellow-500/20 border-yellow-500/30 text-yellow-300 shadow-yellow-500/10"
              : "bg-violet-500/20 border-violet-500/30 text-violet-300 shadow-violet-500/10"
          }`}>
            {dailyLoginReward
              ? dailyLoginReward.message
              : `+${lastXPAmount} XP`}
          </div>
        </motion.div>
      )}
      <motion.div
        className="max-w-5xl mx-auto px-4 pt-16 pb-20"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* ── HERO — Cinematic, value-first ── */}
        <motion.div variants={item} className="text-center mb-16 pt-4">
          <motion.div
            className="flex justify-center mb-8"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <SamsaraLogo size="xl" showText={false} />
          </motion.div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            50+ courses &middot; 8 languages &middot; AI voice coaching
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            Your AI tutor that<br />
            <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              speaks your language.
            </span>
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            Learn to code, speak French, study Islam, master finance — with an AI coach that explains in your language, adapts to your level, and talks back.
          </p>
          {!user && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold text-base hover:from-violet-400 hover:to-cyan-400 transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
              >
                Start Free — 300 AI Credits
              </Link>
              <Link
                href="/talk"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white/70 font-medium text-base hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <Mic className="w-4 h-4" />
                Try a Voice Lesson
              </Link>
            </div>
          )}
        </motion.div>

        {/* ── HOW IT WORKS — 3-step product flow ── */}
        {!user && (
          <motion.div variants={item} className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Step 1: Pick a course */}
              <motion.div
                className="relative rounded-2xl border border-blue-500/15 bg-gradient-to-br from-blue-500/5 via-slate-900/80 to-slate-900/80 p-6"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute top-4 right-4 text-3xl font-bold text-blue-500/10">1</div>
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Pick any course</h3>
                <p className="text-white/50 text-sm leading-relaxed">Coding interviews, French, Islamic studies, personal finance — 50+ structured courses with exercises.</p>
              </motion.div>

              {/* Step 2: Talk to tutor */}
              <motion.div
                className="relative rounded-2xl border border-emerald-500/15 bg-gradient-to-br from-emerald-500/5 via-slate-900/80 to-slate-900/80 p-6"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute top-4 right-4 text-3xl font-bold text-emerald-500/10">2</div>
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                  <Mic className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Talk to your AI tutor</h3>
                <p className="text-white/50 text-sm leading-relaxed">Voice conversations in 8 languages. Coach Alex explains concepts, gives hints, and adapts to your level.</p>
              </motion.div>

              {/* Step 3: Master it */}
              <motion.div
                className="relative rounded-2xl border border-violet-500/15 bg-gradient-to-br from-violet-500/5 via-slate-900/80 to-slate-900/80 p-6"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute top-4 right-4 text-3xl font-bold text-violet-500/10">3</div>
                <div className="w-11 h-11 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Master it your way</h3>
                <p className="text-white/50 text-sm leading-relaxed">Track progress, earn XP, get personalized recommendations. Learn at your pace, in your language.</p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ── SOCIAL PROOF — Numbers bar ── */}
        {!user && (
          <motion.div variants={item} className="mb-14">
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 py-4">
              {[
                { value: "50+", label: "Courses" },
                { value: "8", label: "Voice Languages" },
                { value: "2,200+", label: "Lessons" },
                { value: "Free", label: "1-Month Trial" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/40 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Learning Stats + Forgetting Alert (logged-in users) */}
        {user && (
          <motion.div variants={item} className="mb-10 space-y-4">
            <LearningStats />
            <ForgettingAlert />
          </motion.div>
        )}

        {/* Trial banner — show when user is on a free pro trial */}
        {user && profile?.role === "pro" && profile?.trial_ends_at && (
          <motion.div variants={item} className="mb-8">
            <div className="rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-orange-500/5 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-white">
                  You're on a free 1-month Pro trial
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
                Subscribe — $15/mo
              </Link>
            </div>
          </motion.div>
        )}

        {/* ── SECTION 1: Continue Learning (logged-in users with progress) ── */}
        {user && inProgressCourses.length > 0 && (
          <motion.div variants={item} className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                Continue Learning
              </h3>
              <span className="text-xs text-slate-600">{inProgressCourses.length} course{inProgressCourses.length > 1 ? "s" : ""} in progress</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {inProgressCourses.map((course) => {
                const progress = courseProgress[course.slug] ?? 0;
                const encouragement = progress >= 75 ? "Almost there!" : progress >= 50 ? "Halfway done!" : progress >= 25 ? "Great start!" : "Keep going!";
                return (
                  <Link key={course.slug} href={`/course/${course.slug}`}>
                    <div className="rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/40 p-4 hover:bg-slate-800/80 hover:border-emerald-500/30 transition-all cursor-pointer h-full">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-3xl">{course.icon}</span>
                        <ProgressRing progress={progress} size={36} strokeWidth={2.5} />
                      </div>
                      <div className="text-sm font-semibold text-white mb-1">{course.title}</div>
                      <div className="w-full h-1.5 bg-slate-700/50 rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">{Math.round(progress)}% complete</span>
                        <span className="text-xs text-emerald-400 font-medium">{encouragement}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── SECTION 2: Two Action Cards (Talk + Learn) ── */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {/* Talk Card */}
          <Link href="/talk">
            <motion.div
              className="group relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-slate-900/80 to-slate-900/80 backdrop-blur-sm p-6 md:p-8 cursor-pointer h-full"
              whileHover={{ scale: 1.02, borderColor: "rgba(16, 185, 129, 0.4)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors" />
              <div className="relative z-10">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center mb-4">
                  <Mic className="w-6 h-6 md:w-7 md:h-7 text-emerald-400" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Talk</h2>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed mb-4">
                  Voice conversation with AI tutors in 18 languages.
                </p>
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                  Start Talking <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Learn Card */}
          <Link href="/courses">
            <motion.div
              className="group relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 via-slate-900/80 to-slate-900/80 backdrop-blur-sm p-6 md:p-8 cursor-pointer h-full"
              whileHover={{ scale: 1.02, borderColor: "rgba(59, 130, 246, 0.4)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors" />
              <div className="relative z-10">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 md:w-7 md:h-7 text-blue-400" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Learn</h2>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed mb-4">
                  50+ courses in tech, languages, finance &amp; more.
                </p>
                <div className="flex items-center gap-2 text-blue-400 text-sm font-medium">
                  Browse Courses <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* ── SECTION 3: Quick Voice Practice ── */}
        <motion.div variants={item} className="mb-10">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Mic className="w-3.5 h-3.5 text-emerald-400" />
            Quick Voice Practice
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2 snap-x scrollbar-hide md:flex-wrap md:overflow-visible md:pb-0">
            {ALL_SUPPORTED_LANGUAGES
              .filter(l => l.code !== (typeof window !== 'undefined' ? localStorage.getItem('native-language') : 'en'))
              .filter(l => (l.code as string) !== 'en-IN')
              .slice(0, 8)
              .map((l) => (
              <Link key={l.code} href={`/talk?lang=${l.code}`} className="snap-start shrink-0">
                <motion.button
                  className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-300 text-xs md:text-sm hover:bg-slate-800 hover:border-slate-600 hover:text-white transition-all whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="text-base md:text-lg">{l.flag}</span>
                  {l.name}
                </motion.button>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* ── SECTION 4: Featured Courses (Recommended + Premium + Free) ── */}
        <FeaturedCourses interests={userInterests} />
      </motion.div>
    </div>
  );
}
