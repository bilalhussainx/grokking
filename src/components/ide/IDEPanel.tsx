"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Play, RotateCcw, Eye, EyeOff, Terminal, Lightbulb, Award, Loader2 } from "lucide-react";
import CodeEditor from "./CodeEditor";
import OutputPanel from "./OutputPanel";
import HintPanel from "./HintPanel";
import GradePanel from "./GradePanel";
import AIInterventionToast from "@/components/ai/AIIntervention";
import { useAISupervision } from "@/hooks/useAISupervision";
import { AIGradeResult } from "@/types/ai";

interface IDEPanelProps {
  starterCode: string;
  solutionCode: string;
  height?: string;
  lessonTitle?: string;
  lessonContent?: string;
  onCodeChange?: (code: string) => void;
}

export default function IDEPanel({
  starterCode,
  solutionCode,
  height = "560px",
  lessonTitle = "",
  lessonContent = "",
  onCodeChange,
}: IDEPanelProps) {
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  // Hint state
  const [showHint, setShowHint] = useState(false);
  const [hintText, setHintText] = useState("");
  const [hintLevel, setHintLevel] = useState<1 | 2 | 3>(1);
  const [isLoadingHint, setIsLoadingHint] = useState(false);

  // Grade state
  const [grade, setGrade] = useState<AIGradeResult | null>(null);
  const [isGrading, setIsGrading] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const workerRef = useRef<Worker | null>(null);

  // AI Supervision
  const { intervention, dismissIntervention, onCodeChange: onSupervisionCodeChange } = useAISupervision({
    lessonTitle,
    starterCode,
    solutionCode,
    enabled: !!lessonTitle,
  });

  const handleCodeChange = (value: string) => {
    if (!showSolution) {
      setCode(value);
      onCodeChange?.(value);
      onSupervisionCodeChange(value);
    }
  };

  const runCode = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }

    setIsRunning(true);
    setOutput("");
    setIsError(false);
    setGrade(null);

    const worker = new Worker("/pyodide-worker.js");
    workerRef.current = worker;
    const id = Date.now().toString();

    const timeout = setTimeout(() => {
      worker.terminate();
      workerRef.current = null;
      setIsRunning(false);
      setIsError(true);
      setOutput("Execution timed out (10s limit)");
    }, 10000);

    worker.onmessage = (event) => {
      clearTimeout(timeout);
      const data = event.data;
      if (data.id === id) {
        if (data.error) {
          setIsError(true);
          setOutput(data.error);
        } else {
          setIsError(false);
          setOutput(data.output);
        }
        setIsRunning(false);
        setHasRun(true);
        worker.terminate();
        workerRef.current = null;
      }
    };

    worker.onerror = (err) => {
      clearTimeout(timeout);
      setIsRunning(false);
      setIsError(true);
      setOutput(err.message || "An unexpected error occurred");
      worker.terminate();
      workerRef.current = null;
    };

    const codeToRun = showSolution ? solutionCode : code;
    worker.postMessage({ id, code: codeToRun });
  }, [code, showSolution, solutionCode]);

  const handleReset = () => {
    setCode(starterCode);
    setOutput("");
    setIsError(false);
    setShowSolution(false);
    setShowHint(false);
    setHintLevel(1);
    setHintText("");
    setGrade(null);
    setHasRun(false);
  };

  const toggleSolution = () => setShowSolution((prev) => !prev);

  // Fetch hint
  const fetchHint = useCallback(async (level: 1 | 2 | 3) => {
    setIsLoadingHint(true);
    try {
      const res = await fetch("/api/ai/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          starterCode,
          solutionCode,
          lessonTitle,
          lessonContent,
          hintLevel: level,
        }),
      });
      if (!res.ok) throw new Error("Hint request failed");
      const data = await res.json();
      setHintText(data.hint);
      setHintLevel(level);
      setShowHint(true);
    } catch (err) {
      console.error("Hint error:", err);
      setHintText("Unable to generate hint. Please try again.");
    } finally {
      setIsLoadingHint(false);
    }
  }, [code, starterCode, solutionCode, lessonTitle, lessonContent]);

  const handleHintClick = () => {
    if (showHint) {
      setShowHint(false);
    } else {
      fetchHint(1);
    }
  };

  const handleNextHint = () => {
    if (hintLevel < 3) {
      fetchHint((hintLevel + 1) as 2 | 3);
    }
  };

  // Fetch grade
  const fetchGrade = useCallback(async () => {
    setIsGrading(true);
    try {
      const res = await fetch("/api/ai/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          output,
          starterCode,
          solutionCode,
          lessonTitle,
          lessonContent,
        }),
      });
      if (!res.ok) throw new Error("Grade request failed");
      const data: AIGradeResult = await res.json();
      setGrade(data);
    } catch (err) {
      console.error("Grade error:", err);
    } finally {
      setIsGrading(false);
    }
  }, [code, output, starterCode, solutionCode, lessonTitle, lessonContent]);

  return (
    <div
      className="relative rounded-xl border border-white/[0.08] overflow-hidden flex flex-col shadow-2xl shadow-black/30"
      style={{ height }}
    >
      {/* AI Intervention Toast */}
      {intervention && (
        <AIInterventionToast
          intervention={intervention}
          onDismiss={dismissIntervention}
        />
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#0d0f17] border-b border-white/[0.06]">
        <div className="flex items-center gap-1.5 mr-2 px-2.5 py-1 rounded-md bg-white/[0.06] text-[#cdd6f4] text-xs font-medium">
          <Terminal className="w-3 h-3 text-emerald-400" />
          main.py
        </div>

        <div className="flex-1" />

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-[var(--muted-foreground)] transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>

        {/* Hint Button */}
        <button
          onClick={handleHintClick}
          disabled={isLoadingHint}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            showHint
              ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
              : "bg-white/[0.06] hover:bg-white/[0.1] text-[var(--muted-foreground)]"
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          {isLoadingHint ? "..." : showHint ? "Hide Hint" : "Get Hint"}
        </button>

        {/* Grade Button */}
        <button
          onClick={fetchGrade}
          disabled={!hasRun || isGrading}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            hasRun && !isGrading
              ? "bg-violet-500/15 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20"
              : "bg-white/[0.06] text-[var(--muted-foreground)] opacity-50 cursor-not-allowed"
          }`}
        >
          {isGrading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Award className="w-3.5 h-3.5" />
          )}
          {isGrading ? "Grading..." : "Grade"}
        </button>

        <button
          onClick={toggleSolution}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-[var(--muted-foreground)] transition-colors"
        >
          {showSolution ? (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              Hide Solution
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 text-blue-400" />
              Show Solution
            </>
          )}
        </button>

        <button
          onClick={runCode}
          disabled={isRunning}
          className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-emerald-600/20"
        >
          <Play className="w-3.5 h-3.5" fill="currentColor" />
          {isRunning ? "Running..." : "Run Code"}
        </button>
      </div>

      {/* Hint Panel */}
      {showHint && (
        <HintPanel
          hint={hintText}
          level={hintLevel}
          isLoading={isLoadingHint}
          onNextHint={handleNextHint}
          onClose={() => setShowHint(false)}
        />
      )}

      {/* Editor */}
      <div className="flex-1 min-h-0">
        <CodeEditor
          code={showSolution ? solutionCode : code}
          onChange={handleCodeChange}
          readOnly={showSolution}
        />
      </div>

      {/* Output */}
      <div className="relative h-40 border-t border-white/[0.06]">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0d0f17] border-b border-white/[0.06] text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
          <Terminal className="w-3 h-3" />
          Output
        </div>
        <div className="h-[calc(100%-28px)]">
          <OutputPanel output={output} isRunning={isRunning} error={isError} />
        </div>

        {/* Grade Overlay */}
        {grade && (
          <GradePanel grade={grade} onClose={() => setGrade(null)} />
        )}
      </div>
    </div>
  );
}
