"use client";

import { useState, useEffect } from "react";
import { FileText, Trash2, ChevronDown, ChevronRight, BookOpen } from "lucide-react";
import {
  getAllNotes,
  getNotesForCourse,
  deleteNote,
  type SessionNote,
} from "@/lib/sessionNotes";
import { useAI } from "@/contexts/AIContext";

export default function SessionNotes() {
  const { lessonContext } = useAI();
  const [notes, setNotes] = useState<SessionNote[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "course">("course");

  useEffect(() => {
    const courseSlug = lessonContext?.courseSlug;
    if (filter === "course" && courseSlug) {
      setNotes(getNotesForCourse(courseSlug));
    } else {
      setNotes(getAllNotes());
    }
  }, [filter, lessonContext]);

  const handleDelete = (id: string) => {
    deleteNote(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full bg-[var(--background)]">
      {/* Header */}
      <div className="p-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-sm shadow-lg shadow-amber-500/20">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Session Notes</h3>
            <p className="text-[11px] text-white/40">
              {notes.length} note{notes.length !== 1 ? "s" : ""} saved
            </p>
          </div>
        </div>

        {/* Filter toggle */}
        <div className="flex gap-1">
          <button
            onClick={() => setFilter("course")}
            className={`px-2.5 py-1 rounded text-[10px] font-medium transition-all ${
              filter === "course"
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : "bg-white/[0.04] text-white/40 border border-white/[0.06]"
            }`}
          >
            This Course
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`px-2.5 py-1 rounded text-[10px] font-medium transition-all ${
              filter === "all"
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : "bg-white/[0.04] text-white/40 border border-white/[0.06]"
            }`}
          >
            All Courses
          </button>
        </div>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {notes.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
            <BookOpen className="w-8 h-8 mb-2" />
            <p className="text-xs">No notes yet</p>
            <p className="text-[10px] mt-1">
              Chat with Coach Kairos to generate session notes
            </p>
          </div>
        )}

        {notes.map((note) => {
          const isExpanded = expandedId === note.id;
          return (
            <div
              key={note.id}
              className="border border-white/[0.06] rounded-lg bg-white/[0.02] overflow-hidden"
            >
              {/* Note header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : note.id)}
                className="w-full px-3 py-2 flex items-start gap-2 text-left hover:bg-white/[0.03] transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3 text-white/30 mt-0.5 shrink-0" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-white/30 mt-0.5 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white/80 truncate">
                    {note.lessonTitle}
                  </div>
                  <div className="text-[10px] text-white/30 truncate">
                    {note.moduleTitle} &middot; {formatDate(note.timestamp)}
                  </div>
                </div>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-3 pb-3 border-t border-white/[0.04]">
                  {/* Summary */}
                  <div className="mt-2 mb-2">
                    <div className="text-[10px] text-amber-400/70 uppercase tracking-wider font-medium mb-1">
                      Summary
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">
                      {note.summary}
                    </p>
                  </div>

                  {/* Key Points */}
                  {note.keyPoints.length > 0 && (
                    <div className="mb-2">
                      <div className="text-[10px] text-amber-400/70 uppercase tracking-wider font-medium mb-1">
                        Key Points
                      </div>
                      <ul className="space-y-0.5">
                        {note.keyPoints.map((point, i) => (
                          <li
                            key={i}
                            className="text-xs text-white/60 flex items-start gap-1.5"
                          >
                            <span className="text-amber-400 mt-0.5 shrink-0">
                              &bull;
                            </span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Full conversation toggle */}
                  {note.messages.length > 0 && (
                    <details className="mt-2">
                      <summary className="text-[10px] text-white/30 cursor-pointer hover:text-white/50">
                        Full conversation ({note.messages.length} messages)
                      </summary>
                      <div className="mt-1.5 space-y-1 max-h-48 overflow-y-auto">
                        {note.messages.map((msg, i) => (
                          <div
                            key={i}
                            className={`text-[10px] leading-relaxed px-2 py-1 rounded ${
                              msg.role === "user"
                                ? "bg-blue-500/10 text-white/60 ml-4"
                                : "bg-white/[0.03] text-white/50"
                            }`}
                          >
                            <span className="font-medium text-white/40">
                              {msg.role === "user" ? "You" : "Coach"}:
                            </span>{" "}
                            {msg.text}
                          </div>
                        ))}
                      </div>
                    </details>
                  )}

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="mt-2 flex items-center gap-1 text-[10px] text-red-400/50 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                    Delete note
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
