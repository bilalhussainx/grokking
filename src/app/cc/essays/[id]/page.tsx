"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ChevronUp, ClipboardCheck, MessageSquare } from "lucide-react";
import EssayStepper from "@/components/cc/essay/EssayStepper";
import BrainstormChat from "@/components/cc/essay/BrainstormChat";
import OutlinePicker from "@/components/cc/essay/OutlinePicker";
import DraftEditor from "@/components/cc/essay/DraftEditor";
import RevisionPanel from "@/components/cc/essay/RevisionPanel";
import CounselorFeedbackPanel from "@/components/cc/essay/CounselorFeedbackPanel";
import { useCoachKairos } from "@/contexts/CoachKairosContext";

type Phase = "brainstorm" | "outline" | "draft" | "revise";

interface EssayData {
  id: string;
  essay_type: string;
  prompt_text: string;
  word_limit: number;
  phase: Phase;
  brainstorm_transcript: { role: string; content: string }[] | null;
  outline_json: { title?: string; sections: { label: string; bullets: string[]; wordBudget: number }[] } | null;
  current_draft: string | null;
  revision_comments: {
    comments: { paragraphIndex: number; type: string; text: string; severity: string }[];
    overallNotes: string;
    wordCount: number;
    promptFitScore: number;
    overallScore?: number;
    scoreBreakdown?: {
      promptFit: number;
      voiceAuthenticity: number;
      specificity: number;
      reflectionDepth: number;
      structuralCraft: number;
      applicationFit: number;
    };
    strengths?: string[];
    suggestedNextStep?: "polish" | "restructure" | "re-brainstorm" | "ready";
    nextStepReason?: string;
  } | null;
}

