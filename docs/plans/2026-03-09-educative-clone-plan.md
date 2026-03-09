# Educative.io Clone — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a full educative.io replica with two comprehensive courses, in-browser Python IDE, and progress tracking.

**Architecture:** Next.js 14 App Router with TypeScript. Course content stored as TS data files. Monaco Editor for code editing, Pyodide for in-browser Python execution. Tailwind CSS + 21st.dev components for polished UI. localStorage for progress.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Monaco Editor, Pyodide, localStorage

---

## Phase 1: Project Scaffold & Core Layout

### Task 1: Initialize Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.mjs`, `postcss.config.mjs`
- Create: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`

**Step 1: Scaffold Next.js with TypeScript + Tailwind**

Run:
```bash
cd /c/Users/bilal/Downloads/grokking
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

**Step 2: Install dependencies**

Run:
```bash
npm install @monaco-editor/react react-split-pane react-markdown remark-gfm rehype-highlight lucide-react clsx
```

**Step 3: Verify dev server starts**

Run: `npm run dev`
Expected: Server starts on localhost:3000

**Step 4: Commit**

```bash
git init
git add -A
git commit -m "chore: scaffold Next.js project with dependencies"
```

---

### Task 2: Create core layout — top nav + sidebar + content area

**Files:**
- Create: `src/components/layout/TopNav.tsx`
- Create: `src/components/layout/Sidebar.tsx`
- Create: `src/components/layout/CourseLayout.tsx`
- Modify: `src/app/globals.css`

**Step 1: Build TopNav component**

```tsx
// src/components/layout/TopNav.tsx
"use client";
import { Moon, Sun, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

interface TopNavProps {
  courseTitle?: string;
  progress?: number;
  onToggleSidebar?: () => void;
}

export default function TopNav({ courseTitle, progress = 0, onToggleSidebar }: TopNavProps) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDark = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", !dark ? "dark" : "light");
  };

  return (
    <nav className="h-14 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center px-4 gap-4 sticky top-0 z-50">
      <button onClick={onToggleSidebar} className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
        <Menu size={20} />
      </button>
      <Link href="/" className="font-bold text-lg text-blue-600 dark:text-blue-400 shrink-0">
        Grokking
      </Link>
      {courseTitle && (
        <span className="text-sm text-gray-600 dark:text-gray-400 truncate hidden sm:block">
          {courseTitle}
        </span>
      )}
      {courseTitle && (
        <div className="flex-1 max-w-xs ml-auto mr-4">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">{Math.round(progress)}% complete</span>
        </div>
      )}
      <button onClick={toggleDark} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded ml-auto">
        {dark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </nav>
  );
}
```

**Step 2: Build Sidebar component**

```tsx
// src/components/layout/Sidebar.tsx
"use client";
import { ChevronDown, ChevronRight, Check, Circle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";

export interface SidebarLesson {
  id: string;
  title: string;
  slug: string;
}

export interface SidebarModule {
  id: string;
  title: string;
  lessons: SidebarLesson[];
}

interface SidebarProps {
  modules: SidebarModule[];
  courseSlug: string;
  currentLessonId?: string;
  completedLessons: Set<string>;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ modules, courseSlug, currentLessonId, completedLessons, isOpen, onClose }: SidebarProps) {
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    // Auto-expand module containing current lesson
    const set = new Set<string>();
    for (const mod of modules) {
      if (mod.lessons.some(l => l.id === currentLessonId)) {
        set.add(mod.id);
      }
    }
    return set;
  });

  const toggleModule = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
      <aside className={clsx(
        "fixed lg:static top-14 left-0 h-[calc(100vh-3.5rem)] w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-y-auto z-40 transition-transform lg:translate-x-0 shrink-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4 space-y-1">
          {modules.map((mod, mi) => {
            const modLessons = mod.lessons;
            const completedCount = modLessons.filter(l => completedLessons.has(l.id)).length;
            const isExpanded = expanded.has(mod.id);

            return (
              <div key={mod.id}>
                <button
                  onClick={() => toggleModule(mod.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  <span className="flex-1 text-left">{mi + 1}. {mod.title}</span>
                  <span className="text-xs text-gray-400">{completedCount}/{modLessons.length}</span>
                </button>
                {isExpanded && (
                  <div className="ml-4 space-y-0.5">
                    {modLessons.map(lesson => {
                      const isActive = lesson.id === currentLessonId;
                      const isCompleted = completedLessons.has(lesson.id);
                      return (
                        <Link
                          key={lesson.id}
                          href={`/course/${courseSlug}/${lesson.slug}`}
                          onClick={onClose}
                          className={clsx(
                            "flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors",
                            isActive
                              ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                          )}
                        >
                          {isCompleted ? (
                            <Check size={14} className="text-green-500 shrink-0" />
                          ) : (
                            <Circle size={14} className="text-gray-300 dark:text-gray-600 shrink-0" />
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}
```

