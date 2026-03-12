"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Loader2, MessageSquare, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import type { PipelineStage } from "@/types/writing";

interface Props { stage: PipelineStage; onApprove: (feedback?: string) => void; onReject: (feedback: string) => void; onExecute: () => void; isExecuting: boolean; isTeacher: boolean }

export default function StageCard({ stage, onApprove, onReject, onExecute, isExecuting, isTeacher }: Props) {
  const [expanded, setExpanded] = useState(stage.status === "awaiting_approval");
  const [feedback, setFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  const renderOutput = () => {
    const o = stage.ai_output; if (!o || Object.keys(o).length === 0) return null;
    if (o.thesis) return (
      <div className="space-y-3">
        <div className="rounded-lg bg-blue-500/5 border border-blue-500/10 p-3"><div className="text-[10px] font-semibold text-blue-400 mb-1">THESIS</div><p className="text-sm">{o.thesis as string}</p></div>
        {(o.sections as { title: string; keyPoints: string[]; estimatedWords: number }[])?.map((s, i) => (
          <div key={i} className="rounded-lg bg-white/5 p-3"><div className="text-xs font-semibold mb-1">{s.title}</div><ul className="space-y-0.5">{s.keyPoints?.map((p, j) => <li key={j} className="text-xs text-[var(--muted-foreground)]">- {p}</li>)}</ul><span className="text-[10px] text-[var(--muted-foreground)] mt-1 block">~{s.estimatedWords} words</span></div>
        ))}
      </div>
    );
    if (o.content && typeof o.content === "string") return <div className="prose prose-invert prose-sm max-w-none text-sm" dangerouslySetInnerHTML={{ __html: (o.content as string).replace(/\n/g, "<br/>") }} />;
    return <pre className="text-xs overflow-auto max-h-64 rounded-lg bg-black/30 p-3">{JSON.stringify(o, null, 2)}</pre>;
  };

  return (
    <motion.div layout className={`rounded-xl border transition-all ${stage.status === "awaiting_approval" ? "border-yellow-500/30 bg-yellow-500/5" : stage.status === "approved" || stage.status === "completed" ? "border-emerald-500/20 bg-emerald-500/5" : stage.status === "rejected" ? "border-red-500/20 bg-red-500/5" : "border-white/[0.06] bg-white/[0.02]"}`}>
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center gap-3 px-4 py-3">
        <div className="text-sm font-semibold capitalize flex-1 text-left">{stage.stage_name}</div>
        <span className={`text-[10px] font-semibold rounded-full px-2 py-0.5 ${stage.status === "awaiting_approval" ? "bg-yellow-500/20 text-yellow-400" : stage.status === "approved" || stage.status === "completed" ? "bg-emerald-500/20 text-emerald-400" : stage.status === "running" ? "bg-blue-500/20 text-blue-400" : stage.status === "rejected" ? "bg-red-500/20 text-red-400" : "bg-white/10 text-[var(--muted-foreground)]"}`}>{stage.status === "awaiting_approval" ? "Needs Review" : stage.status}</span>
        {expanded ? <ChevronUp className="w-4 h-4 text-[var(--muted-foreground)]" /> : <ChevronDown className="w-4 h-4 text-[var(--muted-foreground)]" />}
      </button>
      {expanded && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="px-4 pb-4">
          {(stage.status === "awaiting_approval" || stage.status === "approved" || stage.status === "completed" || stage.status === "rejected") && <div className="mb-4 max-h-80 overflow-y-auto rounded-lg bg-black/20 p-4">{renderOutput()}</div>}
          {stage.teacher_feedback && <div className="mb-4 rounded-lg bg-violet-500/10 border border-violet-500/20 p-3"><div className="text-[10px] font-semibold text-violet-400 mb-1">FEEDBACK</div><p className="text-xs">{stage.teacher_feedback}</p></div>}
          {(stage.status === "pending" || stage.status === "rejected") && <button onClick={onExecute} disabled={isExecuting} className="btn-gradient w-full rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50">{isExecuting ? <><Loader2 className="w-4 h-4 animate-spin" />Working...</> : <><Sparkles className="w-4 h-4" />{stage.status === "rejected" ? "Retry" : "Run AI"}</>}</button>}
          {stage.status === "running" && <div className="flex items-center justify-center gap-2 py-4 text-blue-400 text-sm"><Loader2 className="w-4 h-4 animate-spin" />AI working...</div>}
          {stage.status === "awaiting_approval" && isTeacher && (
            <div className="space-y-3">
              {showFeedback && <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Add feedback..." rows={2} className="glass-input w-full rounded-xl px-3 py-2.5 text-sm resize-none" />}
              <div className="flex items-center gap-2">
                <button onClick={() => onApprove(feedback || undefined)} className="flex-1 rounded-xl bg-emerald-500/20 border border-emerald-500/30 py-2.5 text-sm font-semibold text-emerald-400 flex items-center justify-center gap-2 hover:bg-emerald-500/30 transition-colors"><Check className="w-4 h-4" />Approve</button>
                <button onClick={() => { if (!showFeedback) { setShowFeedback(true); return; } if (!feedback.trim()) return; onReject(feedback); }} className="flex-1 rounded-xl bg-red-500/10 border border-red-500/20 py-2.5 text-sm font-semibold text-red-400 flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors"><X className="w-4 h-4" />{showFeedback ? "Reject" : "Changes"}</button>
                {!showFeedback && <button onClick={() => setShowFeedback(true)} className="rounded-xl bg-white/5 border border-white/10 p-2.5 text-[var(--muted-foreground)] hover:bg-white/10 transition-colors" title="Feedback"><MessageSquare className="w-4 h-4" /></button>}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
