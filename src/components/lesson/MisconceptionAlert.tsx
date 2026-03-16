"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, X } from "lucide-react";
import { useState } from "react";

interface MisconceptionAlertProps {
  misconception: {
    label: string;
    description: string | null;
    remediation_content: string | null;
  } | null;
}

export default function MisconceptionAlert({ misconception }: MisconceptionAlertProps) {
  const [dismissed, setDismissed] = useState(false);

  // Reset dismissed state when a new misconception arrives
  const [prevLabel, setPrevLabel] = useState<string | null>(null);
  if (misconception && misconception.label !== prevLabel) {
    setPrevLabel(misconception.label);
    setDismissed(false);
  }

  const visible = misconception && !dismissed;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="rounded-lg border border-amber-500/40 bg-amber-950/30 backdrop-blur-sm p-4 mb-4"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex-shrink-0 rounded-full bg-amber-500/20 p-1.5">
              <Lightbulb className="h-4 w-4 text-amber-400" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-amber-300">
                Common Mistake: {misconception!.label}
              </h4>

              {misconception!.description && (
                <p className="mt-1 text-xs text-amber-200/70">
                  {misconception!.description}
                </p>
              )}

              {misconception!.remediation_content && (
                <div className="mt-2 text-sm text-gray-300 leading-relaxed prose prose-invert prose-sm max-w-none">
                  {misconception!.remediation_content.split("\n").map((line, i) => (
                    <p key={i} className={line.trim() === "" ? "h-2" : ""}>
                      {line}
                    </p>
                  ))}
                </div>
              )}

              <button
                onClick={() => setDismissed(true)}
                className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-amber-500/20 px-3 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-500/30 transition-colors"
              >
                Got it
              </button>
            </div>

            <button
              onClick={() => setDismissed(true)}
              className="flex-shrink-0 rounded p-1 text-amber-400/60 hover:text-amber-300 transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
