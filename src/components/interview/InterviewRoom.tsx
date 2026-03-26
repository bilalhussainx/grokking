"use client";

import { useRef, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Code2, Mic, ArrowLeft } from "lucide-react";
import { useInterview } from "@/contexts/InterviewContext";
import InterviewEditor from "./InterviewEditor";
import InterviewVoicePanel from "./InterviewVoicePanel";
import Link from "next/link";

export default function InterviewRoom() {
  const router = useRouter();
  const { sessionId, interviewType, preset, questionPlan } = useInterview();
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
    router.push(`/interviews/${sessionId}/results`);
  }, [router, sessionId]);

  if (!questionPlan || !sessionId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center px-6">
          <div className="w-16 h-16 bg-violet-500/15 border border-violet-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mic className="w-8 h-8 text-violet-400" />
          </div>
          <p className="text-white/50 mb-4">No interview session found.</p>
          <Link href="/interviews" className="text-cyan-400 underline text-sm">
            Start a new interview
          </Link>
        </div>
      </div>
    );
  }

  const showEditor = interviewType !== "behavioral" && interviewType !== "recruiter";
  const presetLabel = preset ? preset.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "Mock";

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header bar */}
      <div className="h-14 border-b border-white/[0.06] flex items-center justify-between px-4 bg-slate-950/80 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/interviews" className="p-1.5 rounded-lg hover:bg-white/5 transition">
            <ArrowLeft className="w-4 h-4 text-white/40" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-semibold text-white/80">
              {presetLabel} Interview
            </span>
          </div>
          <span className="hidden sm:inline text-xs text-white/30 capitalize px-2 py-0.5 bg-white/5 rounded-full">
            {interviewType}
          </span>
        </div>
      </div>

      {/* Mobile tab switcher — only when editor is available */}
      {showEditor && (
        <div className="md:hidden flex border-b border-white/[0.06] shrink-0">
          <button
            onClick={() => setMobileTab("voice")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition ${
              mobileTab === "voice"
                ? "text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/5"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            <Mic className="w-4 h-4" />
            Interview
          </button>
          <button
            onClick={() => setMobileTab("code")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition ${
              mobileTab === "code"
                ? "text-violet-400 border-b-2 border-violet-400 bg-violet-500/5"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            <Code2 className="w-4 h-4" />
            Code Editor
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex min-h-0">
        {/* Desktop: side-by-side layout */}
        {showEditor && (
          <div className="hidden md:block w-[55%] border-r border-white/[0.06] p-2">
            <InterviewEditor
              onCodeChange={handleCodeChange}
              onOutputChange={handleOutputChange}
            />
          </div>
        )}

        {/* Desktop: voice panel */}
        <div className={`hidden md:block ${showEditor ? "w-[45%]" : "w-full"}`}>
          <InterviewVoicePanel
            codeRef={codeRef}
            outputRef={outputRef}
            onInterviewEnd={handleInterviewEnd}
          />
        </div>

        {/* Mobile: tabbed layout */}
        <div className="md:hidden w-full">
          {(!showEditor || mobileTab === "voice") ? (
            <InterviewVoicePanel
              codeRef={codeRef}
              outputRef={outputRef}
              onInterviewEnd={handleInterviewEnd}
            />
          ) : (
            <div className="h-full p-2">
              <InterviewEditor
                onCodeChange={handleCodeChange}
                onOutputChange={handleOutputChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
