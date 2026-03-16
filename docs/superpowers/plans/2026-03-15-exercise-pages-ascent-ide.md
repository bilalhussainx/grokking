# Exercise Pages (AscentIDE Layout) Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move exercises from split-view inside lesson pages to dedicated full-screen exercise pages using the AscentIDE 3-panel layout (Problem | Editor | Diagnostics).

**Architecture:** Lessons with exercises get a "Start Exercise" button that navigates to `/course/[slug]/[lessonSlug]/exercise` — a full-screen IDE page. The lesson page becomes content-only (no IDE split). The exercise page uses the AscentIDE 3-panel layout: left panel shows the problem description (extracted from lesson content), center panel has Monaco editor with file tabs, bottom panel has test results + terminal output + AI feedback. Coach Alex remains as the sidebar (push layout from providers.tsx).

**Tech Stack:** Next.js App Router, Monaco Editor, react-resizable-panels, Pyodide Web Worker, existing AIContext/coach integration

---

## File Structure

```
MODIFY: src/app/course/[courseSlug]/[lessonSlug]/page.tsx
  - Add exercise detection, pass exercise flag to LessonPage

CREATE: src/app/course/[courseSlug]/[lessonSlug]/exercise/page.tsx
  - New route: full-screen exercise page
  - Finds the lesson, extracts starterCode/solutionCode
  - Renders ExerciseIDE component

CREATE: src/components/exercise/ExerciseIDE.tsx
  - Main 3-panel layout (AscentIDE-inspired)
  - Header: Back to lesson | title | language | Run | Grade | Submit
  - Left: Problem tab + Solution tab
  - Right-top: Monaco editor
  - Right-bottom: Test results + Output + AI feedback tabs

MODIFY: src/components/lesson/LessonPage.tsx
  - Remove IDE split view for exercise lessons
  - Add "Start Exercise" button that links to /exercise route
  - Lesson content renders full-width always

KEEP: src/components/ide/CodeEditor.tsx (reused inside ExerciseIDE)
KEEP: src/components/ide/OutputPanel.tsx (reused)
KEEP: src/components/ide/HintPanel.tsx (reused)
KEEP: src/components/ide/GradePanel.tsx (reused)
KEEP: public/pyodide-worker.js (unchanged)
```

---

## Chunk 1: Exercise Route + ExerciseIDE Component

### Task 1: Create the exercise route page

**Files:**
- Create: `src/app/course/[courseSlug]/[lessonSlug]/exercise/page.tsx`

- [ ] **Step 1: Create the exercise route**

```tsx
// src/app/course/[courseSlug]/[lessonSlug]/exercise/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { courses } from "@/data";
import { findLesson, type Course } from "@/data/types";
import ExerciseIDE from "@/components/exercise/ExerciseIDE";

export default function ExercisePage() {
  const params = useParams();
  const router = useRouter();
  const courseSlug = params.courseSlug as string;
  const lessonSlug = params.lessonSlug as string;

  const course = courses.find((c) => c.slug === courseSlug);
  if (!course) return <NotFound message="Course not found" />;

  const result = findLesson(course as Course, lessonSlug);
  if (!result) return <NotFound message="Lesson not found" />;

  const { lesson, module, prevLesson, nextLesson } = result;

  if (!lesson.starterCode || !lesson.solutionCode) {
    // No exercise — redirect back to lesson
    router.replace(`/course/${courseSlug}/${lessonSlug}`);
    return null;
  }

  return (
    <ExerciseIDE
      courseSlug={courseSlug}
      courseTitle={course.title}
      moduleTitle={module.title}
      lesson={lesson}
      prevLesson={prevLesson}
      nextLesson={nextLesson}
    />
  );
}

function NotFound({ message }: { message: string }) {
  return (
    <div className="h-screen bg-[var(--background)] flex items-center justify-center">
      <p className="text-white/40">{message}</p>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/course/\[courseSlug\]/\[lessonSlug\]/exercise/page.tsx
git commit -m "feat: add exercise route at /course/[slug]/[lesson]/exercise"
```

---

### Task 2: Create ExerciseIDE component (AscentIDE 3-panel layout)

**Files:**
- Create: `src/components/exercise/ExerciseIDE.tsx`

- [ ] **Step 1: Build the 3-panel exercise IDE**

