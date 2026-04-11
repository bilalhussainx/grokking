"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Briefcase, Calendar, CheckCircle2, Plus, Send, Sparkles, X } from "lucide-react";

interface Pathway {
  id: string;
  targetRole: string;
  targetCompanies: string[];
  targetTimeline: string | null;
  requiredSkills: { skillId: string; skillName?: string; status?: "have" | "missing" }[];
  recommendedCourses: string[];
  completedMilestones: string[];
  nextAction: string | null;
  status: "active" | "paused" | "achieved" | "abandoned";
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function CareerDashboard() {
  const [pathway, setPathway] = useState<Pathway | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // New-pathway form
  const [newRole, setNewRole] = useState("");
  const [newCompanies, setNewCompanies] = useState("");
  const [newTimeline, setNewTimeline] = useState("");

  const loadPathway = useCallback(async () => {
    try {
      const res = await fetch("/api/career/pathway");
      if (res.ok) {
        const data = await res.json();
        setPathway(data.pathway);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPathway();
  }, [loadPathway]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  async function createPathway() {
    if (!newRole.trim()) return;
    const res = await fetch("/api/career/pathway", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetRole: newRole.trim(),
        targetCompanies: newCompanies
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        targetTimeline: newTimeline.trim() || undefined,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setPathway(data.pathway);
      setCreating(false);
      setNewRole("");
      setNewCompanies("");
      setNewTimeline("");
    }
  }

  async function toggleMilestone(milestone: string) {
    if (!pathway) return;
    const next = pathway.completedMilestones.includes(milestone)
      ? pathway.completedMilestones.filter((m) => m !== milestone)
      : [...pathway.completedMilestones, milestone];
    const res = await fetch("/api/career/pathway", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: pathway.id, completedMilestones: next }),
    });
    if (res.ok) {
      const data = await res.json();
      setPathway(data.pathway);
    }
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");
    const newMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setStreaming(true);

    try {
      const res = await fetch("/api/career/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages,
        }),
      });

      if (!res.ok || !res.body) {
        setMessages([...newMessages, { role: "assistant", content: "Coach unavailable right now." }]);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      setMessages([...newMessages, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages([...newMessages, { role: "assistant", content: accumulated }]);
      }
    } finally {
      setStreaming(false);
    }
  }

  // Default milestones if pathway has none defined
  const milestones =
    pathway?.requiredSkills.length
      ? pathway.requiredSkills.map((s) => s.skillName || s.skillId)
      : ["Define target role", "Complete 3 prep courses", "Pass 10 mock interviews", "Apply to 5 companies"];

  if (loading) {
    return (
      <div className="rounded-xl bg-white/5 border border-white/10 p-8 animate-pulse">
        <div className="h-6 bg-white/10 rounded w-1/3 mb-4" />
        <div className="h-4 bg-white/10 rounded w-1/2" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl bg-gradient-to-br from-violet-900/40 to-cyan-900/30 border border-white/10 backdrop-blur-sm p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 text-white">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white">
                {pathway ? pathway.targetRole : "No active pathway"}
              </h2>
              {pathway && (
                <div className="flex flex-wrap gap-3 mt-1 text-sm text-white/60">
                  {pathway.targetCompanies.length > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5" /> {pathway.targetCompanies.join(", ")}
                    </span>
                  )}
                  {pathway.targetTimeline && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {pathway.targetTimeline}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {!pathway && !creating && (
            <button
              onClick={() => setCreating(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition"
            >
              <Plus className="w-4 h-4" /> Set Target Role
            </button>
          )}
        </div>

        {/* Inline create form */}
        <AnimatePresence>
          {creating && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="Target role (e.g. Senior Backend Engineer)"
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500"
                />
                <input
                  value={newCompanies}
                  onChange={(e) => setNewCompanies(e.target.value)}
                  placeholder="Target companies (comma-separated)"
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500"
                />
                <input
                  value={newTimeline}
                  onChange={(e) => setNewTimeline(e.target.value)}
                  placeholder="Timeline (e.g. 6 months)"
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500"
                />
              </div>
              <div className="mt-3 flex gap-2 justify-end">
                <button
                  onClick={() => setCreating(false)}
                  className="px-4 py-2 text-sm text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={createPathway}
                  className="px-4 py-2 text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-lg"
                >
                  Create Pathway
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {pathway?.nextAction && (
          <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
            <div className="text-xs uppercase tracking-wide text-white/40 mb-1">Next action</div>
            <div className="text-sm text-white">{pathway.nextAction}</div>
          </div>
        )}
      </div>

      {pathway && (
        <>
          {/* Milestones */}
          <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Milestones</h3>
            <div className="space-y-2">
              {milestones.map((m) => {
                const done = pathway.completedMilestones.includes(m);
                return (
                  <button
                    key={m}
                    onClick={() => toggleMilestone(m)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left transition"
                  >
                    <CheckCircle2
                      className={`w-5 h-5 ${done ? "text-emerald-400" : "text-white/30"}`}
                    />
                    <span className={`text-sm ${done ? "text-white/50 line-through" : "text-white"}`}>
                      {m}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Chat trigger */}
      <button
        onClick={() => setChatOpen(true)}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 text-white rounded-xl font-medium transition"
      >
        <Sparkles className="w-5 h-5" /> Chat with the Career Coach
      </button>

      {/* Chat panel */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 p-0 md:p-4"
            onClick={() => setChatOpen(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl h-[80vh] md:h-[70vh] bg-[var(--background)] border border-white/10 rounded-t-2xl md:rounded-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                  <span className="text-white font-medium">Career Coach</span>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="p-1 text-white/50 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center text-white/40 text-sm mt-8">
                    Ask for a strategic next step, a skill-gap rundown, or a brutal reality check on your timeline.
                  </div>
                )}
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${
                        m.role === "user"
                          ? "bg-violet-600 text-white"
                          : "bg-white/10 text-white/90"
                      }`}
                    >
                      {m.content || (streaming ? "..." : "")}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-white/10 flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="What should I focus on this week?"
                  disabled={streaming}
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500"
                />
                <button
                  onClick={sendMessage}
                  disabled={streaming || !input.trim()}
                  className="p-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-lg"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
