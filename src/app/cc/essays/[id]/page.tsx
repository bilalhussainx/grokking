"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import EssayStepper from "@/components/cc/essay/EssayStepper";
import BrainstormChat from "@/components/cc/essay/BrainstormChat";
import OutlinePicker from "@/components/cc/essay/OutlinePicker";
import DraftEditor from "@/components/cc/essay/DraftEditor";
import RevisionPanel from "@/components/cc/essay/RevisionPanel";
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
        // Auto-nudge coach about next steps after first review lands
        setTimeout(() => {
          coach.open();
          coach.sendMessage(
            "My essay review just came back — give me your read: where it's landing, what's weak, and how it fits the rest of my application.",
            { essayId: id, sourceEvent: "review-landed" }
          );
        }, 800);
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

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
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
              <span className="px-2 py-0.5 rounded-md text-[10px] bg-[#D4AF37]/15 text-[#D4AF37] uppercase tracking-wide font-medium">
                {essay.essay_type.startsWith("supplement") ? "Supplement" : "Personal Statement"}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] bg-white/5 border border-white/10 text-white/70 tabular-nums">
                {essay.word_limit} word max
              </span>
              {essay.current_draft && (
                <span className="text-[10px] text-white/40 tabular-nums">
                  {essay.current_draft.trim().split(/\s+/).filter(Boolean).length} / {essay.word_limit} words drafted
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

      <div className="flex-1 overflow-hidden">
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
          <div className="flex h-full">
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="max-w-2xl mx-auto">
                <button
                  onClick={() => {
                    coach.open();
                    coach.sendMessage(
                      "My essay review just came back — give me your read: where it's landing, what's weak, and how it fits the rest of my application.",
                      { essayId: id, sourceEvent: "review-landed" }
                    );
                  }}
                  className="w-full mb-4 flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 hover:bg-[#D4AF37]/15 transition-colors text-left group"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#D4AF37]">
                      Review landed. Activity optimizer is up next — supplements come after.
                    </p>
                    <p className="text-[11px] text-white/40 mt-0.5">
                      Ask Coach Kairos to walk you through what to tackle.
                    </p>
                  </div>
                  <span className="text-[11px] text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity">
                    Open coach →
                  </span>
                </button>

                <h3 className="text-xs text-white/40 uppercase tracking-wide mb-3">Your Draft</h3>
                <div className="text-sm text-white/80 leading-7 whitespace-pre-wrap">
                  {essay.current_draft || "No draft yet."}
                </div>
              </div>
            </div>
            <div className="w-80 shrink-0 border-l border-white/10 min-h-0 overflow-hidden">
              <RevisionPanel
                review={essay.revision_comments}
                loading={reviewLoading}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
