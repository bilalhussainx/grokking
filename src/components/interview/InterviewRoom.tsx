"use client";

import { useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useInterview } from "@/contexts/InterviewContext";
import InterviewEditor from "./InterviewEditor";
import InterviewVoicePanel from "./InterviewVoicePanel";

export default function InterviewRoom() {
  const router = useRouter();
  const { sessionId, interviewType, questionPlan } = useInterview();
  const codeRef = useRef("");
  const outputRef = useRef("");

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
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/50 mb-4">No interview session found.</p>
          <a href="/interviews" className="text-blue-400 underline text-sm">Start a new interview</a>
        </div>
      </div>
    );
  }

  const showEditor = interviewType !== "behavioral";

  return (
    <div className="h-screen flex flex-col bg-[var(--background)]">
      <div className="h-12 border-b border-white/[0.06] flex items-center justify-between px-4 bg-[var(--background)]/60 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm font-semibold text-white/80">Mock Interview</span>
          <span className="text-xs text-white/30 ml-2 capitalize">{interviewType}</span>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {showEditor && (
          <div className="w-[55%] border-r border-white/[0.06] p-2">
            <InterviewEditor
              onCodeChange={handleCodeChange}
              onOutputChange={handleOutputChange}
            />
          </div>
        )}
        <div className={showEditor ? "w-[45%]" : "w-full"}>
          <InterviewVoicePanel
            codeRef={codeRef}
            outputRef={outputRef}
            onInterviewEnd={handleInterviewEnd}
          />
        </div>
      </div>
    </div>
  );
}
