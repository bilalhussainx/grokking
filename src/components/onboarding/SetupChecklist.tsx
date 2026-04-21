"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MessageSquare,
  GraduationCap,
  Building2,
  BookOpen,
  Sparkles,
  Target,
  Share2,
  ChevronRight,
  Check,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import QuickAcademicPrompt from "@/components/cc/profile/QuickAcademicPrompt";

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: typeof MessageSquare;
  checkFn: (ctx: ChecklistContext) => boolean;
  inline?: boolean;
}

interface ChecklistContext {
  hasIntakeCompleted: boolean;
  hasGPA: boolean;
  hasTestStrategy: boolean;
  profileCompletion: number;
  hasSchools: boolean;
  hasEssays: boolean;
  hasInterviewSessions: boolean;
  hasActivities: boolean;
  hasActivitiesOptimized: boolean;
  hasShareLink: boolean;
}

const STORAGE_KEY = "kairos-setup-dismissed";

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: "intake",
    label: "Chat with Coach Kairos",
    description: "A 2-minute conversation so Kairos can learn about you and personalize your experience.",
    href: "/intake",
    icon: MessageSquare,
    checkFn: (ctx) => ctx.hasIntakeCompleted,
  },
  {
    id: "academics",
    label: "Add your GPA & test scores",
    description: "Just your GPA and testing plan — 30 seconds. This is all Coach Kairos needs to start recommending schools.",
    href: "#inline",
    icon: GraduationCap,
    checkFn: (ctx) => ctx.hasGPA && ctx.hasTestStrategy,
    inline: true,
  },
  {
    id: "schools",
    label: "Build your school list",
    description: "Browse schools and get a reach/match/safety list based on your GPA and scores.",
    href: "/schools",
    icon: Building2,
    checkFn: (ctx) => ctx.hasSchools,
  },
  {
    id: "essays",
    label: "Start your first essay",
    description: "AI-guided brainstorming and drafting for personal statements and supplementals.",
    href: "/cc/essays",
    icon: BookOpen,
    checkFn: (ctx) => ctx.hasEssays,
  },
  {
    id: "activities-optimizer",
    label: "Optimize your activity list",
    description: "Run your activities through the optimizer so each bullet hits its 150-char limit with impact.",
    href: "/cc/activities-optimizer",
    icon: Sparkles,
    checkFn: (ctx) => ctx.hasActivitiesOptimized,
  },
  {
    id: "interviews",
    label: "Practice a mock interview",
    description: "Pick a school and practice with an AI alumni interviewer who knows what that school cares about.",
    href: "/college-interviews",
    icon: Target,
    checkFn: (ctx) => ctx.hasInterviewSessions,
  },
  {
    id: "share",
    label: "Share with your counselor",
    description: "Generate a link so counselors and parents can review your application materials.",
    href: "/cc/share-settings",
    icon: Share2,
    checkFn: (ctx) => ctx.hasShareLink,
  },
];