This component adapts the AscentIDE layout for Samsara.ai:
- **Header:** Back button, lesson title, module breadcrumb, action buttons (Reset, Hint, Run, Show Solution)
- **Left panel (28%):** Problem description (lesson content markdown) + Solution tab
- **Right panel (72%):** vertical split — Monaco editor (60%) + Output/diagnostics (40%)

```tsx
// src/components/exercise/ExerciseIDE.tsx
"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, Play, RotateCcw, Eye, EyeOff,
  Lightbulb, Award, Terminal as TerminalIcon, BotMessageSquare,
  CheckCircle, XCircle, Send,
} from "lucide-react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import CodeEditor from "@/components/ide/CodeEditor";
import HintPanel from "@/components/ide/HintPanel";
import GradePanel from "@/components/ide/GradePanel";
import LessonContent from "@/components/lesson/LessonContent";
import { useAI } from "@/contexts/AIContext";

interface ExerciseIDEProps {
  courseSlug: string;
  courseTitle: string;
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
}

type LeftTab = "problem" | "solution";
type BottomTab = "output" | "grade" | "hint";

export default function ExerciseIDE({
  courseSlug, courseTitle, moduleTitle, lesson, prevLesson, nextLesson,
}: ExerciseIDEProps) {
  const [code, setCode] = useState(lesson.starterCode || "");
  const [output, setOutput] = useState("");
  const [isError, setIsError] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [leftTab, setLeftTab] = useState<LeftTab>("problem");
  const [bottomTab, setBottomTab] = useState<BottomTab>("output");
  const [showHint, setShowHint] = useState(false);
  const [hintText, setHintText] = useState("");
  const [hintLevel, setHintLevel] = useState(0);
  const [grade, setGrade] = useState<any>(null);

  const workerRef = useRef<Worker | null>(null);
  const { setLessonContext, setCurrentCode } = useAI();

  // Set lesson context for coach
  useState(() => {
    setLessonContext({
      courseTitle, moduleTitle,
      lessonTitle: lesson.title,
      lessonContent: lesson.content,
      starterCode: lesson.starterCode || "",
      solutionCode: lesson.solutionCode || "",
    });
  });

  const handleCodeChange = useCallback((value: string | undefined) => {
    const v = value || "";
    setCode(v);
    setCurrentCode(v);
  }, [setCurrentCode]);

  // Run code via Pyodide Web Worker
  const runCode = useCallback(async () => {
    setIsRunning(true);
    setOutput("");
    setIsError(false);
    setBottomTab("output");

    const codeToRun = showSolution ? (lesson.solutionCode || "") : code;

    try {
      if (workerRef.current) workerRef.current.terminate();
      const worker = new Worker("/pyodide-worker.js");
      workerRef.current = worker;

      const result = await new Promise<string>((resolve, reject) => {
        const timeout = setTimeout(() => {
          worker.terminate();
          reject(new Error("Execution timed out (10s)"));
        }, 10000);

        worker.onmessage = (e) => {
          clearTimeout(timeout);
          if (e.data.error) reject(new Error(e.data.error));
          else resolve(e.data.output || "(No output)");
        };
        worker.onerror = (e) => {
          clearTimeout(timeout);
          reject(new Error(e.message));
        };
        worker.postMessage({ id: Date.now(), code: codeToRun });
      });

      setOutput(result);
      setHasRun(true);
    } catch (err: any) {
      setOutput(err.message || "Execution failed");
      setIsError(true);
      setHasRun(true);
    } finally {
      setIsRunning(false);
    }
  }, [code, showSolution, lesson.solutionCode]);

  const resetCode = () => {
    setCode(lesson.starterCode || "");
    setOutput("");
    setIsError(false);
    setShowSolution(false);
    setGrade(null);
    setShowHint(false);
    setHintText("");
    setHintLevel(0);
    setHasRun(false);
  };

  const toggleSolution = () => {
    setShowSolution(!showSolution);
    if (!showSolution) setLeftTab("solution");
    else setLeftTab("problem");
  };

  // Hint handler
  const getHint = async () => {
    const newLevel = Math.min(hintLevel + 1, 3);
    setHintLevel(newLevel);
    setBottomTab("hint");
    setShowHint(true);

    try {
      const resp = await fetch("/api/ai/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonTitle: lesson.title,
          lessonContent: lesson.content,
          starterCode: lesson.starterCode,
          solutionCode: lesson.solutionCode,
          currentCode: code,
          hintLevel: newLevel,
        }),
      });
      if (resp.ok) {
        const data = await resp.json();
        setHintText(data.hint || "No hint available");
      }
    } catch {
      setHintText("Could not fetch hint. Try again.");
    }
  };

  // Grade handler
  const gradeCode = async () => {
    setBottomTab("grade");
    try {
      const resp = await fetch("/api/ai/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonTitle: lesson.title,
          lessonContent: lesson.content,
          starterCode: lesson.starterCode,
          solutionCode: lesson.solutionCode,
          studentCode: code,
          output,
        }),
      });
      if (resp.ok) {
        setGrade(await resp.json());
      }
    } catch {
      setGrade({ error: "Grading failed" });
    }
  };

  return (
    <div className="w-full h-screen bg-[var(--background)] text-white flex flex-col overflow-hidden">
      {/* ── Header ── */}
      <header className="shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-white/[0.08] bg-[var(--background)]/95 backdrop-blur-xl">
        {/* Left: nav */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/course/${courseSlug}/${lesson.slug}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Lesson
          </Link>
          <div className="w-px h-5 bg-white/[0.1]" />
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-white truncate">{lesson.title}</h1>
            <p className="text-[11px] text-white/30 truncate">{moduleTitle} • {courseTitle}</p>
          </div>
        </div>

        {/* Center: language badge */}
        <div className="hidden md:flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 text-xs font-medium border border-cyan-500/20">
            Python
          </span>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          {prevLesson && (
            <Link href={`/course/${courseSlug}/${prevLesson.slug}/exercise`}
              className="p-1.5 rounded-md hover:bg-white/[0.06] text-white/40 hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </Link>
          )}
          {nextLesson && (
            <Link href={`/course/${courseSlug}/${nextLesson.slug}`}
              className="p-1.5 rounded-md hover:bg-white/[0.06] text-white/40 hover:text-white transition-colors">
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
          <div className="w-px h-5 bg-white/[0.1]" />

          <button onClick={resetCode}
            className="px-3 py-1.5 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>

          <button onClick={getHint}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-fuchsia-500/15 text-fuchsia-400 hover:bg-fuchsia-500/25 transition-colors flex items-center gap-1.5 border border-fuchsia-500/20">
            <Lightbulb className="w-3.5 h-3.5" />
            Hint
          </button>

          <button onClick={runCode} disabled={isRunning}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600/80 hover:bg-cyan-500 text-white transition-colors flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 disabled:opacity-50">
            <Play className="w-3.5 h-3.5" />
            {isRunning ? "Running..." : "Run Code"}
          </button>

          <button onClick={gradeCode} disabled={!hasRun}
            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 disabled:opacity-50">
            <Award className="w-3.5 h-3.5" />
            Grade
          </button>

          <button onClick={toggleSolution}
            className="px-3 py-1.5 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors flex items-center gap-1.5">
            {showSolution ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showSolution ? "Hide Solution" : "Solution"}
          </button>
        </div>
      </header>

      {/* ── Main 3-panel layout ── */}
      <main className="flex-1 min-h-0 overflow-hidden">
        <PanelGroup direction="horizontal" className="h-full">
          {/* LEFT: Problem / Solution */}
          <Panel defaultSize={28} minSize={20} maxSize={40}
            className="flex flex-col border-r border-white/[0.08]">
            {/* Tab bar */}
            <div className="flex border-b border-white/[0.06] shrink-0">
              <button
                onClick={() => setLeftTab("problem")}
                className={`flex-1 py-2 text-xs font-medium text-center transition-colors ${
                  leftTab === "problem"
                    ? "text-cyan-400 border-b-2 border-cyan-400"
                    : "text-white/30 hover:text-white/50"
                }`}
              >
                Problem
              </button>
              <button
                onClick={() => { setLeftTab("solution"); setShowSolution(true); }}
                className={`flex-1 py-2 text-xs font-medium text-center transition-colors ${
                  leftTab === "solution"
                    ? "text-emerald-400 border-b-2 border-emerald-400"
                    : "text-white/30 hover:text-white/50"
                }`}
              >
                Solution
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {leftTab === "problem" ? (
                <div className="prose prose-sm prose-invert max-w-none">
                  <LessonContent content={lesson.content} />
                </div>
              ) : (
                <div className="space-y-3">
                  {showSolution && lesson.solutionCode ? (
                    <>
                      <p className="text-xs text-emerald-400/60 mb-2">Official solution:</p>
                      <div className="bg-slate-900/60 border border-slate-700/50 rounded-lg overflow-hidden">
                        <CodeEditor
                          code={lesson.solutionCode}
                          onChange={() => {}}
                          readOnly={true}
                          height="400px"
                        />
                      </div>
                    </>
                  ) : (
                    <p className="text-white/30 text-sm text-center py-8">
                      Run your code first, then view the solution.
                    </p>
                  )}
                </div>
              )}
            </div>
          </Panel>

          <PanelResizeHandle className="w-1.5 bg-white/[0.04] hover:bg-white/[0.08] transition-colors" />

          {/* RIGHT: Editor + Diagnostics (vertical split) */}
          <Panel defaultSize={72} minSize={50} className="flex flex-col">
            <PanelGroup direction="vertical" className="h-full">
              {/* Code Editor */}
              <Panel defaultSize={60} minSize={35}>
                <div className="h-full flex flex-col">
                  {/* File tab bar */}
                  <div className="shrink-0 flex items-center gap-2 px-3 py-1.5 border-b border-white/[0.06] bg-white/[0.02]">
                    <span className="text-xs text-cyan-400 font-medium flex items-center gap-1.5">
                      <TerminalIcon className="w-3 h-3" />
                      main.py
                    </span>
                    <span className="text-[10px] text-white/20 ml-auto">
                      {showSolution ? "Read-only (solution)" : "Editable"}
                    </span>
                  </div>
                  {/* Monaco editor */}
                  <div className="flex-1 min-h-0">
                    <CodeEditor
                      code={showSolution ? (lesson.solutionCode || "") : code}
                      onChange={handleCodeChange}
                      readOnly={showSolution}
                      height="100%"
                    />
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="h-1.5 bg-white/[0.04] hover:bg-white/[0.08] transition-colors" />

              {/* Diagnostics: Output / Grade / Hints */}
              <Panel defaultSize={40} minSize={25}
                className="flex flex-col border-t border-white/[0.06]">
                {/* Tab bar */}
                <div className="flex border-b border-white/[0.06] shrink-0 bg-white/[0.02]">
                  <button
                    onClick={() => setBottomTab("output")}
                    className={`px-4 py-2 text-xs font-medium flex items-center gap-1.5 transition-colors ${
                      bottomTab === "output"
                        ? "text-cyan-400 border-b-2 border-cyan-400"
                        : "text-white/30 hover:text-white/50"
                    }`}
                  >
                    <TerminalIcon className="w-3 h-3" />
                    Output
                  </button>
                  <button
                    onClick={() => setBottomTab("grade")}
                    className={`px-4 py-2 text-xs font-medium flex items-center gap-1.5 transition-colors ${
                      bottomTab === "grade"
                        ? "text-emerald-400 border-b-2 border-emerald-400"
                        : "text-white/30 hover:text-white/50"
                    }`}
                  >
                    <Award className="w-3 h-3" />
                    Grade
                  </button>
                  <button
                    onClick={() => setBottomTab("hint")}
                    className={`px-4 py-2 text-xs font-medium flex items-center gap-1.5 transition-colors ${
                      bottomTab === "hint"
                        ? "text-fuchsia-400 border-b-2 border-fuchsia-400"
                        : "text-white/30 hover:text-white/50"
                    }`}
                  >
                    <BotMessageSquare className="w-3 h-3" />
                    AI Help {hintLevel > 0 ? `(${hintLevel}/3)` : ""}
                  </button>
                </div>

                {/* Tab content */}
                <div className="flex-1 overflow-y-auto p-3 font-mono text-sm">
                  {bottomTab === "output" && (
                    <div>
                      {isRunning ? (
                        <div className="flex items-center gap-2 text-cyan-400">
                          <div className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                          Running...
                        </div>
                      ) : output ? (
                        <pre className={`whitespace-pre-wrap leading-relaxed ${
                          isError ? "text-red-400" : "text-emerald-400"
                        }`}>
                          {output}
                        </pre>
                      ) : (
                        <p className="text-white/20 text-xs">
                          Click &quot;Run Code&quot; to execute your solution
                        </p>
                      )}
                    </div>
                  )}

                  {bottomTab === "grade" && (
                    <div>
                      {grade ? (
                        <GradePanel grade={grade} />
                      ) : (
                        <p className="text-white/20 text-xs">
                          Run your code first, then click &quot;Grade&quot; for AI feedback
                        </p>
                      )}
                    </div>
                  )}

                  {bottomTab === "hint" && (
                    <div>
                      {hintText ? (
                        <div className="bg-fuchsia-950/30 border border-fuchsia-500/20 rounded-lg p-3">
                          <div className="flex items-center gap-1.5 mb-2">
                            <Lightbulb className="w-3.5 h-3.5 text-fuchsia-400" />
                            <span className="text-xs text-fuchsia-400 font-medium">
                              Hint {hintLevel}/3
                            </span>
                          </div>
                          <p className="text-white/80 text-xs leading-relaxed whitespace-pre-wrap">
                            {hintText}
                          </p>
                          {hintLevel < 3 && (
                            <button onClick={getHint}
                              className="mt-2 text-[11px] text-fuchsia-400 underline hover:text-fuchsia-300">
                              Need more help?
                            </button>
                          )}
                        </div>
                      ) : (
                        <p className="text-white/20 text-xs">
                          Click &quot;Hint&quot; in the header for progressive hints
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/exercise/ExerciseIDE.tsx
git commit -m "feat: create ExerciseIDE component with AscentIDE 3-panel layout"
```

