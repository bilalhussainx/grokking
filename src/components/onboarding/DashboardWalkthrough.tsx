"use client";

import { useEffect, useState, useLayoutEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronRight } from "lucide-react";

interface Step {
  target: string;
  title: string;
  body: string;
}

// Variant-specific walkthrough step lists. AUD-P1-004 (OpenClaw 2026-05-02)
// flagged that the original list pushed grade-9 students through senior-only
// surfaces (Draft PS, Essay Studio, Activities Optimizer) which directly
// contradicted the locked tiles on the dashboard ("Unlocks junior year").
//
// Per-variant: only steps whose targets are actually surfaced as primary
// CTAs on that variant's dashboard. Non-rendered targets get skipped at
// measure-time anyway, but listing only what's relevant keeps the count
// honest and lets us tailor copy per audience.

const SENIOR_STEPS: Step[] = [
  { target: "coach", title: "Your AI-Coach", body: "Your first stop. Coach Kairos helps you build your school list and guides the rest of your application." },
  { target: "schools", title: "School Builder", body: "Add reach, match, and safety schools — with Coach's help or browse manually." },
  { target: "activities", title: "Activities", body: "Log extracurriculars. Coach optimizes them for maximum impact." },
  { target: "essays", title: "Essays", body: "Draft your personal statement and supplements with live AI feedback." },
  { target: "interview", title: "Interview Prep", body: "Practice mock admissions interviews by voice — in 7+ languages." },
  { target: "share", title: "Share", body: "Share progress with your human counselor or parents." },
];

const G9_STEPS: Step[] = [
  { target: "coach", title: "Coach Kairos", body: "Your guide for the next four years. Ask anything — Coach calibrates to grade 9." },
  { target: "courses", title: "Course rigor", body: "Log the courses you're taking. Pick one harder course for next semester." },
  { target: "summer", title: "Plan your summer", body: "One real summer experience beats three filler ones. Start the plan now." },
  { target: "majors", title: "Major exploration", body: "Low-stakes interest quiz. No pressure — just a thread to pull on." },
];

const G10_STEPS: Step[] = [
  { target: "coach", title: "Coach Kairos", body: "Your guide for grade 10. Coach knows the PSAT-10-then-summer rhythm." },
  { target: "test", title: "Test strategy", body: "PSAT 10 in October is the diagnostic that sets up junior-year SAT/ACT." },
  { target: "summer", title: "Summer experience", body: "One 'show, don't tell' thing — research, real job, structured program." },
  { target: "courses", title: "Course rigor", body: "Add depth in one area. Sophomore year is when admissions starts looking." },
];

const JUNIOR_STEPS: Step[] = [
  { target: "coach", title: "Coach Kairos", body: "Junior year is the runway. Coach helps you sequence everything." },
  { target: "schools", title: "School list draft", body: "10-15 schools, balanced reach / match / safety. The spine of senior year." },
  { target: "test", title: "Diagnostic test", body: "Real SAT or ACT this fall. Knowing your fit by November = spring to lift the score." },
  { target: "activities", title: "Activities", body: "Lock the list. Run the narrative diagnosis at 3+ activities." },
  { target: "essays", title: "Brainstorm only", body: "Spring brainstorming for the personal statement. Drafting unlocks senior fall." },
];

const TRANSFER_STEPS: Step[] = [
  { target: "coach", title: "Coach Kairos", body: "Transfer admissions is a different game — Coach speaks TAG, IGETC, articulation." },
  { target: "transfer-essay", title: "Why-transfer essay", body: "The whole file rests on this one. Five honest lines beats a vague paragraph." },
  { target: "schools", title: "Transfer school list", body: "Transfer rates differ from first-year — sometimes a lot. Note that on each school." },
  { target: "share", title: "Share", body: "Share progress with your community college counselor." },
];

function stepsForVariant(variantKey?: string): Step[] {
  switch (variantKey) {
    case "g9": return G9_STEPS;
    case "g10": return G10_STEPS;
    case "junior": return JUNIOR_STEPS;
    case "transfer": return TRANSFER_STEPS;
    case "senior_writing":
    case "senior_post_submit":
    case "senior_decisions":
    default:
      return SENIOR_STEPS;
  }
}

// Bump the storage key when the step list materially changes per variant
// (v2 adds variant-aware step lists; users who saw v1 should re-see v2 if
// they're on a non-senior variant since the v1 walkthrough was wrong for
// their grade).
const STORAGE_KEY = "dashboard_walkthrough_seen_v2";

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export default function DashboardWalkthrough({
  variantKey,
}: {
  variantKey?: string;
}) {
  const [visible, setVisible] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const steps = stepsForVariant(variantKey);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = localStorage.getItem(STORAGE_KEY);
    if (seen) return;
    const timer = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const step = steps[stepIndex];

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
    if (stepIndex >= steps.length - 1) {
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
                    {stepIndex + 1} / {steps.length}
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
                  {stepIndex >= steps.length - 1 ? "Got it" : "Next"}
                  {stepIndex < steps.length - 1 && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
