"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Monitor, Server, Layers, Network, Binary,
  FileText, Mic, Brain, MessageSquare, Loader2, ArrowRight, Cpu,
  Phone, Lightbulb, TrendingUp, Users,
} from "lucide-react";
import { useInterview } from "@/contexts/InterviewContext";
import type { InterviewPreset, InterviewType } from "@/types/interview";

const PRESETS: { id: InterviewPreset; label: string; icon: typeof Monitor; desc: string }[] = [
  { id: "second-brain", label: "Second Brain / MCP", icon: Cpu, desc: "MCP, Obsidian, Slack, Missive, Claude Code" },
  { id: "frontend", label: "Frontend Engineer", icon: Monitor, desc: "React, TypeScript, CSS, performance" },
  { id: "backend", label: "Backend Engineer", icon: Server, desc: "APIs, databases, architecture" },
  { id: "fullstack", label: "Full Stack", icon: Layers, desc: "End-to-end development" },
  { id: "system-design", label: "System Design", icon: Network, desc: "Scalability, distributed systems" },
  { id: "dsa", label: "DSA", icon: Binary, desc: "Algorithms & data structures" },
  { id: "recruiter-screen", label: "Recruiter Screen", icon: Phone, desc: "15-min phone screen, culture fit, motivation" },
  { id: "product-manager", label: "Product Manager", icon: Lightbulb, desc: "Product sense, metrics, prioritization" },
  { id: "finance", label: "Finance / Banking", icon: TrendingUp, desc: "DCF, valuation, market questions" },
  { id: "leadership", label: "Tech Lead / Manager", icon: Users, desc: "Leadership, team dynamics, conflict resolution" },
];

const TYPES: { id: InterviewType; label: string; icon: typeof Mic; desc: string }[] = [
  { id: "technical", label: "Technical", icon: Brain, desc: "Coding & system design questions" },
  { id: "behavioral", label: "Behavioral", icon: MessageSquare, desc: "STAR method, soft skills" },
  { id: "mixed", label: "Mixed", icon: Mic, desc: "Behavioral intro + technical deep dive" },
  { id: "recruiter", label: "Recruiter Screen", icon: Phone, desc: "Quick screen — motivation, salary, availability" },
];

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
      // Race the plan API against a 5-second timeout
      // If the API is slow, start with a lightweight fallback plan
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

        if (res.ok) {
          plan = await res.json();
        }
      } catch {
        // Timeout or network error — use fallback
        clearTimeout(timeout);
      }

      // Fallback: let the Deepgram agent generate questions conversationally
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mic className="w-8 h-8 text-violet-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            AI Mock Interview
          </h1>
          <p className="text-white/50 text-base sm:text-lg max-w-lg mx-auto">
            Practice with a real-time AI interviewer that listens, responds, and teaches. 30 minutes. Voice-first.
          </p>
        </div>

        {/* Tips banner */}
        <div className="mb-8 bg-slate-800/40 backdrop-blur rounded-xl border border-white/5 p-4 text-sm text-white/40">
          <span className="text-white/60 font-medium">Tips:</span> Use headphones for best results. Speak clearly and take your time. The AI interviewer will teach you when you're stuck.
        </div>

        {/* Step 1: Choose role / paste JD */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold">1</div>
            <h2 className="text-lg font-semibold">Choose a role or paste a job description</h2>
          </div>

          {/* Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setUseCustom(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                !useCustom ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "bg-white/[0.04] text-white/40 border border-white/[0.08]"
              }`}
            >
              Quick Start
            </button>
            <button
              onClick={() => setUseCustom(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                useCustom ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "bg-white/[0.04] text-white/40 border border-white/[0.08]"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Custom JD
            </button>
          </div>

          {!useCustom ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPreset(p.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    preset === p.id
                      ? "bg-blue-500/10 border-blue-500/30 shadow-lg shadow-blue-500/10"
                      : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]"
                  }`}
                >
                  <p.icon className={`w-5 h-5 mb-2 ${preset === p.id ? "text-blue-400" : "text-white/40"}`} />
                  <div className="text-sm font-semibold mb-0.5">{p.label}</div>
                  <div className="text-[11px] text-white/30">{p.desc}</div>
                </button>
              ))}
            </div>
          ) : (
            <textarea
              value={customJD}
              onChange={(e) => setCustomJD(e.target.value)}
              placeholder="Paste the full job description here..."
              rows={6}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/40 resize-none"
            />
          )}
        </div>

        {/* Step 2: Interview type */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-sm font-bold">2</div>
            <h2 className="text-lg font-semibold">Interview type</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => setInterviewType(t.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  interviewType === t.id
                    ? "bg-violet-500/10 border-violet-500/30 shadow-lg shadow-violet-500/10"
                    : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]"
                }`}
              >
                <t.icon className={`w-5 h-5 mb-2 ${interviewType === t.id ? "text-violet-400" : "text-white/40"}`} />
                <div className="text-sm font-semibold mb-0.5">{t.label}</div>
                <div className="text-[11px] text-white/30">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Start button */}
        <button
          onClick={handleStart}
          disabled={!canStart}
          className="w-full py-4 rounded-xl text-base font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating interview questions...
            </>
          ) : (
            <>
              <Mic className="w-5 h-5" />
              Start Interview
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-center text-white/20 text-xs mt-3">
          30 minute voice interview with AI. Make sure your microphone is working.
        </p>
      </div>
    </div>
  );
}
