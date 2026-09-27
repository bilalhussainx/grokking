"use client";

import { useRef, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Code2, Mic, ArrowLeft } from "lucide-react";
import { useInterview } from "@/contexts/InterviewContext";
import InterviewEditor from "./InterviewEditor";
import InterviewVoicePanel from "./InterviewVoicePanel";
import InterviewTextPanel from "./InterviewTextPanel";
import Link from "next/link";

export default function InterviewRoom() {
  const router = useRouter();
  const { sessionId, interviewType, preset, questionPlan, inputMode, currentProblem, dbSessionId } = useInterview();
  const codeRef = useRef("");
  const outputRef = useRef("");
  const [mobileTab, setMobileTab] = useState<"voice" | "code">("voice");

  const handleCodeChange = useCallback((code: string) => {
    codeRef.current = code;
  }, []);

  const handleOutputChange = useCallback((output: string) => {
    outputRef.current = output;
  }, []);

  const handleInterviewEnd = useCallback(() => {
    router.push(`/college-interviews/${sessionId}/results`);
  }, [router, sessionId]);

  if (!questionPlan || !sessionId) {
    return (
      <div
        className="kl-surface-app min-h-screen flex items-center justify-center"
        style={{ background: "var(--kl-app-bg, #000)" }}
      >
        <div className="text-center px-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{
              background: "rgba(212,175,55,0.1)",
              border: "1px solid rgba(212,175,55,0.22)",
            }}
          >
            <Mic className="w-8 h-8 text-[var(--kl-gold-app,#D4AF37)]" />
          </div>
          <p className="text-white/50 mb-4">No interview session found.</p>
          <Link
            href="/college-interviews"
            className="text-[var(--kl-gold-app,#D4AF37)] underline text-sm hover:text-[var(--kl-gold-hover-app,#C4A030)]"
          >
            Start a new interview
          </Link>
        </div>
      </div>
    );
  }

  const showEditor = interviewType !== "behavioral" && interviewType !== "recruiter";
  const presetLabel = preset ? preset.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "Mock";

  return (
    <div
      className="kl-surface-app h-screen flex flex-col"
      style={{ background: "var(--kl-app-bg, #000)" }}
    >
      {/* Header bar — interview HUD */}
      <div
        className="h-14 flex items-center justify-between px-4 backdrop-blur-xl shrink-0 border-b"
        style={{
          borderColor: "var(--kl-app-border, rgba(255,255,255,0.08))",
          background: "rgba(0,0,0,0.8)",
        }}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/college-interviews"
            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-white/40 hover:text-white/70"
            aria-label="Back to interviews"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-2 h-2 rounded-full animate-pulse"
              style={{ background: "var(--kl-state-reach, #f87171)" }}
              aria-hidden
            />
            <span className="text-sm font-semibold text-white/85">
              {presetLabel} Interview
            </span>
          </div>
          <span className="kl-chip hidden sm:inline-flex capitalize" style={{ cursor: "default" }}>
            {interviewType}
          </span>
        </div>
      </div>

      {/* Mobile tab switcher — only when editor is available */}
      {showEditor && (
        <div
          className="md:hidden flex border-b shrink-0"
          style={{ borderColor: "var(--kl-app-border, rgba(255,255,255,0.08))" }}
        >
          <button
            onClick={() => setMobileTab("voice")}
            aria-selected={mobileTab === "voice"}
            role="tab"
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              mobileTab === "voice"
                ? "text-[var(--kl-gold-app,#D4AF37)] bg-[var(--kl-gold-app,#D4AF37)]/5 border-b-2 border-[var(--kl-gold-app,#D4AF37)]"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            <Mic className="w-4 h-4" />
            Interview
          </button>
          <button
            onClick={() => setMobileTab("code")}
            aria-selected={mobileTab === "code"}
            role="tab"
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              mobileTab === "code"
                ? "text-[var(--kl-gold-app,#D4AF37)] bg-[var(--kl-gold-app,#D4AF37)]/5 border-b-2 border-[var(--kl-gold-app,#D4AF37)]"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            <Code2 className="w-4 h-4" />
            Code Editor
          </button>
        </div>
      )}

      {/* Main content — SINGLE voice panel instance, CSS controls layout */}
      <div className="flex-1 flex min-h-0">
        {showEditor && (
          <div className="hidden md:block w-[55%] border-r border-white/[0.06] p-2">
            <InterviewEditor
              onCodeChange={handleCodeChange}
              onOutputChange={handleOutputChange}
            />
          </div>
        )}

        {/* Mobile: show editor when tab is "code" */}
        {showEditor && mobileTab === "code" && (
          <div className="md:hidden w-full h-full p-2">
            <InterviewEditor
              onCodeChange={handleCodeChange}
              onOutputChange={handleOutputChange}
            />
          </div>
        )}

        {/* Voice panel — always mounted, hidden on mobile when code tab is active */}
        <div className={`${
          showEditor ? "md:w-[45%]" : "w-full"
        } ${showEditor && mobileTab === "code" ? "hidden md:block" : "w-full md:w-auto"}`}>
          {/* Render the right panel based on inputMode picked at setup time.
              Spec: 2026-04-07 audit P0 — text-only fallback for users
              without a microphone. */}
          {inputMode === "text" ? (
            <InterviewTextPanel
              codeRef={codeRef}
              outputRef={outputRef}
              onInterviewEnd={handleInterviewEnd}
            />
          ) : (
            <InterviewVoicePanel
              codeRef={codeRef}
              outputRef={outputRef}
              onInterviewEnd={handleInterviewEnd}
            />
          )}
        </div>
      </div>
    </div>
  );
}
