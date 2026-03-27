"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Monitor, Server, Layers, Network, Binary,
  FileText, Mic, Brain, MessageSquare, Loader2, ArrowRight, Cpu,
  Phone, Lightbulb, TrendingUp, Users, Headphones, Clock, Sparkles,
} from "lucide-react";
import { useInterview } from "@/contexts/InterviewContext";
import type { InterviewPreset, InterviewType } from "@/types/interview";

const PRESETS: { id: InterviewPreset; label: string; icon: typeof Monitor; desc: string; color: string }[] = [
  { id: "second-brain", label: "Second Brain / MCP", icon: Cpu, desc: "MCP, Obsidian, Slack, Missive, Claude Code", color: "cyan" },
  { id: "frontend", label: "Frontend Engineer", icon: Monitor, desc: "React, TypeScript, CSS, performance", color: "blue" },
  { id: "backend", label: "Backend Engineer", icon: Server, desc: "APIs, databases, architecture", color: "emerald" },
  { id: "fullstack", label: "Full Stack", icon: Layers, desc: "End-to-end development", color: "violet" },
  { id: "system-design", label: "System Design", icon: Network, desc: "Scalability, distributed systems", color: "amber" },
  { id: "dsa", label: "DSA", icon: Binary, desc: "Algorithms & data structures", color: "pink" },
  { id: "recruiter-screen", label: "Recruiter Screen", icon: Phone, desc: "15-min phone screen, culture fit", color: "emerald" },
  { id: "product-manager", label: "Product Manager", icon: Lightbulb, desc: "Product sense, metrics, prioritization", color: "amber" },
  { id: "finance", label: "Finance / Banking", icon: TrendingUp, desc: "DCF, valuation, market questions", color: "cyan" },
  { id: "leadership", label: "Tech Lead / Manager", icon: Users, desc: "Leadership, team dynamics", color: "violet" },
];

const TYPES: { id: InterviewType; label: string; icon: typeof Mic; desc: string }[] = [
  { id: "technical", label: "Technical", icon: Brain, desc: "Coding & system design" },
  { id: "behavioral", label: "Behavioral", icon: MessageSquare, desc: "STAR method, soft skills" },
  { id: "mixed", label: "Mixed", icon: Mic, desc: "Behavioral + technical" },
  { id: "recruiter", label: "Recruiter Screen", icon: Phone, desc: "Quick screen" },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
};
const cardVariant = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.25, 0.4, 0.25, 1] as const } },
};