---

## Chunk 2: Update Lesson Pages

### Task 3: Remove IDE split from LessonPage, add "Start Exercise" button

**Files:**
- Modify: `src/components/lesson/LessonPage.tsx`

- [ ] **Step 1: Read current LessonPage**

Read the full `src/components/lesson/LessonPage.tsx` to understand the split-view code.

- [ ] **Step 2: Replace the exercise split-view with a "Start Exercise" CTA**

When `hasExercise` is true, the lesson page should:
- Render lesson content full-width (no split)
- Show a prominent "Start Exercise" button at the bottom of the content
- The button links to `/course/${courseSlug}/${lesson.slug}/exercise`

Remove the `PanelGroup` / `Panel` split-view code for exercise lessons. Keep the content-only layout as the default for all lessons.

The key change: replace the conditional split-view rendering (lines ~160-340) with always rendering full-width content + an exercise CTA at the bottom:

```tsx
// At the bottom of lesson content, after LessonContent and before LessonNav:
{hasExercise && (
  <div className="mt-8 mb-4">
    <Link
      href={`/course/${courseSlug}/${lesson.slug}/exercise`}
      className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600/80 to-blue-600/80 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-base transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 border border-cyan-500/20"
    >
      <Code2 className="w-5 h-5" />
      Start Exercise
      <ChevronRight className="w-4 h-4" />
    </Link>
    <p className="text-center text-xs text-white/30 mt-2">
      Opens a full-screen coding environment
    </p>
  </div>
)}
```

