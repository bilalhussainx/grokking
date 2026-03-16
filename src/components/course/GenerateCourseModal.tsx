"use client";

import { useState, useEffect, useRef } from "react";
import { X, Sparkles, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface GenerateCourseModalProps {
  onClose: () => void;
  onCourseReady?: (slug: string) => void;
}

type Status = "idle" | "generating" | "ready" | "failed";

export default function GenerateCourseModal({
  onClose,
  onCourseReady,
}: GenerateCourseModalProps) {
  const [query, setQuery] = useState("");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [courseId, setCourseId] = useState<string | null>(null);
  const [log, setLog] = useState("");
  const [error, setError] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Poll for status while generating
  useEffect(() => {
    if (status !== "generating" || !courseId) return;

    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}/status`);
        if (!res.ok) return;
        const data = await res.json();
        setLog(data.generation_log || "");

        if (data.status === "ready") {
          setStatus("ready");
          if (pollRef.current) clearInterval(pollRef.current);
          onCourseReady?.(data.slug);
        } else if (data.status === "failed") {
          setStatus("failed");
          setError("Course generation failed. Check the log for details.");
          if (pollRef.current) clearInterval(pollRef.current);
        }
      } catch {
        // Polling error, will retry
      }
    }, 3000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [status, courseId, onCourseReady]);

  const handleGenerate = async () => {
    if (!query.trim()) return;

    setStatus("generating");
    setError("");
    setLog("Starting course generation...");

    try {
      const res = await fetch("/api/courses/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim(), url: url.trim() || undefined }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to start generation");
        setStatus("failed");
        return;
      }

      const data = await res.json();
      setCourseId(data.courseId);
    } catch {
      setError("Network error. Please try again.");
      setStatus("failed");
    }
  };

  const suggestions = [
    "Harvard CS50 — Intro to Computer Science",
    "MIT 6.006 — Introduction to Algorithms",
    "Google Machine Learning Crash Course",
    "Anthropic Prompt Engineering Guide",
    "Stanford CS229 — Machine Learning",
    "freeCodeCamp Web Development",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg mx-4 rounded-2xl border border-white/10 bg-[#0d1117] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-400" />
            <h2 className="text-lg font-bold">Generate a Course</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {status === "idle" && (
            <>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Course name or topic
                </label>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., Harvard CS50, MIT Algorithms, Python for Data Science"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Source URL <span className="text-white/30">(optional)</span>
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://cs50.harvard.edu/x/2024/"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
                />
              </div>

              {/* Suggestions */}
              <div>
                <p className="text-xs text-white/40 mb-2">Popular courses:</p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => setQuery(s)}
                      className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/60 hover:bg-white/10 hover:text-white/80 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!query.trim()}
                className="w-full rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:from-violet-500 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Generate Course
              </button>

              <p className="text-xs text-white/30 text-center">
                Uses Tavily search + AI to create interactive lessons with exercises
              </p>
            </>
          )}

          {status === "generating" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
                <div>
                  <p className="text-sm font-medium">Generating course...</p>
                  <p className="text-xs text-white/40">This may take a few minutes</p>
                </div>
              </div>

              {log && (
                <div className="max-h-48 overflow-y-auto rounded-lg bg-black/40 border border-white/[0.06] p-3">
                  <pre className="text-xs text-white/50 whitespace-pre-wrap font-mono">
                    {log}
                  </pre>
                </div>
              )}
            </div>
          )}

          {status === "ready" && (
            <div className="text-center space-y-3 py-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <p className="text-lg font-bold">Course Ready!</p>
              <p className="text-sm text-white/50">
                Your course has been generated and is ready to explore.
              </p>
              <button
                onClick={onClose}
                className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
              >
                View Course
              </button>
            </div>
          )}

          {status === "failed" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm font-medium">{error}</p>
              </div>
              {log && (
                <div className="max-h-32 overflow-y-auto rounded-lg bg-black/40 border border-white/[0.06] p-3">
                  <pre className="text-xs text-white/50 whitespace-pre-wrap font-mono">
                    {log}
                  </pre>
                </div>
              )}
              <button
                onClick={() => {
                  setStatus("idle");
                  setError("");
                  setLog("");
                  setCourseId(null);
                }}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium hover:bg-white/10 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