**Step 3: Build CourseLayout component**

```tsx
// src/components/layout/CourseLayout.tsx
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
  courseTitle, courseSlug, modules, currentLessonId, completedLessons, progress, children
}: CourseLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <TopNav
        courseTitle={courseTitle}
        progress={progress}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
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
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add core layout components — TopNav, Sidebar, CourseLayout"
```

---

### Task 3: Build Monaco IDE + Pyodide execution component

**Files:**
- Create: `src/components/ide/CodeEditor.tsx`
- Create: `src/components/ide/OutputPanel.tsx`
- Create: `src/components/ide/IDEPanel.tsx`
- Create: `src/lib/pyodide-worker.ts`
- Create: `public/pyodide-worker.js`

**Step 1: Create Pyodide web worker for safe code execution**

```js
// public/pyodide-worker.js
importScripts("https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js");

let pyodide = null;

async function initPyodide() {
  if (!pyodide) {
    pyodide = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
    });
  }
  return pyodide;
}

self.onmessage = async function (e) {
  const { id, code } = e.data;
  try {
    const py = await initPyodide();
    // Capture stdout
    py.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
`);

    let result;
    try {
      result = py.runPython(code);
    } catch (err) {
      const stderr = py.runPython("sys.stderr.getvalue()");
      self.postMessage({ id, error: stderr || String(err) });
      return;
    }

    const stdout = py.runPython("sys.stdout.getvalue()");
    const stderr = py.runPython("sys.stderr.getvalue()");

    let output = stdout;
    if (stderr) output += "\n" + stderr;
    if (result !== undefined && result !== null && !stdout) {
      output = String(result);
    }

    self.postMessage({ id, output: output || "Program finished (no output)" });
  } catch (err) {
    self.postMessage({ id, error: String(err) });
  }
};
```

**Step 2: Create CodeEditor component (Monaco wrapper)**

```tsx
// src/components/ide/CodeEditor.tsx
"use client";
import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  height?: string;
}

export default function CodeEditor({ code, onChange, language = "python", readOnly = false, height = "100%" }: CodeEditorProps) {
  return (
    <MonacoEditor
      height={height}
      language={language}
      value={code}
      onChange={(val) => onChange(val || "")}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 4,
        wordWrap: "on",
        readOnly,
        padding: { top: 12 },
      }}
    />
  );
}
```

**Step 3: Create OutputPanel component**

```tsx
// src/components/ide/OutputPanel.tsx
"use client";
interface OutputPanelProps {
  output: string;
  isRunning: boolean;
  error?: boolean;
}

export default function OutputPanel({ output, isRunning, error }: OutputPanelProps) {
  return (
    <div className="bg-gray-950 text-gray-100 font-mono text-sm p-4 overflow-auto h-full">
      {isRunning ? (
        <div className="flex items-center gap-2 text-yellow-400">
          <div className="animate-spin h-4 w-4 border-2 border-yellow-400 border-t-transparent rounded-full" />
          Running...
        </div>
      ) : (
        <pre className={error ? "text-red-400" : "text-green-300"} style={{ whiteSpace: "pre-wrap" }}>
          {output || "Click 'Run' to execute your code"}
        </pre>
      )}
    </div>
  );
}
```

**Step 4: Create IDEPanel — the full IDE with run/reset/solution**

```tsx
// src/components/ide/IDEPanel.tsx
"use client";
import { useState, useRef, useCallback } from "react";
import { Play, RotateCcw, Eye, EyeOff } from "lucide-react";
import CodeEditor from "./CodeEditor";
import OutputPanel from "./OutputPanel";

interface IDEPanelProps {
  starterCode: string;
  solutionCode: string;
  height?: string;
}

