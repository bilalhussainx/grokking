"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, GraduationCap, ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import AnimatedBlobs from "@/components/ui/AnimatedBlobs";
import CreateClassroomModal from "@/components/classroom/CreateClassroomModal";
import ClassroomCard from "@/components/classroom/ClassroomCard";
import JoinClassroomForm from "@/components/classroom/JoinClassroomForm";
import type { Classroom } from "@/types/classroom";

export default function ClassroomsDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const fetchClassrooms = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/classrooms");
      const data = await res.json();
      if (Array.isArray(data)) setClassrooms(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchClassrooms();
  }, [user, fetchClassrooms]);

  const handleCreate = async (data: { title: string; description: string; course_slug: string }) => {
    const res = await fetch("/api/classrooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to create classroom");
    router.push(`/classrooms/${result.id}`);
  };

  const handleJoin = async (code: string) => {
    const res = await fetch("/api/classrooms/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ join_code: code }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to join");
    if (data.classroom?.id) {
      router.push(`/classrooms/${data.classroom.id}`);
    } else {
      await fetchClassrooms();
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="relative min-h-screen bg-[var(--background)] overflow-hidden">
      <AnimatedBlobs intensity="low" />

      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-white/[0.06] bg-[var(--background)]/60 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="rounded-lg p-1.5 hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold">Classrooms</span>
            </div>
          </div>

          {user.role === "teacher" && (
            <button
              onClick={() => setShowCreate(true)}
              className="btn-gradient rounded-xl px-4 py-2 text-sm font-semibold text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> New Classroom
            </button>
          )}
        </div>
      </nav>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-8 space-y-8">
        {/* Join form for students */}
        {user.role === "student" && <JoinClassroomForm onJoin={handleJoin} />}

        {/* Classrooms grid */}
        <section>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            {user.role === "teacher" ? "Your Classrooms" : "Enrolled Classrooms"}
          </h2>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="glass-strong rounded-2xl p-5 h-40 animate-pulse" />
              ))}
            </div>
          ) : classrooms.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {classrooms.map((classroom, i) => (
                <ClassroomCard
                  key={classroom.id}
                  classroom={classroom}
                  index={i}
                  role={user.role as "teacher" | "student"}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-strong rounded-2xl p-12 text-center"
            >
              <GraduationCap className="w-12 h-12 mx-auto mb-4 text-[var(--muted-foreground)] opacity-30" />
              <h3 className="text-lg font-semibold mb-2">No classrooms yet</h3>
              <p className="text-sm text-[var(--muted-foreground)] mb-6">
                {user.role === "teacher"
                  ? "Create your first classroom to start teaching structured courses with gated progression."
                  : "Ask your teacher for a 6-letter join code to enroll in a classroom."}
              </p>
              {user.role === "teacher" && (
                <button
                  onClick={() => setShowCreate(true)}
                  className="btn-gradient rounded-xl px-6 py-3 text-sm font-semibold text-white inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Create First Classroom
                </button>
              )}
            </motion.div>
          )}
        </section>
      </div>

      <CreateClassroomModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}