- [ ] **Step 3: Remove the PanelGroup/IDEPanel imports if no longer used in this file**

Remove unused imports: `Panel`, `PanelGroup`, `PanelResizeHandle`, `IDEPanel` if they're only used in the exercise split-view.

- [ ] **Step 4: Commit**

```bash
git add src/components/lesson/LessonPage.tsx
git commit -m "refactor: remove IDE split-view from LessonPage, add 'Start Exercise' button"
```

---

### Task 4: Ensure exercise route handles edge cases

**Files:**
- Modify: `src/app/course/[courseSlug]/[lessonSlug]/exercise/page.tsx`

- [ ] **Step 1: Handle generated courses and language courses**

The exercise route currently only checks `courses` (hardcoded). Add fallback for generated courses (same pattern as the lesson route):

```tsx
// Add after hardcoded course lookup:
const [generatedCourse, setGeneratedCourse] = useState<Course | null>(null);

useEffect(() => {
  if (course || generatedCourse) return;
  fetch("/api/courses/generated")
    .then(r => r.ok ? r.json() : { courses: [] })
    .then(data => {
      const found = (data.courses as Course[])?.find(c => c.slug === courseSlug);
      if (found) setGeneratedCourse(found);
    })
    .catch(() => {});
}, [courseSlug]);

const finalCourse = course || generatedCourse;
```