export default function IDEPanel({ starterCode, solutionCode, height = "500px" }: IDEPanelProps) {
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  const runCode = useCallback(() => {
    setIsRunning(true);
    setOutput("");
    setIsError(false);

    if (workerRef.current) {
      workerRef.current.terminate();
    }

    const worker = new Worker("/pyodide-worker.js");
    workerRef.current = worker;

    const id = Date.now();
    worker.postMessage({ id, code: showSolution ? solutionCode : code });

    const timeout = setTimeout(() => {
      worker.terminate();
      setOutput("Execution timed out (10s limit)");
      setIsError(true);
      setIsRunning(false);
    }, 10000);

    worker.onmessage = (e) => {
      clearTimeout(timeout);
      if (e.data.error) {
        setOutput(e.data.error);
        setIsError(true);
      } else {
        setOutput(e.data.output);
        setIsError(false);
      }
      setIsRunning(false);
    };

    worker.onerror = (e) => {
      clearTimeout(timeout);
      setOutput("Worker error: " + e.message);
      setIsError(true);
      setIsRunning(false);
    };
  }, [code, solutionCode, showSolution]);

  const resetCode = () => {
    setCode(starterCode);
    setShowSolution(false);
    setOutput("");
  };

  const toggleSolution = () => {
    setShowSolution(!showSolution);
  };

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden" style={{ height }}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 border-b border-gray-700">
        <button
          onClick={runCode}
          disabled={isRunning}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium rounded transition-colors"
        >
          <Play size={14} /> Run
        </button>
        <button
          onClick={resetCode}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-600 hover:bg-gray-500 text-white text-sm rounded transition-colors"
        >
          <RotateCcw size={14} /> Reset
        </button>
        <button
          onClick={toggleSolution}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors ml-auto"
        >
          {showSolution ? <EyeOff size={14} /> : <Eye size={14} />}
          {showSolution ? "Hide Solution" : "Show Solution"}
        </button>
      </div>

      {/* Editor + Output split */}
      <div className="flex flex-col" style={{ height: "calc(100% - 42px)" }}>
        <div className="flex-1 min-h-0">
          <CodeEditor
            code={showSolution ? solutionCode : code}
            onChange={setCode}
            readOnly={showSolution}
          />
        </div>
        <div className="h-36 border-t border-gray-700">
          <OutputPanel output={output} isRunning={isRunning} error={isError} />
        </div>
      </div>
    </div>
  );
}
```

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Monaco IDE + Pyodide execution components"
```

---

### Task 4: Build lesson content renderer + navigation

**Files:**
- Create: `src/components/lesson/LessonContent.tsx`
- Create: `src/components/lesson/LessonNav.tsx`
- Create: `src/components/lesson/LessonPage.tsx`
- Create: `src/lib/progress.ts`

**Step 1: Create progress tracking utility**

```ts
// src/lib/progress.ts
const PROGRESS_KEY = "grokking-progress";

export function getCompletedLessons(courseSlug: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const data = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
    return new Set(data[courseSlug] || []);
  } catch {
    return new Set();
  }
}

export function markLessonComplete(courseSlug: string, lessonId: string): Set<string> {
  const completed = getCompletedLessons(courseSlug);
  completed.add(lessonId);
  const data = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
  data[courseSlug] = Array.from(completed);
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
  return completed;
}

export function markLessonIncomplete(courseSlug: string, lessonId: string): Set<string> {
  const completed = getCompletedLessons(courseSlug);
  completed.delete(lessonId);
  const data = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
  data[courseSlug] = Array.from(completed);
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
  return completed;
}

export function getCourseProgress(courseSlug: string, totalLessons: number): number {
  const completed = getCompletedLessons(courseSlug);
  if (totalLessons === 0) return 0;
  return (completed.size / totalLessons) * 100;
}
```

**Step 2: Create LessonContent — markdown renderer with code blocks**

```tsx
// src/components/lesson/LessonContent.tsx
"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface LessonContentProps {
  content: string;
}

export default function LessonContent({ content }: LessonContentProps) {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-headings:scroll-mt-20 prose-img:rounded-lg prose-table:border prose-th:bg-gray-100 dark:prose-th:bg-gray-800">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
```

**Step 3: Create LessonNav — previous/next + mark complete buttons**

