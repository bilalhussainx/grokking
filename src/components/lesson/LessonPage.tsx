"use client";

import { useState, useEffect } from "react";
import {
  GraduationCap,
  BookOpen,
  Code2,
  Terminal,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Circle,
  ExternalLink,
  Lightbulb,
  Play,
} from "lucide-react";
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from "react-resizable-panels";
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

type ContentTab = "lesson" | "resources";

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
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set()
  );
  const [progress, setProgress] = useState(0);
  const [contentTab, setContentTab] = useState<ContentTab>("lesson");
  const {
    setLessonContext,
    setCurrentCode,
    isPanelOpen,
    openPanel,
    togglePanel,
  } = useAI();

  const hasExercise = !!(lesson.starterCode && lesson.solutionCode);

  useEffect(() => {
    async function loadProgress() {
      const completed = await getCompletedLessons(courseSlug);
      setCompletedLessons(completed);
      const pct = await getCourseProgress(courseSlug, totalLessons);
      setProgress(pct);
    }
    loadProgress();
  }, [courseSlug, totalLessons]);

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
  }, [
    lesson.id,
    lesson.title,
    lesson.content,
    moduleTitle,
    courseTitle,
    lesson.starterCode,
    lesson.solutionCode,
    setLessonContext,
  ]);

  useEffect(() => {
    if (hasExercise) {
      openPanel();
    }
  }, [lesson.id, hasExercise, openPanel]);

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

  // ─── Content-Only Layout (no exercise) ───────────────────────
  if (!hasExercise) {
    return (
      <CourseLayout
        courseTitle={courseTitle}
        courseSlug={courseSlug}
        modules={modules}
        currentLessonId={lesson.id}
        completedLessons={completedLessons}
        progress={progress}
      >
        <div
          className={`max-w-4xl mx-auto px-6 py-8 transition-all ${isPanelOpen ? "mt-11" : ""}`}
        >
          {/* Module breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/40 mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{moduleTitle}</span>
          </div>

          <h1 className="text-3xl font-bold mb-8">{lesson.title}</h1>

          <LessonContent content={lesson.content} />

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

  // ─── Split Layout (with exercise) — AscentIDE-inspired ───────
  return (
    <CourseLayout
      courseTitle={courseTitle}
      courseSlug={courseSlug}
      modules={modules}
      currentLessonId={lesson.id}
      completedLessons={completedLessons}
      progress={progress}
    >
      <div className="h-[calc(100vh-3.5rem)] flex flex-col">
        {/* Top Bar — Lesson title + navigation + coach toggle */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#0a0c14]/80 backdrop-blur-sm border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            {/* Completion toggle */}
            <button
              onClick={toggleComplete}
              className="shrink-0"
              title={
                completedLessons.has(lesson.id)
                  ? "Mark incomplete"
                  : "Mark complete"
              }
            >
              {completedLessons.has(lesson.id) ? (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              ) : (
                <Circle className="w-5 h-5 text-white/20 hover:text-white/50 transition-colors" />
              )}
            </button>

            <div>
              <div className="text-[10px] uppercase tracking-wider text-white/30 font-semibold">
                {moduleTitle}
              </div>
              <h1 className="text-sm font-semibold text-white/90 leading-tight">
                {lesson.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Coach toggle */}
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

            {/* Nav arrows */}
            {prevLesson && (
              <a
                href={`/course/${courseSlug}/${prevLesson.slug}`}
                className="p-1.5 rounded-md bg-white/[0.06] hover:bg-white/[0.1] text-white/50 hover:text-white/80 transition-colors"
                title={prevLesson.title}
              >
                <ChevronLeft className="w-4 h-4" />
              </a>
            )}
            {nextLesson && (
              <a
                href={`/course/${courseSlug}/${nextLesson.slug}`}
                className="p-1.5 rounded-md bg-white/[0.06] hover:bg-white/[0.1] text-white/50 hover:text-white/80 transition-colors"
                title={nextLesson.title}
              >
                <ChevronRight className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Main Split Layout */}
        <PanelGroup
          orientation="horizontal"
          className={`flex-1 min-h-0 ${isPanelOpen ? "mt-11" : ""}`}
        >
          {/* ─── Left Panel: Lesson Content ─── */}
          <Panel defaultSize={45} minSize={30} maxSize={65}>
            <div className="h-full flex flex-col bg-[#0d0f17]">
              {/* Content Tabs */}
              <div className="flex items-center gap-1 px-3 py-1.5 border-b border-white/[0.06] bg-[#0a0c14]">
                <button
                  onClick={() => setContentTab("lesson")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    contentTab === "lesson"
                      ? "bg-white/[0.08] text-white"
                      : "text-white/40 hover:text-white/60"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Lesson
                </button>
                <button
                  onClick={() => setContentTab("resources")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    contentTab === "resources"
                      ? "bg-white/[0.08] text-white"
                      : "text-white/40 hover:text-white/60"
                  }`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Resources
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto">
                {contentTab === "lesson" ? (
                  <div className="px-6 py-6">
                    <LessonContent content={lesson.content} />
                  </div>
                ) : (
                  <div className="px-6 py-6">
                    <div className="text-sm text-white/50">
                      <h3 className="text-white/80 font-semibold mb-3 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-400" />
                        Learning Resources
                      </h3>
                      <p className="text-white/40 text-xs mb-4">
                        Complement your learning with these external materials.
                      </p>
                      <div className="space-y-2 text-xs text-white/50">
                        <p>Resources for this lesson will be populated based on the course topic.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Panel>

          {/* ─── Resize Handle ─── */}
          <PanelResizeHandle className="w-1.5 bg-white/[0.03] hover:bg-blue-500/30 transition-colors cursor-col-resize flex items-center justify-center group">
            <div className="w-0.5 h-8 rounded-full bg-white/10 group-hover:bg-blue-400/50 transition-colors" />
          </PanelResizeHandle>

          {/* ─── Right Panel: Code Editor ─── */}
          <Panel defaultSize={55} minSize={35} maxSize={70}>
            <div className="h-full flex flex-col">
              {/* Exercise header */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0a0c14] border-b border-white/[0.06]">
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                  Exercise
                </span>
                <div className="flex-1" />
                <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  <Play className="w-3 h-3 text-emerald-400" fill="currentColor" />
                  <span className="text-[10px] font-semibold text-emerald-400">
                    Python
                  </span>
                </div>
              </div>

              {/* IDE Panel fills remaining space */}
              <div className="flex-1 min-h-0">
                <IDEPanel
                  starterCode={lesson.starterCode!}
                  solutionCode={lesson.solutionCode!}
                  height="100%"
                  lessonTitle={lesson.title}
                  lessonContent={lesson.content}
                  onCodeChange={handleCodeChange}
                />
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </CourseLayout>
  );
}
