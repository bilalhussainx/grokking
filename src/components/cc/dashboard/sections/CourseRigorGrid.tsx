// src/components/cc/dashboard/sections/CourseRigorGrid.tsx
// 4-card 2-row course grid for g9/g10 — replaces SchoolCardGrid since
// these students don't have schools yet. Returns null when no courses
// logged. Same eyebrow + grid + "Manage courses" link rhythm as
// SchoolCardGrid for visual consistency across variants.
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, ArrowRight, Circle } from "lucide-react";
import type { DashboardSummary } from "./types";

const MAX_COURSES = 4;

export default function CourseRigorGrid({ summary }: { summary: DashboardSummary }) {
  if (!summary.courses || summary.courses.length === 0) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="rounded-2xl border border-white/10 bg-[#141414]/60 backdrop-blur-sm p-6 text-center">
          <BookOpen className="w-6 h-6 text-white/15 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-white mb-1">Log your courses</h3>
          <p className="text-xs text-white/45 mb-4">
            Course rigor is one of the top three things colleges look at. Start logging now to spot easy wins.
          </p>
          <Link
            href="/cc/courses"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4AF37] text-black text-xs font-semibold hover:bg-[#C4A030] transition-colors"
          >
            Add your courses <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </motion.section>
    );
  }
  const visible = summary.courses.slice(0, MAX_COURSES);
  const hasMore = summary.courses.length > MAX_COURSES;
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-white/50" />
          <span className="text-[10px] uppercase tracking-wider font-semibold text-white/50">
            Your courses
          </span>
          {hasMore && (
            <span className="text-[10px] text-white/35">
              · showing {visible.length} of {summary.courses.length}
            </span>
          )}
        </div>
        <Link
          href="/cc/courses"
          className="text-[11px] text-white/40 hover:text-white/60 transition-colors flex items-center gap-1"
        >
          Manage courses <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {visible.map((course) => (
          <div
            key={course.id}
            className="rounded-xl border border-white/10 bg-[#141414]/60 backdrop-blur-sm p-4 hover:border-[#D4AF37]/30 transition-colors flex items-center gap-3"
          >
            <div className="shrink-0 w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white/60" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-white truncate">{course.courseName}</p>
                {course.level && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#fcd34d] uppercase tracking-wider font-semibold">
                    {course.level}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-white/50">
                {course.grade ? (
                  <span className="tabular-nums">Grade: <span className="text-emerald-300 font-semibold">{course.grade}</span></span>
                ) : course.inProgress ? (
                  <span className="inline-flex items-center gap-1">
                    <Circle className="w-2.5 h-2.5" /> In progress
                  </span>
                ) : (
                  <span className="text-white/30">No grade yet</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
