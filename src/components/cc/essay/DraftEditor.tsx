"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Sparkles, Loader2 } from "lucide-react";

interface OutlineSection {
  label: string;
  bullets: string[];
  wordBudget: number;
}

interface DraftEditorProps {
  essayId: string;
  initialDraft: string;
  wordLimit: number;
  outline: { sections: OutlineSection[] } | null;
  onRequestReview: () => void;
}

export default function DraftEditor({
  essayId,
  initialDraft,
  wordLimit,
  outline,
  onRequestReview,
}: DraftEditorProps) {
  const [draft, setDraft] = useState(initialDraft);
  const [wordCount, setWordCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [quickCheckNotes, setQuickCheckNotes] = useState("");
  const [checkingDraft, setCheckingDraft] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const countWords = (text: string) =>
    text.trim().split(/\s+/).filter(Boolean).length;

  useEffect(() => {
    setWordCount(countWords(draft));
  }, [draft]);

  const saveDraft = useCallback(
    async (content: string) => {
      setSaving(true);
      try {
        await fetch(`/api/cc/essays/${essayId}/draft`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });
      } catch {
        // silent
      } finally {
        setSaving(false);
      }
    },
    [essayId]
  );

  const handleChange = (text: string) => {
    setDraft(text);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveDraft(text), 3000);
  };

  const requestQuickCheck = async () => {
    await saveDraft(draft);
    setCheckingDraft(true);
    setQuickCheckNotes("");

    try {
      const res = await fetch(`/api/cc/essays/${essayId}/draft`, {
        method: "POST",
      });
      if (!res.ok || !res.body) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        setQuickCheckNotes(text);
      }
    } catch {
      setQuickCheckNotes("Could not get feedback. Try again.");
    } finally {
      setCheckingDraft(false);
    }
  };

  const wordCountColor =
    wordCount > wordLimit
      ? "text-red-400"
      : wordCount > wordLimit * 0.9
        ? "text-amber-400"
        : "text-white/40";

  return (
    <div className="flex h-full">
      {outline && (
        <div className="w-56 shrink-0 border-r border-white/10 p-4 overflow-y-auto hidden md:block">
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-3">
            Outline
          </h3>
          {outline.sections.map((sec, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-white/60">{sec.label}</span>
                <span className="text-[10px] text-white/30">~{sec.wordBudget}w</span>
              </div>
              <ul className="mt-1 space-y-0.5">
                {sec.bullets.map((b, j) => (
                  <li key={j} className="text-[11px] text-white/40">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4">
          <textarea
            value={draft}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Start writing your essay..."
            className="w-full h-full resize-none bg-transparent text-white text-sm leading-7 placeholder:text-white/20 focus:outline-none"
          />
        </div>

        <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className={`text-xs font-mono ${wordCountColor}`}>
              {wordCount} / {wordLimit}
            </span>
            {saving && <span className="text-[10px] text-white/20">Saving...</span>}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={requestQuickCheck}
              disabled={checkingDraft || wordCount < 50}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-white/60 border border-white/10 hover:text-white/80 hover:border-white/20 disabled:opacity-30 transition-colors"
            >
              {checkingDraft ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3" />
              )}
              Quick Check
            </button>
            <button
              onClick={onRequestReview}
              disabled={wordCount < 100}
              className="px-4 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-semibold hover:bg-[#C4A030] disabled:opacity-40"
            >
              Request Review
            </button>
          </div>
        </div>
      </div>

      {quickCheckNotes && (
        <div className="w-64 shrink-0 border-l border-white/10 p-4 overflow-y-auto">
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-3">
            AI Notes
          </h3>
          <p className="text-xs text-white/60 leading-relaxed whitespace-pre-wrap">
            {quickCheckNotes}
          </p>
        </div>
      )}
    </div>
  );
}
