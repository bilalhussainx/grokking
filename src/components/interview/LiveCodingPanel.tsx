"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
  Loader2,
  CheckCircle2,
  XCircle,
  Send,
  Eye,
  EyeOff,
  Clock,
  RotateCcw,
  ChevronDown,
  Terminal,
  FileText,
  Lightbulb,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import type {
  InterviewProblem,
  CodeExecutionResult,
  TestCase,
} from "@/types/interview";

type Language = "python" | "java" | "javascript";

interface LiveCodingPanelProps {
  problem: InterviewProblem;
  sessionId?: string;
  onCodeChange?: (code: string) => void;
  onTestResults?: (results: CodeExecutionResult) => void;
  onSubmitSuccess?: () => void;
  showTimer?: boolean;
  timerMinutes?: number;
}

type TabId = "description" | "solution" | "submissions";

export default function LiveCodingPanel({
  problem,
  sessionId,
  onCodeChange,
  onTestResults,
  onSubmitSuccess,
  showTimer = true,
  timerMinutes = 30,
}: LiveCodingPanelProps) {
  const { isDark } = useTheme();

  // Language state
  const [language, setLanguage] = useState<Language>("python");
  const [code, setCode] = useState(getStarterCode("python"));
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<CodeExecutionResult | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("description");
  const [showSolution, setShowSolution] = useState(false);
  const [solutionLanguage, setSolutionLanguage] = useState<Language>("python");
  const [customTestInput, setCustomTestInput] = useState("");
  const [showCustomTest, setShowCustomTest] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resultsPanelOpen, setResultsPanelOpen] = useState(false);

  // Timer
  const [timeLeft, setTimeLeft] = useState(timerMinutes * 60);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!showTimer) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [showTimer]);

  function getStarterCode(lang: Language): string {
    switch (lang) {
      case "python":
        return problem.starterCodePython || "# Write your solution here\n";
      case "java":
        return (
          problem.starterCodeJava ||
          "class Solution {\n    // Write your solution here\n}"
        );
      case "javascript":
        return (
          problem.starterCodeJs || "// Write your solution here\n"
        );
    }
  }

  function getSolutionCode(lang: Language): string | null {
    switch (lang) {
      case "python":
        return problem.solutionCodePython;
      case "java":
        return problem.solutionCodeJava;
      case "javascript":
        return null; // JS solutions can be added later
    }
  }

  const handleLanguageChange = useCallback(
    (lang: Language) => {
      setLanguage(lang);
      setCode(getStarterCode(lang));
      setResults(null);
      setResultsPanelOpen(false);
    },
    [problem]
  );

  const handleReset = useCallback(() => {
    setCode(getStarterCode(language));
    setResults(null);
    setResultsPanelOpen(false);
  }, [language, problem]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // ── Run visible test cases ──
  const runTests = useCallback(async () => {
    setRunning(true);
    setResults(null);
    setResultsPanelOpen(true);

    try {
      const res = await fetch("/api/interviews/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          testCases: problem.testCasesVisible,
          sessionId,
          problemId: problem.id,
          functionName: problem.functionName,
          mode: problem.functionName ? "harness" : "raw",
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
  }, [code, language, problem, sessionId, onTestResults]);

  // ── Submit (run all test cases including hidden) ──
  const submitCode = useCallback(async () => {
    setSubmitting(true);
    setResults(null);
    setResultsPanelOpen(true);

    const allTests: TestCase[] = [
      ...problem.testCasesVisible,
      ...problem.testCasesHidden,
    ];

    try {
      const res = await fetch("/api/interviews/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          testCases: allTests,
          sessionId,
          problemId: problem.id,
          functionName: problem.functionName,
          mode: problem.functionName ? "harness" : "raw",
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
      setSubmitted(true);
      onTestResults?.(data);
      if (data.allPassed) onSubmitSuccess?.();
    } catch {
      setResults({
        testResults: [],
        allPassed: false,
        compilationError: "Failed to connect to code execution service",
        executionTimeMs: 0,
      });
    } finally {
      setSubmitting(false);
    }
  }, [code, language, problem, sessionId, onTestResults, onSubmitSuccess]);

  // ── Run custom test input ──
  const runCustomTest = useCallback(async () => {
    if (!customTestInput.trim() || !problem.functionName) return;
    setRunning(true);
    setResults(null);
    setResultsPanelOpen(true);

    try {
      const res = await fetch("/api/interviews/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          functionName: problem.functionName,
          customTestInput: customTestInput.trim(),
          mode: "harness",
        }),
      });

      const data: CodeExecutionResult = await res.json();
      setResults(data);
    } catch {
      setResults({
        testResults: [],
        allPassed: false,
        compilationError: "Failed to connect",
        executionTimeMs: 0,
      });
    } finally {
      setRunning(false);
    }
  }, [code, language, problem, customTestInput]);

  const passedCount = results?.testResults.filter((r) => r.passed).length || 0;
  const totalCount = results?.testResults.length || 0;
  const timerWarning = timeLeft < 300; // 5 min warning

  return (
    <div className="flex h-full border border-white/10 rounded-lg overflow-hidden bg-black/20">
      {/* ── Left Panel: Problem Description ── */}
      <div className="w-[45%] min-w-[300px] flex flex-col border-r border-white/10">
        {/* Tab bar */}
        <div className="flex items-center gap-0 border-b border-white/10 bg-white/5">
          {(
            [
              { id: "description" as TabId, label: "Description", icon: FileText },
              { id: "solution" as TabId, label: "Solution", icon: Lightbulb },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === id
                  ? "text-white border-b-2 border-green-400 bg-white/5"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}

          {/* Timer */}
          {showTimer && (
            <div
              className={`ml-auto mr-3 flex items-center gap-1 text-sm font-mono ${
                timerWarning ? "text-red-400 animate-pulse" : "text-gray-400"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              {formatTime(timeLeft)}
            </div>
          )}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "description" && (
            <div>
              {/* Title + difficulty */}
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-lg font-semibold text-white">
                  {problem.title}
                </h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
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

              {/* Description */}
              <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed mb-4">
                {problem.description}
              </div>

              {/* Examples */}
              {problem.examples.length > 0 && (
                <div className="space-y-3 mb-4">
                  {problem.examples.map((ex, i) => (
                    <div
                      key={i}
                      className="bg-white/5 rounded-lg p-3 border border-white/5"
                    >
                      <div className="text-xs font-medium text-gray-400 mb-1">
                        Example {i + 1}
                      </div>
                      <div className="font-mono text-sm space-y-1">
                        <div>
                          <span className="text-gray-500">Input: </span>
                          <span className="text-gray-200">{ex.input}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Output: </span>
                          <span className="text-green-400">{ex.output}</span>
                        </div>
                        {ex.explanation && (
                          <div className="text-gray-400 text-xs mt-1">
                            {ex.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Constraints */}
              {problem.constraints && (
                <div className="mb-4">
                  <div className="text-xs font-medium text-gray-400 mb-1">
                    Constraints
                  </div>
                  <div className="text-sm text-gray-300 font-mono">
                    {problem.constraints}
                  </div>
                </div>
              )}

              {/* Topics */}
              {problem.topics.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {problem.topics.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Company tags */}
              {problem.companyTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {problem.companyTags.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20"
                    >
                      {t.split("-")[0]}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "solution" && (
            <div>
              {!submitted && !showSolution ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <EyeOff className="w-10 h-10 text-gray-500 mb-3" />
                  <p className="text-gray-400 text-sm mb-4">
                    Submit your solution first to unlock the reference solution.
                  </p>
                  <button
                    onClick={() => setShowSolution(true)}
                    className="text-xs text-gray-500 hover:text-gray-300 underline"
                  >
                    Reveal anyway (no XP bonus)
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium text-white">
                      Reference Solution
                    </span>
                    <select
                      value={solutionLanguage}
                      onChange={(e) =>
                        setSolutionLanguage(e.target.value as Language)
                      }
                      className="ml-auto bg-white/10 text-white text-xs rounded px-2 py-1 border border-white/20"
                    >
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                    </select>
                  </div>
                  <div className="bg-black/40 rounded-lg p-3 font-mono text-sm text-gray-200 whitespace-pre-wrap overflow-x-auto border border-white/5">
                    {getSolutionCode(solutionLanguage) || "Solution not available for this language."}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Right Panel: Editor + Results ── */}
      <div className="flex-1 flex flex-col min-w-[400px]">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10 bg-white/5">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value as Language)}
            className="bg-white/10 text-white text-sm rounded px-2 py-1.5 border border-white/20"
          >
            <option value="python">Python 3</option>
            {problem.starterCodeJava && <option value="java">Java</option>}
            {problem.starterCodeJs && <option value="javascript">JavaScript</option>}
          </select>

          <button
            onClick={handleReset}
            title="Reset code"
            className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-white/10"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="flex-1" />

          <button
            onClick={runTests}
            disabled={running || submitting}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-sm px-3 py-1.5 rounded border border-white/20 disabled:opacity-50 transition-colors"
          >
            {running ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
            Run
          </button>

          <button
            onClick={submitCode}
            disabled={running || submitting}
            className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-1.5 rounded disabled:opacity-50 font-medium transition-colors"
          >
            {submitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            Submit
          </button>
        </div>

        {/* Monaco Editor */}
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
              tabSize: language === "python" ? 4 : 2,
              insertSpaces: true,
              wordWrap: "on",
              lineNumbers: "on",
              renderLineHighlight: "gutter",
              folding: true,
              bracketPairColorization: { enabled: true },
            }}
          />
        </div>

        {/* ── Results Panel ── */}
        <div
          className={`border-t border-white/10 transition-all ${
            resultsPanelOpen ? "max-h-[300px]" : "max-h-[40px]"
          }`}
        >
          {/* Results header (clickable toggle) */}
          <button
            onClick={() => setResultsPanelOpen(!resultsPanelOpen)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5"
          >
            <Terminal className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-300 font-medium">
              {results
                ? results.compilationError
                  ? "Compilation Error"
                  : results.allPassed
                    ? `Accepted (${passedCount}/${totalCount})`
                    : `Wrong Answer (${passedCount}/${totalCount})`
                : "Test Results"}
            </span>
            {results && (
              <span
                className={`ml-1 text-xs ${
                  results.allPassed ? "text-green-400" : "text-red-400"
                }`}
              >
                {results.executionTimeMs}ms
              </span>
            )}
            <ChevronDown
              className={`w-3.5 h-3.5 text-gray-500 ml-auto transition-transform ${
                resultsPanelOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Results body */}
          {resultsPanelOpen && (
            <div className="px-3 pb-3 max-h-[250px] overflow-y-auto">
              {/* Compilation error */}
              {results?.compilationError && (
                <div className="text-red-400 text-sm font-mono bg-red-500/5 rounded p-2 mb-2 border border-red-500/10">
                  {results.compilationError}
                </div>
              )}

              {/* Test case results */}
              {results?.testResults.map((tr, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2 text-sm py-2 ${
                    i > 0 ? "border-t border-white/5" : ""
                  }`}
                >
                  {tr.passed ? (
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-green-400" />
                  ) : (
                    <XCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-400" />
                  )}
                  <div className="font-mono text-xs flex-1 min-w-0">
                    <div className="text-gray-400 mb-0.5">
                      Test Case {i + 1}
                    </div>
                    <div className="flex gap-4 flex-wrap">
                      <div>
                        <span className="text-gray-500">Input: </span>
                        <span className="text-gray-300 break-all">
                          {tr.input.length > 80
                            ? tr.input.slice(0, 80) + "..."
                            : tr.input}
                        </span>
                      </div>
                      {tr.expected !== "?" && (
                        <div>
                          <span className="text-gray-500">Expected: </span>
                          <span className="text-green-400">{tr.expected}</span>
                        </div>
                      )}
                      {!tr.passed && (
                        <div>
                          <span className="text-gray-500">Got: </span>
                          <span className="text-red-400">{tr.actual}</span>
                        </div>
                      )}
                      {tr.passed && tr.expected !== "?" && (
                        <div>
                          <span className="text-gray-500">Output: </span>
                          <span className="text-green-400">{tr.actual}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Success banner */}
              {results?.allPassed && submitted && (
                <div className="mt-2 p-2 bg-green-500/10 border border-green-500/20 rounded text-green-400 text-sm text-center">
                  All test cases passed! Solution accepted.
                </div>
              )}

              {/* Custom test input */}
              {problem.functionName && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <button
                    onClick={() => setShowCustomTest(!showCustomTest)}
                    className="text-xs text-blue-400 hover:text-blue-300 mb-2"
                  >
                    {showCustomTest ? "Hide" : "Add"} custom test case
                  </button>
                  {showCustomTest && (
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">
                          {problem.functionName}(
                        </label>
                        <input
                          value={customTestInput}
                          onChange={(e) => setCustomTestInput(e.target.value)}
                          placeholder="e.g., [1, 2, 3], 5"
                          className="w-full bg-white/5 text-white text-xs font-mono rounded px-2 py-1.5 border border-white/20 focus:border-blue-400 outline-none"
                        />
                      </div>
                      <button
                        onClick={runCustomTest}
                        disabled={running || !customTestInput.trim()}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded disabled:opacity-50"
                      >
                        Run
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
