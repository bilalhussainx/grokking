"use client";

import { useState } from "react";
import { X, BookOpen, GraduationCap, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { courses } from "@/data";

interface CreateClassroomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; course_slug: string }) => Promise<void>;
}

export default function CreateClassroomModal({ isOpen, onClose, onSubmit }: CreateClassroomModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseSlug, setCourseSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !courseSlug) {
      setError("Please fill in all required fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onSubmit({ title: title.trim(), description: description.trim(), course_slug: courseSlug });
      setTitle("");
      setDescription("");
      setCourseSlug("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create classroom");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="glass-strong rounded-2xl w-full max-w-lg p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Create Classroom</h2>
                    <p className="text-xs text-[var(--muted-foreground)]">Set up a structured course for your students</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Course Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Course *</label>
                  <div className="grid gap-2">
                    {courses.map((course) => (
                      <button
                        key={course.slug}
                        type="button"
                        onClick={() => setCourseSlug(course.slug)}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                          courseSlug === course.slug
                            ? "border-blue-500/50 bg-blue-500/10"
                            : "border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.03]"
                        }`}
                      >
                        <span className="text-2xl">{course.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{course.title}</p>
                          <p className="text-xs text-[var(--muted-foreground)] truncate">
                            {course.modules.length} modules &middot; {course.modules.reduce((s, m) => s + m.lessons.length, 0)} lessons
                          </p>
                        </div>
                        {courseSlug === course.slug && (
                          <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Classroom Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. CS301 — Spring 2026"
                    className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional description for your students..."
                    rows={2}
                    className="glass-input w-full px-4 py-2.5 rounded-xl text-sm resize-none"
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}

                {/* Info */}
                <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <BookOpen className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-blue-300/80">
                    Classes will be auto-generated from the course modules. Homework exercises are pre-populated from lesson starter code. Students join with a unique code.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || !courseSlug || !title.trim()}
                  className="btn-gradient w-full rounded-xl px-4 py-3 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating..." : "Create Classroom"}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
