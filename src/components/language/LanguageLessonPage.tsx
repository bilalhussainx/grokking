"use client";

import { useState, useEffect } from "react";
import { BookOpen, CheckCircle, Circle, ChevronLeft, ChevronRight, Mic, ArrowRight } from "lucide-react";
import Link from "next/link";
import CourseLayout from "@/components/layout/CourseLayout";
import { SidebarModule } from "@/components/layout/Sidebar";
import LessonContent from "@/components/lesson/LessonContent";
import { getCompletedLessons, getCourseProgress, markLessonComplete, markLessonIncomplete } from "@/lib/progress";
import { LanguageLesson, LanguageCourse, LessonContext, lessonPracticeToContext } from "@/data/language-types";
import { LanguageTutorPanel } from "@/components/language/LanguageTutorPanel";

interface LanguageLessonPageProps {
  course: LanguageCourse;
  lesson: LanguageLesson;
  module: { id: string; title: string };
  prevLesson: LanguageLesson | null;
  nextLesson: LanguageLesson | null;
}

export default function LanguageLessonPage({
  course,
  lesson,
  module,
  prevLesson,
  nextLesson,
}: LanguageLessonPageProps) {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState(0);
  const [showVoicePractice, setShowVoicePractice] = useState(false);
  const [voicePracticeContext, setVoicePracticeContext] = useState<LessonContext | null>(null);

  const isLastLesson = nextLesson === null;

  // Convert modules to sidebar format
  const sidebarModules: SidebarModule[] = course.modules.map((m) => ({
    id: m.id,
    title: m.title,
    lessons: m.lessons.map((l) => ({ id: l.id, title: l.title, slug: l.slug })),
  }));

  useEffect(() => {
    async function loadProgress() {
      const completed = await getCompletedLessons(course.slug);
      setCompletedLessons(completed);
      const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
      const pct = await getCourseProgress(course.slug, totalLessons);
      setProgress(pct);
    }
    loadProgress();
  }, [course.slug, course.modules]);

  const toggleComplete = async () => {
    let updated: Set<string>;
    if (completedLessons.has(lesson.id)) {
      updated = await markLessonIncomplete(course.slug, lesson.id);
    } else {
      updated = await markLessonComplete(course.slug, lesson.id);
    }
    setCompletedLessons(updated);
    const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    setProgress(Math.round((updated.size / totalLessons) * 100));
  };

  return (
    <CourseLayout
      courseTitle={course.title}
      courseSlug={course.slug}
      modules={sidebarModules}
      currentLessonId={lesson.id}
      completedLessons={completedLessons}
      progress={progress}
    >
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Module breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-white/40 mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{module.title}</span>
        </div>

        <h1 className="text-3xl font-bold mb-8">{lesson.title}</h1>

        <LessonContent content={lesson.content} />

        {/* Vocabulary section */}
        {lesson.vocabulary.length > 0 && (
          <div className="mt-12 p-6 rounded-xl bg-slate-900/50 border border-slate-800">
            <h2 className="text-lg font-semibold text-slate-100 mb-4">Vocabulary</h2>
            <div className="grid gap-3">
              {lesson.vocabulary.map((vocab, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                  <div>
                    <span className="font-medium text-slate-200">{vocab.word}</span>
                    <span className="text-slate-500 text-sm ml-2">({vocab.pronunciation})</span>
                  </div>
                  <span className="text-slate-400">{vocab.translation}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Practice with Voice */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => {
              const context = lessonPracticeToContext({
                mode: 'lesson-practice',
                courseSlug: course?.slug || '',
                lessonSlug: lesson.slug,
                topicId: lesson.topicId,
                targetVocab: lesson.vocabulary,
                targetGrammar: lesson.grammarPoints,
                voiceScenarios: lesson.voiceScenarios,
                proficiencyLevel: lesson.proficiencyLevel as any,
              }, lesson.title);
              setVoicePracticeContext(context);
              setShowVoicePractice(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/30 transition-all font-medium"
          >
            <Mic className="w-4 h-4" />
            Practice with Voice
          </button>
        </div>

        {/* Voice Practice Panel */}
        {showVoicePractice && (
          <div className="mt-6 rounded-xl border border-slate-800 overflow-hidden" style={{ height: 500 }}>
            <LanguageTutorPanel
              language={lesson.targetLanguage}
              languageName={course.languageName}
              lessonTitle={lesson.title}
              moduleTitle={module.title}
              courseTitle={course.title}
              proficiencyLevel={lesson.proficiencyLevel as any}
              targetPhrases={voicePracticeContext?.targetPhrases || []}
            />
          </div>
        )}

        {/* Course Completion */}
        {isLastLesson && course?.nextCourseSlug && (
          <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 border border-emerald-500/20 text-center">
            <h3 className="text-xl font-bold text-emerald-400 mb-2">Course complete</h3>
            <p className="text-slate-400 mb-4">You&apos;ve finished {course.title}. Ready for the next level?</p>
            <Link
              href={`/course/${course.nextCourseSlug}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-colors"
            >
              Continue to Next Level
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
        {isLastLesson && !course?.nextCourseSlug && (
          <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-yellow-500/10 to-emerald-500/10 border border-yellow-500/20 text-center">
            <h3 className="text-xl font-bold text-yellow-400 mb-2">Mastery achieved</h3>
            <p className="text-slate-400">You&apos;ve completed the highest level. Keep practicing in voice chat!</p>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {prevLesson && (
              <a
                href={`/course/${course.slug}/${prevLesson.slug}`}
                className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </a>
            )}
          </div>

          <button
            onClick={toggleComplete}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            {completedLessons.has(lesson.id) ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-200">Completed</span>
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400">Mark Complete</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-4">
            {nextLesson && (
              <a
                href={`/course/${course.slug}/${nextLesson.slug}`}
                className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </CourseLayout>
  );
}
