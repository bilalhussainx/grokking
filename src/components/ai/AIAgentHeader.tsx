"use client";

import { useAI } from "@/contexts/AIContext";
import { AIMode } from "@/types/ai";
import { GraduationCap, Compass, Heart, HelpCircle } from "lucide-react";

const MODES: { key: AIMode; label: string; icon: React.ReactNode }[] = [
  { key: "tutor", label: "Tutor", icon: <GraduationCap className="w-3.5 h-3.5" /> },
  { key: "guide", label: "Guide", icon: <Compass className="w-3.5 h-3.5" /> },
  { key: "encourager", label: "Motivate", icon: <Heart className="w-3.5 h-3.5" /> },
  { key: "socratic", label: "Socratic", icon: <HelpCircle className="w-3.5 h-3.5" /> },
];

export default function AIAgentHeader() {
  const { mode, setMode } = useAI();

  return (
    <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.06]">
      {MODES.map((m) => (
        <button
          key={m.key}
          onClick={() => setMode(m.key)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 ${
            mode === m.key
              ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
              : "text-[var(--muted-foreground)] hover:bg-white/[0.06] hover:text-[var(--foreground)] border border-transparent"
          }`}
        >
          {m.icon}
          {m.label}
        </button>
      ))}
    </div>
  );
}
