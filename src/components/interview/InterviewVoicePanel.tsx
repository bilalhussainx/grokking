"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, PhoneOff, AlertCircle } from "lucide-react";
import { useInterview } from "@/contexts/InterviewContext";
import type { TranscriptEntry } from "@/types/interview";
import { saveSessionNote } from "@/lib/sessionNotes";
import { useDeepgramAgent } from "@/hooks/useDeepgramAgent";

interface InterviewVoicePanelProps {
  codeRef: React.MutableRefObject<string>;
  outputRef: React.MutableRefObject<string>;
  onInterviewEnd: () => void;
}

export default function InterviewVoicePanel({
  codeRef,
  outputRef,
  onInterviewEnd,
}: InterviewVoicePanelProps) {
  const { questionPlan, addTranscriptEntry, transcript, setFinalCode, interviewType } = useInterview();
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sentFiveMinWarning = useRef(false);
  const sentTimeUp = useRef(false);
  const startedRef = useRef(false);

  const lastAgentMsg = useRef("");

  const deepgramCallbacks = {
    onUserMessage: (text: string) => {
      addTranscriptEntry({ role: "user", text, timestamp: Date.now() });
    },
    onAgentMessage: (text: string) => {
      // Deduplicate repeated messages (Deepgram can echo the same intro)
      const trimmed = text.trim();
      if (trimmed === lastAgentMsg.current) return;
      lastAgentMsg.current = trimmed;
      addTranscriptEntry({ role: "agent", text: trimmed, timestamp: Date.now() });
    },
    onConnect: () => {
      // Send interview context to the Deepgram agent
      const isFallback = questionPlan?.fallback;
      const persona = questionPlan?.interviewerPersona || "professional interviewer";

      const silenceRules = `
SILENCE HANDLING (CRITICAL):
- If the candidate goes silent for more than 5-8 seconds, DO NOT just wait forever.
- After ~5 seconds of silence, gently nudge: rephrase the question in simpler terms, give a hint, or ask "Would you like me to rephrase that?" or "Take your time — want a hint to get started?"
- If still silent after another 5 seconds, break the question into smaller parts: "Let's start simpler — what's the first thing you'd think about?"
- Be a proactive coach: guide them through the thought process, don't just wait for a perfect answer.
- Keep the interview moving naturally — long silences kill the learning experience.
- NEVER repeat the exact same question verbatim. Always rephrase, simplify, or offer a different angle.`;

      const prompt = isFallback
        ? `You are conducting a ${interviewType || "technical"} interview as a ${persona}.

RULES:
- Generate questions dynamically based on the conversation flow — adapt to what the candidate says.
- Ask ONE question at a time. Wait for the candidate to respond before asking the next.
- Start with easier questions, then increase difficulty based on their answers.
- If they answer well, go deeper. If they struggle, TEACH THEM the correct approach.
- Cover a range of topics relevant to the role.
- At 5 minutes remaining, wrap up with "Any questions for me?"
- Start by briefly introducing yourself and the interview format, then ask the first question.
- Keep a natural, conversational tone — this should feel like a real interview, not a quiz.
${silenceRules}`
        : `You are conducting a ${interviewType || "technical"} interview. Here is your question plan:\n${JSON.stringify(questionPlan, null, 2)}\n\nRULES:\n- Ask questions one at a time. Wait for the candidate to respond.\n- Adapt follow-up questions based on their answers — don't rigidly follow the plan.\n- When the candidate is coding, observe their approach and give guidance if stuck.\n- IMPORTANT: When the candidate struggles, TEACH THEM. Explain the correct answer clearly.\n- At 5 minutes remaining, wrap up with "Any questions for me?"\n- Start by briefly introducing yourself and the format, then ask the first question.\n${silenceRules}`;

      deepgramRef.current?.sendPromptUpdate(prompt);

      // Start countdown timer
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) return 0;
          return prev - 1;
        });
      }, 1000);
    },
    onDisconnect: () => {
      if (timerRef.current) clearInterval(timerRef.current);
    },
    onError: (err: string) => {
      console.error("[Interview] Deepgram error:", err);
    },
  };

  const deepgram = useDeepgramAgent(deepgramCallbacks);
  const deepgramRef = useRef(deepgram);
  deepgramRef.current = deepgram;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  // Auto-start session
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const timer = setTimeout(() => {
      deepgram.start({
        mode: "interviewer",
        personaId: "interviewer-mentor",
      });
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Send code context updates periodically
  useEffect(() => {
    if (!deepgram.isConnected) return;

    const interval = setInterval(() => {
      if (codeRef.current) {
        deepgram.sendPromptUpdate(
          `CANDIDATE'S CURRENT CODE:\n\`\`\`\n${codeRef.current}\n\`\`\`\nOUTPUT: ${outputRef.current || "(not run yet)"}`
        );
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [deepgram.isConnected, deepgram, codeRef, outputRef]);

  // Save interview transcript as session notes
  const saveInterviewNotes = useCallback(() => {
    if (transcript.length < 2) return;

    const agentMessages = transcript.filter(m => m.role === "agent" && m.text.length > 10);
    const userMessages = transcript.filter(m => m.role === "user");

    const keyPoints = agentMessages
      .map(m => {
        const firstSentence = m.text.split(/[.!?]\s/)[0];
        return firstSentence.length > 150 ? firstSentence.slice(0, 150) + "..." : firstSentence;
      })
      .filter((v, i, arr) => arr.indexOf(v) === i)
      .slice(0, 8);

    const planQuestions = questionPlan?.questions?.map((q: { text: string }) => q.text).join("; ") || "general interview";
    const summary = `Mock interview session (${interviewType}). ${agentMessages.length} interviewer responses, ${userMessages.length} candidate responses. Questions covered: ${planQuestions.slice(0, 200)}.`;

    saveSessionNote({
      id: `interview-${Date.now()}`,
      courseSlug: "mock-interview",
      courseTitle: "Mock Interview",
      lessonSlug: `session-${Date.now()}`,
      lessonTitle: `${interviewType?.charAt(0).toUpperCase()}${interviewType?.slice(1)} Interview`,
      moduleTitle: "Interview Practice",
      summary,
      keyPoints,
      timestamp: Date.now(),
      messages: transcript.map(m => ({
        role: m.role === "agent" ? "coach" as const : "user" as const,
        text: m.text,
      })),
    });
  }, [transcript, questionPlan, interviewType]);

  // Time warnings
  useEffect(() => {
    if (timeLeft === 5 * 60 && !sentFiveMinWarning.current && deepgram.isConnected) {
      sentFiveMinWarning.current = true;
      deepgram.sendPromptUpdate("TIME CHECK: 5 minutes remaining. Start wrapping up. Ask if the candidate has any questions.");
    }

    if (timeLeft === 0 && !sentTimeUp.current) {
      sentTimeUp.current = true;
      deepgram.sendPromptUpdate("TIME'S UP. Say 'That wraps up our time today. Thanks for the interview.' then stop.");
      setTimeout(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        setFinalCode(codeRef.current);
        saveInterviewNotes();
        deepgram.stop();
        onInterviewEnd();
      }, 10000);
    }
  }, [timeLeft, deepgram, codeRef, setFinalCode, onInterviewEnd, saveInterviewNotes]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const endInterview = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setFinalCode(codeRef.current);
    saveInterviewNotes();
    deepgram.stop();
    onInterviewEnd();
  }, [deepgram, codeRef, setFinalCode, onInterviewEnd, saveInterviewNotes]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const isUrgent = timeLeft <= 5 * 60;
  const connected = deepgram.isConnected;
  const connecting = deepgram.isConnecting;

  return (
    <div className="flex flex-col h-full bg-[var(--background)]">
      <div className="p-3 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${connected ? "bg-emerald-400 animate-pulse" : connecting ? "bg-amber-400 animate-pulse" : "bg-white/20"}`} />
          <span className="text-sm font-medium text-white/70">
            {connected ? "Interview in progress" : connecting ? "Connecting..." : "Disconnected"}
          </span>
        </div>
        <div className={`font-mono text-lg font-bold ${isUrgent ? "text-red-400" : "text-white/80"}`}>
          {formatTime(timeLeft)}
        </div>
      </div>

      {connected && (
        <div className="px-3 py-2 border-b border-white/[0.06] flex items-center gap-2">
          <button
            onClick={() => deepgram.toggleMic()}
            className={`p-2 rounded-lg transition-colors ${
              deepgram.micMuted
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            }`}
          >
            {deepgram.micMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <div className="flex-1 flex items-center justify-center">
            {deepgram.isSpeaking ? (
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {[3, 4, 2.5, 3.5].map((h, i) => (
                    <span
                      key={i}
                      className="w-1 bg-blue-400 rounded-full animate-pulse"
                      style={{ height: `${h * 4}px`, animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-blue-400 font-medium">Interviewer speaking...</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-[11px] text-emerald-400 font-medium">
                  {deepgram.micMuted ? "Mic muted" : "Listening..."}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={endInterview}
            className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors border border-red-500/30"
            title="End interview"
          >
            <PhoneOff className="w-4 h-4" />
          </button>
        </div>
      )}

      {deepgram.error && (
        <div className="px-3 py-2 bg-red-500/10 border-b border-red-500/20 flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <span className="text-xs text-red-400">{deepgram.error}</span>
          <button
            onClick={() => deepgram.start({ mode: "interviewer", personaId: "interviewer-mentor" })}
            className="ml-auto text-xs text-red-400 underline hover:text-red-300"
          >
            Reconnect
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {transcript.length === 0 && !connected && !connecting && (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
            <Mic className="w-8 h-8 mb-2" />
            <p className="text-xs">Connecting to interviewer...</p>
          </div>
        )}
        {transcript.map((entry: TranscriptEntry, i: number) => (
          <div key={i}>
            {entry.role === "user" ? (
              <div className="flex justify-end">
                <div className="bg-blue-500/15 border border-blue-500/20 rounded-lg px-3 py-2 max-w-[85%]">
                  <p className="text-xs text-white/80 leading-relaxed">{entry.text}</p>
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded-lg border-l-2 border-violet-500/40 bg-violet-500/5">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] text-white/30 uppercase tracking-wider font-medium">Interviewer</span>
                </div>
                <p className="text-white/80 text-xs leading-relaxed">{entry.text}</p>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
