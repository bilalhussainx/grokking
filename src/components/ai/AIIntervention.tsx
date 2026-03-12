"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Lightbulb, Heart, ArrowRight, HelpCircle, MessageCircle } from "lucide-react";
import { AIIntervention as InterventionType } from "@/types/ai";
import { useAI } from "@/contexts/AIContext";

interface AIInterventionProps {
  intervention: InterventionType;
  onDismiss: () => void;
}

const TYPE_CONFIG = {
  hint: {
    icon: Lightbulb,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  encouragement: {
    icon: Heart,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  nudge: {
    icon: ArrowRight,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  question: {
    icon: HelpCircle,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
};

export default function AIInterventionToast({ intervention, onDismiss }: AIInterventionProps) {
  const { openPanel } = useAI();

  const config = TYPE_CONFIG[intervention.type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20, y: -10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className={`absolute top-2 right-2 z-20 w-72 rounded-xl ${config.bg} border ${config.border} backdrop-blur-xl shadow-xl overflow-hidden`}
      >
        <div className="p-3">
          <div className="flex items-start gap-2.5">
            <div className={`flex-shrink-0 p-1.5 rounded-lg ${config.bg}`}>
              <Icon className={`w-4 h-4 ${config.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <h4 className={`text-[11px] font-semibold ${config.color}`}>
                  {intervention.title}
                </h4>
                <button
                  onClick={onDismiss}
                  className="p-0.5 rounded text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <p className="text-[12px] leading-relaxed text-[var(--foreground)]/80">
                {intervention.content}
              </p>
            </div>
          </div>

          {/* Action: open chat for more help */}
          <button
            onClick={() => {
              openPanel();
              onDismiss();
            }}
            className="flex items-center gap-1.5 mt-2 ml-8 text-[10px] font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            <MessageCircle className="w-3 h-3" />
            Ask AI Tutor for more help
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
