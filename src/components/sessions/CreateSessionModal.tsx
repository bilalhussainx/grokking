"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Zap,
  Code2,
  Eye,
  Loader2,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Layers,
  FileCode,
  Check,
} from "lucide-react";
import { courses } from "@/data";
import type { Course, Module, Lesson } from "@/data/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    session_type: "coding" | "review";
    course_slug: string;
    module_id: string;
    lesson_id: string;
  }) => Promise<void>;
}

export default function CreateSessionModal({ isOpen, onClose, onSubmit }: Props) {
  const [step, setStep] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const sessionType: "coding" | "review" = selectedLesson?.starterCode ? "coding" : "review";

  const filteredLessons = useMemo(() => {
    if (!selectedModule) return [];
    return selectedModule.lessons;
  }, [selectedModule]);

  const reset = () => {
    setStep(1);
    setSelectedCourse(null);
    setSelectedModule(null);
    setSelectedLesson(null);
    setDescription("");
    setLoading(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setSelectedModule(null);
    setSelectedLesson(null);
    setStep(2);
  };

  const handleModuleSelect = (mod: Module) => {
    setSelectedModule(mod);
    setSelectedLesson(null);
    setStep(3);
  };

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  const handleBack = () => {
    if (step === 3) {
      setSelectedModule(null);
      setSelectedLesson(null);
      setStep(2);
    } else if (step === 2) {
      setSelectedCourse(null);
      setStep(1);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCourse || !selectedModule || !selectedLesson) return;
    setLoading(true);
    try {
      await onSubmit({
        title: selectedLesson.title,
        description: description.trim(),
        session_type: sessionType,
        course_slug: selectedCourse.slug,
        module_id: selectedModule.id,
        lesson_id: selectedLesson.id,
      });
      reset();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const getLessonCount = (course: Course) =>
    course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

  const getCodeLessonCount = (mod: Module) =>
    mod.lessons.filter((l) => l.starterCode).length;

  const stepTitles = ["Select Course", "Select Module", "Select Lesson"];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="glass-strong rounded-2xl w-full max-w-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/25">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">New Live Session</h2>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      Step {step} of 3 &mdash; {stepTitles[step - 1]}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="rounded-lg p-2 hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Step indicator */}
              <div className="flex gap-2 mb-6">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      s <= step ? "bg-gradient-to-r from-blue-500 to-violet-600" : "bg-white/10"
                    }`}
                  />
                ))}
              </div>

              {/* Step content */}
              <AnimatePresence mode="wait">
                {/* Step 1: Pick Course */}
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    {courses.map((course) => (
                      <button
                        key={course.id}
                        onClick={() => handleCourseSelect(course)}
                        className="w-full rounded-xl p-4 text-left transition-all border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/30 group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-3xl">{course.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm">{course.title}</div>
                            <div className="text-xs text-[var(--muted-foreground)] mt-1">
                              {course.description}
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="flex items-center gap-1 text-[10px] text-[var(--muted-foreground)]">
                                <Layers className="w-3 h-3" />
                                {course.modules.length} modules
                              </span>
                              <span className="flex items-center gap-1 text-[10px] text-[var(--muted-foreground)]">
                                <BookOpen className="w-3 h-3" />
                                {getLessonCount(course)} lessons
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)] group-hover:text-blue-400 transition-colors" />
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}

                {/* Step 2: Pick Module */}
                {step === 2 && selectedCourse && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3 max-h-[400px] overflow-y-auto pr-1"
                  >
                    {selectedCourse.modules.map((mod) => {
                      const codeLessons = getCodeLessonCount(mod);
                      return (
                        <button
                          key={mod.id}
                          onClick={() => handleModuleSelect(mod)}
                          className="w-full rounded-xl p-4 text-left transition-all border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/30 group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm">{mod.title}</div>
                              <div className="text-xs text-[var(--muted-foreground)] mt-1 line-clamp-2">
                                {mod.description}
                              </div>
                              <div className="flex items-center gap-3 mt-2">
                                <span className="flex items-center gap-1 text-[10px] text-[var(--muted-foreground)]">
                                  <BookOpen className="w-3 h-3" />
                                  {mod.lessons.length} lessons
                                </span>
                                {codeLessons > 0 && (
                                  <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                                    <FileCode className="w-3 h-3" />
                                    {codeLessons} with code
                                  </span>
                                )}
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)] group-hover:text-blue-400 transition-colors" />
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                )}

                {/* Step 3: Pick Lesson + Confirm */}
                {step === 3 && selectedModule && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                      {filteredLessons.map((lesson) => {
                        const isCoding = !!lesson.starterCode;
                        const isSelected = selectedLesson?.id === lesson.id;
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => handleLessonSelect(lesson)}
                            className={`w-full rounded-xl p-3 text-left transition-all border ${
                              isSelected
                                ? "border-blue-500/50 bg-blue-500/10"
                                : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                                  isSelected
                                    ? "bg-blue-500/20 text-blue-400"
                                    : "bg-white/5 text-[var(--muted-foreground)]"
                                }`}
                              >
                                {isSelected ? (
                                  <Check className="w-4 h-4" />
                                ) : isCoding ? (
                                  <Code2 className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">{lesson.title}</div>
                              </div>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full ${
                                  isCoding
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : "bg-amber-500/10 text-amber-400"
                                }`}
                              >
                                {isCoding ? "coding" : "review"}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Description + summary when lesson selected */}
                    {selectedLesson && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-3"
                      >
                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-[var(--muted-foreground)]">
                              Session Title
                            </span>
                          </div>
                          <div className="text-sm font-semibold">{selectedLesson.title}</div>
                          <div className="flex items-center gap-2 mt-2">
                            <span
                              className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full ${
                                sessionType === "coding"
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-amber-500/10 text-amber-400"
                              }`}
                            >
                              {sessionType === "coding" ? (
                                <Code2 className="w-3 h-3" />
                              ) : (
                                <Eye className="w-3 h-3" />
                              )}
                              {sessionType === "coding" ? "Coding Session" : "Review Session"}
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Description{" "}
                            <span className="text-[var(--muted-foreground)]">(optional)</span>
                          </label>
                          <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add notes for your students..."
                            rows={2}
                            className="glass-input w-full rounded-xl px-4 py-3 text-sm resize-none"
                          />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
                {step > 1 ? (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-white transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {step === 3 && (
                  <button
                    onClick={handleSubmit}
                    disabled={!selectedLesson || loading}
                    className="btn-gradient rounded-xl px-6 py-2.5 text-sm font-semibold text-white flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Zap className="w-4 h-4" />
                    )}
                    {loading ? "Creating..." : "Create Session"}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
