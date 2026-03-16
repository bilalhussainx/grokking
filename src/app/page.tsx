"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mic, BookOpen, ArrowRight, Sparkles, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { courses } from "@/data";
import { getFeaturedCourses } from "@/data/types";
import { ALL_SUPPORTED_LANGUAGES } from "@/lib/voice-provider-router";
import WelcomeWizard from "@/components/onboarding/WelcomeWizard";
import LearningStats from "@/components/gamification/LearningStats";
import { useCourseProgress } from "@/hooks/useCourseProgress";
import ProgressRing from "@/components/ui/ProgressRing";
import ForgettingAlert from "@/components/gamification/ForgettingAlert";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};
const item = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

// Map onboarding interest IDs to course domain tags
const INTEREST_TO_DOMAIN: Record<string, string[]> = {
  coding: ['computer science', 'programming'],
  'ai-ml': ['computer science', 'ai', 'machine learning'],
  'system-design': ['computer science', 'system design'],
  'interview-prep': ['computer science', 'interview'],
  finance: ['finance', 'business'],
  languages: ['language'],
  religion: ['religious studies', 'philosophy'],
  'personal-growth': ['health', 'wellness', 'leadership', 'philosophy'],
};

function FeaturedCourses() {
  const featured = getFeaturedCourses(courses);
  if (featured.length === 0) return null;

  // Get user's interests from localStorage for personalized sorting
  const userInterests = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('learning-interests') || '[]')
    : [];

  // Build domain relevance set from user interests
  const relevantDomains = new Set<string>();
  userInterests.forEach((interest: string) => {
    (INTEREST_TO_DOMAIN[interest] || []).forEach(d => relevantDomains.add(d));
  });

  // Sort: relevant courses first, then alphabetically
  const sortedFeatured = [...featured].sort((a, b) => {
    const aRelevant = a.domain && relevantDomains.has(a.domain) ? 1 : 0;
    const bRelevant = b.domain && relevantDomains.has(b.domain) ? 1 : 0;
    if (bRelevant !== aRelevant) return bRelevant - aRelevant;
    return 0;
  });

  // Separate recommended (matching interests) from the rest
  const recommended = relevantDomains.size > 0
    ? sortedFeatured.filter(c => c.domain && relevantDomains.has(c.domain))
    : [];
  const nonRecommended = relevantDomains.size > 0
    ? sortedFeatured.filter(c => !c.domain || !relevantDomains.has(c.domain))
    : sortedFeatured;

  const premium = nonRecommended.filter(c => c.tier === 'pro');
  const free = nonRecommended.filter(c => c.tier === 'free');

  return (
    <motion.div variants={item} className="mb-16">
      {/* Recommended for You — personalized based on onboarding interests */}
      {recommended.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            Recommended for You
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommended.map((course) => (
              <Link key={course.id} href={`/course/${course.slug}`}>
                <motion.div
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-500/5 via-slate-800/80 to-slate-900/80 border border-violet-500/20 p-5 cursor-pointer h-full hover:border-violet-500/40 transition-all"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 text-xs font-semibold border border-violet-500/20">
                    {course.tier === 'pro' ? 'Premium' : 'Free'}
                  </div>
                  <div className="text-3xl mb-3">{course.icon}</div>
                  <h4 className="text-white font-semibold">{course.title}</h4>
                  <p className="text-slate-400 text-sm mt-1 line-clamp-2">{course.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    {course.domain && (
                      <span className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 text-xs">
                        {course.domain.replace(/-/g, ' ')}
                      </span>
                    )}
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Premium Courses */}
      {premium.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            Premium Courses
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {premium.map((course) => (
              <Link key={course.id} href={`/course/${course.slug}`}>
                <motion.div
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-yellow-500/5 via-slate-800/80 to-slate-900/80 border border-yellow-500/20 p-5 cursor-pointer h-full hover:border-yellow-500/40 transition-all"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 text-xs font-semibold border border-yellow-500/20">
                    Premium
                  </div>
                  <div className="text-3xl mb-3">{course.icon}</div>
                  <h4 className="text-white font-semibold">{course.title}</h4>
                  <p className="text-slate-400 text-sm mt-1 line-clamp-2">{course.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    {course.domain && (
                      <span className="px-2 py-0.5 rounded bg-slate-700/50 text-slate-400 text-xs">
                        {course.domain.replace(/-/g, ' ')}
                      </span>
                    )}
                    {course.level && (
                      <span className="px-2 py-0.5 rounded bg-slate-700/50 text-slate-400 text-xs">
                        {course.level}
                      </span>
                    )}
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Free Featured Courses */}
      {free.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Featured — Free
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {free.map((course) => (
              <Link key={course.id} href={`/course/${course.slug}`}>
                <motion.div
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500/5 via-slate-800/80 to-slate-900/80 border border-emerald-500/20 p-5 cursor-pointer h-full hover:border-emerald-500/40 transition-all"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-medium">
                    Free
                  </div>
                  <div className="text-3xl mb-3">{course.icon}</div>
                  <h4 className="text-white font-semibold">{course.title}</h4>
                  <p className="text-slate-400 text-sm mt-1 line-clamp-2">{course.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    {course.domain && (
                      <span className="px-2 py-0.5 rounded bg-slate-700/50 text-slate-400 text-xs">
                        {course.domain.replace(/-/g, ' ')}
                      </span>
                    )}
                    {course.level && (
                      <span className="px-2 py-0.5 rounded bg-slate-700/50 text-slate-400 text-xs">
                        {course.level}
                      </span>
                    )}
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function HomePage() {
  const { user, profile } = useAuth();
  const [showWizard, setShowWizard] = useState(false);
  const courseProgress = useCourseProgress();

  // Get courses user has started (progress > 0, not 100%)
  const inProgressCourses = courses
    .filter((c) => {
      const p = courseProgress[c.slug];
      return p && p > 0 && p < 100;
    })
    .slice(0, 4);

  useEffect(() => {
    if (user && !localStorage.getItem("onboarding_complete")) {
      // Check if the new onboarding has been completed
      fetch('/api/user/preferences')
        .then(r => r.ok ? r.json() : null)
        .then(prefs => {
          if (prefs?.onboarding_completed) {
            // Sync to localStorage
            localStorage.setItem('onboarding_complete', 'true');
            if (prefs.native_language) localStorage.setItem('native-language', prefs.native_language);
            if (prefs.instruction_language) localStorage.setItem('coach-language', prefs.instruction_language);
            if (prefs.learning_interests) localStorage.setItem('learning-interests', JSON.stringify(prefs.learning_interests));
          } else {
            setShowWizard(true);
          }
        })
        .catch(() => setShowWizard(true));
    }
  }, [user]);

  if (showWizard) {
    return (
      <WelcomeWizard
        userName={user?.user_metadata?.full_name?.split(" ")[0]}
        onComplete={() => setShowWizard(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <motion.div
        className="max-w-5xl mx-auto px-4 pt-16 pb-20"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Hero */}
        <motion.div variants={item} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            AI-powered learning hub
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Master Anything.
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-xl mx-auto">
            Learn languages, code, and more with AI tutors that adapt to you.
          </p>
        </motion.div>

        {/* Learning Stats + Forgetting Alert (logged-in users) */}
        {user && (
          <motion.div variants={item} className="mb-10 space-y-4">
            <LearningStats />
            <ForgettingAlert />
          </motion.div>
        )}

        {/* Two Action Cards */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
          {/* Talk Card */}
          <Link href="/talk">
            <motion.div
              className="group relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-slate-900/80 to-slate-900/80 backdrop-blur-sm p-8 cursor-pointer h-full"
              whileHover={{ scale: 1.02, borderColor: "rgba(16, 185, 129, 0.4)" }}
              transition={{ duration: 0.2 }}
            >
              {/* Glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors" />

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center mb-5">
                  <Mic className="w-7 h-7 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Talk</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Start a voice conversation with an AI tutor in any language. Practice speaking naturally with instant feedback.
                </p>
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium group-hover:gap-3 transition-all">
                  Start Talking <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Learn Card */}
          <Link href="/courses">
            <motion.div
              className="group relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 via-slate-900/80 to-slate-900/80 backdrop-blur-sm p-8 cursor-pointer h-full"
              whileHover={{ scale: 1.02, borderColor: "rgba(59, 130, 246, 0.4)" }}
              transition={{ duration: 0.2 }}
            >
              {/* Glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors" />

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center mb-5">
                  <BookOpen className="w-7 h-7 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Learn</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Structured courses in tech, languages, and finance. From beginner to advanced with AI coaching.
                </p>
                <div className="flex items-center gap-2 text-blue-400 text-sm font-medium group-hover:gap-3 transition-all">
                  Browse Courses <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Featured Courses */}
        <FeaturedCourses />

        {/* Quick Voice Practice — personalized by user's native language */}
        <motion.div variants={item} className="mb-16">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">
            Quick Voice Practice
          </h3>
          <div className="flex flex-wrap gap-3">
            {ALL_SUPPORTED_LANGUAGES
              .filter(l => l.code !== (typeof window !== 'undefined' ? localStorage.getItem('native-language') : 'en'))
              .filter(l => (l.code as string) !== 'en-IN') // Skip duplicate English-IN
              .slice(0, 8)
              .map((l) => (
              <Link key={l.code} href={`/talk?lang=${l.code}`}>
                <motion.button
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-300 text-sm hover:bg-slate-800 hover:border-slate-600 hover:text-white transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="text-lg">{l.flag}</span>
                  {l.name}
                </motion.button>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Continue Learning (logged in users with courses in progress) */}
        {user && inProgressCourses.length > 0 && (
          <motion.div variants={item}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                Continue Learning
              </h3>
              <Link href="/courses" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {inProgressCourses.map((course) => (
                <Link key={course.slug} href={`/course/${course.slug}`}>
                  <div className="rounded-xl bg-slate-800/40 border border-slate-700/40 p-4 hover:bg-slate-800/60 hover:border-slate-600/50 transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{course.icon}</span>
                      <ProgressRing progress={courseProgress[course.slug] ?? 0} size={28} strokeWidth={2} />
                    </div>
                    <div className="text-sm font-medium text-slate-200">{course.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {courseProgress[course.slug]}% complete
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
