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

export default function IDEPanel({
  starterCode,
  solutionCode,
  height = "500px",
}: IDEPanelProps) {
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const workerRef = useRef<Worker | null>(null);

  const runCode = useCallback(() => {
    // Terminate previous worker if still running
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

    // 10 second timeout
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
      className="rounded-lg border border-gray-700 overflow-hidden flex flex-col"
      style={{ height }}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 border-b border-gray-700">
        <button
          onClick={runCode}
          disabled={isRunning}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Play className="w-4 h-4" />
          Run
        </button>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded bg-gray-600 hover:bg-gray-500 text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>

        <button
          onClick={toggleSolution}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors ml-auto"
        >
          {showSolution ? (
            <>
              <EyeOff className="w-4 h-4" />
              Hide Solution
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Show Solution
            </>
          )}
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
      <div className="h-36 border-t border-gray-700">
        <OutputPanel output={output} isRunning={isRunning} error={isError} />
      </div>
    </div>
  );
}
