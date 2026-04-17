"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, GraduationCap } from "lucide-react";
import Link from "next/link";

interface QuestionData {
  index: number;
  id: string;
  text: string;
  voicePrompt: string;
  type: string;
  options?: string[];
  required?: boolean;
}

interface Progress {
  current: number;
  total: number;
}

interface Summary {
  name: string;
  grade: number | null;
  state: string;
  country: string;
  language: string;
  first_gen: boolean | null;
  worries: string | null;
  interested_schools: string | null;
}

export default function IntakePage() {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [progress, setProgress] = useState<Progress>({ current: 0, total: 6 });
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startSession();
  }, []);

  async function startSession() {
    setLoading(true);
    try {
      const res = await fetch("/api/cc/intake/start", { method: "POST" });
      const data = await res.json();
      if (data.session_token) {
        setSessionToken(data.session_token);
        localStorage.setItem("intake_session_token", data.session_token);
        setQuestion(data.question);
        setProgress(data.progress);
      }
    } catch {
      setError("Failed to start session. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const submitAnswer = useCallback(async (overrideAnswer?: string) => {
    const ans = overrideAnswer || answer;
    if (!ans.trim() || !sessionToken || !question) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cc/intake/turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_token: sessionToken,
          question_index: question.index,
          answer: ans.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setAnswer("");
      setProgress(data.progress);

      if (data.is_complete) {
        const compRes = await fetch("/api/cc/intake/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_token: sessionToken }),
        });
        const compData = await compRes.json();
        setSummary(compData.summary);
        setComplete(true);
        setQuestion(null);
      } else {
        setQuestion(data.next_question);
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [answer, sessionToken, question]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitAnswer();
    }
  };

  const selectOption = (option: string) => {
    setAnswer(option);
    submitAnswer(option);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        className="mb-8 flex items-center gap-3"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <GraduationCap className="w-10 h-10 text-[#D4AF37]" />
        <span className="text-xl font-bold text-white">Coach Kairos</span>
      </motion.div>

      {!complete && (
        <div className="w-full max-w-md mb-8">
          <div className="flex justify-between text-xs text-white/40 mb-2">
            <span>Question {progress.current + 1} of {progress.total}</span>
            <span>{Math.round((progress.current / progress.total) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#D4AF37] rounded-full"
              animate={{ width: `${(progress.current / progress.total) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {question && !complete && (
          <motion.div
            key={question.index}
            className="w-full max-w-md"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 leading-relaxed">
              {question.text}
            </h2>

            {question.options && (question.type === "select" || question.type === "yes-no-unsure") && (
              <div className="flex flex-wrap gap-2 mb-4">
                {question.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => selectOption(opt)}
                    disabled={loading}
                    className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                      answer === opt
                        ? "border-[#D4AF37] bg-[#D4AF37]/20 text-[#D4AF37]"
                        : "border-white/10 text-white/70 hover:border-[#D4AF37]/50 hover:bg-white/5"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {question.options && question.type === "freeform" && (
              <div className="flex flex-wrap gap-2 mb-4">
                {question.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => selectOption(opt)}
                    disabled={loading}
                    className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-white/50 hover:border-[#D4AF37]/50 hover:text-white/70 transition-all"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your answer..."
                disabled={loading}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
              />
              <button
                onClick={() => submitAnswer()}
                disabled={loading || !answer.trim()}
                className="px-4 py-3 rounded-xl bg-[#D4AF37] text-black font-semibold disabled:opacity-50 transition-all hover:bg-[#C4A030]"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {!question.required && (
              <button
                onClick={() => selectOption("(skipped)")}
                className="mt-3 text-xs text-white/30 hover:text-white/50 transition-colors"
              >
                Skip this question
              </button>
            )}

            {error && (
              <p className="mt-3 text-sm text-red-400">{error}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {complete && summary && (
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Check className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Nice to meet you, {summary.name}!</h2>
              <p className="text-sm text-white/50">Here&apos;s what I&apos;ve learned so far:</p>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-3 mb-8">
            <SummaryRow label="Grade" value={summary.grade ? `${summary.grade}th` : "Not specified"} />
            <SummaryRow label="Location" value={`${summary.state}, ${summary.country}`} />
            <SummaryRow label="Home language" value={summary.language} />
            <SummaryRow label="First gen" value={summary.first_gen === true ? "Yes" : summary.first_gen === false ? "No" : "Not sure"} />
            {summary.worries && <SummaryRow label="Biggest worry" value={summary.worries} />}
            {summary.interested_schools && <SummaryRow label="Interested in" value={summary.interested_schools} />}
          </div>

          <p className="text-white/60 text-sm mb-6 leading-relaxed">
            Want me to keep your work? Create a free account and I&apos;ll build your school list, help with essays, and guide you through financial aid.
          </p>

          <Link
            href="/signup"
            className="block w-full text-center px-6 py-3.5 rounded-xl bg-[#D4AF37] text-black font-semibold text-base hover:bg-[#C4A030] transition-all"
          >
            <GraduationCap className="w-5 h-5 inline mr-2" />
            Create free account
          </Link>

          <Link
            href="/"
            className="block w-full text-center mt-3 text-sm text-white/40 hover:text-white/60 transition-colors"
          >
            Maybe later
          </Link>
        </motion.div>
      )}

      {loading && !question && !complete && (
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4AF37]" />
      )}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-white/40 text-sm">{label}</span>
      <span className="text-white text-sm font-medium">{value}</span>
    </div>
  );
}
