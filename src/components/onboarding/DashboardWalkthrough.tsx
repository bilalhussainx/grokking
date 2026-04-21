"use client";

import { useEffect, useState, useLayoutEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronRight } from "lucide-react";

interface Step {
  target: string;
  title: string;
  body: string;
}

const STEPS: Step[] = [
  {
    target: "coach",
    title: "Your AI-Coach",
    body: "Your first stop. Kairos helps you build your school list and guides the rest of your application.",
  },
  {
    target: "schools",
    title: "School Builder",
    body: "Add reach, match, and safety schools — with Coach's help or browse manually.",
  },
  {
    target: "activities",
    title: "Activities",
    body: "Log extracurriculars. Coach optimizes them for maximum impact.",
  },
  {
    target: "essays",
    title: "Essays",
    body: "Draft your personal statement and supplements with live AI feedback.",
  },
  {
    target: "interview",
    title: "Interview Prep",
    body: "Practice mock admissions interviews by voice — in 7+ languages.",
  },
  {
    target: "share",
    title: "Share",
    body: "Share progress with your human counselor or parents.",
  },
];

const STORAGE_KEY = "dashboard_walkthrough_seen_v1";

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export default function DashboardWalkthrough() {
  const [visible, setVisible] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = localStorage.getItem(STORAGE_KEY);
    if (seen) return;
    const timer = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const step = STEPS[stepIndex];

  useLayoutEffect(() => {
    if (!visible) return;
    const measure = () => {
      const el = document.querySelector<HTMLElement>(`[data-tour="${step.target}"]`);
      if (!el) {
        setRect(null);
        return;
      }
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
      if (r.top < 80 || r.bottom > window.innerHeight - 200) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [visible, step.target]);

  function finish() {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, "1");
    }
    setVisible(false);
  }

  function next() {
    if (stepIndex >= STEPS.length - 1) {
      finish();
    } else {
      setStepIndex((i) => i + 1);
    }
  }

  if (!visible) return null;

  const tooltipTop = rect ? rect.top + rect.height + 14 : 120;
  const tooltipLeft = rect ? Math.max(16, Math.min(rect.left, window.innerWidth - 336)) : 16;

  return (
    <AnimatePresence>
      <motion.div
        key="walkthrough"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[100] pointer-events-none"
      >
        <div className="absolute inset-0 bg-black/70 pointer-events-auto" onClick={finish} />

        {rect && (
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute rounded-lg pointer-events-none"
            style={{
              top: rect.top - 4,
              left: rect.left - 4,
              width: rect.width + 8,
              height: rect.height + 8,
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.7), 0 0 0 2px #D4AF37, 0 0 24px rgba(212,175,55,0.5)",
            }}
          />
        )}

        {rect && (
          <motion.div
            layout
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute w-80 max-w-[calc(100vw-32px)] pointer-events-auto"
            style={{ top: tooltipTop, left: tooltipLeft }}
          >
            <div className="absolute -top-1.5 left-6 w-3 h-3 rotate-45 bg-[#1a1610] border-l border-t border-[#D4AF37]/40" />
            <div className="relative rounded-xl border border-[#D4AF37]/40 bg-gradient-to-br from-[#1a1610] to-[#141414] p-4 shadow-2xl">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-[#D4AF37]">
                    {stepIndex + 1} / {STEPS.length}
                  </span>
                </div>
                <button
                  onClick={finish}
                  className="text-white/40 hover:text-white/80 transition-colors -mt-1 -mr-1"
                  aria-label="Skip walkthrough"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">{step.title}</h3>
              <p className="text-xs text-white/70 leading-relaxed mb-3">{step.body}</p>
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={finish}
                  className="text-[11px] text-white/40 hover:text-white/70 transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={next}
                  className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-semibold hover:bg-[#F4D03F] transition-colors flex items-center gap-1"
                >
                  {stepIndex >= STEPS.length - 1 ? "Got it" : "Next"}
                  {stepIndex < STEPS.length - 1 && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