```tsx
// src/components/lesson/LessonNav.tsx
"use client";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import Link from "next/link";

interface LessonNavProps {
  courseSlug: string;
  prevLesson?: { slug: string; title: string } | null;
  nextLesson?: { slug: string; title: string } | null;
  isCompleted: boolean;
  onToggleComplete: () => void;
}

export default function LessonNav({ courseSlug, prevLesson, nextLesson, isCompleted, onToggleComplete }: LessonNavProps) {
  return (
    <div className="flex items-center justify-between py-6 border-t border-gray-200 dark:border-gray-700 mt-8">
      {prevLesson ? (
        <Link
          href={`/course/${courseSlug}/${prevLesson.slug}`}
          className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ChevronLeft size={16} /> {prevLesson.title}
        </Link>
      ) : <div />}

      <button
        onClick={onToggleComplete}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
          isCompleted
            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        <CheckCircle size={16} />
        {isCompleted ? "Completed" : "Mark Complete"}
      </button>

      {nextLesson ? (
        <Link
          href={`/course/${courseSlug}/${nextLesson.slug}`}
          className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          {nextLesson.title} <ChevronRight size={16} />
        </Link>
      ) : <div />}
    </div>
  );
}
```

**Step 4: Create LessonPage — the full lesson view combining content + IDE**

```tsx
// src/components/lesson/LessonPage.tsx
"use client";
import { useState, useEffect } from "react";
import CourseLayout from "../layout/CourseLayout";
import LessonContent from "./LessonContent";
import LessonNav from "./LessonNav";
import IDEPanel from "../ide/IDEPanel";
import { SidebarModule } from "../layout/Sidebar";
import { getCompletedLessons, markLessonComplete, markLessonIncomplete, getCourseProgress } from "@/lib/progress";

interface LessonData {
  id: string;
  slug: string;
  title: string;
  content: string;
  starterCode?: string;
  solutionCode?: string;
}

interface LessonPageProps {
  courseTitle: string;
  courseSlug: string;
  modules: SidebarModule[];
  lesson: LessonData;
  prevLesson: { slug: string; title: string } | null;
  nextLesson: { slug: string; title: string } | null;
  totalLessons: number;
}

export default function LessonPage({
  courseTitle, courseSlug, modules, lesson, prevLesson, nextLesson, totalLessons
}: LessonPageProps) {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const completed = getCompletedLessons(courseSlug);
    setCompletedLessons(completed);
    setProgress(getCourseProgress(courseSlug, totalLessons));
  }, [courseSlug, totalLessons]);

  const toggleComplete = () => {
    const isCompleted = completedLessons.has(lesson.id);
    const updated = isCompleted
      ? markLessonIncomplete(courseSlug, lesson.id)
      : markLessonComplete(courseSlug, lesson.id);
    setCompletedLessons(new Set(updated));
    setProgress((updated.size / totalLessons) * 100);
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
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">{lesson.title}</h1>
        <LessonContent content={lesson.content} />

        {lesson.starterCode && lesson.solutionCode && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Try it yourself</h2>
            <IDEPanel
              starterCode={lesson.starterCode}
              solutionCode={lesson.solutionCode}
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
```

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add lesson content renderer, navigation, and progress tracking"
```

---

### Task 5: Create course data types and structure

**Files:**
- Create: `src/data/types.ts`

**Step 1: Define course data types**

```ts
// src/data/types.ts
export interface Lesson {
  id: string;
  slug: string;
  title: string;
  content: string;        // Markdown content
  starterCode?: string;   // For IDE exercises
  solutionCode?: string;  // Solution to reveal
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;           // Emoji or icon name
  modules: Module[];
}

export function getAllLessons(course: Course): Lesson[] {
  return course.modules.flatMap(m => m.lessons);
}

export function findLesson(course: Course, lessonSlug: string): {
  lesson: Lesson;
  module: Module;
  prevLesson: Lesson | null;
  nextLesson: Lesson | null;
} | null {
  const allLessons = getAllLessons(course);
  const index = allLessons.findIndex(l => l.slug === lessonSlug);
  if (index === -1) return null;
  const lesson = allLessons[index];
  const module = course.modules.find(m => m.lessons.some(l => l.id === lesson.id))!;
  return {
    lesson,
    module,
    prevLesson: index > 0 ? allLessons[index - 1] : null,
    nextLesson: index < allLessons.length - 1 ? allLessons[index + 1] : null,
  };
}

