"use client";

import { useState, useEffect } from "react";
import Sidebar, { SidebarModule } from "./Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AnimatedBlobs from "@/components/ui/AnimatedBlobs";
import { TranslationWidget } from "@/components/language";
import { getLanguageCourse } from "@/data/languages";
import { LanguageTutorPanel } from "@/components/language";
import { useTopNav } from "@/contexts/TopNavContext";

interface CourseLayoutProps {
  courseTitle: string;
  courseSlug: string;
  modules: SidebarModule[];
  currentLessonId?: string;
  completedLessons: Set<string>;
  progress: number;
  children: React.ReactNode;
}

export default function CourseLayout({
  courseTitle,
  courseSlug,
  modules,
  currentLessonId,
  completedLessons,
  progress,
  children,
}: CourseLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { setOverrides, clearOverrides } = useTopNav();

  // Check if this is a language course
  const langCourse = getLanguageCourse(courseSlug);
  const isLanguageCourse = !!langCourse;

  // Find the current lesson in the language course for context
  const currentLangLesson = langCourse?.modules
    .flatMap(m => m.lessons)
    .find(l => l.slug === currentLessonId || l.id === currentLessonId);

  // Inject course-specific props into the global TopNav
  useEffect(() => {
    setOverrides({
      courseTitle,
      progress,
      onToggleSidebar: () => setSidebarOpen((prev) => !prev),
    });
    return () => clearOverrides();
  }, [courseTitle, progress, setOverrides, clearOverrides]);

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen bg-[var(--background)]">
        <AnimatedBlobs intensity="low" />

        <div className="relative z-10 flex">
          <Sidebar
            modules={modules}
            courseSlug={courseSlug}
            currentLessonId={currentLessonId}
            completedLessons={completedLessons}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <main className="flex-1 min-w-0">{children}</main>
          
          {/* Right Panel: Language Tutor for language courses */}
          {isLanguageCourse && langCourse && (
            <div className="w-80 border-l border-slate-800 hidden lg:block">
              <LanguageTutorPanel
                language={langCourse.language}
                languageName={langCourse.languageName}
                lessonTitle={currentLangLesson?.title ?? courseTitle}
                courseTitle={courseTitle}
                proficiencyLevel={langCourse.proficiencyLevel || "A1"}
                targetPhrases={currentLangLesson?.voiceScenarios?.flatMap(s => s.targetPhrases || []) || []}
                vocabulary={currentLangLesson?.vocabulary?.map(v => `${v.word} (${v.translation})`) || []}
                grammarFocus={currentLangLesson?.grammarPoints?.map(g => g.title) || []}
              />
            </div>
          )}
        </div>

        {/* TranslationBar rendered globally via providers.tsx */}

        {/* Coach Alex is rendered globally via providers.tsx */}
      </div>
    </ProtectedRoute>
  );
}
