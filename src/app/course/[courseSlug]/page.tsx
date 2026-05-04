"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Clock, Layers, ArrowRight, Lock, CheckCircle, Mic } from "lucide-react";
import { courses } from "@/data";
import { getAllLessons, type Course, type Lesson } from "@/data/types";
import { getLanguageCourse } from "@/data/languages";
import { useAuth } from "@/contexts/AuthContext";

export default function CourseOverviewPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const courseSlug = params.courseSlug as string;
  const [checked, setChecked] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  const hardcodedCourse = courses.find((c) => c.slug === courseSlug);
  const langCourse = !hardcodedCourse ? getLanguageCourse(courseSlug) : undefined;
  const course = hardcodedCourse || langCourse;

  // If user is logged in, redirect to first lesson (existing behavior)
  useEffect(() => {
    if (authLoading) return;
    if (!user) return; // Show overview for logged-out users

    if (hardcodedCourse) {
      const allLessons = getAllLessons(hardcodedCourse);
      if (allLessons.length > 0) {
        router.replace(`/course/${courseSlug}/${allLessons[0].slug}`);
      } else setChecked(true);
      return;
    }
    if (langCourse) {
      const firstLesson = langCourse.modules[0]?.lessons[0];
      if (firstLesson) router.replace(`/course/${courseSlug}/${firstLesson.slug}`);
      else setChecked(true);
      return;
    }
    fetch("/api/courses/generated")
      .then((r) => r.ok ? r.json() : { courses: [] })
      .then((data) => {
        const found = (data.courses as Course[])?.find((c) => c.slug === courseSlug);
        if (found) {
          const allLessons = getAllLessons(found);
          if (allLessons.length > 0) { router.replace(`/course/${courseSlug}/${allLessons[0].slug}`); return; }
        }
        setChecked(true);
      })
      .catch(() => setChecked(true));
  }, [authLoading, user, hardcodedCourse, langCourse, courseSlug, router]);

  // Timeout
  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  // Not found
  if (!course && checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <p className="text-lg text-white/40">Course not found.</p>
      </div>
    );
  }

  // Loading redirect for logged-in users
  if (user && !checked && !timedOut) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <p className="text-lg text-white/40 animate-pulse">Loading course...</p>
      </div>
    );
  }

  // COURSE OVERVIEW PAGE — shown to logged-out users (or timeout fallback)
  if (!course) return null;

  // Union of arrays (Lesson[] | LanguageLesson[]) can't be flat-mapped with a
  // single callback signature without a cast — we only need length + basic
  // props downstream, so narrowing to the Lesson shape is safe here.
  const allLessons: Lesson[] = hardcodedCourse
    ? getAllLessons(hardcodedCourse)
    : (course.modules.flatMap((m) => m.lessons) as Lesson[]);
  const isFree = "tier" in course ? course.tier === "free" : true;
  const estimatedHours = Math.max(1, Math.round(allLessons.length * 0.25));

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{course.icon}</span>
            <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
              isFree
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-violet-500/10 text-violet-400 border border-violet-500/20"
            }`}>
              {isFree ? "Free" : "Pro"}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            {course.title}
          </h1>
          <p className="text-white/45 text-base leading-relaxed mb-5">
            {course.description}
          </p>

          {/* Stats bar */}
          <div className="flex flex-wrap gap-4 text-[13px] text-white/30 font-medium">
            <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> {course.modules.length} modules</span>
            <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> {allLessons.length} lessons</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> ~{estimatedHours}h</span>
            <span className="flex items-center gap-1.5"><Mic className="w-3.5 h-3.5" /> AI voice coach</span>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Link
            href={isFree ? `/signup?next=/course/${courseSlug}` : `/signup?next=/course/${courseSlug}`}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-semibold hover:from-violet-500 hover:to-cyan-500 transition-all shadow-lg shadow-violet-500/15 hover:shadow-violet-500/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            {isFree ? "Start Learning — Free" : "Start Learning — Pro"}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          {!isFree && (
            <p className="text-white/20 text-xs mt-2">7-day free Pro trial included</p>
          )}
        </motion.div>

        {/* Syllabus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Course Outline</h2>
          <div className="space-y-3">
            {course.modules.map((module, mi) => (
              <motion.div
                key={module.id}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.25 + mi * 0.05, ease: [0.25, 0.4, 0.25, 1] }}
              >
                <div className="px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-[11px] font-bold text-white/40">
                        {mi + 1}
                      </span>
                      <h3 className="text-[15px] font-semibold text-white/80">{module.title}</h3>
                    </div>
                    <span className="text-[11px] text-white/20 font-medium">{module.lessons.length} lessons</span>
                  </div>
                  {module.description && (
                    <p className="text-[13px] text-white/30 mt-1.5 ml-9">{module.description}</p>
                  )}
                  {/* Show lesson titles */}
                  <div className="mt-3 ml-9 space-y-1">
                    {module.lessons.map((lesson, li) => {
                      const isComingSoon = /"title"\s*:\s*"Coming Soon"/.test(lesson.content);
                      return (
                        <div key={lesson.id} className="flex items-center gap-2 text-[12px]">
                          {isComingSoon ? (
                            <span className="w-3 h-3 rounded-full bg-amber-500/30 flex-shrink-0" aria-label="Coming soon" />
                          ) : isFree ? (
                            <CheckCircle className="w-3 h-3 text-emerald-500/40 flex-shrink-0" />
                          ) : (
                            <Lock className="w-3 h-3 text-white/15 flex-shrink-0" />
                          )}
                          <span className={`truncate ${isComingSoon ? 'text-white/25 italic' : 'text-white/25'}`}>
                            {lesson.title}
                          </span>
                          {isComingSoon && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300/80 border border-amber-500/20 flex-shrink-0">
                              Coming Soon
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            href={`/signup?next=/course/${courseSlug}`}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/60 text-sm font-semibold hover:bg-white/[0.08] hover:text-white transition-all"
          >
            Sign up to start this course
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