export function toSidebarModules(course: Course) {
  return course.modules.map(m => ({
    id: m.id,
    title: m.title,
    lessons: m.lessons.map(l => ({ id: l.id, title: l.title, slug: l.slug })),
  }));
}
```

**Step 2: Commit**

```bash
git add -A
git commit -m "feat: add course data types and utilities"
```

---

### Task 6: Create routing — landing page + course pages

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/app/course/[courseSlug]/[lessonSlug]/page.tsx`
- Create: `src/app/course/[courseSlug]/page.tsx`

**Step 1: Build landing page (course catalog)**

```tsx
// src/app/page.tsx
import Link from "next/link";
import { courses } from "@/data";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <nav className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Grokking</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Master coding interviews & system design</p>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8">Courses</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {courses.map(course => (
            <Link
              key={course.id}
              href={`/course/${course.slug}`}
              className="block p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition-all group"
            >
              <div className="text-4xl mb-4">{course.icon}</div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {course.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{course.description}</p>
              <div className="text-sm text-gray-500">
                {course.modules.length} modules &middot; {course.modules.reduce((a, m) => a + m.lessons.length, 0)} lessons
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
```

**Step 2: Build course overview page (redirects to first lesson)**

```tsx
// src/app/course/[courseSlug]/page.tsx
import { redirect } from "next/navigation";
import { courses } from "@/data";
import { getAllLessons } from "@/data/types";

export default function CoursePage({ params }: { params: { courseSlug: string } }) {
  const course = courses.find(c => c.slug === params.courseSlug);
  if (!course) redirect("/");
  const firstLesson = getAllLessons(course)[0];
  if (!firstLesson) redirect("/");
  redirect(`/course/${course.slug}/${firstLesson.slug}`);
}

export function generateStaticParams() {
  return courses.map(c => ({ courseSlug: c.slug }));
}
```

**Step 3: Build lesson page**

```tsx
// src/app/course/[courseSlug]/[lessonSlug]/page.tsx
"use client";
import { useParams } from "next/navigation";
import { courses } from "@/data";
import { findLesson, toSidebarModules, getAllLessons } from "@/data/types";
import LessonPage from "@/components/lesson/LessonPage";

export default function LessonRoute() {
  const params = useParams();
  const courseSlug = params.courseSlug as string;
  const lessonSlug = params.lessonSlug as string;

  const course = courses.find(c => c.slug === courseSlug);
  if (!course) return <div className="p-8">Course not found</div>;

  const result = findLesson(course, lessonSlug);
  if (!result) return <div className="p-8">Lesson not found</div>;

  const { lesson, prevLesson, nextLesson } = result;
  const allLessons = getAllLessons(course);

  return (
    <LessonPage
      courseTitle={course.title}
      courseSlug={course.slug}
      modules={toSidebarModules(course)}
      lesson={lesson}
      prevLesson={prevLesson ? { slug: prevLesson.slug, title: prevLesson.title } : null}
      nextLesson={nextLesson ? { slug: nextLesson.slug, title: nextLesson.title } : null}
      totalLessons={allLessons.length}
    />
  );
}
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add routing — landing page, course overview, lesson pages"
```

---

## Phase 2: Course Content — Grokking the Coding Interview

### Task 7-22: Create all 16 coding interview pattern modules

Each task creates one module file at `src/data/coding-interview/XX-module-name.ts` containing the module with all its lessons (intro + problems). Each lesson includes markdown content explaining the pattern, visual examples, starter code, and solution code.

The modules are:
- Task 7: `01-two-pointers.ts` (intro + 5 problems)
- Task 8: `02-fast-slow-pointers.ts` (intro + 5 problems)
- Task 9: `03-sliding-window.ts` (intro + 5 problems)
- Task 10: `04-merge-intervals.ts` (intro + 5 problems)
- Task 11: `05-cyclic-sort.ts` (intro + 5 problems)
- Task 12: `06-linked-list-reversal.ts` (intro + 5 problems)
- Task 13: `07-tree-bfs.ts` (intro + 5 problems)
- Task 14: `08-tree-dfs.ts` (intro + 5 problems)
- Task 15: `09-two-heaps.ts` (intro + 5 problems)
- Task 16: `10-subsets.ts` (intro + 5 problems)
- Task 17: `11-modified-binary-search.ts` (intro + 5 problems)
- Task 18: `12-bitwise-xor.ts` (intro + 5 problems)
- Task 19: `13-top-k-elements.ts` (intro + 5 problems)
- Task 20: `14-k-way-merge.ts` (intro + 5 problems)
- Task 21: `15-topological-sort.ts` (intro + 5 problems)
- Task 22: `16-dynamic-programming.ts` (intro + 5 problems)

