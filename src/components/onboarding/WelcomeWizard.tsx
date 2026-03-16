"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2, TrendingUp, Languages, Brain,
  Clock, Zap, Rocket, Mic, Search, GraduationCap, Keyboard,
  ChevronRight, Check, ArrowRight,
} from "lucide-react";
import { courses } from "@/data";

interface WelcomeWizardProps {
  userName?: string;
  onComplete: () => void;
}

type Interest = "cs" | "finance" | "languages" | "personal";
type Pace = "5min" | "30min" | "1hr";

const INTERESTS = [
  { id: "cs" as const, label: "Computer Science", desc: "Coding interviews, system design, algorithms", icon: Code2 },
  { id: "finance" as const, label: "Finance & Business", desc: "Personal finance, investing, economics", icon: TrendingUp },
  { id: "languages" as const, label: "Languages", desc: "Practice speaking with AI voice tutors", icon: Languages },
  { id: "personal" as const, label: "Personal Growth", desc: "Philosophy, mental health, leadership", icon: Brain },
];

const PACES = [
  { id: "5min" as const, label: "5 min/day", desc: "Bite-sized lessons", icon: Clock },
  { id: "30min" as const, label: "30 min/day", desc: "Standard pace", icon: Zap },
  { id: "1hr" as const, label: "1+ hour/day", desc: "Intensive learning", icon: Rocket },
];

// Map interests to actual course domains for smart matching
const INTEREST_DOMAINS: Record<Interest, string[]> = {
  cs: ["computer-science", "cs"],
  finance: ["finance-business"],
  languages: [], // handled separately via /talk
  personal: ["philosophy", "health-wellness", "religious-studies"],
};

const AI_FEATURES = [
  {
    icon: Search,
    title: "Search anything",
    desc: "Press Ctrl+K to instantly find courses, lessons, or topics",
    color: "text-blue-400",
  },
  {
    icon: GraduationCap,
    title: "Coach Alex",
    desc: "Click the Coach button on any lesson for AI hints, explanations, and code help",
    color: "text-violet-400",
  },
  {
    icon: Mic,
    title: "Voice practice",
    desc: "Click \"Talk\" in the top nav to start a voice conversation in 7+ languages",
    color: "text-emerald-400",
  },
  {
    icon: Keyboard,
    title: "Keyboard shortcuts",
    desc: "N = next lesson, P = previous, H = hints, ? = all shortcuts",
    color: "text-amber-400",
  },
];

function getRecommendedCourses(selectedInterests: Set<Interest>) {
  const recommended: { slug: string; title: string; icon: string; reason: string }[] = [];

  for (const interest of selectedInterests) {
    if (interest === "languages") {
      // Language learners should go to the Talk page
      recommended.push({
        slug: "__talk__",
        title: "Start a Voice Conversation",
        icon: "\u{1F3A4}",
        reason: "Practice speaking with AI tutors",
      });
      continue;
    }

    const domains = INTEREST_DOMAINS[interest];
    const matching = courses.filter(
      (c) => domains.some((d) => c.domain === d) || (!c.domain && interest === "cs")
    );

    // Pick beginner-level or free courses first
    const sorted = matching.sort((a, b) => {
      if (a.level === "beginner" && b.level !== "beginner") return -1;
      if (a.tier === "free" && b.tier !== "free") return -1;
      return 0;
    });

    const pick = sorted[0];
    if (pick && !recommended.some((r) => r.slug === pick.slug)) {
      const reasons: Record<Interest, string> = {
        cs: "Great starting point for coding",
        finance: "Build financial literacy",
        personal: "Start your personal growth journey",
        languages: "",
      };
      recommended.push({
        slug: pick.slug,
        title: pick.title,
        icon: pick.icon,
        reason: reasons[interest],
      });
    }
  }

  return recommended.slice(0, 3);
}

