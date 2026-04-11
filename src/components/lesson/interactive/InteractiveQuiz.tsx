"use client";

import { useState } from "react";
import { CheckCircle, XCircle, RotateCcw, HelpCircle } from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

interface InteractiveQuizProps {
  questions: QuizQuestion[];
  title?: string;
}

export default function InteractiveQuiz({ questions, title }: InteractiveQuizProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<boolean[]>(new Array(questions.length).fill(false));

  const q = questions[currentQ];
  const isCorrect = selected === q.answer;
  const isComplete = answered.every(Boolean);

  function handleSelect(idx: number) {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    if (idx === q.answer) {
      setScore((s) => s + 1);
    }
    const updated = [...answered];
    updated[currentQ] = true;
    setAnswered(updated);
  }

  function handleNext() {
    if (currentQ < questions.length - 1) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setShowResult(false);
    }
  }

  function handleReset() {
    setCurrentQ(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setAnswered(new Array(questions.length).fill(false));
  }

  return (
    <div className="my-8 rounded-xl border border-indigo-500/20 bg-indigo-500/5 overflow-hidden not-prose">
      {/* Header */}
      <div className="px-5 py-3 bg-indigo-500/10 border-b border-indigo-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-semibold text-indigo-300">
            {title || "Knowledge Check"}
          </span>
        </div>
        <span className="text-xs text-white/40">
          {currentQ + 1} / {questions.length}
        </span>
      </div>

      {/* Progress dots */}
      <div className="px-5 pt-4 flex gap-1.5">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i === currentQ
                ? "bg-indigo-400"
                : answered[i]
                ? "bg-indigo-400/40"
                : "bg-white/10"
            }`}
          />
        ))}
      </div>

      {/* Question */}
      <div className="px-5 py-4">
        <p className="text-base font-medium text-white/90 mb-4">{q.question}</p>

        {/* Options */}
        <div className="space-y-2">
          {q.options.map((opt, i) => {
            let optStyle = "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 cursor-pointer";
            if (showResult) {
              if (i === q.answer) {
                optStyle = "border-emerald-500/40 bg-emerald-500/10";
              } else if (i === selected && !isCorrect) {
                optStyle = "border-red-500/40 bg-red-500/10";
              } else {
                optStyle = "border-white/5 bg-white/[0.02] opacity-50";
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={showResult}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center gap-3 ${optStyle}`}
              >
                <span className="shrink-0 w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-xs font-mono text-white/50">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-sm text-white/80">{opt}</span>
                {showResult && i === q.answer && (
                  <CheckCircle className="w-4 h-4 text-emerald-400 ml-auto shrink-0" />
                )}
                {showResult && i === selected && !isCorrect && i !== q.answer && (
                  <XCircle className="w-4 h-4 text-red-400 ml-auto shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showResult && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${
            isCorrect ? "bg-emerald-500/10 text-emerald-200" : "bg-amber-500/10 text-amber-200"
          }`}>
            <p className="font-semibold mb-1">
              {isCorrect ? "Correct!" : "Not quite."}
            </p>
            <p className="text-white/60">{q.explanation}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-4 flex items-center justify-between">
          {isComplete ? (
            <div className="flex items-center gap-3 w-full">
              <div className="text-sm text-white/60">
                Score: <span className="font-bold text-white">{score}/{questions.length}</span>
                {score === questions.length && (
                  <span className="ml-2 text-emerald-400">Perfect!</span>
                )}
              </div>
              <button
                onClick={handleReset}
                className="ml-auto flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Retry
              </button>
            </div>
          ) : showResult && currentQ < questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="ml-auto px-4 py-2 rounded-lg bg-indigo-500/20 text-indigo-300 text-sm font-medium hover:bg-indigo-500/30 transition-colors"
            >
              Next Question
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
