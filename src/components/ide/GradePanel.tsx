"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { AIGradeResult } from "@/types/ai";

interface GradePanelProps {
  grade: AIGradeResult;
  onClose: () => void;
}

function ScoreRing({ label, score, size = 56 }: { label: string; score: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const color = score >= 80 ? "#34d399" : score >= 50 ? "#fbbf24" : "#f87171";
  const bgColor = score >= 80 ? "rgba(52,211,153,0.1)" : score >= 50 ? "rgba(251,191,36,0.1)" : "rgba(248,113,113,0.1)";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="4"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div
          className="absolute inset-0 flex items-center justify-center rounded-full text-sm font-bold"
          style={{ color, backgroundColor: bgColor }}
        >
          {score}
        </div>
      </div>
      <span className="text-[10px] font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

export default function GradePanel({ grade, onClose }: GradePanelProps) {
  const StatusIcon = grade.passed ? CheckCircle : grade.overall >= 50 ? AlertTriangle : XCircle;
  const statusColor = grade.passed ? "text-emerald-400" : grade.overall >= 50 ? "text-amber-400" : "text-red-400";
  const statusBg = grade.passed ? "bg-emerald-500/10" : grade.overall >= 50 ? "bg-amber-500/10" : "bg-red-500/10";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="absolute inset-0 z-10 bg-[#080a12]/95 backdrop-blur-sm flex flex-col"
      >
        <div className="flex-1 overflow-y-auto p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${statusBg}`}>
                <StatusIcon className={`w-4 h-4 ${statusColor}`} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--foreground)]">
                  {grade.passed ? "Great Work!" : grade.overall >= 50 ? "Almost There" : "Keep Trying"}
                </h3>
                <p className="text-[10px] text-[var(--muted-foreground)]">AI Auto-Grade</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:bg-white/[0.06] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Score Rings */}
          <div className="flex items-center justify-center gap-6 mb-4">
            <ScoreRing label="Correct" score={grade.correctness} />
            <ScoreRing label="Overall" score={grade.overall} size={72} />
            <ScoreRing label="Efficient" score={grade.efficiency} />
          </div>

          {/* Style Score Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-medium text-[var(--muted-foreground)] uppercase tracking-wider">Style</span>
              <span className="text-[11px] font-semibold text-[var(--foreground)]">{grade.style}/100</span>
            </div>
            <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${grade.style}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
              />
            </div>
          </div>

          {/* Feedback */}
          <div className="mb-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <p className="text-[12px] leading-relaxed text-[var(--foreground)]/90">{grade.feedback}</p>
          </div>

          {/* Suggestions */}
          {grade.suggestions.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Suggestions
              </h4>
              {grade.suggestions.map((s, i) => (
                <div key={i} className="flex gap-2 text-[12px] text-[var(--foreground)]/80">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
