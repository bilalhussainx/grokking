"use client";
import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, Square, Copy, MessageSquare, Users,
  ChevronLeft, PanelRightOpen, PanelRightClose,
  Code2, Loader2, Sparkles, BookOpen, CheckCircle2,
  Send, Trophy, XCircle,
} from "lucide-react";
import type {
  LiveSession, SessionMessage, PresenceState,
  SessionBroadcastEvent,
} from "@/types/sessions";
import { useSessionChannel } from "@/hooks/useSessionChannel";
import { usePresence } from "@/hooks/usePresence";
import { getLessonById } from "@/lib/classroom";
import type { Lesson } from "@/data/types";
import SessionChat from "./SessionChat";
import SessionParticipants from "./SessionParticipants";
import SessionAIPanel from "./SessionAIPanel";
import PromptLab from "./PromptLab";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useTheme } from "@/contexts/ThemeContext";

const MonacoEditor = dynamic(() => import("@monaco-editor/react").then((m) => m.default), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="w-6 h-6 animate-spin text-[var(--muted-foreground)]" />
    </div>
  ),
});

type ActiveTab = "lesson" | "editor" | "ai" | "submit";

interface GradeResult {
  overall: number;
  correctness: number;
  efficiency: number;
  style: number;
  feedback: string;
  suggestions: string[];
  passed: boolean;
}

interface Props {
  session: LiveSession;
  userId: string;
  userName: string;
  userRole: "student" | "teacher" | "observer";
}

