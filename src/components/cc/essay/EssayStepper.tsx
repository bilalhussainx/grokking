"use client";

import { Check, MessageCircle, List, PenLine, Eye } from "lucide-react";

const PHASES = [
  { key: "brainstorm", label: "Brainstorm", icon: MessageCircle },
  { key: "outline", label: "Outline", icon: List },
  { key: "draft", label: "Draft", icon: PenLine },
  { key: "revise", label: "Revise", icon: Eye },
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
    <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
      {PHASES.map((phase, i) => {
        const isActive = phase.key === currentPhase;
        const isCompleted = i < currentIndex;
        const Icon = isCompleted ? Check : phase.icon;

        return (
          <button
            key={phase.key}
            onClick={() => onPhaseClick(phase.key)}
            disabled={i > currentIndex}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isActive
                ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                : isCompleted
                  ? "text-white/50 hover:text-white/70 cursor-pointer"
                  : "text-white/20 cursor-not-allowed"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{phase.label}</span>
          </button>
        );
      })}
    </div>
  );
}
