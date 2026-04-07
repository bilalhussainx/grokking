"use client";

// Text-only interview panel — drop-in replacement for InterviewVoicePanel
// when the user picks text mode at setup time. Sends each user message to
// /api/interviews/text-message and renders the conversation.
//
// Spec: 2026-04-07 audit P0 — "Add text-only fallback. Blocks ~30% of users
// without microphone." Same persona prompts, same scoring path — only the
// I/O modality changes.

import { useState, useEffect, useRef, useCallback } from "react";
import { Send, PhoneOff, Loader2, MessageSquare } from "lucide-react";
import { useInterview } from "@/contexts/InterviewContext";
import type { TranscriptEntry } from "@/types/interview";
import { saveSessionNote } from "@/lib/sessionNotes";
import { markMissionComplete } from "@/lib/dailyMissions";

interface InterviewTextPanelProps {
  codeRef: React.MutableRefObject<string>;
  outputRef: React.MutableRefObject<string>;
  onInterviewEnd: () => void;
}

export default function InterviewTextPanel({
  codeRef,
  outputRef,
  onInterviewEnd,
}: InterviewTextPanelProps) {
  const {
    questionPlan,
    addTranscriptEntry,
    transcript,
    setFinalCode,
    interviewType,
    language,
    companyPersonaId,
    category,
    collegePersonaId,
    applicantProfile,
  } = useInterview();

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  // Send a turn to the LLM
  const sendTurn = useCallback(
    async (userMessage: string | null) => {
      setSending(true);
      setError("");
      try {
        // Build conversation history for the API
        const history: Array<{ role: "user" | "assistant"; content: string }> = transcript.map((t) => ({
          role: t.role === "user" ? "user" : "assistant",
          content: t.text,
        }));
        if (userMessage) {
          history.push({ role: "user", content: userMessage });
        }

        const res = await fetch("/api/interviews/text-message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category: category || "tech",
            language: language || "en",
            companyPersonaId,
            collegePersonaId,
            applicantProfile,
            questionPlan,
            interviewType,
            conversationHistory: history,
            isGreeting: history.length === 0,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `API error ${res.status}`);
        }
        const { reply } = await res.json();
        if (reply) {
          addTranscriptEntry({ role: "agent", text: reply, timestamp: Date.now() });
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to send message";
        setError(msg);
        console.error("[InterviewTextPanel] Send failed:", msg);
      } finally {
        setSending(false);
        // Refocus the input so the user can keep typing
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    },
    [
      transcript,
      category,
      language,
      companyPersonaId,
      collegePersonaId,
      applicantProfile,
      questionPlan,
      interviewType,
      addTranscriptEntry,
    ]
  );

  // Auto-start: fetch the first interviewer message + start the timer
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    // Mark the daily mission for "complete a mock interview" — auto-detect
    markMissionComplete("mock-interview");

    // Trigger the greeting turn after a small delay so the room can mount
    setTimeout(() => {
      sendTurn(null);
    }, 300);

    // Start countdown timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save transcript as session notes for /history page
  const saveNotes = useCallback(() => {
    if (transcript.length < 2) return;
    const agentMessages = transcript.filter((m) => m.role === "agent");
    const userMessages = transcript.filter((m) => m.role === "user");
    const keyPoints = agentMessages
      .map((m) => m.text.split(/[.!?]\s/)[0])
      .filter((v, i, arr) => arr.indexOf(v) === i)
      .slice(0, 6);
    const summary = `Text interview (${interviewType}). ${agentMessages.length} interviewer turns, ${userMessages.length} candidate turns.`;
    saveSessionNote({
      id: `interview-text-${Date.now()}`,
      courseSlug: category === "college" ? "college-interview" : "mock-interview",
      courseTitle: category === "college" ? "College Interview" : "Mock Interview",
      lessonSlug: `text-${Date.now()}`,
      lessonTitle: `${category === "college" ? "College" : "Tech"} interview (text)`,
      moduleTitle: "Interview Practice",
      summary,
      keyPoints,
      timestamp: Date.now(),
      messages: transcript.map((m) => ({
        role: m.role === "agent" ? ("coach" as const) : ("user" as const),
        text: m.text,
      })),
    });
  }, [transcript, category, interviewType]);

  // Time warnings
  useEffect(() => {
    if (timeLeft === 0 && transcript.length > 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      setFinalCode(codeRef.current);
      saveNotes();
      onInterviewEnd();
    }
  }, [timeLeft, transcript.length, codeRef, setFinalCode, onInterviewEnd, saveNotes]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || sending) return;
    addTranscriptEntry({ role: "user", text: trimmed, timestamp: Date.now() });
    setInput("");
    sendTurn(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const endInterview = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setFinalCode(codeRef.current);
    saveNotes();
    onInterviewEnd();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const isUrgent = timeLeft <= 5 * 60;

  return (
    <div className="flex flex-col h-full bg-[var(--background)]">
      {/* Header */}
      <div className="p-3 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-sm font-medium text-white/70">Text interview</span>
        </div>
        <div className={`font-mono text-lg font-bold ${isUrgent ? "text-red-400" : "text-white/80"}`}>
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* End-interview button */}
      <div className="px-3 py-2 border-b border-white/[0.06] flex items-center justify-end gap-2">
        <button
          onClick={endInterview}
          className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors border border-red-500/30"
          title="End interview"
        >
          <PhoneOff className="w-4 h-4" />
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="px-3 py-2 bg-red-500/10 border-b border-red-500/20">
          <span className="text-xs text-red-400">{error}</span>
        </div>
      )}

      {/* Transcript */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {transcript.length === 0 && sending && (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
            <Loader2 className="w-6 h-6 animate-spin mb-2" />
            <p className="text-xs">The interviewer is preparing the first question…</p>
          </div>
        )}
        {transcript.map((entry: TranscriptEntry, i: number) => (
          <div key={i}>
            {entry.role === "user" ? (
              <div className="flex justify-end">
                <div className="bg-blue-500/15 border border-blue-500/20 rounded-lg px-3 py-2 max-w-[85%]">
                  <p className="text-xs text-white/80 leading-relaxed whitespace-pre-wrap">{entry.text}</p>
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded-lg border-l-2 border-violet-500/40 bg-violet-500/5">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] text-white/30 uppercase tracking-wider font-medium">Interviewer</span>
                </div>
                <p className="text-white/80 text-xs leading-relaxed whitespace-pre-wrap">{entry.text}</p>
              </div>
            )}
          </div>
        ))}
        {sending && transcript.length > 0 && (
          <div className="flex items-center gap-2 text-white/40 text-[11px] pl-3">
            <Loader2 className="w-3 h-3 animate-spin" />
            Interviewer is thinking…
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer… (Enter to send, Shift+Enter for new line)"
            rows={2}
            className="flex-1 resize-none bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white/90 placeholder:text-white/20 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.05] transition-colors"
            disabled={sending}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="p-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 text-white hover:from-violet-500 hover:to-cyan-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Send"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