export default function EssayWorkspace({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const coach = useCoachKairos();
  const [essay, setEssay] = useState<EssayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePhase, setActivePhase] = useState<Phase>("brainstorm");
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [promptExpanded, setPromptExpanded] = useState(true);

  const loadEssay = () => {
    fetch(`/api/cc/essays/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.essay) {
          setEssay(d.essay);
          setActivePhase(d.essay.phase as Phase);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEssay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAdvanceToOutline = (themes: string[]) => {
    setSelectedThemes(themes);
    setActivePhase("outline");
  };

  const handleOutlineSaved = () => {
    setActivePhase("draft");
    loadEssay();
  };

  const handleRequestReview = async (draftText: string) => {
    setReviewLoading(true);
    setEssay((prev) => (prev ? { ...prev, current_draft: draftText } : prev));
    setActivePhase("revise");
    try {
      const res = await fetch(`/api/cc/essays/${id}/review`, { method: "POST" });
      const data = await res.json();
      if (data.review) {
        setEssay((prev) =>
          prev
            ? { ...prev, current_draft: draftText, revision_comments: data.review, phase: "revise" }
            : prev
        );
        // Do NOT auto-open Coach Kairos here. Two reasons:
        //   1. The student needs uninterrupted time to read their own review.
        //   2. An 800ms setTimeout raced the Supabase write of revision_comments,
        //      so the coach often loaded with empty review context and
        //      responded "I don't have the essay or the review findings".
        // The manual "Review landed → open coach" CTA on the revise panel is
        // still available; clicking it after the write settles gives the coach
        // full context.
      }
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4AF37]" />
      </div>
    );
  }

  if (!essay) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-white/40">Essay not found.</p>
        <Link href="/cc/essays" className="text-[#D4AF37] text-sm mt-2 inline-block">
          Back to essays
        </Link>
      </div>
    );
  }

  // All four phases now render their own full phase bar + prompt subhead
  // internally. The parent just needs a slim back-link row — the legacy
  // double-header (EssayStepper + prompt banner) is fully retired.
  const phaseOwnsBanner = true;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {phaseOwnsBanner ? (
        <div className="px-4 py-2 border-b border-white/10 flex items-center gap-3">
          <Link href="/cc/essays" className="text-white/40 hover:text-white/70 shrink-0 inline-flex items-center gap-1.5 text-[12px]">
            <ArrowLeft className="w-3.5 h-3.5" />
            All essays
          </Link>
        </div>
      ) : (
        <>
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between gap-3">
            <Link href="/cc/essays" className="text-white/30 hover:text-white/50 shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <EssayStepper currentPhase={activePhase} onPhaseClick={setActivePhase} />
          </div>

          <div className="px-4 py-3 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span
                    className="px-2.5 py-0.5 rounded-md text-[10px] uppercase tracking-wide font-semibold"
                    style={{
                      background: "rgba(212,175,55,0.14)",
                      color: "var(--kl-gold-app, #D4AF37)",
                      letterSpacing: "0.15em",
                    }}
                  >
                    {essay.essay_type.startsWith("supplement") ? "Supplement" : "Personal Statement"}
                  </span>
                  <span
                    className="text-[11px] tabular-nums"
                    style={{
                      fontFamily: "var(--kl-font-mono, 'JetBrains Mono', monospace)",
                      color: "rgba(255,255,255,0.55)",
                    }}
                  >
                    {essay.word_limit} word max
                  </span>
                  {essay.current_draft && (
                    <span className="text-[11px] text-white/45 tabular-nums">
                      · {essay.current_draft.trim().split(/\s+/).filter(Boolean).length} / {essay.word_limit} words drafted
                    </span>
                  )}
                </div>
                <p
                  className={`text-xs text-white/70 leading-relaxed ${
                    promptExpanded ? "" : "line-clamp-1"
                  }`}
                >
                  {essay.prompt_text}
                </p>
              </div>
              <button
                onClick={() => setPromptExpanded((v) => !v)}
                className="shrink-0 mt-0.5 p-1 rounded-md text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
                aria-label={promptExpanded ? "Collapse prompt" : "Expand prompt"}
              >
                {promptExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </>
      )}

      {/* On brainstorm/outline, allow the page to scroll so all cards reach.
          On draft/revise, keep the old overflow-hidden + child scrolling. */}
      <div className={phaseOwnsBanner ? "flex-1 overflow-y-auto" : "flex-1 overflow-hidden"}>
        {/* Counselor review surfaces on every phase, not just revise — the
            panel renders nothing when there's no review activity. Without
            this, feedback left while the student is still brainstorming or
            drafting is invisible to them. */}
        {activePhase !== "revise" && (
          <div className="px-4 pt-3 max-w-3xl mx-auto w-full">
            <CounselorFeedbackPanel essayId={id} />
          </div>
        )}
        {activePhase === "brainstorm" && (
          <BrainstormChat
            essayId={id}
            initialTranscript={
              (essay.brainstorm_transcript as { role: "user" | "assistant"; content: string }[]) || []
            }
            onAdvanceToOutline={handleAdvanceToOutline}
          />
        )}

        {activePhase === "outline" && (
          <OutlinePicker
            essayId={id}
            selectedThemes={selectedThemes}
            existingOutline={
              essay.outline_json
                ? {
                    title: essay.outline_json.title || "Saved outline",
                    sections: essay.outline_json.sections,
                  }
                : null
            }
            onOutlineSaved={handleOutlineSaved}
          />
        )}

        {activePhase === "draft" && (
          <DraftEditor
            essayId={id}
            initialDraft={essay.current_draft || ""}
            wordLimit={essay.word_limit}
            outline={essay.outline_json}
            selectedThemes={selectedThemes}
            onRequestReview={handleRequestReview}
          />
        )}

        {activePhase === "revise" && (
          <ReviseView
            essay={essay}
            reviewLoading={reviewLoading}
            onNavigatePhase={setActivePhase}
            onOpenCoach={() => {
              coach.open();
              coach.sendMessage(
                "My essay review just came back — give me your read: where it's landing, what's weak, and how it fits the rest of my application.",
                { essayId: id, sourceEvent: "review-landed" }
              );
            }}
          />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Revise view — matches brainstorm/outline/draft layout (phase bar + subhead
// + two-column grid). Draft text on the left, RevisionPanel on the right.
// ─────────────────────────────────────────────────────────────────────────

function ReviseView({
  essay,
  reviewLoading,
  onNavigatePhase,
  onOpenCoach,
}: {
  essay: EssayData;
  reviewLoading: boolean;
  onNavigatePhase: (phase: Phase) => void;
  onOpenCoach: () => void;
}) {
  const review = essay.revision_comments;
  const overall = review?.overallScore ?? (review ? Math.round((review.promptFitScore ?? 0) * 100) : null);

  const phaseNodes = [
    { n: "01", label: "Brainstorm", status: "is-done" as const, meta: "Complete" },
    {
      n: "02", label: "Outline", status: "is-done" as const,
      meta: essay.outline_json ? `${essay.outline_json.sections.length} sections` : "Complete",
    },
    {
      n: "03", label: "Draft", status: "is-done" as const,
      meta: essay.current_draft
        ? `${essay.current_draft.trim().split(/\s+/).filter(Boolean).length} / ${essay.word_limit} words`
        : "Complete",
    },
    {
      n: "04", label: "Revise", status: "is-active" as const,
      meta: review ? `Score ${overall ?? "—"} · ${review.comments.length} notes` : "Awaiting review",
      pct: review ? 100 : 30,
    },
  ];

  return (
    <div
      className="kl-surface-app w-full"
      style={{ padding: "22px 28px", display: "flex", flexDirection: "column", gap: 18 }}
    >
      <div className="kl-phase-bar">
        {phaseNodes.map((p) => (
          <button
            key={p.n}
            type="button"
            onClick={() => onNavigatePhase(
              p.label === "Brainstorm" ? "brainstorm"
              : p.label === "Outline" ? "outline"
              : p.label === "Draft" ? "draft" : "revise"
            )}
            className={`kl-phase-node ${p.status === "is-active" ? "is-active" : "is-done"}`}
            style={{ textAlign: "left", background: "transparent", border: "none", cursor: "pointer" }}
          >
            <div className="kl-phase-num">{p.n}</div>
            <div className="kl-phase-label">{p.label}</div>
            <div className="kl-phase-meta">{p.meta}</div>
            {p.status === "is-active" && (
              <div className="kl-phase-fill" style={{ width: `${p.pct ?? 0}%` }} />
            )}
            {p.status === "is-done" && <div className="kl-phase-fill" />}
          </button>
        ))}
      </div>

      <div className="kl-bs-subhead">
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <span
            className="kl-prompt-badge"
            style={{
              background: "var(--kl-phase-revise-bg, rgba(34,197,94,0.20))",
              color: "var(--kl-phase-revise-fg, #86efac)",
              borderColor: "rgba(34,197,94,0.28)",
            }}
          >
            <ClipboardCheck className="w-3 h-3" />
            Revise
          </span>
          <div className="min-w-0">
            <div className="text-[13.5px] leading-snug">
              <em className="not-italic text-white/95 font-medium">Holistic read of your draft.</em>{" "}
              <span className="text-white/45">
                Score reflects how this essay lands in the context of the full application — not a raw English-class grade.
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onOpenCoach}
          disabled={reviewLoading || !review}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12.5px] font-semibold transition-colors shrink-0"
          style={{
            background: "rgba(212,175,55,0.12)",
            border: "1px solid var(--kl-app-gold-edge, rgba(212,175,55,0.22))",
            color: "var(--kl-gold-app,#D4AF37)",
            opacity: reviewLoading || !review ? 0.4 : 1,
            cursor: reviewLoading || !review ? "not-allowed" : "pointer",
          }}
          title={!review ? "Review still landing" : "Open Coach Kairos to talk through the feedback"}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Talk through with Coach
        </button>
      </div>

      <div className="grid items-start gap-5" style={{ gridTemplateColumns: "1fr 400px" }}>
        {/* Draft prose */}
        <div
          className="rounded-2xl overflow-y-auto"
          style={{
            background: "rgba(255,255,255,0.015)",
            border: "1px solid var(--kl-app-border, rgba(255,255,255,0.08))",
            padding: "28px 32px",
            maxHeight: "calc(100vh - 260px)",
          }}
        >
          <div
            className="text-[10px] uppercase tracking-[0.22em] text-white/40 mb-4"
            style={{ fontFamily: "var(--kl-font-mono, 'JetBrains Mono', monospace)" }}
          >
            Your draft
          </div>
          <div className="kl-essay-prose whitespace-pre-wrap">
            {essay.current_draft || "No draft yet."}
          </div>
        </div>

        {/* Scorecard + comments + jump-back rail + counselor review */}
        <div className="overflow-y-auto space-y-4" style={{ maxHeight: "calc(100vh - 260px)" }}>
          <CounselorFeedbackPanel essayId={essay.id} />
          <RevisionPanel
            review={review}
            loading={reviewLoading}
            onNavigatePhase={onNavigatePhase}
          />
        </div>
      </div>
    </div>
  );
}
