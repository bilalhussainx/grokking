"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Circle, MessageSquare, ClipboardList, Building2, BookOpen, Target, FileEdit } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SetupStatus {
  hasMetCoach: boolean;
  hasIntakeCompleted: boolean;
  hasSchools: boolean;
  hasPersonalStatement: boolean;
  hasActivities: boolean;
  hasSupplementsStarted: boolean;
}

interface Step {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  done: boolean;
  cta: string;
  action: { type: "link"; href: string } | { type: "openCoach" };
}

interface OnboardingChecklistProps {
  status: SetupStatus;
  firstName: string | null;
  onOpenCoach: () => void;
}

export default function OnboardingChecklist({ status, firstName, onOpenCoach }: OnboardingChecklistProps) {
  const steps: Step[] = [
    {
      id: "meet-coach",
      title: "Meet Coach Kairos",
      description: "Your AI college counselor. Ask anything — essays, schools, strategy. Start here.",
      icon: MessageSquare,
      done: status.hasMetCoach,
      cta: "Start chat",
      action: { type: "openCoach" },
    },
    {
      id: "intake",
      title: "Tell us about you",
      description: "A quick profile so every suggestion is personalized to your grades, goals, and background.",
      icon: ClipboardList,
      done: status.hasIntakeCompleted,
      cta: "Complete intake",
      action: { type: "link", href: "/intake" },
    },
    {
      id: "schools",
      title: "Build your school list",
      description: "Add your target schools. We'll calculate chancing and surface each school's supplements.",
      icon: Building2,
      done: status.hasSchools,
      cta: "Add schools",
      action: { type: "link", href: "/schools" },
    },
    {
      id: "personal-statement",
      title: "Draft your personal statement",
      description: "The Common App essay. Coach walks you through brainstorm → outline → draft → review.",
      icon: BookOpen,
      done: status.hasPersonalStatement,
      cta: "Open Essay Studio",
      action: { type: "link", href: "/cc/essays" },
    },
    {
      id: "activities",
      title: "Log your activities",
      description: "Your Common App activities list. We score impact and suggest rewrites.",
      icon: Target,
      done: status.hasActivities,
      cta: "Add activities",
      action: { type: "link", href: "/cc/activities-optimizer" },
    },
    {
      id: "supplements",
      title: "Tackle school supplements",
      description: "School-specific essays. Coach tailors brainstorms to each school's mission.",
      icon: FileEdit,
      done: status.hasSupplementsStarted,
      cta: "Start supplements",
      action: { type: "link", href: "/cc/essays" },
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const totalCount = steps.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);
  const nextStep = steps.find((s) => !s.done) || null;

  return (
    <div className="space-y-6">
      <header>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-[#D4AF37]">
            Getting started
          </span>
          <span className="text-[10px] text-white/30 tabular-nums">
            {completedCount}/{totalCount}
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
          {completedCount === 0
            ? `Let's set up your application${firstName ? `, ${firstName}` : ""}.`
            : `Great start${firstName ? `, ${firstName}` : ""}. Keep going.`}
        </h2>
        <p className="text-sm text-white/50">
          {nextStep
            ? `Next up: ${nextStep.title.toLowerCase()}.`
            : "You've completed setup. Your counselor dashboard is ready."}
        </p>
      </header>

      <div className="h-1 w-full bg-white/[0.06] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <div className="space-y-3">
        {steps.map((step, idx) => {
          const isNext = nextStep?.id === step.id;
          const Icon = step.icon;

          const inner = (
            <div
              className={`relative rounded-2xl border transition-all ${
                step.done
                  ? "border-white/5 bg-white/[0.015] opacity-60"
                  : isNext
                  ? "border-[#D4AF37]/40 bg-gradient-to-br from-[#1a1610] via-[#141414] to-[#141414] shadow-[0_0_0_1px_rgba(212,175,55,0.08)]"
                  : "border-white/10 bg-[#141414] hover:border-white/20"
              }`}
            >
              {isNext && (
                <div className="absolute -top-2 left-5 px-2 py-0.5 rounded-full bg-[#D4AF37] text-black text-[9px] font-bold uppercase tracking-wider">
                  Next step
                </div>
              )}
              <div className="p-5 flex items-start gap-4">
                <div
                  className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                    step.done
                      ? "bg-white/[0.03] text-white/30"
                      : isNext
                      ? "bg-[#D4AF37]/15 text-[#D4AF37]"
                      : "bg-white/[0.03] text-white/50"
                  }`}
                >
                  {step.done ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] tabular-nums ${
                        step.done ? "text-white/25" : "text-white/40"
                      }`}
                    >
                      Step {idx + 1}
                    </span>
                    {step.done && (
                      <span className="text-[10px] uppercase tracking-wider text-[#D4AF37]/70">
                        Done
                      </span>
                    )}
                  </div>
                  <h3
                    className={`text-base font-semibold mb-1 ${
                      step.done ? "text-white/50 line-through decoration-white/20" : "text-white"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`text-xs leading-relaxed ${
                      step.done ? "text-white/30" : "text-white/55"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
                {!step.done && (
                  <div
                    className={`shrink-0 flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                      isNext ? "text-[#D4AF37]" : "text-white/50"
                    }`}
                  >
                    <span className="hidden sm:inline">{step.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
                {step.done && <Circle className="w-4 h-4 text-[#D4AF37]/50 shrink-0 fill-[#D4AF37]/20" />}
              </div>
            </div>
          );

          if (step.done) {
            return <div key={step.id}>{inner}</div>;
          }

          if (step.action.type === "openCoach") {
            return (
              <button
                key={step.id}
                onClick={onOpenCoach}
                className="w-full text-left block focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 rounded-2xl"
              >
                {inner}
              </button>
            );
          }

          return (
            <Link key={step.id} href={step.action.href} className="block focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 rounded-2xl">
              {inner}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
