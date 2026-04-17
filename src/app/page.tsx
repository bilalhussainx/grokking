"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Mic, BookOpen, ArrowRight, Sparkles, Star, Target, Users, Building2, MessageSquare, Map, Code2, Globe, GraduationCap, Zap, Shield, Brain, Server, Clock, Trophy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAI } from "@/contexts/AIContext";
import { useXP } from "@/contexts/XPContext";
import { courses } from "@/data";
import { getAllLanguageCourses } from "@/data/languages";
import { pathways } from "@/data/pathways";
import type { Course } from "@/data/types";
import { ALL_SUPPORTED_LANGUAGES } from "@/lib/voice-provider-router";
import { useRouter } from "next/navigation";
import LearningStats from "@/components/gamification/LearningStats";
import DailyMissions from "@/components/gamification/DailyMissions";
import StreakCalendar from "@/components/gamification/StreakCalendar";
import AchievementsShowcase from "@/components/gamification/AchievementsShowcase";
import { useCourseProgress } from "@/hooks/useCourseProgress";
import ProgressRing from "@/components/ui/ProgressRing";
import ForgettingAlert from "@/components/gamification/ForgettingAlert";
import VariableReward from "@/components/gamification/VariableReward";
import WelcomeModal from "@/components/onboarding/WelcomeModal";
import { getDailyLoginReward } from "@/lib/rewards";
import KairosLogo from "@/components/ui/SamsaraLogo";


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