- [ ] **Step 2: Commit**

```bash
git add src/app/course/\[courseSlug\]/\[lessonSlug\]/exercise/page.tsx
git commit -m "feat: handle generated courses in exercise route"
```

---

## Chunk 3: Mobile Responsiveness

### Task 5: Make ExerciseIDE mobile-responsive

**Files:**
- Modify: `src/components/exercise/ExerciseIDE.tsx`

- [ ] **Step 1: Add mobile layout**

On screens < `md` (768px), the 3-panel layout should stack vertically:
- Problem description (collapsible)
- Code editor (full width)
- Output/diagnostics (full width)

Add responsive detection and a vertical stacked layout as alternative:

```tsx
// At top of ExerciseIDE component, add:
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const check = () => setIsMobile(window.innerWidth < 768);
  check();
  window.addEventListener('resize', check);
  return () => window.removeEventListener('resize', check);
}, []);

// In the header, make action buttons responsive:
// On mobile: show icon-only buttons (hide text labels)
// On desktop: show full buttons with text
```

For mobile, replace the horizontal PanelGroup with a simple vertical stack:

```tsx
{isMobile ? (
  <div className="flex-1 flex flex-col overflow-hidden">
    {/* Collapsible problem description */}
    <details className="border-b border-white/[0.06]">
      <summary className="px-4 py-2 text-xs text-cyan-400 font-medium cursor-pointer">
        Problem Description
      </summary>
      <div className="px-4 pb-4 max-h-48 overflow-y-auto prose prose-sm prose-invert">
        <LessonContent content={lesson.content} />
      </div>
    </details>

    {/* Editor */}
    <div className="flex-1 min-h-0">
      <CodeEditor code={...} onChange={...} height="100%" />
    </div>

    {/* Output */}
    <div className="h-40 shrink-0 border-t border-white/[0.06] overflow-y-auto p-3">
      {/* Same output/grade/hint tabs */}
    </div>
  </div>
) : (
  /* Desktop: existing PanelGroup layout */
)}
```

