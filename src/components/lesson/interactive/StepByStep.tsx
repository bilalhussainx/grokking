"use client";

import { useState } from "react";
import { ChevronRight, CheckCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface Step {
  title: string;
  content: string;
}

interface StepByStepProps {
  steps: Step[];
  title?: string;
}

export default function StepByStep({ steps, title }: StepByStepProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  function markComplete(idx: number) {
    const updated = new Set(completedSteps);
    updated.add(idx);
    setCompletedSteps(updated);
    if (idx < steps.length - 1) {
      setActiveStep(idx + 1);
    }
  }

  return (
    <div className="my-6 rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden not-prose">
      {title && (
        <div className="px-5 py-3 bg-white/[0.03] border-b border-white/10">
          <span className="text-sm font-semibold text-white/60">{title}</span>
        </div>
      )}

      <div className="divide-y divide-white/5">
        {steps.map((step, i) => {
          const isActive = i === activeStep;
          const isDone = completedSteps.has(i);

          return (
            <div key={i}>
              <button
                onClick={() => setActiveStep(i)}
                className={`w-full px-5 py-3 flex items-center gap-3 text-left transition-colors ${
                  isActive ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
                }`}
              >
                {/* Step indicator */}
                <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  isDone
                    ? "bg-emerald-500/20 text-emerald-400"
                    : isActive
                    ? "bg-cyan-500/20 text-cyan-400 ring-2 ring-cyan-500/30"
                    : "bg-white/5 text-white/30"
                }`}>
                  {isDone ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>

                <span className={`text-sm font-medium ${
                  isActive ? "text-white/90" : isDone ? "text-white/50" : "text-white/60"
                }`}>
                  {step.title}
                </span>

                <ChevronRight className={`w-4 h-4 ml-auto text-white/20 transition-transform ${
                  isActive ? "rotate-90" : ""
                }`} />
              </button>

              {isActive && (
                <div className="px-5 pb-4 pl-14">
                  <div className="prose prose-invert prose-sm max-w-none prose-pre:bg-black/40 prose-code:text-blue-400">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                      {step.content}
                    </ReactMarkdown>
                  </div>
                  {!isDone && (
                    <button
                      onClick={() => markComplete(i)}
                      className="mt-3 px-3 py-1.5 rounded-lg bg-cyan-500/15 text-cyan-300 text-xs font-medium hover:bg-cyan-500/25 transition-colors"
                    >
                      {i < steps.length - 1 ? "Got it, next step" : "Complete"}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
