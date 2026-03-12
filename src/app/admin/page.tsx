"use client";

import { useState } from "react";
import Link from "next/link";
import { courses } from "@/data";
import { getAllLessons } from "@/data/types";
import { BookOpen, Layers, Code, ChevronRight, Sparkles, GraduationCap } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Course Editor</h1>
        <p className="text-[var(--muted-foreground)]">
          Manage your courses, modules, and lessons. Create new content or edit existing material.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={<BookOpen className="w-5 h-5 text-blue-400" />}
          label="Total Courses"
          value={courses.length}
          bg="from-blue-500/10 to-blue-600/5"
        />
        <StatCard
          icon={<Layers className="w-5 h-5 text-violet-400" />}
          label="Total Modules"
          value={courses.reduce((acc, c) => acc + c.modules.length, 0)}
          bg="from-violet-500/10 to-violet-600/5"
        />
        <StatCard
          icon={<Code className="w-5 h-5 text-emerald-400" />}
          label="Total Lessons"
          value={courses.reduce((acc, c) => acc + getAllLessons(c).length, 0)}
          bg="from-emerald-500/10 to-emerald-600/5"
        />
      </div>

      {/* Courses Grid */}
      <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course) => {
          const totalLessons = getAllLessons(course).length;
          const codingLessons = getAllLessons(course).filter((l) => l.starterCode).length;

          return (
            <Link
              key={course.id}
              href={`/admin/courses/${course.slug}`}
              className="group flex flex-col p-5 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{course.icon}</div>
                  <div>
                    <h3 className="font-semibold text-[var(--foreground)] group-hover:text-blue-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                      {course.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors" />
              </div>

              <div className="flex items-center gap-4 mt-auto text-xs text-[var(--muted-foreground)]">
                <span className="flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  {course.modules.length} modules
                </span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" />
                  {totalLessons} lessons
                </span>
                <span className="flex items-center gap-1">
                  <Code className="w-3 h-3" />
                  {codingLessons} exercises
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  bg: string;
}) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl border border-white/[0.08] bg-gradient-to-br ${bg}`}>
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/[0.06]">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-[var(--foreground)]">{value}</p>
        <p className="text-xs text-[var(--muted-foreground)]">{label}</p>
      </div>
    </div>
  );
}
