"use client";

import { useState, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { Play, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import type { InterviewProblem, CodeExecutionResult, TestCase } from "@/types/interview";

interface LiveCodingPanelProps {
  problem: InterviewProblem;
  sessionId?: string;
  onCodeChange?: (code: string) => void;
  onTestResults?: (results: CodeExecutionResult) => void;
}

export default function LiveCodingPanel({
  problem,
  sessionId,
  onCodeChange,
  onTestResults,
}: LiveCodingPanelProps) {
  const { isDark } = useTheme();
  const [language, setLanguage] = useState<"python" | "java">("python");
  const [code, setCode] = useState(
    language === "python"
      ? problem.starterCodePython || "# Write your solution here\n"
      : problem.starterCodeJava || "// Write your solution here\n"
  );
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<CodeExecutionResult | null>(null);

  const handleLanguageChange = useCallback(
    (lang: "python" | "java") => {
      setLanguage(lang);
      setCode(
        lang === "python"
          ? problem.starterCodePython || "# Write your solution here\n"
          : problem.starterCodeJava || "// Write your solution here\n"
      );
      setResults(null);
    },
    [problem]
  );

  const runCode = useCallback(
    async (includeHidden: boolean) => {
      setRunning(true);
      setResults(null);

      const testCases: TestCase[] = [
        ...problem.testCasesVisible,
        ...(includeHidden ? problem.testCasesHidden : []),
      ];

      try {
        const res = await fetch("/api/interviews/run-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            language,
            testCases,
            sessionId,
            problemId: problem.id,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          setResults({
            testResults: [],
            allPassed: false,
            compilationError: err.error || `Error ${res.status}`,
            executionTimeMs: 0,
          });
          return;
        }

        const data: CodeExecutionResult = await res.json();
        setResults(data);
        onTestResults?.(data);
      } catch {
        setResults({
          testResults: [],
          allPassed: false,
          compilationError: "Failed to connect to code execution service",
          executionTimeMs: 0,
        });
      } finally {
        setRunning(false);
      }
    },
    [code, language, problem, sessionId, onTestResults]
  );

  return (
    <div className="flex flex-col h-full border border-white/10 rounded-lg overflow-hidden bg-black/20">
      {/* Problem Description */}
      <div className="p-4 border-b border-white/10 max-h-[200px] overflow-y-auto">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-semibold text-white">{problem.title}</h3>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              problem.difficulty === "easy"
                ? "bg-green-500/20 text-green-400"
                : problem.difficulty === "medium"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {problem.difficulty}
          </span>
        </div>
        <p className="text-sm text-gray-300 whitespace-pre-wrap">{problem.description}</p>
        {problem.constraints && (
          <p className="text-xs text-gray-500 mt-2">Constraints: {problem.constraints}</p>
        )}
        {problem.examples.length > 0 && (
          <div className="mt-2">
            {problem.examples.map((ex, i) => (
              <div key={i} className="text-xs bg-white/5 rounded p-2 mt-1">
                <div><span className="text-gray-500">Input:</span> {ex.input}</div>
                <div><span className="text-gray-500">Output:</span> {ex.output}</div>
                {ex.explanation && <div><span className="text-gray-500">Explanation:</span> {ex.explanation}</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10">
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value as "python" | "java")}
          className="bg-white/10 text-white text-sm rounded px-2 py-1 border border-white/20"
        >
          <option value="python">Python</option>
          {problem.starterCodeJava && <option value="java">Java</option>}
        </select>

        <button
          onClick={() => runCode(false)}
          disabled={running}
          className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded disabled:opacity-50"
        >
          {running ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
          Run Tests
        </button>

        <button
          onClick={() => runCode(true)}
          disabled={running}
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded disabled:opacity-50"
        >
          Submit
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-[200px]">
        <Editor
          height="100%"
          language={language}
          theme={isDark ? "vs-dark" : "light"}
          value={code}
          onChange={(val) => {
            const newCode = val || "";
            setCode(newCode);
            onCodeChange?.(newCode);
          }}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
          }}
        />
      </div>

      {/* Test Results */}
      {results && (
        <div className="border-t border-white/10 p-3 max-h-[200px] overflow-y-auto">
          {results.compilationError && (
            <div className="text-red-400 text-sm mb-2 font-mono">
              {results.compilationError}
            </div>
          )}
          {results.testResults.map((tr, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 text-sm mb-1 ${
                tr.passed ? "text-green-400" : "text-red-400"
              }`}
            >
              {tr.passed ? (
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
              )}
              <div className="font-mono text-xs">
                <div>Input: {tr.input.slice(0, 80)}</div>
                <div>Expected: {tr.expected}</div>
                {!tr.passed && <div>Got: {tr.actual}</div>}
                <div className="text-gray-500">{tr.runtimeMs}ms</div>
              </div>
            </div>
          ))}
          <div className="text-xs text-gray-500 mt-1">
            Total: {results.executionTimeMs}ms |{" "}
            {results.allPassed ? (
              <span className="text-green-400">All tests passed</span>
            ) : (
              <span className="text-red-400">
                {results.testResults.filter((r) => r.passed).length}/{results.testResults.length} passed
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
