"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, Copy, Check, Lock, Unlock, Play, Users, BookOpen,
  ChevronDown, ChevronRight, Code2, FileText
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import AnimatedBlobs from "@/components/ui/AnimatedBlobs";
import type { Classroom, ClassUnit, ClassHomework } from "@/types/classroom";

export default function ClassroomDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [expandedClass, setExpandedClass] = useState<string | null>(null);
  const [unlocking, setUnlocking] = useState<string | null>(null);

  const fetchClassroom = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/classrooms/${id}`);
      if (!res.ok) {
        router.push("/classrooms");
        return;
      }
      const data = await res.json();
      setClassroom(data);
      // Auto-expand first unlocked class
      const firstUnlocked = data.classes?.find(
        (c: ClassUnit) => c.status === "unlocked" || c.status === "in_progress"
      );
      if (firstUnlocked) setExpandedClass(firstUnlocked.id);
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (user) fetchClassroom();
  }, [user, fetchClassroom]);

  const handleUnlock = async (classId: string) => {
    setUnlocking(classId);
    try {
      const res = await fetch(`/api/classrooms/${id}/classes/${classId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "unlocked" }),
      });
      if (res.ok) {
        await fetchClassroom();
      }
    } finally {
      setUnlocking(null);
    }
  };

  const copyCode = async () => {
    if (!classroom) return;
    await navigator.clipboard.writeText(classroom.join_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !classroom) return null;

  const isTeacher = user.role === "teacher" && classroom.teacher_id === user.userId;
  const classes = classroom.classes || [];

  const statusIcon = (status: string) => {
    switch (status) {
      case "locked": return <Lock className="w-4 h-4 text-white/20" />;
      case "unlocked": return <Unlock className="w-4 h-4 text-blue-400" />;
      case "in_progress": return <Play className="w-4 h-4 text-amber-400" />;
      case "completed": return <Check className="w-4 h-4 text-emerald-400" />;
      default: return null;
    }
  };

  const statusLabel: Record<string, string> = {
    locked: "Locked",
    unlocked: "Ready",
    in_progress: "In Progress",
    completed: "Completed",
  };

  const statusColors: Record<string, string> = {
    locked: "bg-white/[0.06] text-[var(--muted-foreground)]",
    unlocked: "bg-blue-500/20 text-blue-400",
    in_progress: "bg-amber-500/20 text-amber-400",
    completed: "bg-emerald-500/20 text-emerald-400",
  };

  return (
    <div className="relative min-h-screen bg-[var(--background)] overflow-hidden">
      <AnimatedBlobs intensity="low" />

      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-white/[0.06] bg-[var(--background)]/60 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Link href="/classrooms" className="rounded-lg p-1.5 hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="text-lg font-bold truncate">{classroom.title}</span>
          </div>
          {isTeacher && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] font-mono text-sm tracking-widest">
                {classroom.join_code}
              </div>
              <button onClick={copyCode} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" title="Copy join code">
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-8 space-y-6">
        {/* Header stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="glass-strong rounded-xl p-4 text-center">
            <Users className="w-5 h-5 mx-auto mb-1 text-blue-400" />
            <p className="text-2xl font-bold">{classroom.enrollment_count || 0}</p>
            <p className="text-xs text-[var(--muted-foreground)]">Students</p>
          </div>
          <div className="glass-strong rounded-xl p-4 text-center">
            <BookOpen className="w-5 h-5 mx-auto mb-1 text-violet-400" />
            <p className="text-2xl font-bold">{classes.length}</p>
            <p className="text-xs text-[var(--muted-foreground)]">Classes</p>
          </div>
          <div className="glass-strong rounded-xl p-4 text-center">
            <Check className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
            <p className="text-2xl font-bold">
              {classes.filter((c) => c.status === "completed").length}
            </p>
            <p className="text-xs text-[var(--muted-foreground)]">Completed</p>
          </div>
        </div>

        {/* Classes list */}
        <section>
          <h2 className="text-lg font-bold mb-4">Classes</h2>
          <div className="space-y-2">
            {classes.map((cls, i) => {
              const isExpanded = expandedClass === cls.id;
              const isLocked = cls.status === "locked";
              const homework = cls.homework || [];

              return (
                <motion.div
                  key={cls.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`glass-strong rounded-xl overflow-hidden transition-all ${
                    isLocked ? "opacity-60" : ""
                  }`}
                >
                  {/* Class header */}
                  <button
                    onClick={() => !isLocked && setExpandedClass(isExpanded ? null : cls.id)}
                    disabled={isLocked && !isTeacher}
                    className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/[0.03] transition-colors"
                  >
                    {statusIcon(cls.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{cls.title}</p>
                      {cls.description && (
                        <p className="text-xs text-[var(--muted-foreground)] mt-0.5 truncate">{cls.description}</p>
                      )}
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColors[cls.status]}`}>
                      {statusLabel[cls.status]}
                    </span>
                    {isTeacher && isLocked && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleUnlock(cls.id); }}
                        disabled={unlocking === cls.id}
                        className="ml-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                      >
                        {unlocking === cls.id ? "..." : "Unlock"}
                      </button>
                    )}
                    {!isLocked && (
                      isExpanded ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />
                    )}
                  </button>

                  {/* Expanded content */}
                  {isExpanded && !isLocked && (
                    <div className="px-4 pb-4 border-t border-white/[0.06]">
                      {/* Lessons */}
                      <div className="mt-3">
                        <p className="text-xs font-semibold text-[var(--muted-foreground)] mb-2 uppercase tracking-wider">
                          Lessons ({cls.lesson_ids?.length || 0})
                        </p>
                        <div className="space-y-1">
                          {(cls.lesson_ids || []).map((lessonId, li) => (
                            <div key={lessonId} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/[0.04] text-sm">
                              <FileText className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                              <span className="text-[var(--muted-foreground)]">Lesson {li + 1}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Homework */}
                      {homework.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs font-semibold text-[var(--muted-foreground)] mb-2 uppercase tracking-wider">
                            Homework ({homework.length})
                          </p>
                          <div className="space-y-1">
                            {homework.map((hw) => (
                              <div key={hw.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/[0.04] text-sm">
                                <Code2 className="w-3.5 h-3.5 text-violet-400" />
                                <span>{hw.title}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
