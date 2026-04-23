"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { getLanguagePersonas } from "@/lib/language-personas";
import { Mic, Volume2, CheckCircle, ArrowRight, SkipForward } from "lucide-react";
import Link from "next/link";

interface Question {
  id: string;
  level: string;
  type: "text" | "voice";
  question: string;
  hints?: string[];
}

const PLACEMENT_QUESTIONS: Record<string, Question[]> = {
  es: [
    {
      id: "es-1",
      level: "A1",
      type: "text",
      question: "How do you say 'Hello, my name is...' in Spanish?",
    },
    {
      id: "es-2",
      level: "A1",
      type: "text",
      question: "Count from 1 to 5 in Spanish.",
    },
    {
      id: "es-3",
      level: "A1",
      type: "voice",
      question: "Introduce yourself: Say your name and where you're from.",
    },
    {
      id: "es-4",
      level: "A2",
      type: "text",
      question: "How do you ask 'How much does this cost?' in Spanish?",
    },
    {
      id: "es-5",
      level: "A2",
      type: "voice",
      question: "Describe what you did yesterday in 2-3 sentences.",
    },
    {
      id: "es-6",
      level: "B1",
      type: "text",
      question: "What's the difference between 'ser' and 'estar'?",
    },
    {
      id: "es-7",
      level: "B1",
      type: "voice",
      question: "Give your opinion about your favorite hobby. Why do you like it?",
    },
    {
      id: "es-8",
      level: "B2",
      type: "voice",
      question: "Describe a memorable trip you took. Where did you go and what did you do?",
    },
  ],
  fr: [
    {
      id: "fr-1",
      level: "A1",
      type: "text",
      question: "How do you say 'Hello' in French?",
    },
    {
      id: "fr-2",
      level: "A1",
      type: "text",
      question: "Count from 1 to 5 in French.",
    },
    {
      id: "fr-3",
      level: "A1",
      type: "voice",
      question: "Introduce yourself: Say your name and where you're from.",
    },
  ],
  hi: [
    {
      id: "hi-1",
      level: "A1",
      type: "text",
      question: "How do you say 'Hello' in Hindi? (Transliteration is fine)",
    },
    {
      id: "hi-2",
      level: "A1",
      type: "voice",
      question: "Introduce yourself in Hindi: Say your name and greet someone.",
    },
    {
      id: "hi-3",
      level: "A2",
      type: "text",
      question: "How would you ask 'Where is the train station?' in Hindi?",
    },
    {
      id: "hi-4",
      level: "B1",
      type: "voice",
      question: "Describe your daily routine in Hindi using at least 3 sentences.",
    },
  ],
  zh: [
    {
      id: "zh-1",
      level: "A1",
      type: "text",
      question: "How do you say 'Hello' in Mandarin Chinese? (Pinyin is fine)",
    },
    {
      id: "zh-2",
      level: "A1",
      type: "voice",
      question: "Introduce yourself in Mandarin: Say your name and where you're from.",
    },
    {
      id: "zh-3",
      level: "A2",
      type: "text",
      question: "How would you order food at a restaurant in Mandarin? Write a simple sentence.",
    },
    {
      id: "zh-4",
      level: "B1",
      type: "voice",
      question: "Describe what you like to do on weekends in Mandarin.",
    },
  ],
  en: [
    {
      id: "en-1",
      level: "A1",
      type: "text",
      question: "Complete the sentence: 'My name ____ John and I ____ from Brazil.'",
    },
    {
      id: "en-2",
      level: "A1",
      type: "voice",
      question: "Introduce yourself in English: your name, where you're from, and what you do.",
    },
    {
      id: "en-3",
      level: "A2",
      type: "text",
      question: "What is the difference between 'there', 'their', and 'they're'? Give an example of each.",
    },
    {
      id: "en-4",
      level: "B1",
      type: "voice",
      question: "Describe your favorite movie and explain why you like it. Use at least 3 sentences.",
    },
  ],
  ur: [
    {
      id: "ur-1",
      level: "A1",
      type: "text",
      question: "How do you say 'Hello' in Urdu? ( transliteration is fine)",
    },
    {
      id: "ur-2",
      level: "A1",
      type: "voice",
      question: "Introduce yourself in Urdu or using transliteration.",
    },
  ],
};

const LANGUAGE_NAMES: Record<string, string> = {
  es: "Spanish",
  fr: "French",
  hi: "Hindi",
  zh: "Chinese",
  en: "English",
  ur: "Urdu",
};

/**
 * Maps assessed level to a course slug tier.
 * A1/A2 → beginner, B1/B2 → intermediate, C1+ → advanced
 */
function getCourseTier(level: string): string {
  switch (level) {
    case "A1":
    case "A2":
      return "beginner";
    case "B1":
    case "B2":
      return "intermediate";
    case "C1":
    case "C2":
      return "advanced";
    default:
      return "beginner";
  }
}

