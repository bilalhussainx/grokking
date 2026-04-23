"use client";

import { Check } from "lucide-react";

const PHASES = [
  { key: "brainstorm", label: "Brainstorm" },
  { key: "outline", label: "Outline" },
  { key: "draft", label: "Draft" },
  { key: "revise", label: "Revise" },
] as const;

type Phase = (typeof PHASES)[number]["key"];

const PHASE_ORDER: Phase[] = ["brainstorm", "outline", "draft", "revise"];

interface EssayStepperProps {
  currentPhase: Phase;
  onPhaseClick: (phase: Phase) => void;
}

export default function EssayStepper({ currentPhase, onPhaseClick }: EssayStepperProps) {
  const currentIndex = PHASE_ORDER.indexOf(currentPhase);

  return (
    <ol className="kl-stepper" aria-label="Essay phase progress">
      {PHASES.map((phase, i) => {
        const isDone = i < currentIndex;
        const isActive = i === currentIndex;
        const isDisabled = i > currentIndex;
        const stateClass = isDone ? "is-done" : isActive ? "is-active" : "";

        return (
          <li key={phase.key} className="flex items-center">
            <button
              type="button"
              onClick={() => onPhaseClick(phase.key)}
              disabled={isDisabled}
              aria-current={isActive ? "step" : undefined}
              aria-label={`${phase.label} phase`}
              className="flex items-center gap-2 group"
              style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
            >
              <span className={`kl-stepper-step ${stateClass}`}>
                {isDone ? (
                  <Check className="w-3 h-3" strokeWidth={2.5} />
                ) : (
                  String(i + 1).padStart(2, "0")
                )}
              </span>
              <span
                className={`hidden sm:inline text-[11px] font-medium transition-colors ${
                  isActive
                    ? "text-[var(--kl-gold-app,#D4AF37)]"
                    : isDone
                      ? "text-white/60 group-hover:text-white/80"
                      : "text-white/30"
                }`}
              >
                {phase.label}
              </span>
            </button>
            {i < PHASES.length - 1 && (
              <span
                className={`kl-stepper-connector ${isDone ? "is-done" : ""}`}
                aria-hidden
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
