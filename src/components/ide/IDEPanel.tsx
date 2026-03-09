"use client";

import { useState, useRef, useCallback } from "react";
import { Play, RotateCcw, Eye, EyeOff, Terminal } from "lucide-react";
import CodeEditor from "./CodeEditor";
import OutputPanel from "./OutputPanel";

interface IDEPanelProps {
  starterCode: string;
  solutionCode: string;
  height?: string;
}

export default function IDEPanel({
  starterCode,
  solutionCode,
  height = "520px",
}: IDEPanelProps) {
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const workerRef = useRef<Worker | null>(null);

  const runCode = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }

    setIsRunning(true);
    setOutput("");
    setIsError(false);

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
  };

  const toggleSolution = () => {
    setShowSolution((prev) => !prev);
  };

  return (
    <div
      className="rounded-xl border border-[var(--border)] overflow-hidden flex flex-col shadow-lg"
      style={{ height }}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#1e1e2e] border-b border-[#313244]">
        {/* File tab indicator */}
        <div className="flex items-center gap-1.5 mr-2 px-2.5 py-1 rounded-md bg-[#313244] text-[#cdd6f4] text-xs font-medium">
          <Terminal className="w-3 h-3 text-green-400" />
          main.py
        </div>

        <div className="flex-1" />

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-[#313244] hover:bg-[#45475a] text-[#cdd6f4] transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>

        <button
          onClick={toggleSolution}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-[#313244] hover:bg-[#45475a] text-[#cdd6f4] transition-colors"
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
          className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-green-600 hover:bg-green-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shadow-green-600/25"
        >
          <Play className="w-3.5 h-3.5" fill="currentColor" />
          {isRunning ? "Running..." : "Run Code"}
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0">
        <CodeEditor
          code={showSolution ? solutionCode : code}
          onChange={(value) => {
            if (!showSolution) setCode(value);
          }}
          readOnly={showSolution}
        />
      </div>

      {/* Output */}
      <div className="h-40 border-t border-[#313244]">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e1e2e] border-b border-[#313244] text-[10px] font-semibold uppercase tracking-wider text-[#6c7086]">
          <Terminal className="w-3 h-3" />
          Output
        </div>
        <div className="h-[calc(100%-28px)]">
          <OutputPanel output={output} isRunning={isRunning} error={isError} />
        </div>
      </div>
    </div>
  );
}
