"use client";

import { useState, useEffect } from "react";
import { GraduationCap } from "lucide-react";
import CourseLayout from "@/components/layout/CourseLayout";
import { SidebarModule } from "@/components/layout/Sidebar";
import LessonContent from "./LessonContent";
import LessonNav from "./LessonNav";
import IDEPanel from "@/components/ide/IDEPanel";
import { useAI } from "@/contexts/AIContext";
import {
  getCompletedLessons,
  getCourseProgress,
  markLessonComplete,
  markLessonIncomplete,
} from "@/lib/progress";

interface LessonPageProps {
  courseTitle: string;
  courseSlug: string;
  modules: SidebarModule[];
  moduleTitle: string;
  lesson: {
    id: string;
    slug: string;
    title: string;
    content: string;
    starterCode?: string;
    solutionCode?: string;
  };
  prevLesson: { slug: string; title: string } | null;
  nextLesson: { slug: string; title: string } | null;
  totalLessons: number;
}

export default function LessonPage({
  courseTitle,
  courseSlug,
  modules,
  moduleTitle,
  lesson,
  prevLesson,
  nextLesson,
  totalLessons,
}: LessonPageProps) {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState(0);
  const { setLessonContext, setCurrentCode, isPanelOpen, openPanel, togglePanel } = useAI();

  useEffect(() => {
    async function loadProgress() {
      const completed = await getCompletedLessons(courseSlug);
      setCompletedLessons(completed);
      const pct = await getCourseProgress(courseSlug, totalLessons);
      setProgress(pct);
    }
    loadProgress();
  }, [courseSlug, totalLessons]);

  // Set AI lesson context whenever the lesson changes
  useEffect(() => {
    setLessonContext({
      courseSlug: courseSlug,
      lessonSlug: lesson.slug,
      lessonTitle: lesson.title,
      lessonContent: lesson.content,
      moduleTitle: moduleTitle,
      courseTitle: courseTitle,
      starterCode: lesson.starterCode,
      solutionCode: lesson.solutionCode,
    });
    return () => setLessonContext(null);
  }, [lesson.id, lesson.title, lesson.content, moduleTitle, courseTitle, lesson.starterCode, lesson.solutionCode, setLessonContext]);

  // Auto-open coach when there's a coding exercise
  useEffect(() => {
    if (lesson.starterCode && lesson.solutionCode) {
      openPanel();
    }
  }, [lesson.id, lesson.starterCode, lesson.solutionCode, openPanel]);

  const toggleComplete = async () => {
    let updated: Set<string>;
    if (completedLessons.has(lesson.id)) {
      updated = await markLessonIncomplete(courseSlug, lesson.id);
    } else {
      updated = await markLessonComplete(courseSlug, lesson.id);
    }
    setCompletedLessons(updated);
    setProgress(Math.round((updated.size / totalLessons) * 100));
  };

  const handleCodeChange = (code: string) => {
    setCurrentCode(code);
  };

  return (
    <CourseLayout
      courseTitle={courseTitle}
      courseSlug={courseSlug}
      modules={modules}
      currentLessonId={lesson.id}
      completedLessons={completedLessons}
      progress={progress}
    >
      <div className={`max-w-4xl mx-auto px-6 py-8 transition-all ${isPanelOpen ? "mr-80" : ""}`}>
        <h1 className="text-3xl font-bold mb-8">{lesson.title}</h1>

        <LessonContent content={lesson.content} />

        {lesson.starterCode && lesson.solutionCode && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold gradient-text-subtle">
                Try it yourself
              </h2>
              <button
                onClick={togglePanel}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  isPanelOpen
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "bg-white/[0.06] text-white/50 border border-white/[0.08] hover:text-white/80 hover:bg-white/10"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                {isPanelOpen ? "Hide Coach" : "Coach Alex"}
              </button>
            </div>
            <IDEPanel
              starterCode={lesson.starterCode}
              solutionCode={lesson.solutionCode}
              lessonTitle={lesson.title}
              lessonContent={lesson.content}
              onCodeChange={handleCodeChange}
            />
          </div>
        )}

        <LessonNav
          courseSlug={courseSlug}
          prevLesson={prevLesson}
          nextLesson={nextLesson}
          isCompleted={completedLessons.has(lesson.id)}
          onToggleComplete={toggleComplete}
        />
      </div>
    </CourseLayout>
  );
}
