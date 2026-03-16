"use client";

import Link from "next/link";
import { getAllLanguageCourses, getSupportedLanguages } from "@/data/languages";

export default function LanguagesPage() {
  const courses = getAllLanguageCourses();
  const languages = getSupportedLanguages();

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Language Courses</h1>
        <p className="text-slate-400 mb-8">Learn a new language with AI-powered voice tutors</p>

        {/* Languages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {languages.map((lang) => (
            <div
              key={lang.code}
              className="p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-colors"
            >
              <div className="text-4xl mb-4">{lang.flag}</div>
              <h2 className="text-xl font-semibold text-slate-100 mb-2">{lang.name}</h2>
              <p className="text-slate-400 text-sm mb-4">
                {courses.filter((c) => c.language === lang.code).length} courses available
              </p>
              <Link
                href={`/placement/${lang.code}`}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-colors text-sm font-medium"
              >
                Start Learning
              </Link>
            </div>
          ))}
        </div>

        {/* Available Courses */}
        <h2 className="text-2xl font-semibold text-slate-100 mb-4">Available Courses</h2>
        <div className="space-y-4">
          {courses.map((course) => (
            <Link
              key={course.slug}
              href={`/course/${course.slug}/${course.modules[0]?.lessons[0]?.slug || ""}`}
              className="block p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-slate-100 mb-1">
                    {course.icon} {course.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-2">{course.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>{course.modules.length} modules</span>
                    <span>{course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons</span>
                    <span>~{course.estimatedHours} hours</span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-xs font-medium text-slate-300">
                  {course.proficiencyLevel}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Practice */}
        <div className="mt-12 p-6 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
          <h2 className="text-xl font-semibold text-slate-100 mb-2">Quick Voice Practice</h2>
          <p className="text-slate-300 text-sm mb-4">
            Jump straight into a conversation without a structured lesson
          </p>
          <Link
            href="/practice"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors text-sm font-medium"
          >
            Start Practicing
          </Link>
        </div>
      </div>
    </div>
  );
}