export default function PlacementPage() {
  const params = useParams();
  const lang = params.lang as string;
  const languageName = LANGUAGE_NAMES[lang] || lang;

  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);
  const [assessedLevel, setAssessedLevel] = useState("A1");

  const questions = PLACEMENT_QUESTIONS[lang] || [];
  const question = questions[currentQuestion];

  const handleAnswer = (answer: string) => {
    if (!question) return;
    setAnswers({ ...answers, [question.id]: answer });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate level based on answers
      const correctCount = Object.keys(answers).length;
      const total = questions.length;
      const percentage = (correctCount / total) * 100;

      if (percentage >= 80) setAssessedLevel("B2");
      else if (percentage >= 60) setAssessedLevel("B1");
      else if (percentage >= 40) setAssessedLevel("A2");
      else setAssessedLevel("A1");

      setCompleted(true);
    }
  };

  const handleStart = () => {
    setStarted(true);
  };

  /** Manual level override — skip the assessment entirely */
  const handleManualLevel = (level: string) => {
    setAssessedLevel(level);
    setCompleted(true);
    setStarted(true);
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-100 mb-2">Language Not Available</h1>
          <p className="text-slate-400">Placement test for {languageName} is not yet available.</p>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-slate-950 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-slate-100 mb-4">
            {languageName} Placement Test
          </h1>
          <p className="text-slate-400 mb-8">
            This quick assessment will help us determine your current level in {languageName}.
            We&apos;ll recommend the best starting point for your learning journey.
          </p>

          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 mb-8 text-left">
            <h2 className="font-medium text-slate-100 mb-4">What&apos;s included:</h2>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                {questions.length} graduated questions
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Mix of text and voice responses
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Immediate level assessment (A1 - B2)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Personalized course recommendations
              </li>
            </ul>
          </div>

          <button
            onClick={handleStart}
            className="px-8 py-3 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-colors"
          >
            Start Placement Test
          </button>

          {/* Manual level override */}
          <div className="mt-8 p-6 rounded-xl bg-slate-900/50 border border-slate-800/50">
            <div className="flex items-center gap-2 justify-center mb-4">
              <SkipForward className="w-4 h-4 text-slate-400" />
              <p className="text-sm text-slate-400">I already know my level</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {["A1", "A2", "B1", "B2", "C1"].map((level) => (
                <button
                  key={level}
                  onClick={() => handleManualLevel(level)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700 hover:text-white transition-colors border border-slate-700/50"
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Cost: 5 credits (one-time)
          </p>
        </div>
      </div>
    );
  }

  if (completed) {
    const tier = getCourseTier(assessedLevel);
    // Urdu only has A1 course
    const courseSlug = lang === "ur" ? "urdu-a1" : `${lang}-${tier}`;

    return (
      <div className="min-h-screen bg-slate-950 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>

          <h1 className="text-3xl font-bold text-slate-100 mb-2">Assessment complete</h1>
          <p className="text-slate-400 mb-8">
            Based on your responses, we&apos;ve determined your level.
          </p>

          <div className="p-8 rounded-xl bg-slate-900 border border-slate-800 mb-8">
            <div className="text-sm text-slate-400 mb-2">Your assessed level:</div>
            <div className="text-5xl font-bold text-indigo-400 mb-4">{assessedLevel}</div>
            <p className="text-slate-400 text-sm">
              {assessedLevel === "A1" && "Beginner - Starting from the basics"}
              {assessedLevel === "A2" && "Elementary - Building foundational skills"}
              {assessedLevel === "B1" && "Intermediate - Conversational level"}
              {assessedLevel === "B2" && "Upper Intermediate - Advanced communication"}
              {assessedLevel === "C1" && "Advanced - Near-native fluency"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/course/${courseSlug}`}
              className="px-8 py-3 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-colors"
            >
              Start {languageName} {tier.charAt(0).toUpperCase() + tier.slice(1)} Course
            </Link>
            <Link
              href="/practice"
              className="px-8 py-3 rounded-lg bg-slate-800 text-slate-200 font-medium hover:bg-slate-700 transition-colors"
            >
              Go to Practice
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>Level: {question?.level}</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="p-8 rounded-xl bg-slate-900 border border-slate-800 mb-6">
          <div className="flex items-center gap-2 mb-4">
            {question?.type === "voice" ? (
              <Mic className="w-5 h-5 text-indigo-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-indigo-400" />
            )}
            <span className="text-xs font-medium text-indigo-400 uppercase">
              {question?.type === "voice" ? "Voice Response" : "Text Response"}
            </span>
          </div>

          <h2 className="text-xl font-medium text-slate-100 mb-6">
            {question?.question}
          </h2>

          {question?.type === "text" ? (
            <textarea
              value={answers[question.id] || ""}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full h-32 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 placeholder:text-slate-500 resize-none focus:outline-none focus:border-indigo-500/50"
            />
          ) : (
            <div className="p-6 rounded-lg bg-slate-800 border border-slate-700 border-dashed">
              <div className="flex flex-col items-center gap-3">
                <Mic className="w-8 h-8 text-slate-500" />
                <p className="text-sm text-slate-400 text-center">
                  Voice input will be available when you click Start Voice Session.
                </p>
                <button className="px-4 py-2 rounded-lg bg-indigo-500/20 text-indigo-400 text-sm font-medium hover:bg-indigo-500/30 transition-colors">
                  Start Voice Session
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-2 rounded-lg text-slate-400 hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-colors"
          >
            {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
