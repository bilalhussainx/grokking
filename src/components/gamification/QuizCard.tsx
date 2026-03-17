"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useXP } from "@/contexts/XPContext";

interface QuizQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
}

interface QuizCardProps {
  lessonTitle: string;
  lessonSlug: string;
  onClose: () => void;
}

/** Generate 3 generic quiz questions based on lesson title. Cached in localStorage. */
function getQuizQuestions(
  lessonTitle: string,
  lessonSlug: string
): QuizQuestion[] {
  const cacheKey = `quiz_${lessonSlug}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      /* fall through */
    }
  }

  // Deterministic seed from slug
  let hash = 0;
  for (let i = 0; i < lessonSlug.length; i++) {
    hash = (hash * 31 + lessonSlug.charCodeAt(i)) | 0;
  }
  const pick = (arr: string[]) => arr[Math.abs(hash++) % arr.length];

  const questions: QuizQuestion[] = [
    {
      prompt: `Which best describes the main topic of "${lessonTitle}"?`,
      options: [
        `A core concept covered in this lesson`,
        `An unrelated programming paradigm`,
        `A database management technique`,
        `A networking protocol specification`,
      ],
      correctIndex: 0,
    },
    {
      prompt: `Why is understanding "${lessonTitle}" important?`,
      options: [
        `It is only useful for theoretical exams`,
        `It builds foundational knowledge for advanced topics`,
        `It is deprecated and rarely used`,
        `It only applies to legacy systems`,
      ],
      correctIndex: 1,
    },
    {
      prompt: `What is the best way to master the concepts in "${lessonTitle}"?`,
      options: [
        `Memorize definitions without practice`,
        `Skip to advanced topics immediately`,
        `Read once and never revisit`,
        `Practice with exercises and review regularly`,
      ],
      correctIndex: 3,
    },
  ];

  localStorage.setItem(cacheKey, JSON.stringify(questions));
  return questions;
}

export default function QuizCard({
  lessonTitle,
  lessonSlug,
  onClose,
}: QuizCardProps) {
  const { earnXP } = useXP();
  const [questions] = useState<QuizQuestion[]>(() =>
    getQuizQuestions(lessonTitle, lessonSlug)
  );
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleSelect = useCallback(
    async (optionIndex: number) => {
      if (answered) return;
      setSelected(optionIndex);
      setAnswered(true);

      const isCorrect = optionIndex === questions[currentQ].correctIndex;
      if (isCorrect) {
        setCorrectCount((c) => c + 1);
        await earnXP("quiz_correct", `${lessonSlug}_q${currentQ}`);
      }

      // Auto-advance after 1.2s
      setTimeout(() => {
        if (currentQ < questions.length - 1) {
          setCurrentQ((q) => q + 1);
          setSelected(null);
          setAnswered(false);
        } else {
          // Quiz finished
          setFinished(true);
        }
      }, 1200);
    },
    [answered, currentQ, questions, lessonSlug, earnXP]
  );

  // Award perfect bonus
  useEffect(() => {
    if (finished && correctCount === questions.length) {
      earnXP("quiz_perfect", lessonSlug);
    }
  }, [finished, correctCount, questions.length, earnXP, lessonSlug]);

  const optionLabels = ["A", "B", "C", "D"];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="relative max-w-lg w-full mx-4"
        >
          {/* Glowing border */}
          <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 opacity-70 blur-sm" />
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />

          <div className="relative rounded-2xl bg-slate-900 p-6">
            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2 mb-5">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i < currentQ
                      ? "bg-green-400 scale-100"
                      : i === currentQ && !finished
                      ? "bg-cyan-400 scale-110 shadow-lg shadow-cyan-400/40"
                      : "bg-white/20"
                  }`}
                />
              ))}
            </div>

            {!finished ? (
              <>
                {/* Question */}
                <h3 className="text-center text-white font-semibold text-base mb-1">
                  Quick Quiz
                </h3>
                <p className="text-center text-white/50 text-xs mb-4">
                  +10 XP per correct answer
                </p>

                <p className="text-white/90 text-sm mb-5 leading-relaxed">
                  {questions[currentQ].prompt}
                </p>

                {/* Options */}
                <div className="space-y-2.5">
                  {questions[currentQ].options.map((option, i) => {
                    const isCorrect = i === questions[currentQ].correctIndex;
                    const isSelected = selected === i;

                    let bgClass = "bg-white/5 hover:bg-white/10 border-white/10";
                    if (answered) {
                      if (isCorrect) {
                        bgClass =
                          "bg-green-500/20 border-green-500/50 shadow-lg shadow-green-500/10";
                      } else if (isSelected && !isCorrect) {
                        bgClass =
                          "bg-red-500/20 border-red-500/50 shadow-lg shadow-red-500/10";
                      } else {
                        bgClass = "bg-white/5 border-white/5 opacity-50";
                      }
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handleSelect(i)}
                        disabled={answered}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm transition-all ${bgClass}`}
                      >
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                            answered && isCorrect
                              ? "bg-green-500/30 text-green-300"
                              : answered && isSelected && !isCorrect
                              ? "bg-red-500/30 text-red-300"
                              : "bg-white/10 text-white/60"
                          }`}
                        >
                          {optionLabels[i]}
                        </span>
                        <span
                          className={`${
                            answered && isCorrect
                              ? "text-green-300"
                              : answered && isSelected && !isCorrect
                              ? "text-red-300"
                              : "text-white/80"
                          }`}
                        >
                          {option}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              /* Results screen */
              <div className="text-center py-4">
                <div className="text-4xl mb-3">
                  {correctCount === questions.length
                    ? "🎉"
                    : correctCount >= 2
                    ? "👏"
                    : "📚"}
                </div>
                <h3 className="text-white font-bold text-lg mb-1">
                  {correctCount === questions.length
                    ? "Perfect Score!"
                    : `${correctCount}/${questions.length} Correct`}
                </h3>
                <p className="text-white/50 text-sm mb-2">
                  {correctCount * 10}
                  {correctCount === questions.length ? " + 30 bonus" : ""} XP
                  earned
                </p>
                <p className="text-yellow-400 font-semibold text-base mb-5">
                  +
                  {correctCount * 10 +
                    (correctCount === questions.length ? 30 : 0)}{" "}
                  XP
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-cyan-500/20"
                >
                  Continue to Next Lesson
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
