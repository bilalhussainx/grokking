"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, Play, RotateCcw, Eye, EyeOff,
  Lightbulb, Award, Terminal as TerminalIcon, BotMessageSquare,
  Code2, FileCode, GripVertical,
} from "lucide-react";
import CodeEditor from "@/components/ide/CodeEditor";
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
  prevLesson: { slug: string; title: string; starterCode?: string } | null;
  nextLesson: { slug: string; title: string; starterCode?: string } | null;
}

type LeftTab = "problem" | "solution";
type BottomTab = "output" | "grade" | "hint";

// ── Draggable resize hook ──
function useResize(initialPercent: number, direction: "horizontal" | "vertical") {
  const [size, setSize] = useState(initialPercent);
  const dragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;

    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      let pct: number;
      if (direction === "horizontal") {
        pct = ((e.clientX - rect.left) / rect.width) * 100;
      } else {
        pct = ((e.clientY - rect.top) / rect.height) * 100;
      }
      setSize(Math.min(Math.max(pct, 15), 85));
    };

    const onMouseUp = () => {
      dragging.current = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.body.style.cursor = direction === "horizontal" ? "col-resize" : "row-resize";
    document.body.style.userSelect = "none";
  }, [direction]);

  return { size, containerRef, onMouseDown };
}

export default function ExerciseIDE({
  courseSlug,
  courseTitle,
  moduleTitle,
  lesson,
  prevLesson,
  nextLesson,
}: ExerciseIDEProps) {
  const [code, setCode] = useState(lesson.starterCode || "");
  const [output, setOutput] = useState("");
  const [isError, setIsError] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [leftTab, setLeftTab] = useState<LeftTab>("problem");
  const [bottomTab, setBottomTab] = useState<BottomTab>("output");
  const [hintText, setHintText] = useState("");
  const [hintLevel, setHintLevel] = useState(0);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [grade, setGrade] = useState<any>(null);
  const [isGrading, setIsGrading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const workerRef = useRef<Worker | null>(null);
  const { setLessonContext, setCurrentCode } = useAI();

  // Resizable panels
  const hResize = useResize(28, "horizontal");
  const vResize = useResize(60, "vertical");

  // Responsive detection — SSR-safe (Bug fix 2026-04-07: was crashing
  // mobile clients on hydration because window.innerWidth was read in
  // an effect that fired before the window was guaranteed to exist)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Set lesson context for coach
  useEffect(() => {
    setLessonContext({
      courseSlug,
      lessonSlug: lesson.slug,
      courseTitle,
      moduleTitle,
      lessonTitle: lesson.title,
      lessonContent: lesson.content,
      starterCode: lesson.starterCode || "",
      solutionCode: lesson.solutionCode || "",
    });
  }, [lesson.id, courseTitle, moduleTitle, lesson.title, lesson.content, lesson.starterCode, lesson.solutionCode, setLessonContext]);

  const handleCodeChange = useCallback(
    (value: string) => {
      setCode(value);
      setCurrentCode(value);
    },
    [setCurrentCode]
  );

  // ── Run code via Pyodide ──
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

  // ── Reset ──
  const resetCode = () => {
    setCode(lesson.starterCode || "");
    setOutput("");
    setIsError(false);
    setShowSolution(false);
    setGrade(null);
    setHintText("");
    setHintLevel(0);
    setHasRun(false);
    setLeftTab("problem");
  };

  // ── Hint ──
  const getHint = async () => {
    const newLevel = Math.min(hintLevel + 1, 3);
    setHintLevel(newLevel);
    setBottomTab("hint");
    setIsHintLoading(true);

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
    } finally {
      setIsHintLoading(false);
    }
  };

  // ── Grade ──
  const gradeCode = async () => {
    setBottomTab("grade");
    setIsGrading(true);
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
      if (resp.ok) setGrade(await resp.json());
    } catch {
      setGrade({ error: "Grading failed" });
    } finally {
      setIsGrading(false);
    }
  };

  const nextHasExercise = nextLesson && "starterCode" in nextLesson && nextLesson.starterCode;

  // ── Header ──
  const header = (
    <header className="shrink-0 flex items-center justify-between px-3 py-2 border-b border-white/[0.08] bg-[var(--background)]">
      <div className="flex items-center gap-2 min-w-0">
        <Link
          href={`/course/${courseSlug}/${lesson.slug}`}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </Link>
        <div className="w-px h-4 bg-white/[0.1] hidden sm:block" />
        <div className="min-w-0">
          <h1 className="text-sm font-semibold text-white truncate">{lesson.title}</h1>
          <p className="text-[10px] text-white/30 truncate hidden sm:block">
            {moduleTitle} &middot; {courseTitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {prevLesson && (
          <Link
            href={`/course/${courseSlug}/${prevLesson.slug}${nextHasExercise ? "/exercise" : ""}`}
            className="p-1.5 rounded-md hover:bg-white/[0.06] text-white/40 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </Link>
        )}
        {nextLesson && (
          <Link
            href={`/course/${courseSlug}/${nextLesson.slug}`}
            className="p-1.5 rounded-md hover:bg-white/[0.06] text-white/40 hover:text-white transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        )}

        <div className="w-px h-4 bg-white/[0.1]" />

        <button onClick={resetCode} className="p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors" title="Reset code">
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={getHint}
          disabled={isHintLoading}
          className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-fuchsia-500/15 text-fuchsia-400 hover:bg-fuchsia-500/25 transition-colors flex items-center gap-1 border border-fuchsia-500/20 disabled:opacity-50"
        >
          <Lightbulb className="w-3 h-3" />
          <span className="hidden md:inline">Hint</span>
        </button>

        <button
          onClick={runCode}
          disabled={isRunning}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600/80 hover:bg-cyan-500 text-white transition-colors flex items-center gap-1 shadow-lg shadow-cyan-500/15 disabled:opacity-50"
        >
          <Play className="w-3 h-3" />
          <span className="hidden sm:inline">{isRunning ? "Running..." : "Run"}</span>
        </button>

        <button
          onClick={gradeCode}
          disabled={!hasRun || isGrading}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white transition-colors flex items-center gap-1 shadow-lg shadow-emerald-500/15 disabled:opacity-50"
        >
          <Award className="w-3 h-3" />
          <span className="hidden sm:inline">{isGrading ? "Grading..." : "Grade"}</span>
        </button>

        <button
          onClick={() => {
            setShowSolution(!showSolution);
            setLeftTab(showSolution ? "problem" : "solution");
          }}
          className="p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors"
          title={showSolution ? "Hide solution" : "Show solution"}
        >
          {showSolution ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>
      </div>
    </header>
  );

  // ── Bottom panel content ──
  const bottomContent = (
    <>
      <div className="flex border-b border-white/[0.06] shrink-0 bg-white/[0.02]">
        {(["output", "grade", "hint"] as BottomTab[]).map((tab) => {
          const icons = { output: TerminalIcon, grade: Award, hint: BotMessageSquare };
          const labels = { output: "Output", grade: "Grade", hint: `AI Help${hintLevel > 0 ? ` (${hintLevel}/3)` : ""}` };
          const activeColors = { output: "text-cyan-400 border-cyan-400", grade: "text-emerald-400 border-emerald-400", hint: "text-fuchsia-400 border-fuchsia-400" };
          const Icon = icons[tab];
          return (
            <button
              key={tab}
              onClick={() => setBottomTab(tab)}
              className={`px-4 py-2 text-xs font-medium flex items-center gap-1.5 transition-colors ${
                bottomTab === tab ? `${activeColors[tab]} border-b-2` : "text-white/30 hover:text-white/50"
              }`}
            >
              <Icon className="w-3 h-3" />
              {labels[tab]}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-3 font-mono text-sm">
        {bottomTab === "output" && (
          <div>
            {isRunning ? (
              <div className="flex items-center gap-2 text-cyan-400">
                <div className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                Running...
              </div>
            ) : output ? (
              <pre className={`whitespace-pre-wrap leading-relaxed ${isError ? "text-red-400" : "text-emerald-400"}`}>{output}</pre>
            ) : (
              <p className="text-white/20 text-xs">Click &quot;Run&quot; to execute your solution</p>
            )}
          </div>
        )}

        {bottomTab === "grade" && (
          <div>
            {isGrading ? (
              <div className="flex items-center gap-2 text-emerald-400">
                <div className="w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                Grading...
              </div>
            ) : grade ? (
              <div className="space-y-3">
                {grade.error ? (
                  <p className="text-red-400 text-xs">{grade.error}</p>
                ) : (
                  <>
                    <div className="flex items-center gap-4">
                      {["correctness", "efficiency", "style", "overall"].map((key) => {
                        const score = grade[key] || 0;
                        const color = score >= 80 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-red-400";
                        return (
                          <div key={key} className="text-center">
                            <div className={`text-lg font-bold ${color}`}>{score}</div>
                            <div className="text-[10px] text-white/30 capitalize">{key}</div>
                          </div>
                        );
                      })}
                    </div>
                    {grade.feedback && <p className="text-xs text-white/70 leading-relaxed">{grade.feedback}</p>}
                    {grade.suggestions?.length > 0 && (
                      <div className="space-y-1">
                        {grade.suggestions.map((s: string, i: number) => (
                          <p key={i} className="text-[11px] text-white/50 flex items-start gap-1.5">
                            <span className="text-amber-400 shrink-0">-</span>{s}
                          </p>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <p className="text-white/20 text-xs">Run your code, then click &quot;Grade&quot; for AI feedback</p>
            )}
          </div>
        )}

        {bottomTab === "hint" && (
          <div>
            {isHintLoading ? (
              <div className="flex items-center gap-2 text-fuchsia-400">
                <div className="w-3 h-3 border-2 border-fuchsia-400 border-t-transparent rounded-full animate-spin" />
                Getting hint...
              </div>
            ) : hintText ? (
              <div className="bg-fuchsia-950/30 border border-fuchsia-500/20 rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <Lightbulb className="w-3.5 h-3.5 text-fuchsia-400" />
                  <span className="text-xs text-fuchsia-400 font-medium">Hint {hintLevel}/3</span>
                </div>
                <p className="text-white/80 text-xs leading-relaxed whitespace-pre-wrap">{hintText}</p>
                {hintLevel < 3 && (
                  <button onClick={getHint} className="mt-2 text-[11px] text-fuchsia-400 underline hover:text-fuchsia-300">
                    Need more help?
                  </button>
                )}
              </div>
            ) : (
              <p className="text-white/20 text-xs">Click &quot;Hint&quot; for progressive guidance</p>
            )}
          </div>
        )}
      </div>
    </>
  );

  // ── Mobile Layout ──
  if (isMobile) {
    return (
      <div className="w-full h-[100dvh] bg-[var(--background)] text-white flex flex-col overflow-hidden">
        {header}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <details className="border-b border-white/[0.06] shrink-0">
            <summary className="px-4 py-2 text-xs text-cyan-400 font-medium cursor-pointer flex items-center gap-1.5">
              <Code2 className="w-3 h-3" />
              Problem Description
            </summary>
            <div className="px-4 pb-3 max-h-48 overflow-y-auto">
              <div className="prose prose-sm prose-invert max-w-none">
                <LessonContent content={lesson.content} />
              </div>
            </div>
          </details>
          <div className="flex-1 min-h-0">
            <CodeEditor
              code={showSolution ? (lesson.solutionCode || "") : code}
              onChange={handleCodeChange}
              readOnly={showSolution}
              height="100%"
            />
          </div>
          <div className="h-44 shrink-0 border-t border-white/[0.06] flex flex-col">
            {bottomContent}
          </div>
        </div>
      </div>
    );
  }

  // ── Desktop Layout (CSS-based resizable 3-panel) ──
  return (
    <div className="w-full h-[calc(100vh-3.5rem)] bg-[var(--background)] text-white flex flex-col overflow-hidden">
      {header}

      <main ref={hResize.containerRef} className="flex-1 min-h-0 overflow-hidden flex">
        {/* ── LEFT: Problem / Solution ── */}
        <div
          className="flex flex-col border-r border-white/[0.08] overflow-hidden"
          style={{ width: `${hResize.size}%`, minWidth: "200px" }}
        >
          {/* Tab bar */}
          <div className="flex border-b border-white/[0.06] shrink-0">
            <button
              onClick={() => { setLeftTab("problem"); setShowSolution(false); }}
              className={`flex-1 py-2 text-xs font-medium text-center flex items-center justify-center gap-1.5 transition-colors ${
                leftTab === "problem" ? "text-cyan-400 border-b-2 border-cyan-400" : "text-white/30 hover:text-white/50"
              }`}
            >
              <Code2 className="w-3 h-3" />
              Problem
            </button>
            <button
              onClick={() => { setLeftTab("solution"); setShowSolution(true); }}
              className={`flex-1 py-2 text-xs font-medium text-center flex items-center justify-center gap-1.5 transition-colors ${
                leftTab === "solution" ? "text-emerald-400 border-b-2 border-emerald-400" : "text-white/30 hover:text-white/50"
              }`}
            >
              <FileCode className="w-3 h-3" />
              Solution
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {leftTab === "problem" ? (
              <div className="prose prose-sm prose-invert max-w-none">
                <LessonContent content={lesson.content} />
              </div>
            ) : lesson.solutionCode ? (
              <div className="space-y-3">
                <p className="text-[11px] text-emerald-400/60">Official solution (read-only):</p>
                <div className="rounded-lg overflow-hidden border border-white/[0.06]">
                  <CodeEditor code={lesson.solutionCode} onChange={() => {}} readOnly={true} height="400px" />
                </div>
              </div>
            ) : (
              <p className="text-white/30 text-sm text-center py-8">Solution not available.</p>
            )}
          </div>
        </div>

        {/* ── Horizontal Resize Handle ── */}
        <div
          onMouseDown={hResize.onMouseDown}
          className="w-1.5 shrink-0 bg-white/[0.04] hover:bg-cyan-500/20 active:bg-cyan-500/30 transition-colors cursor-col-resize flex items-center justify-center group"
        >
          <GripVertical className="w-3 h-3 text-white/10 group-hover:text-cyan-400/50 transition-colors" />
        </div>

        {/* ── RIGHT: Editor + Diagnostics (vertical split) ── */}
        <div ref={vResize.containerRef} className="flex-1 min-w-0 flex flex-col">
          {/* Code Editor */}
          <div className="overflow-hidden" style={{ height: `${vResize.size}%`, minHeight: "100px" }}>
            <div className="h-full flex flex-col">
              <div className="shrink-0 flex items-center gap-2 px-3 py-1.5 border-b border-white/[0.06] bg-white/[0.02]">
                <TerminalIcon className="w-3 h-3 text-cyan-400" />
                <span className="text-xs text-cyan-400 font-medium">main.py</span>
                <div className="flex-1" />
                <span className="text-[10px] text-white/20">{showSolution ? "Viewing solution" : "Python 3"}</span>
              </div>
              <div className="flex-1 min-h-0">
                <CodeEditor
                  code={showSolution ? (lesson.solutionCode || "") : code}
                  onChange={handleCodeChange}
                  readOnly={showSolution}
                  height="100%"
                />
              </div>
            </div>
          </div>

          {/* ── Vertical Resize Handle ── */}
          <div
            onMouseDown={vResize.onMouseDown}
            className="h-1.5 shrink-0 bg-white/[0.04] hover:bg-cyan-500/20 active:bg-cyan-500/30 transition-colors cursor-row-resize"
          />

          {/* Diagnostics */}
          <div className="flex-1 min-h-0 flex flex-col border-t border-white/[0.06] overflow-hidden">
            {bottomContent}
          </div>
        </div>
      </main>
    </div>
  );
}
