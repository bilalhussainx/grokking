"use client";

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

export default function RevisionPanel({ review, loading }: RevisionPanelProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20" style={{ background: "#0a0a0a" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[var(--kl-gold-app,#D4AF37)] mx-auto mb-3" />
          <p className="text-xs text-white/40">Reviewing your essay…</p>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="flex items-center justify-center py-20" style={{ background: "#0a0a0a" }}>
        <p className="text-xs text-white/30">
          No review yet. Click &quot;Request Review&quot; when ready.
        </p>
      </div>
    );
  }

  const fitPct = Math.round(review.promptFitScore * 100);

  return (
    <div
      className="h-full overflow-y-auto p-5 space-y-4"
      style={{ background: "#0a0a0a" }}
    >
      <div className="grid grid-cols-3 gap-3 pb-2">
        <div>
          <div className="text-xl font-semibold text-[var(--kl-gold-app,#D4AF37)] tabular-nums">
            {fitPct}%
          </div>
          <div className="text-[10px] text-white/40 tracking-wide uppercase mt-1">Prompt fit</div>
        </div>
        <div>
          <div className="text-xl font-semibold text-white tabular-nums">{review.wordCount}</div>
          <div className="text-[10px] text-white/40 tracking-wide uppercase mt-1">Words</div>
        </div>
        <div>
          <div className="text-xl font-semibold text-white tabular-nums">
            {review.comments.length}
          </div>
          <div className="text-[10px] text-white/40 tracking-wide uppercase mt-1">Comments</div>
        </div>
      </div>

      <div
        className="p-3.5 rounded-xl"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid var(--kl-app-border, rgba(255,255,255,0.08))",
        }}
      >
        <p className="text-xs text-white/70 leading-relaxed">{review.overallNotes}</p>
      </div>

      <div className="flex flex-col gap-2.5">
        {review.comments.map((comment, i) => (
          <div key={i} className="kl-pin">
            <span className="kl-pin-tag" aria-label={`Paragraph ${comment.paragraphIndex + 1}`}>
              P{comment.paragraphIndex + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="kl-pin-title capitalize">{comment.type}</div>
              <div className="kl-pin-body">{comment.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
