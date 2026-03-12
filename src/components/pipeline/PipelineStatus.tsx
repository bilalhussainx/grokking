"use client";
import { motion } from "framer-motion";
import { Check, Loader2, Clock, XCircle, AlertCircle, FileSearch, BookOpen, PenTool, Sparkles, Wand2 } from "lucide-react";
import type { PipelineStage, StageName, StageStatus } from "@/types/writing";

const STAGE_CFG: Record<StageName, { label: string; icon: React.ReactNode; desc: string }> = {
  outline: { label: "Outline", icon: <BookOpen className="w-4 h-4" />, desc: "Structure" },
  research: { label: "Research", icon: <FileSearch className="w-4 h-4" />, desc: "Evidence" },
  draft: { label: "Draft", icon: <PenTool className="w-4 h-4" />, desc: "First draft" },
  refine: { label: "Refine", icon: <Sparkles className="w-4 h-4" />, desc: "Improve" },
  final: { label: "Final", icon: <Wand2 className="w-4 h-4" />, desc: "Polish" },
};

const STATUS_STYLE: Record<StageStatus, { ring: string; bg: string }> = {
  pending: { ring: "border-white/10", bg: "bg-white/5" },
  running: { ring: "border-blue-500/50 animate-pulse", bg: "bg-blue-500/10" },
  awaiting_approval: { ring: "border-yellow-500/50", bg: "bg-yellow-500/10" },
  approved: { ring: "border-emerald-500/50", bg: "bg-emerald-500/10" },
  completed: { ring: "border-emerald-500/50", bg: "bg-emerald-500/10" },
  rejected: { ring: "border-red-500/50", bg: "bg-red-500/10" },
};

export default function PipelineStatus({ stages, onStageClick }: { stages: PipelineStage[]; onStageClick?: (s: PipelineStage) => void }) {
  return (
    <div className="flex items-center w-full px-4 py-5">
      {stages.map((stage, i) => {
        const cfg = STAGE_CFG[stage.stage_name as StageName]; const ss = STATUS_STYLE[stage.status];
        const isActive = stage.status === "running" || stage.status === "awaiting_approval";
        return (
          <div key={stage.id} className="flex items-center flex-1 last:flex-none">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onStageClick?.(stage)} className="relative flex flex-col items-center gap-1.5">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 ${ss.ring} ${ss.bg} transition-all`}>
                {stage.status === "running" ? <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" /> : stage.status === "approved" || stage.status === "completed" ? <Check className="w-4 h-4 text-emerald-400" /> : stage.status === "rejected" ? <XCircle className="w-4 h-4 text-red-400" /> : stage.status === "awaiting_approval" ? <AlertCircle className="w-3.5 h-3.5 text-yellow-400" /> : <span className="text-[var(--muted-foreground)]">{cfg.icon}</span>}
              </div>
              <div className="text-center">
                <div className={`text-[10px] font-semibold ${isActive ? "text-blue-400" : stage.status === "approved" || stage.status === "completed" ? "text-emerald-400" : "text-[var(--muted-foreground)]"}`}>{cfg.label}</div>
                <div className="text-[9px] text-[var(--muted-foreground)]">{cfg.desc}</div>
              </div>
              {stage.status === "awaiting_approval" && <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-black"><AlertCircle className="w-3 h-3" /></motion.div>}
            </motion.button>
            {i < stages.length - 1 && <div className="flex-1 mx-2"><div className={`h-0.5 rounded-full transition-all ${stage.status === "approved" || stage.status === "completed" ? "bg-gradient-to-r from-emerald-500/50 to-emerald-500/20" : "bg-white/10"}`} /></div>}
          </div>
        );
      })}
    </div>
  );
}