export default function SetupChecklist() {
  const { user } = useAuth();
  const [ctx, setCtx] = useState<ChecklistContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const [expandedInline, setExpandedInline] = useState<string | null>(null);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "true") {
      setDismissed(true);
      setLoading(false);
      return;
    }
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchStatus() {
      try {
        const res = await fetch("/api/cc/setup-status");
        if (res.ok) {
          const data = await res.json();
          setCtx(data);
        } else {
          setCtx({
            hasIntakeCompleted: false,
            hasGPA: false,
            hasTestStrategy: false,
            profileCompletion: 0,
            hasSchools: false,
            hasEssays: false,
            hasInterviewSessions: false,
            hasActivities: false,
            hasActivitiesOptimized: false,
            hasShareLink: false,
          });
        }
      } catch {
        setCtx({
          hasIntakeCompleted: false,
          hasGPA: false,
          hasTestStrategy: false,
          profileCompletion: 0,
          hasSchools: false,
          hasEssays: false,
          hasInterviewSessions: false,
          hasActivities: false,
          hasActivitiesOptimized: false,
          hasShareLink: false,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
  }, [user]);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "true");
    setDismissed(true);
  }

  function handleInlineComplete() {
    setExpandedInline(null);
    if (ctx) {
      setCtx({ ...ctx, hasGPA: true, hasTestStrategy: true });
    }
  }

  if (loading || dismissed || !ctx || !user) return null;

  const completedCount = CHECKLIST_ITEMS.filter((item) => item.checkFn(ctx)).length;
  const totalCount = CHECKLIST_ITEMS.length;
  const allDone = completedCount === totalCount;

  if (allDone) return null;

  const nextItem = CHECKLIST_ITEMS.find((item) => !item.checkFn(ctx));
  const progressPct = Math.round((completedCount / totalCount) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-br from-[#1a1610] to-[#141414] overflow-hidden"
    >
      <div className="px-5 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Getting Started</h3>
            <p className="text-xs text-white/40">
              {completedCount} of {totalCount} &middot; each step takes under 2 minutes
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#D4AF37] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </div>
            <span className="text-xs text-white/40 font-medium">{progressPct}%</span>
          </div>
          <button
            onClick={dismiss}
            className="p-1 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/60 transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="divide-y divide-white/5">
        {CHECKLIST_ITEMS.map((item, i) => {
          const done = item.checkFn(ctx);
          const isNext = item === nextItem;
          const Icon = item.icon;
          const isInlineExpanded = expandedInline === item.id;

          return (
            <div key={item.id}>
              {item.inline ? (
                <button
                  onClick={() => {
                    if (!done) setExpandedInline(isInlineExpanded ? null : item.id);
                  }}
                  className={`w-full px-5 py-3.5 flex items-center gap-4 transition-all text-left ${
                    isNext
                      ? "bg-[#D4AF37]/5 hover:bg-[#D4AF37]/10"
                      : done
                      ? "opacity-60"
                      : "hover:bg-white/[0.02]"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      done
                        ? "bg-emerald-500/20 text-emerald-400"
                        : isNext
                        ? "bg-[#D4AF37]/20 text-[#D4AF37] ring-2 ring-[#D4AF37]/30"
                        : "bg-white/5 text-white/30"
                    }`}
                  >
                    {done ? <Check className="w-3.5 h-3.5" /> : <span className="text-xs font-bold">{i + 1}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${done ? "text-white/50 line-through" : "text-white"}`}>
                      {item.label}
                    </div>
                    {isNext && !isInlineExpanded && (
                      <p className="text-xs text-white/40 mt-0.5">{item.description}</p>
                    )}
                  </div>
                  {!done && (
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 transition-all ${
                        isInlineExpanded ? "rotate-90 text-[#D4AF37]" :
                        isNext ? "text-[#D4AF37]" : "text-white/20"
                      }`}
                    />
                  )}
                </button>
              ) : (
                <Link href={item.href}>
                  <div
                    className={`px-5 py-3.5 flex items-center gap-4 transition-all group ${
                      isNext
                        ? "bg-[#D4AF37]/5 hover:bg-[#D4AF37]/10"
                        : done
                        ? "opacity-60 hover:opacity-80"
                        : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        done
                          ? "bg-emerald-500/20 text-emerald-400"
                          : isNext
                          ? "bg-[#D4AF37]/20 text-[#D4AF37] ring-2 ring-[#D4AF37]/30"
                          : "bg-white/5 text-white/30"
                      }`}
                    >
                      {done ? <Check className="w-3.5 h-3.5" /> : <span className="text-xs font-bold">{i + 1}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium ${done ? "text-white/50 line-through" : "text-white"}`}>
                        {item.label}
                      </div>
                      {isNext && <p className="text-xs text-white/40 mt-0.5">{item.description}</p>}
                    </div>
                    {!done && (
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 transition-all ${
                          isNext ? "text-[#D4AF37] group-hover:translate-x-0.5" : "text-white/20 group-hover:text-white/40"
                        }`}
                      />
                    )}
                  </div>
                </Link>
              )}

              {isInlineExpanded && !done && (
                <div className="px-5 pb-4">
                  <QuickAcademicPrompt onComplete={handleInlineComplete} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {nextItem && (
        <div className="px-5 py-3 border-t border-white/5">
          <p className="text-[10px] text-white/20 text-center">
            Fill out your{" "}
            <Link href="/profile" className="text-white/30 underline hover:text-white/50">
              full Common App profile
            </Link>{" "}
            anytime — no rush
          </p>
        </div>
      )}
    </motion.div>
  );
}
