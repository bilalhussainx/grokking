"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronRight, Check } from "lucide-react";

interface Props {
  onComplete: () => void;
}

const TEST_STRATEGIES = ["SAT", "ACT", "Both", "Test-optional", "Undecided"];

export default function QuickAcademicPrompt({ onComplete }: Props) {
  const [gpa, setGpa] = useState("");
  const [testStrategy, setTestStrategy] = useState("");
  const [satTotal, setSatTotal] = useState("");
  const [actComposite, setActComposite] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const showSAT = testStrategy === "SAT" || testStrategy === "Both";
  const showACT = testStrategy === "ACT" || testStrategy === "Both";
  const canSubmit = gpa.trim() !== "" && testStrategy !== "";

  async function handleSubmit() {
    if (!canSubmit || saving) return;
    setSaving(true);

    const fields: Record<string, unknown> = {
      gpa_unweighted: parseFloat(gpa),
      test_strategy: testStrategy,
    };
    if (showSAT && satTotal) fields.sat_total = parseInt(satTotal, 10);
    if (showACT && actComposite) fields.act_composite = parseInt(actComposite, 10);

    try {
      await fetch("/api/cc/profile/academic", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      setDone(true);
      setTimeout(onComplete, 1200);
    } catch {
      setSaving(false);
    }
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-center"
      >
        <Check className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
        <p className="text-sm font-medium text-emerald-300">
          Got it! Coach Kairos can now recommend schools for you.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-br from-[#1a1610] to-[#141414] p-5"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">
            Quick question — what&apos;s your GPA?
          </h3>
          <p className="text-xs text-white/40 mt-0.5">
            Just 2 things so Coach Kairos can find your best-fit schools. Takes 30 seconds.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-white/50 mb-1">GPA (unweighted)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="4"
              value={gpa}
              onChange={(e) => setGpa(e.target.value)}
              placeholder="e.g. 3.7"
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50 placeholder:text-white/20"
            />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1">Testing plan</label>
            <select
              value={testStrategy}
              onChange={(e) => setTestStrategy(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
            >
              <option value="">Select...</option>
              {TEST_STRATEGIES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <AnimatePresence>
          {(showSAT || showACT) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {showSAT && (
                <div>
                  <label className="block text-xs text-white/50 mb-1">SAT score (optional)</label>
                  <input
                    type="number"
                    min="400"
                    max="1600"
                    value={satTotal}
                    onChange={(e) => setSatTotal(e.target.value)}
                    placeholder="e.g. 1420"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50 placeholder:text-white/20"
                  />
                </div>
              )}
              {showACT && (
                <div>
                  <label className="block text-xs text-white/50 mb-1">ACT score (optional)</label>
                  <input
                    type="number"
                    min="1"
                    max="36"
                    value={actComposite}
                    onChange={(e) => setActComposite(e.target.value)}
                    placeholder="e.g. 31"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50 placeholder:text-white/20"
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between pt-1">
          <p className="text-[10px] text-white/20">
            You can add more details anytime in your full profile
          </p>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#C4A030] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {saving ? "Saving..." : "Save"}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
