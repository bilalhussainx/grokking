"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EssayStepper from "@/components/cc/essay/EssayStepper";
import BrainstormChat from "@/components/cc/essay/BrainstormChat";
import OutlinePicker from "@/components/cc/essay/OutlinePicker";
import DraftEditor from "@/components/cc/essay/DraftEditor";
import RevisionPanel from "@/components/cc/essay/RevisionPanel";

type Phase = "brainstorm" | "outline" | "draft" | "revise";

interface EssayData {
  id: string;
  essay_type: string;
  prompt_text: string;
  word_limit: number;
  phase: Phase;
  brainstorm_transcript: { role: string; content: string }[] | null;
  outline_json: { sections: { label: string; bullets: string[]; wordBudget: number }[] } | null;
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
  const [essay, setEssay] = useState<EssayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePhase, setActivePhase] = useState<Phase>("brainstorm");
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);

  const loadEssay = () => {
    fetch("/api/cc/essays")
      .then((r) => r.json())
      .then((d) => {
        const found = (d.essays || []).find((e: EssayData) => e.id === id);
        if (found) {
          setEssay(found);
          setActivePhase(found.phase as Phase);
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

  const handleRequestReview = async () => {
    setReviewLoading(true);
    setActivePhase("revise");
    try {
      const res = await fetch(`/api/cc/essays/${id}/review`, { method: "POST" });
      const data = await res.json();
      if (data.review) {
        setEssay((prev) =>
          prev ? { ...prev, revision_comments: data.review, phase: "revise" } : prev
        );
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
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/cc/essays" className="text-white/30 hover:text-white/50">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <p className="text-xs text-white/40 line-clamp-1 max-w-md">
            {essay.prompt_text}
          </p>
        </div>
        <EssayStepper currentPhase={activePhase} onPhaseClick={setActivePhase} />
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
            onOutlineSaved={handleOutlineSaved}
          />
        )}

        {activePhase === "draft" && (
          <DraftEditor
            essayId={id}
            initialDraft={essay.current_draft || ""}
            wordLimit={essay.word_limit}
            outline={essay.outline_json}
            onRequestReview={handleRequestReview}
          />
        )}

        {activePhase === "revise" && (
          <div className="flex h-full">
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-xs text-white/40 uppercase tracking-wide mb-3">Your Draft</h3>
                <div className="text-sm text-white/80 leading-7 whitespace-pre-wrap">
                  {essay.current_draft || "No draft yet."}
                </div>
              </div>
            </div>
            <div className="w-80 shrink-0 border-l border-white/10">
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
