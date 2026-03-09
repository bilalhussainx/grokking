"use client";

import { useState } from "react";
import TopNav from "./TopNav";
import Sidebar, { SidebarModule } from "./Sidebar";

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <TopNav
        courseTitle={courseTitle}
        progress={progress}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />

      <div className="flex">
        <Sidebar
          modules={modules}
          courseSlug={courseSlug}
          currentLessonId={currentLessonId}
          completedLessons={completedLessons}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
