"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Zap, Plus, Users, ArrowLeft, LogIn, Loader2, Search } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import CreateSessionModal from "@/components/sessions/CreateSessionModal";
import SessionCard from "@/components/sessions/SessionCard";
import type { LiveSession } from "@/types/sessions";

export default function SessionsDashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [filter, setFilter] = useState<"all" | "live" | "ended">("all");

  const fetchSessions = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/sessions?userId=${user.id}`);
      const data = await res.json();
      if (Array.isArray(data)) setSessions(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchSessions();
  }, [user, fetchSessions]);

  const handleCreate = async (data: { title: string; description: string; session_type: string; course_slug?: string; module_id?: string; lesson_id?: string }) => {
    if (!user) return;
    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, teacher_id: user.id }),
    });
    const session = await res.json();
    if (session.id) router.push(`/sessions/${session.id}`);
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || joinCode.length < 6) return;
    setJoining(true);
    try {
      const res = await fetch("/api/sessions/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ join_code: joinCode.toUpperCase(), user_id: user.id }),
      });
      const data = await res.json();
      if (data.session?.id) router.push(`/sessions/${data.session.id}`);
    } finally {
      setJoining(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) { router.push("/login"); return null; }

  const filtered = filter === "all" ? sessions
    : filter === "live" ? sessions.filter((s) => s.status === "active")
    : sessions.filter((s) => s.status === "ended" || s.status === "paused");

  const liveCount = sessions.filter((s) => s.status === "active").length;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Sticky header */}
      <nav className="sticky top-0 z-40 border-b border-white/[0.06] bg-[var(--background)]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-2.5">
          <Link href="/" className="rounded-lg p-1.5 hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <Zap className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-bold">Sessions</span>

          {/* Inline join */}
          <form onSubmit={handleJoin} className="ml-4 flex items-center gap-1.5">
            <input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 6))}
              placeholder="JOIN CODE"
              maxLength={6}
              className="w-24 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-[11px] font-mono tracking-widest text-center placeholder:text-white/20 focus:outline-none focus:border-blue-500/40"
            />
            <button
              type="submit"
              disabled={joinCode.length < 6 || joining}
              className="rounded-lg bg-blue-500/15 px-2.5 py-1.5 text-[11px] font-semibold text-blue-400 hover:bg-blue-500/25 transition-colors disabled:opacity-30 flex items-center gap-1"
            >
              {joining ? <Loader2 className="w-3 h-3 animate-spin" /> : <LogIn className="w-3 h-3" />}
              Join
            </button>
          </form>

          <div className="flex-1" />

          {/* Filter pills */}
          <div className="flex items-center gap-0.5 rounded-lg border border-white/[0.06] bg-white/[0.02] p-0.5">
            {([["all", "All"], ["live", `Live${liveCount ? ` (${liveCount})` : ""}`], ["ended", "Past"]] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  filter === key ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {profile?.role === "teacher" && (
            <button
              onClick={() => setShowCreate(true)}
              className="rounded-lg bg-gradient-to-r from-blue-500 to-violet-600 px-3 py-1.5 text-[11px] font-semibold text-white flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-3.5 h-3.5" /> New
            </button>
          )}
        </div>
      </nav>

      {/* Grid */}
      <div className="mx-auto max-w-6xl px-6 py-6">
        {loading ? (
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 h-28 animate-pulse" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((session, i) => (
              <SessionCard key={session.id} session={session} index={i} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <Users className="w-10 h-10 mb-3 text-white/10" />
            <p className="text-sm text-white/40 mb-1">
              {filter !== "all" ? "No sessions match this filter" : "No sessions yet"}
            </p>
            <p className="text-xs text-white/20 mb-5">
              {profile?.role === "teacher" ? "Create a session to get started" : "Join with a code from your teacher"}
            </p>
            {profile?.role === "teacher" && (
              <button
                onClick={() => setShowCreate(true)}
                className="rounded-lg bg-white/[0.06] border border-white/[0.08] px-4 py-2 text-xs font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Create Session
              </button>
            )}
          </motion.div>
        )}
      </div>

      <CreateSessionModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}