Each module follows this pattern:

```ts
// src/data/coding-interview/01-two-pointers.ts
import { Module } from "../types";

export const twoPointersModule: Module = {
  id: "two-pointers",
  title: "Two Pointers",
  description: "Learn the two pointers technique...",
  lessons: [
    {
      id: "two-pointers-intro",
      slug: "two-pointers-intro",
      title: "Introduction to Two Pointers",
      content: `# Two Pointers Pattern\n\n...comprehensive markdown...`,
    },
    {
      id: "two-pointers-pair-sum",
      slug: "pair-with-target-sum",
      title: "Pair with Target Sum",
      content: `# Pair with Target Sum\n\n## Problem Statement\n...`,
      starterCode: `def pair_with_target_sum(arr, target):\n    # Write your code here\n    pass\n\n# Test\nprint(pair_with_target_sum([1, 2, 3, 4, 6], 6))`,
      solutionCode: `def pair_with_target_sum(arr, target):\n    left, right = 0, len(arr) - 1\n    while left < right:\n        s = arr[left] + arr[right]\n        if s == target:\n            return [left, right]\n        if s < target:\n            left += 1\n        else:\n            right -= 1\n    return [-1, -1]\n\nprint(pair_with_target_sum([1, 2, 3, 4, 6], 6))`,
    },
    // ... more lessons
  ],
};
```

**Each lesson contains:**
- Problem statement with examples and constraints
- Visual walkthrough explaining the approach
- Time/space complexity analysis
- Starter code with test cases
- Complete solution code

After each module, commit:
```bash
git add src/data/coding-interview/XX-*.ts
git commit -m "feat: add [module name] module with N lessons"
```

---

## Phase 3: Course Content — System Design

### Task 23-34: Create all 12 system design chapters

Each task creates one chapter file at `src/data/system-design/XX-chapter-name.ts`.

- Task 23: `01-fundamentals.ts` (scaling, load balancing, caching, databases — 6 lessons)
- Task 24: `02-key-concepts.ts` (CAP, consistent hashing, message queues — 5 lessons)
- Task 25: `03-url-shortener.ts` (4 lessons)
- Task 26: `04-instagram.ts` (4 lessons)
- Task 27: `05-twitter.ts` (4 lessons)
- Task 28: `06-chat-system.ts` (4 lessons)
- Task 29: `07-web-crawler.ts` (4 lessons)
- Task 30: `08-notification-system.ts` (4 lessons)
- Task 31: `09-rate-limiter.ts` (4 lessons)
- Task 32: `10-key-value-store.ts` (4 lessons)
- Task 33: `11-youtube.ts` (4 lessons)
- Task 34: `12-google-docs.ts` (4 lessons)

System design lessons have markdown content but no IDE (no starterCode/solutionCode). They include:
- Requirements gathering (functional + non-functional)
- Back-of-envelope estimation
- High-level architecture with ASCII diagrams
- Deep dives into components
- Trade-off analysis

---

## Phase 4: Wire Everything Together

### Task 35: Create course index files and data barrel export

**Files:**
- Create: `src/data/coding-interview/index.ts`
- Create: `src/data/system-design/index.ts`
- Create: `src/data/index.ts`

These import all modules, assemble them into `Course` objects, and export as `courses` array.

### Task 36: Add highlight.js CSS for code syntax highlighting

**Files:**
- Modify: `src/app/globals.css` — import highlight.js theme
- Modify: `src/app/layout.tsx` — add Inter font, metadata

### Task 37: Polish UI — responsive design, animations, dark mode consistency

### Task 38: Final integration test — verify all routes, IDE, progress tracking

**Step 1:** `npm run build` — verify no build errors
**Step 2:** `npm run dev` — manually test each course, lesson navigation, IDE execution, progress saving

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete educative.io clone with full course content"
```

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| Phase 1 | Tasks 1-6 | Project scaffold, layout, IDE, routing |
| Phase 2 | Tasks 7-22 | 16 coding interview modules (~80 lessons) |
| Phase 3 | Tasks 23-34 | 12 system design chapters (~50 lessons) |
| Phase 4 | Tasks 35-38 | Wire together, polish, test |

**Total: ~38 tasks, ~130+ lessons across 2 courses**