export default function HomePage() {
  const { user, profile, credits, loading } = useAuth();
  const { earnXP, showXPFlyUp, lastXPAmount, pendingReward, dismissReward } = useXP();
  const { openPanel } = useAI();
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
          // Onboarding not completed — redirect to onboarding with the
          // ?new=1 flag so the onboarding page clears stale localStorage
          // and renders the form fresh. (Bug fix 2026-04-07: without the
          // flag, an unfinished onboarding could loop if localStorage and
          // DB disagreed.)
          router.push('/onboarding?new=1');
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

      {/* First-time welcome modal */}
      {user && <WelcomeModal userName={profile?.full_name} />}

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
              : "bg-white/10 border-white/20 text-[#D4AF37]"
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
        {/* ====================================================================
            NON-LOGGED-IN EXPERIENCE — COLLEGE COUNSELOR FIRST
            ==================================================================== */}
        {!user && !loading && (
          <>
            {/* ── SECTION 1: HERO — College Counselor ── */}
            <motion.div variants={item} className="relative text-center mb-20 pt-8">
              <div
                className="absolute -z-20 inset-0 h-[600px] w-full opacity-30
                bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)]
                bg-[size:4rem_4rem]
                [mask-image:radial-gradient(ellipse_80%_60%_at_50%_20%,#000_40%,transparent_100%)]"
              />
              <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                <motion.div
                  className="absolute top-0 left-1/4 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-[120px]"
                  animate={{ x: [0, 40, -10, 0], y: [0, -30, 10, 0], scale: [1, 1.2, 0.95, 1] }}
                  transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute top-10 right-1/4 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-[120px]"
                  animate={{ x: [0, -35, 15, 0], y: [0, 30, -15, 0], scale: [1, 1.15, 1.05, 1] }}
                  transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>

              <motion.div
                className="flex justify-center mb-8"
                initial={{ scale: 0.3, opacity: 0, filter: "blur(20px)" }}
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <KairosLogo size="xl" showText={false} />
              </motion.div>

              <motion.div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 text-[#D4AF37] text-xs font-medium mb-6"
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Free for every student &middot; No credit card &middot; Speaks your language
              </motion.div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]">
                <BlurReveal
                  text="Your free AI"
                  className="text-white"
                  delay={0.3}
                />
                <br />
                <span className="inline-block">
                  <BlurReveal
                    text="college counselor."
                    className="italic text-[#D4AF37]"
                    delay={0.6}
                  />
                </span>
              </h1>

              <motion.p
                className="mt-6 text-lg sm:text-xl text-white/55 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
              >
                For <strong className="text-white/80">first-gen students</strong>. Build your school list, write winning essays, navigate financial aid, and practice interviews — all with an AI that speaks <strong className="text-white/80">your language</strong>.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.65, ease: [0.25, 0.4, 0.25, 1] }}
              >
                <Link
                  href="/signup"
                  className="group w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#D4AF37] text-black font-semibold text-base hover:bg-[#C4A030] transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                >
                  <GraduationCap className="w-4 h-4" />
                  Start your free plan
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </motion.div>
            </motion.div>

            {/* ── SECTION 2: THREE PERSONA TESTIMONIALS ── */}
            <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20" delay={0.1}>
              {[
                {
                  name: "Maria",
                  emoji: "🇲🇽",
                  label: "First-gen, Spanish-speaking family",
                  quote: "My parents don't speak English, so nobody at home could explain what FAFSA even means. Coach Kairos walked me through everything — in Spanish for my mom, in English for me. I applied to 12 schools and got into 4.",
                  stat: "12 schools applied",
                },
                {
                  name: "Jamal",
                  emoji: "🎓",
                  label: "Low-income, no college-educated relatives",
                  quote: "I didn't even know you could negotiate financial aid. Kairos helped me compare award letters, draft an appeal, and save $8,000/year. None of my family had been through this before.",
                  stat: "$8K saved in aid",
                },
                {
                  name: "Priya",
                  emoji: "🇮🇳",
                  label: "International student from India",
                  quote: "The US application process is totally different from India. Kairos explained Common App, helped me find need-blind schools for internationals, and prepped me for my MIT interview.",
                  stat: "Need-blind schools found",
                },
              ].map((persona) => (
                <motion.div
                  key={persona.name}
                  variants={staggerChild}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#141414] p-7"
                  whileHover={{ scale: 1.02, borderColor: "rgba(212, 175, 55, 0.4)", y: -4 }}
                  transition={springSnappy}
                >
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#D4AF37]/5 rounded-full blur-3xl group-hover:bg-[#D4AF37]/10 transition-colors" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{persona.emoji}</span>
                      <div>
                        <p className="text-white font-semibold">{persona.name}</p>
                        <p className="text-white/40 text-xs">{persona.label}</p>
                      </div>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed mb-4">&ldquo;{persona.quote}&rdquo;</p>
                    <span className="inline-block px-2.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-medium">
                      {persona.stat}
                    </span>
                  </div>
                </motion.div>
              ))}
            </StaggerReveal>

            {/* ── SECTION 3: WHAT COACH KAIROS DOES ── */}
            <ScrollReveal className="mb-20" delay={0.1} direction="up">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Everything a $10,000 counselor does. Free.
                </h2>
                <p className="mt-2 text-sm sm:text-base text-white/50 max-w-xl mx-auto">
                  Coach Kairos guides you from &ldquo;I have no idea where to start&rdquo; through &ldquo;I got in.&rdquo;
                </p>
              </div>
              <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" delay={0.15}>
                {[
                  { icon: MessageSquare, label: "Voice Intake", desc: "Tell Kairos about yourself in a 5-minute conversation — type or speak" },
                  { icon: Building2, label: "School List Builder", desc: "AI-generated reach/match/safety list based on your profile and goals" },
                  { icon: BookOpen, label: "Essay Studio", desc: "Brainstorm, outline, and polish your essays — Kairos coaches, never writes for you" },
                  { icon: Shield, label: "Financial Aid Navigator", desc: "FAFSA walkthrough, CSS Profile help, and scholarship matching" },
                  { icon: Users, label: "Interview Prep", desc: "Practice with AI personas trained on real Harvard, Yale, and Stanford interviews" },
                  { icon: Globe, label: "In Your Language", desc: "Speaks Spanish, Hindi, Mandarin, and more — for you and your parents" },
                ].map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={feature.label}
                      variants={staggerChild}
                      className="bg-[#141414] border border-white/10 hover:border-[#D4AF37]/40 rounded-2xl p-5 transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center mb-3">
                        <Icon className="w-5 h-5 text-[#D4AF37]" />
                      </div>
                      <h4 className="text-white font-semibold mb-1">{feature.label}</h4>
                      <p className="text-slate-400 text-xs leading-relaxed">{feature.desc}</p>
                    </motion.div>
                  );
                })}
              </StaggerReveal>
            </ScrollReveal>

            {/* ── SECTION 4: SOCIAL PROOF NUMBERS ── */}
            <ScrollReveal className="mb-20" direction="scale">
              <div className="rounded-2xl border border-white/10 bg-[#141414] p-8">
                <StaggerReveal className="grid grid-cols-2 md:grid-cols-4 gap-8" delay={0.1}>
                  {[
                    { value: "550+", label: "Schools in Database", icon: Building2 },
                    { value: "17", label: "Languages Supported", icon: Globe },
                    { value: "200+", label: "Terms Explained", icon: BookOpen },
                    { value: "$0", label: "Cost to Students", icon: GraduationCap },
                  ].map((stat) => {
                    const StatIcon = stat.icon;
                    return (
                      <motion.div key={stat.label} variants={staggerChild} className="text-center">
                        <StatIcon className="w-5 h-5 text-white/20 mx-auto mb-2" />
                        <div className="text-3xl sm:text-4xl font-bold text-white">{stat.value}</div>
                        <div className="text-xs text-white/40 mt-1 font-medium">{stat.label}</div>
                      </motion.div>
                    );
                  })}
                </StaggerReveal>
              </div>
            </ScrollReveal>

            {/* ── SECTION 5: SUPPLEMENTAL LEARNING (de-emphasized) ── */}
            <ScrollReveal className="mb-20" delay={0.1}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white/70">Supplemental Learning</h2>
                  <p className="mt-1 text-xs text-white/40">AP courses, coding, and more to strengthen your application</p>
                </div>
                <Link
                  href="/courses"
                  className="text-sm text-[#D4AF37] hover:text-[#C4A030] font-medium flex items-center gap-1 transition-colors"
                >
                  All courses <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {["coding-interview", "python-fundamentals", "react-development"].map((slug) => {
                  const course = courses.find(c => c.slug === slug);
                  if (!course) return null;
                  return (
                    <Link key={course.slug} href={`/course/${course.slug}`}>
                      <motion.div
                        className="group rounded-xl bg-[#141414] border border-white/10 hover:border-[#D4AF37]/40 p-5 h-full cursor-pointer transition-all"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-3xl">{course.icon}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${course.tier === 'pro' ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20' : 'border-white/20 text-white/70'}`}>
                            {course.tier === 'pro' ? 'PRO' : 'FREE'}
                          </span>
                        </div>
                        <h4 className="text-white font-semibold">{course.title}</h4>
                        <p className="text-slate-400 text-sm mt-1 line-clamp-2">{course.description}</p>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </ScrollReveal>

            {/* ── SECTION 6: FINAL CTA ── */}
            <ScrollReveal className="mb-16" direction="scale">
              <div className="relative rounded-2xl border border-white/10 bg-[#141414] p-10 text-center overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                  <motion.div
                    className="absolute top-0 left-1/4 w-40 h-40 bg-[#D4AF37]/8 rounded-full blur-[80px]"
                    animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="absolute bottom-0 right-1/4 w-40 h-40 bg-[#D4AF37]/5 rounded-full blur-[80px]"
                    animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                <div className="relative z-10">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                    You deserve the same guidance as a prep-school kid.
                  </h2>
                  <p className="text-white/50 text-sm sm:text-base max-w-md mx-auto mb-8">
                    Start free. No credit card. Coach Kairos is here whenever you need help — in your language.
                  </p>
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#D4AF37] text-black font-semibold text-base hover:bg-[#C4A030] transition-all hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <GraduationCap className="w-5 h-5" />
                    Start your free plan
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </>
        )}

        {/* ====================================================================
            LOGGED-IN EXPERIENCE
            ==================================================================== */}

        {/* Hero for logged-in users */}
        {user && (
          <motion.div variants={item} className="relative text-center mb-12 pt-4">
            {/* Subtle grid bg for logged-in too */}
            <div
              className="absolute -z-10 inset-0 h-[400px] w-full opacity-15
              bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)]
              bg-[size:4rem_4rem]
              [mask-image:radial-gradient(ellipse_70%_50%_at_50%_20%,#000_30%,transparent_100%)]"
            />
            <motion.div
              className="flex justify-center mb-6"
              initial={{ scale: 0.5, opacity: 0, filter: "blur(12px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <KairosLogo size="xl" showText={false} />
            </motion.div>
            <motion.h1
              className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-[1.2] mb-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
            </motion.h1>
            <motion.p
              className="text-base text-white/50 max-w-xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              Practice interviews, talk with AI tutors, or continue your learning path.
            </motion.p>

            {/* Quick action row — staggered entrance */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-3"
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.4 } } }}
            >
              {[
                { href: "/college-interviews", icon: GraduationCap, label: "College Interview", style: "bg-[#D4AF37] text-black font-semibold" },
                { href: "/interviews", icon: Target, label: "Tech Interview", style: "border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/10" },
                { href: "/talk", icon: Mic, label: "Voice Tutoring", style: "border border-white/20 text-white hover:border-[#D4AF37]/50 hover:bg-white/5" },
                { href: "/history", icon: Clock, label: "Your Sessions", style: "border border-white/20 text-white/60 hover:border-[#D4AF37]/50 hover:bg-white/5" },
                { href: "/leaderboard", icon: Trophy, label: "Leaderboard", style: "border border-white/20 text-white/60 hover:border-[#D4AF37]/50 hover:bg-white/5" },
                { href: "/courses", icon: BookOpen, label: "All Courses", style: "border border-white/20 text-white/60 hover:border-[#D4AF37]/50 hover:bg-white/5" },
              ].map((action) => {
                const ActionIcon = action.icon;
                return (
                  <motion.div
                    key={action.label}
                    variants={{ hidden: { opacity: 0, y: 12, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1 } }}
                  >
                    <Link
                      href={action.href}
                      className={`group px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 ${action.style}`}
                    >
                      <ActionIcon className="w-4 h-4" />
                      {action.label}
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div variants={{ hidden: { opacity: 0, y: 12, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1 } }}>
                <button
                  onClick={() => openPanel()}
                  className="group px-5 py-2.5 rounded-xl border border-[#D4AF37]/30 text-[#D4AF37] text-sm font-semibold hover:bg-[#D4AF37]/10 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat with Coach Kairos
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

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

        {/* Daily Missions + Streak Calendar + Achievements — retention hooks
            (per audit 2026-04-07) */}
        {user && (
          <motion.div variants={item} className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <DailyMissions />
            </div>
            <div className="space-y-4">
              <StreakCalendar />
              <AchievementsShowcase />
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
                  You&#39;re on a free 1-month Pro trial
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

        {/* ── LOGGED-IN SECTION 2: Interview Coaches (HERO) ── */}
        {user && (
          <motion.div variants={item} className="mb-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 text-[#D4AF37] text-xs font-medium mb-4">
                <Target className="w-3.5 h-3.5" />
                AI-Powered Practice
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Your Interview Coaches
              </h2>
              <p className="text-base text-white/50 max-w-xl mx-auto">
                Pick a role and start practicing. The AI adapts to your level in real time.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Globe, label: "Frontend Engineer", desc: "React, CSS, DOM, accessibility, and UI architecture questions." },
                { icon: Server, label: "Backend Engineer", desc: "APIs, databases, auth, caching, and server-side architecture." },
                { icon: Code2, label: "Full Stack Developer", desc: "End-to-end system questions spanning frontend and backend." },
                { icon: Building2, label: "System Design", desc: "Whiteboard-style architecture rounds for senior roles." },
                { icon: Users, label: "Recruiter Screen", desc: "15-minute phone screens: tell me about yourself, why this role, salary." },
                { icon: MessageSquare, label: "Behavioral", desc: "STAR method practice: leadership, conflict, failure, teamwork." },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <Link key={card.label} href="/interviews">
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
                        Start Interview <ArrowRight className="w-4 h-4" />
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── LOGGED-IN SECTION 3: Quick Voice Practice (compact) ── */}
        {user && (
          <motion.div variants={item} className="mb-10">
            <div className="space-y-3">
              <Link href="/talk">
                <motion.div
                  className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl border border-white/20 text-white hover:border-[#D4AF37]/50 hover:bg-white/5 font-medium text-sm transition-all cursor-pointer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Mic className="w-4 h-4" />
                  Voice Practice
                </motion.div>
              </Link>
              <div className="flex flex-wrap gap-2">
                {ALL_SUPPORTED_LANGUAGES
                  .filter(l => l.code !== (typeof window !== 'undefined' ? localStorage.getItem('native-language') : 'en'))
                  .filter(l => (l.code as string) !== 'en-IN')
                  .slice(0, 8)
                  .map((l) => (
                  <Link key={l.code} href={`/talk?lang=${l.code}`}>
                    <motion.button
                      className="flex items-center gap-1.5 px-3 py-2.5 min-h-[44px] rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-300 text-xs hover:bg-slate-800 hover:border-slate-600 hover:text-white transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span className="text-sm">{l.flag}</span>
                      {l.name}
                    </motion.button>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── LOGGED-IN SECTION 4: Career Pathways ── */}
        {user && (
          <motion.div variants={item} className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Map className="w-3.5 h-3.5 text-[#D4AF37]" />
                Career Pathways
              </h3>
              <Link href="/pathways" className="text-xs text-[#D4AF37] hover:text-[#C4A030] transition-colors flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {pathways.slice(0, 6).map((pathway) => {
                const pathwayCourseProgress = pathway.courses.reduce((acc, slug) => {
                  const p = courseProgress[slug];
                  return acc + (p && p > 0 ? p : 0);
                }, 0);
                const avgProgress = pathway.courses.length > 0
                  ? Math.round(pathwayCourseProgress / pathway.courses.length)
                  : 0;
                const hasStarted = avgProgress > 0;
                return (
                  <Link key={pathway.slug} href={`/pathways/${pathway.slug}`}>
                    <motion.div
                      className="rounded-xl bg-[#141414] border border-white/10 hover:border-[#D4AF37]/40 p-4 cursor-pointer h-full transition-all"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-2xl">{pathway.icon}</span>
                        {hasStarted && (
                          <span className="text-xs font-medium text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-full">
                            {avgProgress}%
                          </span>
                        )}
                      </div>
                      <h4 className="text-white text-sm font-semibold mb-1">{pathway.title}</h4>
                      <p className="text-slate-500 text-xs line-clamp-2">{pathway.description}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-xs text-slate-600">{pathway.courses.length} courses</span>
                        <span className="text-slate-700">-</span>
                        <span className="text-xs text-slate-600">{pathway.estimatedWeeks} weeks</span>
                      </div>
                      {hasStarted && (
                        <div className="w-full h-1 bg-slate-700/50 rounded-full overflow-hidden mt-2">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${pathway.color}`}
                            style={{ width: `${avgProgress}%` }}
                          />
                        </div>
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── LOGGED-IN SECTION 5: Continue Learning ── */}
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
                const encouragement = progress >= 75 ? "Almost there!" : progress >= 50 ? "Halfway done!" : progress >= 25 ? "Great start!" : "Keep going!";
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
}