export default function WelcomeWizard({ userName, onComplete }: WelcomeWizardProps) {
  const [step, setStep] = useState(0);
  const [interests, setInterests] = useState<Set<Interest>>(new Set());
  const [pace, setPace] = useState<Pace | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const router = useRouter();

  const toggleInterest = (id: Interest) => {
    setInterests((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const recommended = getRecommendedCourses(interests);

  const handleFinish = () => {
    // Save preferences
    localStorage.setItem("onboarding_complete", "true");
    localStorage.setItem("learning_interests", JSON.stringify([...interests]));
    localStorage.setItem("learning_pace", pace ?? "30min");

    // Navigate FIRST, then complete (so component doesn't unmount before navigation)
    const target = selectedCourse || recommended[0]?.slug;
    if (target === "__talk__") {
      router.push("/talk");
    } else if (target) {
      router.push(`/course/${target}`);
    } else {
      router.push("/courses");
    }

    // Delay onComplete so router.push has time to start
    setTimeout(() => onComplete(), 100);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[var(--background)]">
      <div className="w-full max-w-md mx-4">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step
                  ? "w-8 bg-blue-500"
                  : i < step
                    ? "w-1.5 bg-blue-500/50"
                    : "w-1.5 bg-white/10"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: What do you want to learn? */}
          {step === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-[var(--foreground)]">
                  Welcome{userName ? `, ${userName}` : ""}!
                </h2>
                <p className="text-sm text-[var(--muted-foreground)] mt-2">
                  What would you like to learn?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {INTERESTS.map((item) => {
                  const Icon = item.icon;
                  const selected = interests.has(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleInterest(item.id)}
                      className={`relative rounded-xl border p-4 text-left transition-all ${
                        selected
                          ? "border-blue-500/40 bg-blue-500/10"
                          : "border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-hover)]"
                      }`}
                    >
                      {selected && (
                        <div className="absolute top-2 right-2">
                          <Check className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                      )}
                      <Icon className={`w-5 h-5 mb-2 ${selected ? "text-blue-400" : "text-[var(--muted-foreground)]"}`} />
                      <div className="text-sm font-medium text-[var(--foreground)]">{item.label}</div>
                      <div className="text-[11px] text-[var(--muted-foreground)] mt-0.5">{item.desc}</div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => interests.size > 0 && setStep(1)}
                disabled={interests.size === 0}
                className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-30 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* Step 2: Learning pace */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-[var(--foreground)]">
                  How much time can you commit?
                </h2>
                <p className="text-sm text-[var(--muted-foreground)] mt-2">
                  We&apos;ll tailor your experience accordingly.
                </p>
              </div>

              <div className="space-y-3">
                {PACES.map((item) => {
                  const Icon = item.icon;
                  const selected = pace === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setPace(item.id)}
                      className={`w-full flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                        selected
                          ? "border-blue-500/40 bg-blue-500/10"
                          : "border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-hover)]"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${selected ? "text-blue-400" : "text-[var(--muted-foreground)]"}`} />
                      <div>
                        <div className="text-sm font-medium text-[var(--foreground)]">{item.label}</div>
                        <div className="text-[11px] text-[var(--muted-foreground)]">{item.desc}</div>
                      </div>
                      {selected && <Check className="w-4 h-4 text-blue-400 ml-auto" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(0)}
                  className="flex-1 py-3 rounded-xl border border-[var(--border)] text-[var(--muted-foreground)] text-sm hover:bg-[var(--card)] transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => pace && setStep(2)}
                  disabled={!pace}
                  className="flex-1 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-30 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: AI Features Tour */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-[var(--foreground)]">
                  Your AI superpowers
                </h2>
                <p className="text-sm text-[var(--muted-foreground)] mt-2">
                  Here&apos;s what makes Samsara different.
                </p>
              </div>

              <div className="space-y-3">
                {AI_FEATURES.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.title}
                      className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3.5"
                    >
                      <div className={`mt-0.5 ${feature.color}`}>
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[var(--foreground)]">{feature.title}</div>
                        <div className="text-[11px] text-[var(--muted-foreground)] mt-0.5">{feature.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-xl border border-[var(--border)] text-[var(--muted-foreground)] text-sm hover:bg-[var(--card)] transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Recommended courses + start */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-[var(--foreground)]">
                  Recommended for you
                </h2>
                <p className="text-sm text-[var(--muted-foreground)] mt-2">
                  Pick a course to start with, or browse all courses.
                </p>
              </div>

              <div className="space-y-3">
                {recommended.map((course) => {
                  const isSelected = selectedCourse === course.slug;
                  return (
                    <button
                      key={course.slug}
                      onClick={() => setSelectedCourse(course.slug)}
                      className={`w-full flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                        isSelected
                          ? "border-blue-500/40 bg-blue-500/10"
                          : "border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-hover)]"
                      }`}
                    >
                      <span className="text-2xl">{course.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-[var(--foreground)]">{course.title}</div>
                        <div className="text-[11px] text-[var(--muted-foreground)]">{course.reason}</div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-blue-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 rounded-xl border border-[var(--border)] text-[var(--muted-foreground)] text-sm hover:bg-[var(--card)] transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleFinish}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 text-white font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  Start Learning
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => {
                  localStorage.setItem("onboarding_complete", "true");
                  router.push("/courses");
                  setTimeout(() => onComplete(), 100);
                }}
                className="w-full text-center text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                Browse all courses instead
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
