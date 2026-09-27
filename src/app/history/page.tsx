"use client";

// Session History page — last 20 sessions with title, date, summary.
// Per audit 2026-04-07: "No session history. Users can't track progress."
// Reads from localStorage via getAllNotes() (existing). Shows mock interview
// sessions, language tutor sessions, and coach Alex sessions.

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Mic, Target, BookOpen, ArrowLeft, GraduationCap, MessageSquare } from "lucide-react";
import { getAllNotes, type SessionNote } from "@/lib/sessionNotes";

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (minutes < 60) return minutes <= 1 ? "just now" : `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

function iconForSession(note: SessionNote) {
  if (note.courseSlug === "mock-interview") return Target;
  if (note.courseSlug === "college-interview") return GraduationCap;
  if (note.courseSlug === "talk-session" || note.courseSlug === "voice-tutor") return Mic;
  if (note.courseSlug === "coach-chat") return MessageSquare;
  return BookOpen;
}

function categoryLabel(note: SessionNote): string {
  if (note.courseSlug === "mock-interview") return "Tech interview";
  if (note.courseSlug === "college-interview") return "College interview";
  if (note.courseSlug === "talk-session" || note.courseSlug === "voice-tutor") return "Voice tutor";
  if (note.courseSlug === "coach-chat") return "Coach Kairos";
  return note.courseTitle || "Lesson";
}

export default function HistoryPage() {
  const [notes, setNotes] = useState<SessionNote[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setNotes(getAllNotes().slice(0, 20));
    setLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/"
            className="p-2 rounded-lg hover:bg-white/5 transition"
            title="Back to home"
          >
            <ArrowLeft className="w-4 h-4 text-white/40" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Your sessions</h1>
            <p className="text-xs text-white/40">
              Last 20 interviews, voice chats, and coach sessions
            </p>
          </div>
        </div>

        {/* Empty state */}
        {loaded && notes.length === 0 && (
          <div className="text-center py-20">
            <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <Clock className="w-8 h-8 text-violet-400" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">No sessions yet</h2>
            <p className="text-sm text-white/50 mb-6 max-w-sm mx-auto">
              Practice your first interview, voice tutor session, or coach chat.
              Your history will appear here automatically.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/college-interviews"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#C4A030] transition-colors"
              >
                <GraduationCap className="w-4 h-4" />
                Start a college interview
              </Link>
            </div>
          </div>
        )}

        {/* Session list */}
        {notes.length > 0 && (
          <div className="space-y-3">
            {notes.map((note, i) => {
              const Icon = iconForSession(note);
              return (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 hover:border-[#D4AF37]/30 hover:bg-white/[0.04] transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">
                            {categoryLabel(note)}
                          </p>
                          <h3 className="text-sm font-semibold text-white truncate">
                            {note.lessonTitle}
                          </h3>
                        </div>
                        <span className="text-[10px] text-white/30 shrink-0">
                          {formatRelativeTime(note.timestamp)}
                        </span>
                      </div>
                      {note.summary && (
                        <p className="text-xs text-white/50 leading-relaxed mb-2 line-clamp-2">
                          {note.summary}
                        </p>
                      )}
                      {note.keyPoints && note.keyPoints.length > 0 && (
                        <ul className="space-y-1 mt-2">
                          {note.keyPoints.slice(0, 3).map((point, j) => (
                            <li
                              key={j}
                              className="text-[11px] text-white/40 leading-snug flex gap-2 before:content-['•'] before:text-white/20"
                            >
                              {point}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
