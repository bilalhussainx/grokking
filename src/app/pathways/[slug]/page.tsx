"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Clock,
  PlayCircle,
  Target,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCourseProgress } from "@/hooks/useCourseProgress";
import { getPathwayBySlug } from "@/data/pathways";
import { courses as allCourses } from "@/data";
import type { Course } from "@/data/types";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

function getCourseBySlug(slug: string): Course | undefined {
  return allCourses.find((c) => c.slug === slug);
}

export default function PathwayDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const pathway = getPathwayBySlug(slug);
  const { user } = useAuth();
  const courseProgress = useCourseProgress();

  if (!pathway) {
    notFound();
  }

  // Resolve course objects in pathway order
  const resolvedCourses = pathway.courses
    .map((s) => getCourseBySlug(s))
    .filter(Boolean) as Course[];

  // Calculate overall pathway progress
  const totalCourses = resolvedCourses.length;
  const completedCourses = resolvedCourses.filter(
    (c) => (courseProgress[c.slug] ?? 0) >= 100
  ).length;
  const overallProgress =
    totalCourses > 0
      ? Math.round(
          resolvedCourses.reduce(
            (sum, c) => sum + (courseProgress[c.slug] ?? 0),
            0
          ) / totalCourses
        )
      : 0;

  const interviewLabel: Record<string, string> = {
    technical: "Technical",
    behavioral: "Behavioral",
    "system-design": "System Design",
    "recruiter-screen": "Recruiter Screen",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <motion.div
        className="max-w-4xl mx-auto px-4 pt-16 pb-24"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Back link */}
        <motion.div variants={item} className="mb-8">
          <Link
            href="/pathways"
            className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Pathways
          </Link>
        </motion.div>

        {/* Hero */}
        <motion.div
          variants={item}
          className="relative overflow-hidden rounded-2xl bg-slate-800/60 backdrop-blur-xl border border-white/10 p-8 mb-8"
        >
          {/* Background glow */}
          <div
            className={`absolute -top-32 -right-32 w-64 h-64 rounded-full blur-3xl opacity-15 bg-gradient-to-br ${pathway.color}`}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl">{pathway.icon}</span>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white">
                  {pathway.title}
                </h1>
                <p className="text-white/40 text-sm mt-1">
                  {totalCourses} courses &middot; ~{pathway.estimatedWeeks}{" "}
                  weeks
                </p>
              </div>
            </div>

            <p className="text-white/60 leading-relaxed max-w-2xl mb-6">
              {pathway.description}
            </p>

            {/* Roles */}
            <div className="mb-6">
              <h3 className="text-xs font-medium text-white/30 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                Prepares you for
              </h3>
              <div className="flex flex-wrap gap-2">
                {pathway.roles.map((role) => (
                  <span
                    key={role}
                    className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-sm text-white/70"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {/* Interview types */}
            <div className="mb-6">
              <h3 className="text-xs font-medium text-white/30 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                Interview types covered
              </h3>
              <div className="flex flex-wrap gap-2">
                {pathway.interviewTypes.map((type) => (
                  <span
                    key={type}
                    className={`px-3 py-1 rounded-lg text-sm border ${
                      type === "technical"
                        ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                        : type === "system-design"
                          ? "bg-violet-500/10 border-violet-500/20 text-violet-400"
                          : type === "behavioral"
                            ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                            : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    }`}
                  >
                    {interviewLabel[type] || type}
                  </span>
                ))}
              </div>
            </div>

            {/* Progress bar (authenticated users only) */}
            {user && (
              <div className="rounded-xl bg-slate-900/60 border border-white/5 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white/70">
                    Your progress
                  </span>
                  <span className="text-sm text-white/40">
                    {completedCourses}/{totalCourses} courses completed
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${pathway.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${overallProgress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <p className="text-xs text-white/30 mt-1.5">
                  {overallProgress}% overall
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Course List */}
        <motion.div variants={item} className="mb-8">
          <h2 className="text-sm font-medium text-white/30 uppercase tracking-wider mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Course Sequence
          </h2>

          <div className="space-y-3">
            {resolvedCourses.map((course, index) => {
              const progress = courseProgress[course.slug] ?? 0;
              const isCompleted = progress >= 100;
              const isStarted = progress > 0;

              return (
                <motion.div
                  key={course.slug}
                  variants={item}
                  className="group"
                >
                  <Link href={`/course/${course.slug}`}>
                    <div
                      className={`relative overflow-hidden rounded-xl bg-slate-800/60 backdrop-blur-xl border p-5 cursor-pointer transition-all ${
                        isCompleted
                          ? "border-emerald-500/20 hover:border-emerald-500/40"
                          : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Step number */}
                        <div
                          className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold ${
                            isCompleted
                              ? "bg-emerald-500/15 text-emerald-400"
                              : "bg-white/5 text-white/30"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            index + 1
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">{course.icon}</span>
                            <h3 className="text-base font-semibold text-white truncate">
                              {course.title}
                            </h3>
                            {course.tier === "pro" && (
                              <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-yellow-500/15 text-yellow-400 border border-yellow-500/20">
                                PRO
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-white/40 line-clamp-1">
                            {course.description}
                          </p>

                          {/* Progress for started courses */}
                          {user && isStarted && !isCompleted && (
                            <div className="mt-2.5 flex items-center gap-3">
                              <div className="flex-1 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <span className="text-xs text-white/30 shrink-0">
                                {Math.round(progress)}%
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Arrow */}
                        <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-white/40 shrink-0 mt-1 transition-colors" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA: Start Interview Practice */}
        <motion.div variants={item}>
          <Link href={`/interviews?pathway=${pathway.slug}`}>
            <div
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-r ${pathway.color} p-[1px] cursor-pointer`}
            >
              <div className="rounded-2xl bg-slate-900/90 backdrop-blur-xl px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <PlayCircle className="w-6 h-6 text-white/80" />
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      Start Interview Practice
                    </h3>
                    <p className="text-sm text-white/40">
                      Practice{" "}
                      {pathway.interviewTypes
                        .map((t) => interviewLabel[t] || t)
                        .join(", ")}{" "}
                      interviews for this pathway
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white/70 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Estimated completion */}
        <motion.div variants={item} className="mt-6 text-center">
          <p className="text-sm text-white/30 flex items-center justify-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Estimated completion: ~{pathway.estimatedWeeks} weeks at 10
            hrs/week
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