export default function InterviewSetup() {
  const router = useRouter();
  const { startInterview } = useInterview();
  const [preset, setPreset] = useState<InterviewPreset | null>(null);
  const [customJD, setCustomJD] = useState("");
  const [interviewType, setInterviewType] = useState<InterviewType>("technical");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  const canStart = (useCustom ? customJD.trim().length > 20 : preset !== null) && !loading;

  const handleStart = async () => {
    setLoading(true);
    setError("");
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      let plan;
      try {
        const res = await fetch("/api/interviews/plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobDescription: useCustom ? customJD.trim() : null,
            preset: useCustom ? null : preset,
            interviewType,
          }),
          signal: controller.signal,
        });
        clearTimeout(timeout);
        if (res.ok) plan = await res.json();
      } catch {
        clearTimeout(timeout);
      }

      if (!plan) {
        plan = {
          questions: [],
          interviewerPersona: `Adaptive ${interviewType} interviewer for ${preset || "general"} role. Generate questions dynamically based on the conversation flow.`,
          timeAllocation: { intro: 3, questions: 22, wrapUp: 5 },
          fallback: true,
        };
      }

      const jd = useCustom ? customJD.trim() : `Preset: ${preset}`;
      const sessionId = startInterview({
        interviewType,
        preset: preset || "fullstack",
        jobDescription: jd,
        questionPlan: plan,
      });
      router.push(`/interviews/${sessionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  const selectedColor = (isSelected: boolean, base: string) =>
    isSelected ? base : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]";

  return (
    <div className="min-h-screen bg-[var(--background)] text-white">
      {/* Grid background */}
      <div
        className="fixed inset-0 opacity-15 pointer-events-none
        bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)]
        bg-[size:4rem_4rem]
        [mask-image:radial-gradient(ellipse_70%_50%_at_50%_30%,#000_30%,transparent_100%)]"
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="w-14 h-14 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center mx-auto mb-5"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Mic className="w-7 h-7 text-violet-400" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            AI Mock Interview
          </h1>
          <p className="text-white/40 text-base max-w-md mx-auto">
            Voice-first. 30 minutes. Real-time feedback.
          </p>

          {/* Inline tips */}
          <motion.div
            className="flex items-center justify-center gap-4 mt-5 text-[11px] text-white/25 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span className="flex items-center gap-1"><Headphones className="w-3 h-3" /> Headphones recommended</span>
            <span className="text-white/10">|</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> ~30 minutes</span>
            <span className="text-white/10">|</span>
            <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI teaches when stuck</span>
          </motion.div>
        </motion.div>

        {/* Step 1 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-white/[0.06] border border-white/[0.1] text-white/50 flex items-center justify-center text-xs font-bold">1</div>
            <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Choose a role</h2>
          </div>

          {/* Toggle */}
          <div className="flex gap-1.5 mb-4 p-1 bg-white/[0.03] rounded-lg border border-white/[0.06] w-fit">
            <button
              onClick={() => setUseCustom(false)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                !useCustom ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white/60"
              }`}
            >
              Quick Start
            </button>
            <button
              onClick={() => setUseCustom(true)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
                useCustom ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white/60"
              }`}
            >
              <FileText className="w-3 h-3" />
              Custom JD
            </button>
          </div>

          {!useCustom ? (
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5"
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              {PRESETS.map((p) => {
                const isSelected = preset === p.id;
                return (
                  <motion.button
                    key={p.id}
                    variants={cardVariant}
                    onClick={() => setPreset(p.id)}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className={`p-3.5 rounded-xl border text-left transition-colors ${
                      isSelected
                        ? "bg-violet-500/10 border-violet-500/30 ring-1 ring-violet-500/20"
                        : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]"
                    }`}
                  >
                    <p.icon className={`w-4.5 h-4.5 mb-2 ${isSelected ? "text-violet-400" : "text-white/30"}`} />
                    <div className={`text-[13px] font-semibold mb-0.5 ${isSelected ? "text-white" : "text-white/70"}`}>{p.label}</div>
                    <div className="text-[10px] text-white/25 leading-tight">{p.desc}</div>
                  </motion.button>
                );
              })}
            </motion.div>
          ) : (
            <motion.textarea
              value={customJD}
              onChange={(e) => setCustomJD(e.target.value)}
              placeholder="Paste the full job description here..."
              rows={5}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 resize-none transition-all"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.div>

        {/* Step 2 */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-white/[0.06] border border-white/[0.1] text-white/50 flex items-center justify-center text-xs font-bold">2</div>
            <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Interview type</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {TYPES.map((t) => {
              const isSelected = interviewType === t.id;
              return (
                <motion.button
                  key={t.id}
                  onClick={() => setInterviewType(t.id)}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`p-3.5 rounded-xl border text-left transition-colors ${
                    isSelected
                      ? "bg-violet-500/10 border-violet-500/30 ring-1 ring-violet-500/20"
                      : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]"
                  }`}
                >
                  <t.icon className={`w-4.5 h-4.5 mb-2 ${isSelected ? "text-violet-400" : "text-white/30"}`} />
                  <div className={`text-[13px] font-semibold mb-0.5 ${isSelected ? "text-white" : "text-white/70"}`}>{t.label}</div>
                  <div className="text-[10px] text-white/25 leading-tight">{t.desc}</div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        {/* Start button */}
        <motion.button
          onClick={handleStart}
          disabled={!canStart}
          className="group w-full py-3.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-20 disabled:cursor-not-allowed bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white shadow-lg shadow-violet-500/15 hover:shadow-violet-500/30 hover:-translate-y-0.5 active:translate-y-0"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Preparing interview...
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              Start Interview
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </motion.button>

        <p className="text-center text-white/15 text-[11px] mt-3 font-medium">
          Voice interview with AI &middot; Microphone required
        </p>
      </div>
    </div>
  );
}
