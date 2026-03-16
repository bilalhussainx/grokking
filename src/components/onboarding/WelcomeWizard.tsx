"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, TrendingUp, Languages, Brain, Clock, Zap, Rocket, Mic, ChevronRight, Check } from "lucide-react";

interface WelcomeWizardProps {
  userName?: string;
  onComplete: () => void;
}

type Interest = "cs" | "finance" | "languages" | "personal";
type Pace = "5min" | "30min" | "1hr";

const INTERESTS = [
  { id: "cs" as const, label: "Computer Science", desc: "Coding interviews, system design, algorithms", icon: Code2, color: "blue" },
  { id: "finance" as const, label: "Finance & Business", desc: "Personal finance, investing, economics", icon: TrendingUp, color: "amber" },
  { id: "languages" as const, label: "Languages", desc: "Practice speaking with AI voice tutors", icon: Languages, color: "emerald" },
  { id: "personal" as const, label: "Personal Growth", desc: "Philosophy, mental health, leadership", icon: Brain, color: "violet" },
];

const PACES = [
  { id: "5min" as const, label: "5 min/day", desc: "Bite-sized lessons", icon: Clock },
  { id: "30min" as const, label: "30 min/day", desc: "Standard pace", icon: Zap },
  { id: "1hr" as const, label: "1+ hour/day", desc: "Intensive learning", icon: Rocket },
];

const RECOMMENDED_COURSES: Record<Interest, { slug: string; title: string; icon: string }> = {
  cs: { slug: "python-fundamentals", title: "Python Fundamentals", icon: "\u{1F40D}" },
  finance: { slug: "personal-finance", title: "Personal Finance Mastery", icon: "\u{1F4B0}" },
  languages: { slug: "spanish-beginner", title: "Spanish for Beginners", icon: "\u{1F1EA}\u{1F1F8}" },
  personal: { slug: "stoic-philosophy", title: "Stoic Philosophy", icon: "\u{1F3DB}\u{FE0F}" },
};

export default function WelcomeWizard({ userName, onComplete }: WelcomeWizardProps) {
  const [step, setStep] = useState(0);
  const [interests, setInterests] = useState<Set<Interest>>(new Set());
  const [pace, setPace] = useState<Pace | null>(null);
  const router = useRouter();

  const toggleInterest = (id: Interest) => {
    setInterests((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleFinish = () => {
    // Save preferences
    localStorage.setItem("onboarding_complete", "true");
    localStorage.setItem("learning_interests", JSON.stringify([...interests]));
    localStorage.setItem("learning_pace", pace ?? "30min");
    onComplete();

    // Navigate to recommended course
    const firstInterest = [...interests][0];
    if (firstInterest && RECOMMENDED_COURSES[firstInterest]) {
      router.push(`/course/${RECOMMENDED_COURSES[firstInterest].slug}`);
    } else {
      router.push("/courses");
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[var(--background)]">
      <div className="w-full max-w-md mx-4">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[0, 1, 2].map((i) => (
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
                <h2 className="text-2xl font-bold text-white">
                  Welcome{userName ? `, ${userName}` : ""}!
                </h2>
                <p className="text-sm text-slate-400 mt-2">
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
                          : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
                      }`}
                    >
                      {selected && (
                        <div className="absolute top-2 right-2">
                          <Check className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                      )}
                      <Icon className={`w-5 h-5 mb-2 ${selected ? "text-blue-400" : "text-slate-400"}`} />
                      <div className="text-sm font-medium text-white">{item.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
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
                <h2 className="text-2xl font-bold text-white">
                  How much time can you commit?
                </h2>
                <p className="text-sm text-slate-400 mt-2">
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
                          : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${selected ? "text-blue-400" : "text-slate-400"}`} />
                      <div>
                        <div className="text-sm font-medium text-white">{item.label}</div>
                        <div className="text-[11px] text-slate-500">{item.desc}</div>
                      </div>
                      {selected && <Check className="w-4 h-4 text-blue-400 ml-auto" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(0)}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 text-sm hover:bg-white/5 transition-colors"
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

          {/* Step 3: Voice coaching + finish */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                  <Mic className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  AI Voice Coaching
                </h2>
                <p className="text-sm text-slate-400 mt-2 max-w-xs mx-auto">
                  Practice speaking with AI tutors in 7+ languages. Enable your microphone for the full experience.
                </p>
              </div>

              {/* Recommended course */}
              {[...interests][0] && RECOMMENDED_COURSES[[...interests][0]] && (
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="text-[11px] text-slate-500 uppercase tracking-wider mb-2">Recommended for you</div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{RECOMMENDED_COURSES[[...interests][0]].icon}</span>
                    <div>
                      <div className="text-sm font-medium text-white">{RECOMMENDED_COURSES[[...interests][0]].title}</div>
                      <div className="text-[11px] text-slate-500">Start your learning journey</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 text-sm hover:bg-white/5 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleFinish}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 text-white font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  Start Learning
                  <Rocket className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => {
                  localStorage.setItem("onboarding_complete", "true");
                  onComplete();
                }}
                className="w-full text-center text-xs text-slate-600 hover:text-slate-400 transition-colors"
              >
                Skip for now
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
