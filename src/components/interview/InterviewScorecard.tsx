"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RotateCcw, ArrowLeft, Trophy, TrendingUp, AlertTriangle } from "lucide-react";
import { useInterview } from "@/contexts/InterviewContext";
import { useAuth } from "@/contexts/AuthContext";
import SignupPrompt from "@/components/auth/SignupPrompt";

function ScoreBar({ label, score }: { label: string; score: number }) {
  const pct = (score / 10) * 100;
  const color =
    score >= 7 ? "bg-emerald-500" : score >= 4 ? "bg-amber-500" : "bg-red-500";
  const textColor =
    score >= 7 ? "text-emerald-400" : score >= 4 ? "text-amber-400" : "text-red-400";

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-white/60 w-36 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-sm font-bold w-8 text-right ${textColor}`}>{score}</span>
    </div>
  );
}

export default function InterviewScorecard() {
  const router = useRouter();
  const { transcript, questionPlan, finalCode, interviewType, scorecard, setScorecard, preset, language, companyPersonaId, category } = useInterview();
  const { user } = useAuth();
  const [loading, setLoading] = useState(!scorecard);
  const [error, setError] = useState("");
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);

  // Show signup prompt for guest users after a short delay
  useEffect(() => {
    if (!user && transcript.length > 0) {
      const timer = setTimeout(() => setShowSignupPrompt(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [user, transcript.length]);

  const fetchScore = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/interviews/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript, questionPlan, finalCode, interviewType,
          // Spec: 2026-04-07-multilingual-interviews-design.md — these enable
          // history writes for the question variation engine.
          preset, language, companyPersonaId,
          // College fields are present but the tech scorecard ignores them
          category: category || "tech",
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Scoring failed");
      }
      const sc = await res.json();
      setScorecard(sc);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scoring failed");
    } finally {
      setLoading(false);
    }
  };

  // Wait briefly for InterviewContext to rehydrate from sessionStorage before
  // deciding the transcript is missing. Prevents a false "No transcript found"
  // error on the very first render after navigation from the interview room.
  useEffect(() => {
    if (scorecard) {
      setLoading(false);
      return;
    }
    if (transcript.length > 0) {
      fetchScore();
      return;
    }
    const t = setTimeout(() => {
      if (transcript.length === 0) {
        setLoading(false);
        setError("No interview transcript found.");
      }
    }, 800);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript.length, scorecard]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-white/50 text-sm">Analyzing your interview performance...</p>
          <p className="text-white/20 text-xs mt-1">This may take a moment</p>
        </div>
      </div>
    );
  }

  if (error || !scorecard) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 text-sm mb-4">{error || "No scorecard available"}</p>
          {transcript.length > 0 && (
            <button
              onClick={fetchScore}
              className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm flex items-center gap-2 mx-auto hover:bg-blue-500/30 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retry Scoring
            </button>
          )}
          <button
            onClick={() => router.push("/interviews")}
            className="mt-3 text-white/40 text-xs underline hover:text-white/60"
          >
            Start a new interview
          </button>
        </div>
      </div>
    );
  }

  const { overall, categories, questions, strengths, improvements } = scorecard;
  const overallColor =
    overall >= 7 ? "text-emerald-400" : overall >= 4 ? "text-amber-400" : "text-red-400";

  return (
    <div className="min-h-screen bg-[var(--background)] text-white">
      <SignupPrompt
        show={showSignupPrompt}
        onDismiss={() => setShowSignupPrompt(false)}
        title="Great interview!"
        message="Sign up to save your results, track your progress, and practice unlimited interviews."
      />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <button
          onClick={() => router.push("/interviews")}
          className="flex items-center gap-1.5 text-white/40 text-sm hover:text-white/60 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          New Interview
        </button>

        <div className="text-center mb-10">
          <Trophy className="w-10 h-10 mx-auto mb-3 text-amber-400" />
          <h1 className="text-3xl font-bold mb-2">Interview Results</h1>
          <div className={`text-5xl font-bold ${overallColor}`}>
            {overall.toFixed(1)}<span className="text-lg text-white/30">/10</span>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] mb-6 space-y-3">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">Category Scores</h2>
          <ScoreBar label="Communication" score={categories.communication} />
          <ScoreBar label="Technical Depth" score={categories.technicalDepth} />
          <ScoreBar label="Problem Solving" score={categories.problemSolving} />
          <ScoreBar label="Code Quality" score={categories.codeQuality} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
            <h3 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> Strengths
            </h3>
            <ul className="space-y-1.5">
              {strengths.map((s, i) => (
                <li key={i} className="text-xs text-white/60 flex items-start gap-1.5">
                  <span className="text-emerald-400 mt-0.5">+</span> {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
            <h3 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Areas to Improve
            </h3>
            <ul className="space-y-1.5">
              {improvements.map((s, i) => (
                <li key={i} className="text-xs text-white/60 flex items-start gap-1.5">
                  <span className="text-amber-400 mt-0.5">-</span> {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider">Question Breakdown</h2>
          {questions.map((q) => {
            const qColor = q.score >= 7 ? "border-emerald-500/20" : q.score >= 4 ? "border-amber-500/20" : "border-red-500/20";
            const qScoreColor = q.score >= 7 ? "text-emerald-400" : q.score >= 4 ? "text-amber-400" : "text-red-400";
            return (
              <div key={q.id} className={`p-4 rounded-xl border ${qColor} bg-white/[0.02]`}>
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium text-white/80">{q.question}</p>
                  <span className={`text-sm font-bold ${qScoreColor} shrink-0 ml-3`}>{q.score}/10</span>
                </div>
                <p className="text-xs text-white/40 mb-1.5">{q.answerSummary}</p>
                <p className="text-xs text-white/60">{q.feedback}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => router.push("/interviews")}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 text-white text-sm font-semibold hover:from-blue-400 hover:to-violet-500 transition-all shadow-lg shadow-blue-500/20"
          >
            Start Another Interview
          </button>
        </div>
      </div>
    </div>
  );
}
