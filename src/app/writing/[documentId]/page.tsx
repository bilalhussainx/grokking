"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MessageCircle,
  Sparkles,
  PanelRightOpen,
  PanelRightClose,
  Bot,
  Loader2,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useDocument } from "@/hooks/useDocument";
import { useWritingPipeline } from "@/hooks/useWritingPipeline";
import TipTapEditor from "@/components/writing/TipTapEditor";
import DocumentHeader from "@/components/writing/DocumentHeader";
import CommentSidebar from "@/components/writing/CommentSidebar";
import PipelineStatus from "@/components/pipeline/PipelineStatus";
import StageCard from "@/components/pipeline/StageCard";
import type { StageName, DocStatus } from "@/types/writing";

type RightPanel = "comments" | "pipeline";

export default function DocumentEditorPage() {
  const params = useParams();
  const documentId = params.documentId as string;
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const {
    document: doc,
    comments,
    loading,
    saving,
    saveContent,
    updateTitle,
    addComment,
    resolveComment,
  } = useDocument(documentId);

  const {
    run,
    stages,
    currentStage,
    executing,
    isComplete,
    isRunning,
    startPipeline,
    executeStage,
    approveStage,
    rejectStage,
  } = useWritingPipeline(documentId);

  const [rightPanel, setRightPanel] = useState<RightPanel>("pipeline");
  const [showRight, setShowRight] = useState(true);
  const [topic, setTopic] = useState("");
  const [requirements, setRequirements] = useState("");
  const [showPipelineSetup, setShowPipelineSetup] = useState(false);
  const [aiReviewing, setAiReviewing] = useState(false);

  const handleEditorUpdate = useCallback(
    (content: Record<string, unknown>, plainText: string) => {
      saveContent(content, plainText);
    },
    [saveContent]
  );

  const handleStartPipeline = async () => {
    if (!user || !topic.trim()) return;
    const newRun = await startPipeline(user.userId, doc?.doc_type || "essay");
    if (newRun) {
      setShowPipelineSetup(false);
      // Auto-execute first stage
      await executeStage("outline", {
        topic,
        doc_type: doc?.doc_type || "essay",
        requirements,
      });
    }
  };

  const handleApprove = async (stageName: string, feedback?: string) => {
    if (!user) return;
    const result = await approveStage(stageName, user.userId, feedback);
    // Auto-execute next stage if there is one
    if (result?.next_stage) {
      await executeStage(result.next_stage as StageName, {
        topic,
        doc_type: doc?.doc_type || "essay",
        requirements,
      });
    }
  };

  const handleAIReview = async () => {
    if (!doc?.plain_text) return;
    setAiReviewing(true);
    try {
      const res = await fetch("/api/ai/writing/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: doc.plain_text,
          doc_type: doc.doc_type,
        }),
      });
      const data = await res.json();
      // Add AI comments
      if (data.comments) {
        for (const comment of data.comments) {
          await addComment({
            author_id: null,
            author_type: "ai",
            content: comment.content,
            selection_from: comment.selectionFrom,
            selection_to: comment.selectionTo,
            resolved: false,
          });
        }
      }
      setRightPanel("comments");
      setShowRight(true);
    } finally {
      setAiReviewing(false);
    }
  };

  if (authLoading || loading) {
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

  if (!doc) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <p className="text-[var(--muted-foreground)]">Document not found</p>
      </div>
    );
  }

  const isTeacher = user.role === "teacher";
  const unresolvedComments = comments.filter((c) => !c.resolved).length;

  return (
    <div className="flex flex-col h-screen bg-[var(--background)]">
      {/* Top Bar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.06] bg-[var(--background)]/80 backdrop-blur-xl">
        <Link
          href="/writing"
          className="rounded-lg p-1.5 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <div className="flex-1">
          <DocumentHeader
            title={doc.title}
            onTitleChange={updateTitle}
            status={doc.status as DocStatus}
            wordCount={doc.word_count}
            saving={saving}
          />
        </div>

        {/* AI Review Button */}
        <button
          onClick={handleAIReview}
          disabled={aiReviewing || !doc.plain_text}
          className="flex items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-400 hover:bg-violet-500/20 transition-colors disabled:opacity-50"
        >
          {aiReviewing ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Bot className="w-3.5 h-3.5" />
          )}
          AI Review
        </button>

        {/* Pipeline Button */}
        {!run && (
          <button
            onClick={() => setShowPipelineSetup(true)}
            className="btn-gradient rounded-lg px-3 py-1.5 text-xs font-semibold text-white flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> AI Pipeline
          </button>
        )}

        {/* Right Panel Toggles */}
        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-0.5">
          <button
            onClick={() => {
              setRightPanel("comments");
              setShowRight(true);
            }}
            className={`relative rounded-md px-2 py-1 text-xs transition-colors ${
              rightPanel === "comments" && showRight
                ? "bg-white/10 text-violet-400"
                : "text-[var(--muted-foreground)] hover:text-white"
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            {unresolvedComments > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-violet-500 text-[8px] text-white font-bold">
                {unresolvedComments}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setRightPanel("pipeline");
              setShowRight(true);
            }}
            className={`rounded-md px-2 py-1 text-xs transition-colors ${
              rightPanel === "pipeline" && showRight
                ? "bg-white/10 text-blue-400"
                : "text-[var(--muted-foreground)] hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowRight(!showRight)}
            className="rounded-md px-2 py-1 text-xs text-[var(--muted-foreground)] hover:text-white transition-colors"
          >
            {showRight ? (
              <PanelRightClose className="w-3.5 h-3.5" />
            ) : (
              <PanelRightOpen className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Pipeline Status Bar */}
      {run && stages.length > 0 && (
        <div className="border-b border-white/[0.06] bg-white/[0.02]">
          <PipelineStatus stages={stages} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          <TipTapEditor
            content={doc.content as Record<string, unknown>}
            onUpdate={handleEditorUpdate}
            placeholder="Start writing your document..."
          />
        </div>

        {/* Right Sidebar */}
        {showRight && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 340, opacity: 1 }}
            className="border-l border-white/[0.06] bg-[var(--background)]/50 backdrop-blur-xl overflow-hidden flex flex-col"
            style={{ width: 340 }}
          >
            {rightPanel === "comments" ? (
              <CommentSidebar
                comments={comments}
                onResolve={resolveComment}
              />
            ) : (
              <div className="flex flex-col h-full overflow-y-auto">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-semibold">AI Pipeline</span>
                </div>

                {!run ? (
                  <div className="p-4">
                    {showPipelineSetup ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-medium mb-1.5">
                            Topic / Prompt
                          </label>
                          <textarea
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="What should the AI write about?"
                            rows={3}
                            className="glass-input w-full rounded-xl px-3 py-2.5 text-sm resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1.5">
                            Requirements{" "}
                            <span className="text-[var(--muted-foreground)]">
                              (optional)
                            </span>
                          </label>
                          <textarea
                            value={requirements}
                            onChange={(e) => setRequirements(e.target.value)}
                            placeholder="Word count, style, specific points to cover..."
                            rows={2}
                            className="glass-input w-full rounded-xl px-3 py-2.5 text-sm resize-none"
                          />
                        </div>
                        <button
                          onClick={handleStartPipeline}
                          disabled={!topic.trim() || isRunning}
                          className="btn-gradient w-full rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isRunning ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Sparkles className="w-4 h-4" />
                          )}
                          Start 5-Stage Pipeline
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Sparkles className="w-10 h-10 mx-auto mb-3 text-[var(--muted-foreground)] opacity-30" />
                        <p className="text-xs text-[var(--muted-foreground)] mb-4">
                          Use the AI writing pipeline to generate, research,
                          draft, refine, and polish your document with
                          teacher approval at each stage.
                        </p>
                        <button
                          onClick={() => setShowPipelineSetup(true)}
                          className="btn-gradient rounded-xl px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2"
                        >
                          <Sparkles className="w-4 h-4" /> Set Up Pipeline
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 space-y-3">
                    {stages.map((stage) => (
                      <StageCard
                        key={stage.id}
                        stage={stage}
                        onApprove={(feedback) =>
                          handleApprove(stage.stage_name, feedback)
                        }
                        onReject={(feedback) =>
                          rejectStage(stage.stage_name, feedback)
                        }
                        onExecute={() =>
                          executeStage(stage.stage_name as StageName, {
                            topic,
                            doc_type: doc.doc_type,
                            requirements,
                            teacher_feedback: stage.teacher_feedback || undefined,
                          })
                        }
                        isExecuting={
                          executing &&
                          currentStage?.stage_name === stage.stage_name
                        }
                        isTeacher={isTeacher}
                      />
                    ))}

                    {isComplete && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center"
                      >
                        <Sparkles className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
                        <p className="text-sm font-semibold text-emerald-400">
                          Pipeline Complete!
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)] mt-1">
                          Your document has been through all 5 stages.
                        </p>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