- [ ] **Step 2: Make header buttons icon-only on mobile**

```tsx
// Wrap button text in hidden md:inline spans:
<button>
  <Play className="w-3.5 h-3.5" />
  <span className="hidden md:inline ml-1.5">{isRunning ? "Running..." : "Run Code"}</span>
</button>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/exercise/ExerciseIDE.tsx
git commit -m "feat: add mobile-responsive layout for exercise IDE"
```

---

## Execution Order

```
Task 1 → Exercise route page
Task 2 → ExerciseIDE component (3-panel layout)
Task 3 → Update LessonPage (remove split, add CTA)
Task 4 → Edge cases (generated courses)
Task 5 → Mobile responsiveness
```

Tasks 1-2 are the core (new route + component).
Task 3 modifies the existing lesson page.
Tasks 4-5 are polish.

## Layout Diagram

```
BEFORE (current):
┌─────────────────────────────────────────────────────────┐
│ TopNav                                                   │
├──────────┬──────────────────┬──────────┬────────────────┤
│ Sidebar  │ Lesson Content   │ IDE      │ Coach (overlay)│
│ (nav)    │ (markdown)       │ (editor) │ (blocks IDE!)  │
│          │                  │ (output) │                │
└──────────┴──────────────────┴──────────┴────────────────┘

AFTER (new):

Lesson page: /course/python/two-sum
┌─────────────────────────────────────────────────────────┐
│ TopNav                                                   │
├──────────┬──────────────────────────────┬────────────────┤
│ Sidebar  │ Lesson Content (full width)  │ Coach (push)   │
│ (nav)    │ ────────────────────         │ (sidebar)      │
│          │ [▶ Start Exercise]           │                │
│          │                              │                │
└──────────┴──────────────────────────────┴────────────────┘

Exercise page: /course/python/two-sum/exercise
┌──────────────────────────────────────────────────────────┐
│ Header: ← Back | Two Sum | Python | Reset | Hint | Run  │
├──────────────┬───────────────────────────────────────────┤
│              │  ┌─────────────────────────────────────┐  │
│  Problem     │  │  Monaco Editor (main.py)            │  │
│  (markdown)  │  │                                     │  │
│              │  │  def two_sum(nums, target):         │  │
│  ──────────  │  │      # TODO: implement              │  │
│  Solution    │  │      pass                           │  │
│  (read-only) │  ├─────────────────────────────────────┤  │
│              │  │  Output | Grade | AI Help            │  │
│              │  │  > [0, 1]                            │  │
│              │  │  > [1, 2]                            │  │
└──────────────┴──┴─────────────────────────────────────┘──┘
```
