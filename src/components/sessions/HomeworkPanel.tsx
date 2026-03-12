"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Plus, Clock, Code2, CheckCircle } from "lucide-react";
import type { HomeworkAssignment } from "@/types/sessions";

interface Props {
  userRole: "student" | "teacher" | "observer";
  homework: HomeworkAssignment[];
  onAssign: (hw: HomeworkAssignment) => void;
  language: string;
}

export default function HomeworkPanel({ userRole, homework, onAssign, language }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [starterCode, setStarterCode] = useState("");

  const handleAssign = () => {
    if (!title.trim() || !description.trim()) return;
    const hw: HomeworkAssignment = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      starterCode: starterCode.trim() || undefined,
      language,
      assignedAt: new Date().toISOString(),
      assignedBy: "teacher",
    };
    onAssign(hw);
    setTitle("");
    setDescription("");
    setStarterCode("");
    setShowForm(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
        <BookOpen className="w-4 h-4 text-amber-400" />
        <span className="text-sm font-semibold">Homework</span>
        <span className="text-[10px] text-[var(--muted-foreground)] ml-auto">
          {homework.length} assignment{homework.length !== 1 ? "s" : ""}
        </span>
        {userRole === "teacher" && (
          <button onClick={() => setShowForm(!showForm)} className="rounded-lg bg-amber-500/20 px-2.5 py-1 text-xs text-amber-400 hover:bg-amber-500/30 transition-colors flex items-center gap-1">
            <Plus className="w-3 h-3" /> Assign
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Create form (teacher) */}
        <AnimatePresence>
          {showForm && userRole === "teacher" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="glass-strong rounded-xl p-4 space-y-3">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Assignment title..."
                className="glass-input w-full rounded-lg px-3 py-2 text-sm"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the problem or task..."
                rows={4}
                className="glass-input w-full rounded-lg px-3 py-2 text-sm resize-none"
              />
              <textarea
                value={starterCode}
                onChange={(e) => setStarterCode(e.target.value)}
                placeholder="Starter code (optional)..."
                rows={3}
                className="glass-input w-full rounded-lg px-3 py-2 text-sm font-mono resize-none"
              />
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowForm(false)} className="rounded-lg px-3 py-1.5 text-xs text-[var(--muted-foreground)] hover:text-white transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleAssign}
                  disabled={!title.trim() || !description.trim()}
                  className="rounded-lg bg-amber-500/20 px-4 py-1.5 text-xs text-amber-400 hover:bg-amber-500/30 transition-colors disabled:opacity-30 font-semibold"
                >
                  Assign to All
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Homework list */}
        {homework.length === 0 ? (
          <div className="text-center py-12 text-[var(--muted-foreground)]">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm">No homework assigned yet</p>
            {userRole === "teacher" && (
              <p className="text-xs mt-1">Click "Assign" to create a task for students</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {homework.map((hw, i) => (
              <motion.div
                key={hw.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-strong rounded-xl p-4 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-semibold">{hw.title}</h3>
                  <span className="flex items-center gap-1 text-[10px] text-[var(--muted-foreground)]">
                    <Code2 className="w-3 h-3" /> {hw.language}
                  </span>
                </div>
                <p className="text-xs text-[var(--muted-foreground)] whitespace-pre-wrap">{hw.description}</p>
                {hw.starterCode && (
                  <pre className="rounded-lg bg-black/30 p-3 text-xs font-mono text-emerald-400 overflow-x-auto">
                    {hw.starterCode}
                  </pre>
                )}
                <div className="flex items-center justify-between text-[10px] text-[var(--muted-foreground)]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(hw.assignedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  {userRole === "student" && (
                    <button className="flex items-center gap-1 rounded-lg bg-emerald-500/20 px-2.5 py-1 text-emerald-400 hover:bg-emerald-500/30 transition-colors">
                      <CheckCircle className="w-3 h-3" /> Mark Done
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
