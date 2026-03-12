"use client";

import { useState } from "react";
import TopNav from "./TopNav";
import Sidebar, { SidebarModule } from "./Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AnimatedBlobs from "@/components/ui/AnimatedBlobs";

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
    <ProtectedRoute>
      <div className="relative min-h-screen bg-[var(--background)]">
        <AnimatedBlobs intensity="low" />
        <TopNav
          courseTitle={courseTitle}
          progress={progress}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

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
        </div>

        {/* Coach Alex is rendered globally via providers.tsx */}
      </div>
    </ProtectedRoute>
  );
}
