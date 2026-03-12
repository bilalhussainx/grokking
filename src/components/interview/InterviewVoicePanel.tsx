"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useConversation } from "@elevenlabs/react";
import { Mic, MicOff, PhoneOff, Loader2, AlertCircle } from "lucide-react";
import { useInterview } from "@/contexts/InterviewContext";
import type { TranscriptEntry } from "@/types/interview";
import { saveSessionNote } from "@/lib/sessionNotes";

const AGENT_ID = process.env.NEXT_PUBLIC_ELEVENLABS_INTERVIEWER_AGENT_ID || "";

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
  const [micMuted, setMicMuted] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sentFiveMinWarning = useRef(false);
  const sentTimeUp = useRef(false);

  const conversation = useConversation({
    micMuted,
    onConnect: () => {
      console.log("[Interview] Connected to ElevenLabs");
      setConnecting(false);
      setConnected(true);
    },
    onDisconnect: (details) => {
      console.log("[Interview] Disconnected", details);
      setConnecting(false);
      setConnected(false);
    },
    onMessage: (msg) => {
      if (msg.source === "user" && msg.message) {
        addTranscriptEntry({ role: "user", text: msg.message, timestamp: Date.now() });
      } else if (msg.source === "ai" && msg.message) {
        addTranscriptEntry({ role: "agent", text: msg.message, timestamp: Date.now() });
      }
    },
    onError: (err) => {
      console.error("[Interview] Error:", err);
      setError("Voice connection error. Try reconnecting.");
      setConnecting(false);
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  const startSession = useCallback(async () => {
    if (connecting || connected || !AGENT_ID) {
      if (!AGENT_ID) setError("Interviewer agent not configured. Add NEXT_PUBLIC_ELEVENLABS_INTERVIEWER_AGENT_ID to .env.local.");
      return;
    }

    setConnecting(true);
    setError("");

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      await conversation.startSession({
        agentId: AGENT_ID,
        connectionType: "websocket",
      });

      if (questionPlan) {
        conversation.sendContextualUpdate(
          `You are a technical interviewer conducting a 30-minute mock interview.

INTERVIEW PLAN:
${JSON.stringify(questionPlan, null, 2)}

RULES:
- Ask questions one at a time. Wait for the candidate to respond.
- When the candidate is coding, observe their approach and give guidance if stuck for >60 seconds.
- Ask follow-up questions based on their answers.
- Keep a natural conversational tone — firm but encouraging.
- IMPORTANT: When the candidate says "I don't know", gives an incomplete answer, or struggles, TEACH THEM. Explain the correct answer clearly and thoroughly. Give concrete examples, mention specific technologies, and explain WHY the answer is what it is. This is a learning interview — the candidate should walk away knowing the answers.
- After explaining an answer, briefly summarize the key takeaway, then move to the next question.
- At 5 minutes remaining, wrap up with "Any questions for me?"
- Start by briefly introducing yourself and the format, then ask the first question.`
        );
      }

      if (codeRef.current) {
        conversation.sendContextualUpdate(
          `CANDIDATE'S CURRENT CODE:\n\`\`\`python\n${codeRef.current}\n\`\`\``
        );
      }

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const next = prev - 1;
          if (next <= 0) return 0;
          return next;
        });
      }, 1000);
    } catch (err) {
      console.error("[Interview] Failed to start:", err);
      setError(`Failed to connect: ${err}`);
      setConnecting(false);
    }
  }, [connecting, connected, conversation, questionPlan, codeRef]);

  useEffect(() => {
    const timer = setTimeout(() => startSession(), 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!connected) return;

    const interval = setInterval(() => {
      if (codeRef.current) {
        conversation.sendContextualUpdate(
          `CANDIDATE'S CURRENT CODE:\n\`\`\`python\n${codeRef.current}\n\`\`\`\nOUTPUT (last run): ${outputRef.current || "(not run yet)"}`
        );
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [connected, conversation, codeRef, outputRef]);

  useEffect(() => {
    if (timeLeft === 5 * 60 && !sentFiveMinWarning.current && connected) {
      sentFiveMinWarning.current = true;
      conversation.sendContextualUpdate("TIME CHECK: 5 minutes remaining. Start wrapping up. Ask if the candidate has any questions.");
    }

    if (timeLeft === 0 && !sentTimeUp.current) {
      sentTimeUp.current = true;
      if (connected) {
        conversation.sendContextualUpdate("TIME'S UP. Say 'That wraps up our time today. Thanks for the interview.' then stop.");
      }
      setTimeout(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        setFinalCode(codeRef.current);
        saveInterviewNotes();
        conversation.endSession().catch(() => {});
        onInterviewEnd();
      }, 10000);
    }
  }, [timeLeft, connected, conversation, codeRef, setFinalCode, onInterviewEnd, saveInterviewNotes]);

  const conversationRef = useRef(conversation);
  conversationRef.current = conversation;
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (conversationRef.current.status === "connected") {
        conversationRef.current.endSession().catch(() => {});
      }
    };
  }, []);

  // Save interview transcript as session notes
  const saveInterviewNotes = useCallback(() => {
    if (transcript.length < 2) return;

    const agentMessages = transcript.filter(m => m.role === "agent" && m.text.length > 10);
    const userMessages = transcript.filter(m => m.role === "user");

    // Extract key points from interviewer's teachings and questions
    const keyPoints = agentMessages
      .map(m => {
        const firstSentence = m.text.split(/[.!?]\s/)[0];
        return firstSentence.length > 150 ? firstSentence.slice(0, 150) + "..." : firstSentence;
      })
      .filter((v, i, arr) => arr.indexOf(v) === i)
      .slice(0, 8);

    const planQuestions = questionPlan?.questions?.map(q => q.text).join("; ") || "general interview";
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

  const endInterview = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setFinalCode(codeRef.current);
    saveInterviewNotes();
    conversation.endSession().catch(() => {});
    onInterviewEnd();
  }, [conversation, codeRef, setFinalCode, onInterviewEnd, saveInterviewNotes]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const isUrgent = timeLeft <= 5 * 60;

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
            onClick={() => setMicMuted(!micMuted)}
            className={`p-2 rounded-lg transition-colors ${
              micMuted
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            }`}
          >
            {micMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <div className="flex-1 flex items-center justify-center">
            {conversation.isSpeaking ? (
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
                  {micMuted ? "Mic muted" : "Listening..."}
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

      {error && (
        <div className="px-3 py-2 bg-red-500/10 border-b border-red-500/20 flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <span className="text-xs text-red-400">{error}</span>
          <button
            onClick={startSession}
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
