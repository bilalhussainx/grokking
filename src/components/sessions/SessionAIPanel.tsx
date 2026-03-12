"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Loader2, Lightbulb, Code2, Puzzle, Trash2 } from "lucide-react";
import type { SessionBroadcastEvent } from "@/types/sessions";

interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  userName?: string;
  userRole?: string;
  timestamp: number;
}

interface Props {
  sessionId: string;
  userId: string;
  userName: string;
  userRole: "student" | "teacher" | "observer";
  currentCode: string;
  sessionType: string;
  sendBroadcast: (event: SessionBroadcastEvent) => void;
}

const QUICK_PROMPTS = [
  { label: "Explain this concept", icon: <Lightbulb className="w-3 h-3" />, prompt: "Explain the concept behind our current code in simple terms. Use analogies and examples." },
  { label: "Debug this code", icon: <Code2 className="w-3 h-3" />, prompt: "Look at our current code and identify any bugs or potential improvements. Walk me through the fix step by step." },
  { label: "Challenge me", icon: <Puzzle className="w-3 h-3" />, prompt: "Give me a coding challenge related to what we're currently working on. Start easy and progressively increase difficulty." },
  { label: "Review & grade", icon: <Lightbulb className="w-3 h-3" />, prompt: "Review my current code like a teaching assistant. Rate it on correctness, efficiency, and style (1-10 each). Give specific improvement suggestions." },
];

export default function SessionAIPanel({ sessionId, userId, userName, userRole, currentCode, sessionType, sendBroadcast }: Props) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendToAI = useCallback(async (prompt: string) => {
    if (!prompt.trim() || streaming) return;

    const userMsg: AIMessage = {
      id: Date.now().toString(),
      role: "user",
      content: prompt,
      userName,
      userRole,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setStreaming(true);

    const assistantId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "", timestamp: Date.now() }]);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/ai/session-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompt,
          role: userRole,
          sessionContext: { type: sessionType, code: currentCode },
          history,
        }),
      });

      if (!res.body) throw new Error("No response stream");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        const current = accumulated;
        setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, content: current } : m));
      }
    } catch {
      setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, content: "Failed to get AI response. Please try again." } : m));
    } finally {
      setStreaming(false);
    }
  }, [streaming, messages, userName, userRole, sessionType, currentCode]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
        <Sparkles className="w-4 h-4 text-violet-400" />
        <span className="text-sm font-semibold">AI Tutor</span>
        <span className="text-[10px] text-[var(--muted-foreground)] ml-auto">
          Your personal coding tutor
        </span>
        {messages.length > 0 && (
          <button onClick={() => setMessages([])} className="text-[var(--muted-foreground)] hover:text-red-400 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Quick prompts */}
      {messages.length === 0 && (
        <div className="p-4 space-y-3">
          <p className="text-xs text-[var(--muted-foreground)]">Quick start ideas:</p>
          <div className="grid gap-2">
            {QUICK_PROMPTS.map((qp, i) => (
              <button
                key={i}
                onClick={() => sendToAI(qp.prompt)}
                className="flex items-center gap-2 rounded-xl glass-subtle px-4 py-3 text-left text-sm hover:bg-white/10 transition-colors"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/20 text-violet-400 shrink-0">
                  {qp.icon}
                </span>
                {qp.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {msg.role === "user" ? (
                <div className="flex justify-end">
                  <div className="max-w-[85%]">
                    <span className="text-[10px] text-[var(--muted-foreground)] mb-0.5 block text-right">
                      {msg.userName} ({msg.userRole})
                    </span>
                    <div className="rounded-2xl rounded-br-md bg-blue-500/20 text-blue-100 px-3.5 py-2 text-sm">
                      {msg.content}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-start">
                  <div className="max-w-[90%]">
                    <span className="text-[10px] text-violet-400 mb-0.5 block flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> Grok AI
                    </span>
                    <div className="rounded-2xl rounded-bl-md bg-white/8 px-3.5 py-2 text-sm whitespace-pre-wrap">
                      {msg.content || <Loader2 className="w-4 h-4 animate-spin text-violet-400" />}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendToAI(input); } }}
            placeholder="Ask the AI to brainstorm, explain, or challenge..."
            rows={1}
            className="glass-input flex-1 rounded-xl px-3.5 py-2.5 text-sm resize-none"
            disabled={streaming}
          />
          <button
            onClick={() => sendToAI(input)}
            disabled={!input.trim() || streaming}
            className="rounded-xl bg-violet-500/20 px-3 text-violet-400 hover:bg-violet-500/30 transition-colors disabled:opacity-30"
          >
            {streaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