export default function SessionRoom({ session, userId, userName, userRole }: Props) {
  const { isDark } = useTheme();
  const [messages, setMessages] = useState<SessionMessage[]>([]);
  const [rightPanel, setRightPanel] = useState<"chat" | "participants">("chat");
  const [showRight, setShowRight] = useState(true);
  const [copied, setCopied] = useState(false);
  const [sessionStatus, setSessionStatus] = useState(session.status);
  const [activeTab, setActiveTab] = useState<ActiveTab>("lesson");

  // Editor state (independent per student, no teacher sync)
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");

  // Submission / grading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null);

  // Load lesson from course data
  const lesson: Lesson | null = useMemo(() => {
    const s = session as unknown as Record<string, unknown>;
    const courseSlug = (s.course_slug as string) || null;
    const lessonId = (s.lesson_id as string) || null;
    if (!courseSlug || !lessonId) return null;
    return getLessonById(courseSlug, lessonId);
  }, [session]);

  // Pre-load starter code when lesson is found
  useEffect(() => {
    if (lesson?.starterCode) {
      setCode(lesson.starterCode);
    }
  }, [lesson]);

  const handleMessage = useCallback((payload: Record<string, unknown>) => {
    const msg = payload as unknown as SessionMessage;
    if (!msg.sender_name && msg.metadata) {
      msg.sender_name = (msg.metadata as Record<string, unknown>).sender_name as string;
    }
    setMessages((prev) => [...prev, msg]);
  }, []);

  const handleBroadcastEvent = useCallback((event: SessionBroadcastEvent) => {
    if (event.type === "session_state") {
      setSessionStatus(event.status);
    }
  }, []);

  const { isConnected, presenceState, sendBroadcast } = useSessionChannel({
    sessionId: session.id,
    userId,
    userName,
    userRole,
    onMessage: handleMessage,
    onBroadcast: handleBroadcastEvent,
  });

  const { onlineUsers } = usePresence(presenceState);

  // Load chat history
  useEffect(() => {
    fetch(`/api/sessions/${session.id}/messages`)
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setMessages(d); });
  }, [session.id]);

  const sendMessage = async (msgContent: string, type = "chat") => {
    await fetch(`/api/sessions/${session.id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, content: msgContent, message_type: type, sender_name: userName }),
    });
  };

  const updateStatus = async (status: "draft" | "active" | "paused" | "ended") => {
    await fetch(`/api/sessions/${session.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setSessionStatus(status);
    sendBroadcast({ type: "session_state", status });
  };

  const copyCode = () => {
    navigator.clipboard.writeText(session.join_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const submitForGrading = async () => {
    if (!lesson || isSubmitting) return;
    setIsSubmitting(true);
    setGradeResult(null);

    try {
      // Grade the submission via AI
      const gradeRes = await fetch("/api/ai/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          output: "",
          starterCode: lesson.starterCode ?? "",
          solutionCode: lesson.solutionCode ?? "",
          lessonTitle: lesson.title,
          lessonContent: lesson.content.substring(0, 2000),
        }),
      });
      const grade: GradeResult = await gradeRes.json();
      setGradeResult(grade);

      // Record the submission
      await fetch("/api/classrooms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: session.id,
          lesson_id: (session as unknown as Record<string, unknown>).lesson_id,
          code,
          language,
          score: grade.overall,
          passed: grade.passed,
          feedback: grade.feedback,
        }),
      });
    } catch {
      setGradeResult({ overall: 0, correctness: 0, efficiency: 0, style: 0, feedback: "Failed to grade submission. Please try again.", suggestions: [], passed: false });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isActive = sessionStatus === "active";

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; condition?: boolean }[] = [
    { id: "lesson", label: "Lesson", icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: "editor", label: "Editor", icon: <Code2 className="w-3.5 h-3.5" /> },
    { id: "ai", label: "AI Tutor", icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: "submit", label: "Submit", icon: <Send className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex flex-col h-screen bg-[var(--background)]">
      {/* Top Bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.06] bg-[var(--background)]/80 backdrop-blur-xl">
        <Link href="/sessions" className="rounded-lg p-1.5 hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </Link>

        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-bold truncate">{session.title}</h1>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${sessionStatus === "active" ? "text-emerald-400" : "text-[var(--muted-foreground)]"}`}>
              {sessionStatus === "active" && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />}
              {sessionStatus.charAt(0).toUpperCase() + sessionStatus.slice(1)}
            </span>
            <span className="text-[10px] text-[var(--muted-foreground)]">
              {isConnected ? `${onlineUsers.length} online` : "Connecting..."}
            </span>
            {lesson && (
              <span className="text-[10px] text-blue-400/80 truncate max-w-[200px]">{lesson.title}</span>
            )}
          </div>
        </div>

        {/* Join code */}
        <button onClick={copyCode} className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-mono hover:bg-white/10 transition-colors">
          <Copy className="w-3 h-3" />{copied ? "Copied" : session.join_code}
        </button>

        {/* Teacher controls */}
        {userRole === "teacher" && (
          <div className="flex items-center gap-1.5">
            {sessionStatus === "draft" && (
              <button onClick={() => updateStatus("active")} className="btn-gradient rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5">
                <Play className="w-3 h-3" /> Start
              </button>
            )}
            {sessionStatus === "active" && (
              <>
                <button onClick={() => updateStatus("paused")} className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1.5 text-xs font-semibold text-yellow-400 flex items-center gap-1.5">
                  <Pause className="w-3 h-3" /> Pause
                </button>
                <button onClick={() => updateStatus("ended")} className="rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-xs font-semibold text-red-400 flex items-center gap-1.5">
                  <Square className="w-3 h-3" /> End
                </button>
              </>
            )}
            {sessionStatus === "paused" && (
              <button onClick={() => updateStatus("active")} className="btn-gradient rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5">
                <Play className="w-3 h-3" /> Resume
              </button>
            )}
          </div>
        )}

        {/* Right panel toggles */}
        <div className="flex items-center gap-0.5 rounded-lg border border-white/10 bg-white/5 p-0.5">
          <button onClick={() => { setRightPanel("chat"); setShowRight(true); }} className={`rounded-md px-2 py-1 text-xs transition-colors ${rightPanel === "chat" && showRight ? "bg-white/10 text-blue-400" : "text-[var(--muted-foreground)] hover:text-white"}`}>
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => { setRightPanel("participants"); setShowRight(true); }} className={`rounded-md px-2 py-1 text-xs transition-colors ${rightPanel === "participants" && showRight ? "bg-white/10 text-blue-400" : "text-[var(--muted-foreground)] hover:text-white"}`}>
            <Users className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setShowRight(!showRight)} className="rounded-md px-2 py-1 text-xs text-[var(--muted-foreground)] hover:text-white transition-colors">
            {showRight ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      {isActive && (
        <div className="flex items-center gap-1 px-3 py-1.5 border-b border-white/[0.06] bg-[var(--background)]/50">
          {tabs
            .filter((t) => t.condition !== false)
            .map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-3 py-1.5 text-xs flex items-center gap-1.5 transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-500/20 text-blue-400 font-semibold"
                    : "text-[var(--muted-foreground)] hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}

          {/* Prompt Lab for review sessions (teacher only) */}
          {session.session_type === "review" && userRole === "teacher" && (
            <button
              onClick={() => setActiveTab("ai")}
              className="ml-auto rounded-lg px-3 py-1.5 text-xs flex items-center gap-1.5 text-[var(--muted-foreground)] hover:text-white hover:bg-white/5 transition-all"
            >
              Prompt Lab
            </button>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          {isActive ? (
            <AnimatePresence mode="wait">
              {/* Lesson Tab */}
              {activeTab === "lesson" && (
                <motion.div key="lesson" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-auto">
                  {lesson ? (
                    <div className="max-w-3xl mx-auto p-6">
                      <h2 className="text-xl font-bold mb-4 text-white">{lesson.title}</h2>
                      <div className="glass-strong rounded-xl p-6 text-sm text-[var(--muted-foreground)] leading-relaxed whitespace-pre-wrap">
                        {lesson.content}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-[var(--muted-foreground)]">
                      <div className="text-center">
                        <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">No lesson linked to this session.</p>
                        <p className="text-xs mt-1 opacity-60">Create a session with a course and lesson to see content here.</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Editor Tab */}
              {activeTab === "editor" && (
                <motion.div key="editor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-1.5 border-b border-white/[0.06] bg-[var(--background)]/50">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="glass-input rounded-lg px-2 py-1 text-xs bg-transparent border-white/10"
                    >
                      <option value="python">Python</option>
                      <option value="javascript">JavaScript</option>
                      <option value="typescript">TypeScript</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                      <option value="go">Go</option>
                      <option value="rust">Rust</option>
                    </select>
                    {lesson?.starterCode && (
                      <button
                        onClick={() => setCode(lesson.starterCode ?? "")}
                        className="text-[10px] text-[var(--muted-foreground)] hover:text-white transition-colors"
                      >
                        Reset to starter code
                      </button>
                    )}
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <MonacoEditor
                      height="100%"
                      language={language}
                      value={code}
                      onChange={(val) => setCode(val ?? "")}
                      theme={isDark ? "vs-dark" : "light"}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: "on",
                        wordWrap: "off",
                        padding: { top: 16 },
                        scrollBeyondLastLine: false,
                        renderLineHighlight: "line",
                      }}
                    />
                  </div>
                </motion.div>
              )}

              {/* AI Tutor Tab */}
              {activeTab === "ai" && (
                <motion.div key="ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-hidden">
                  {session.session_type === "review" && userRole === "teacher" ? (
                    <PromptLab userRole={userRole} userId={userId} sendBroadcast={sendBroadcast} />
                  ) : (
                    <SessionAIPanel
                      sessionId={session.id}
                      userId={userId}
                      userName={userName}
                      userRole={userRole}
                      currentCode={code}
                      sessionType={session.session_type}
                      sendBroadcast={sendBroadcast}
                    />
                  )}
                </motion.div>
              )}

              {/* Submit Tab */}
              {activeTab === "submit" && (
                <motion.div key="submit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-auto">
                  <div className="max-w-2xl mx-auto p-6 space-y-6">
                    <div>
                      <h2 className="text-lg font-bold text-white mb-1">Submit Your Solution</h2>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {lesson ? `Submit your code for "${lesson.title}" to be graded by AI.` : "Submit your code for AI grading."}
                      </p>
                    </div>

                    {/* Code preview */}
                    <div className="glass-strong rounded-xl overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06]">
                        <span className="text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Your Code</span>
                        <span className="text-[10px] text-[var(--muted-foreground)]">{language}</span>
                      </div>
                      <pre className="p-4 text-xs font-mono text-emerald-400 overflow-auto max-h-[200px]">
                        {code || "No code written yet. Go to the Editor tab to write your solution."}
                      </pre>
                    </div>

                    {/* Submit button */}
                    {!gradeResult && (
                      <button
                        onClick={submitForGrading}
                        disabled={isSubmitting || !code.trim()}
                        className="w-full btn-gradient rounded-xl px-4 py-3 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Grading...</>
                        ) : (
                          <><Send className="w-4 h-4" /> Submit for Grading</>
                        )}
                      </button>
                    )}

                    {/* Grade result */}
                    {gradeResult && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <div className={`rounded-xl border p-6 text-center ${
                          gradeResult.passed
                            ? "border-emerald-500/30 bg-emerald-500/10"
                            : "border-red-500/30 bg-red-500/10"
                        }`}>
                          {gradeResult.passed ? (
                            <Trophy className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
                          ) : (
                            <XCircle className="w-12 h-12 mx-auto mb-3 text-red-400" />
                          )}
                          <div className="text-3xl font-bold mb-1">
                            <span className={gradeResult.passed ? "text-emerald-400" : "text-red-400"}>
                              {gradeResult.overall}
                            </span>
                            <span className="text-[var(--muted-foreground)] text-lg"> / 100</span>
                          </div>
                          <p className={`text-sm font-semibold ${gradeResult.passed ? "text-emerald-400" : "text-red-400"}`}>
                            {gradeResult.passed ? "Passed." : "Not yet — keep trying."}
                          </p>
                        </div>

                        <div className="glass-strong rounded-xl p-4">
                          <h3 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-2">Feedback</h3>
                          <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{gradeResult.feedback}</p>
                        </div>

                        <button
                          onClick={() => { setGradeResult(null); setActiveTab("editor"); }}
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-[var(--muted-foreground)] hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                        >
                          <Code2 className="w-4 h-4" /> Back to Editor
                        </button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-[var(--muted-foreground)]">
                <div className="text-6xl mb-4 opacity-20">{"{ }"}</div>
                <p className="text-sm">
                  {sessionStatus === "draft"
                    ? userRole === "teacher" ? "Click Start to begin the session" : "Waiting for teacher to start..."
                    : sessionStatus === "paused" ? "Session is paused"
                    : "Session has ended"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel */}
        {showRight && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            className="border-l border-white/[0.06] bg-[var(--background)]/50 backdrop-blur-xl overflow-hidden"
            style={{ width: 320 }}
          >
            {rightPanel === "chat" ? (
              <SessionChat messages={messages} onSendMessage={sendMessage} currentUserId={userId} />
            ) : (
              <SessionParticipants participants={onlineUsers} />
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
