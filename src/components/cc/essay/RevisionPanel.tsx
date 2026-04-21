"use client";

import { AlertTriangle, CheckCircle, MessageCircle } from "lucide-react";

interface ReviewComment {
  paragraphIndex: number;
  type: string;
  text: string;
  severity: string;
}

interface ReviewData {
  comments: ReviewComment[];
  overallNotes: string;
  wordCount: number;
  promptFitScore: number;
}

interface RevisionPanelProps {
  review: ReviewData | null;
  loading: boolean;
}

const SEVERITY_STYLES: Record<string, { icon: typeof CheckCircle; color: string }> = {
  positive: { icon: CheckCircle, color: "text-green-400 border-green-500/20 bg-green-500/5" },
  suggestion: { icon: MessageCircle, color: "text-blue-400 border-blue-500/20 bg-blue-500/5" },
  warning: { icon: AlertTriangle, color: "text-amber-400 border-amber-500/20 bg-amber-500/5" },
};

export default function RevisionPanel({ review, loading }: RevisionPanelProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4AF37] mx-auto mb-3" />
          <p className="text-xs text-white/40">Reviewing your essay...</p>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-xs text-white/30">No review yet. Click &quot;Request Review&quot; when ready.</p>
      </div>
    );
  }

  const fitPct = Math.round(review.promptFitScore * 100);

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10">
        <div className="text-center">
          <span className="text-lg font-bold text-[#D4AF37]">{fitPct}%</span>
          <p className="text-[10px] text-white/30">Prompt Fit</p>
        </div>
        <div className="text-center">
          <span className="text-lg font-bold text-white">{review.wordCount}</span>
          <p className="text-[10px] text-white/30">Words</p>
        </div>
        <div className="text-center">
          <span className="text-lg font-bold text-white">{review.comments.length}</span>
          <p className="text-[10px] text-white/30">Comments</p>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
        <p className="text-xs text-white/60 leading-relaxed">{review.overallNotes}</p>
      </div>

      <div className="space-y-2">
        {review.comments.map((comment, i) => {
          const style = SEVERITY_STYLES[comment.severity] || SEVERITY_STYLES.suggestion;
          const Icon = style.icon;
          return (
            <div
              key={i}
              className={`p-3 rounded-xl border ${style.color}`}
            >
              <div className="flex items-start gap-2">
                <Icon className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-white/30 uppercase">
                      P{comment.paragraphIndex + 1}
                    </span>
                    <span className="text-[10px] text-white/30">{comment.type}</span>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">{comment.text}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
