"use client";

import { useState } from "react";
import { Loader2, Sparkles, Check, ThumbsUp, AlertTriangle } from "lucide-react";

interface BulletFeedback {
  works: string[];
  improve: string[];
  rewrite: string;
  charCount: number;
  withinLimit: boolean;
}

interface Props {
  position: number;
  kind: "activity" | "honor";
  label: string;
  initialText: string;
  charLimit: number;
  organization?: string | null;
  role?: string | null;
  onSave: (position: number, text: string) => Promise<void>;
}

export default function BulletEditor({
  position,
  kind,
  label,
  initialText,
  charLimit,
  organization,
  role,
  onSave,
}: Props) {
  const [text, setText] = useState(initialText);
  const [feedback, setFeedback] = useState<BulletFeedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState("");

  const dirty = text !== initialText;
  const over = text.length > charLimit;

  const getFeedback = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/cc/activities/suggest-bullet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, kind, organization, role, charLimit }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Feedback failed");
        return;
      }
      setFeedback(data);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      await onSave(position, text);
      setSavedAt(Date.now());
      setTimeout(() => setSavedAt(null), 2000);
    } finally {
      setSaving(false);
    }
  };

  const applyRewrite = () => {
    if (feedback?.rewrite) {
      setText(feedback.rewrite);
    }
  };

  return (
    <div className="p-4 rounded-xl border border-white/10 bg-[#141414]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/30 font-mono">#{position}</span>
          <span className="text-sm font-medium text-white">{label}</span>
          <span className="text-[10px] text-white/20 uppercase">{kind}</span>
        </div>
        <span className={`text-[10px] tabular-nums ${over ? "text-red-400" : "text-white/30"}`}>
          {text.length}/{charLimit}
        </span>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        className={`w-full px-3 py-2 rounded-lg text-xs text-white placeholder:text-white/30 bg-white/5 border focus:outline-none resize-none ${
          over ? "border-red-400/50 focus:border-red-400" : "border-white/10 focus:border-[#D4AF37]/50"
        }`}
        placeholder={`Describe this ${kind}...`}
      />

      <div className="flex items-center gap-2 mt-2 flex-wrap">
        <button
          onClick={getFeedback}
          disabled={loading || !text.trim()}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] text-[11px] font-medium hover:bg-[#D4AF37]/20 disabled:opacity-40 transition-colors"
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
          {loading ? "Reviewing..." : "Get AI feedback"}
        </button>

        <button
          onClick={save}
          disabled={!dirty || saving || over}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/70 text-[11px] hover:bg-white/10 disabled:opacity-40 transition-colors"
        >
          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
          Save
        </button>

        {savedAt && (
          <span className="text-[10px] text-green-400/80 flex items-center gap-1">
            <Check className="w-3 h-3" /> Saved
          </span>
        )}

        {error && <span className="text-[10px] text-red-400">{error}</span>}
      </div>

      {feedback && (
        <div className="mt-3 space-y-2.5 pt-3 border-t border-white/5">
          {feedback.works.length > 0 && (
            <div>
              <p className="text-[10px] text-green-400/60 uppercase tracking-wide mb-1 flex items-center gap-1">
                <ThumbsUp className="w-3 h-3" /> What works
              </p>
              <ul className="space-y-1">
                {feedback.works.map((w, i) => (
                  <li key={i} className="text-[11px] text-white/60 flex items-start gap-1.5">
                    <span className="text-green-400/60 mt-0.5">+</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {feedback.improve.length > 0 && (
            <div>
              <p className="text-[10px] text-amber-400/70 uppercase tracking-wide mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Could be stronger
              </p>
              <ul className="space-y-1">
                {feedback.improve.map((w, i) => (
                  <li key={i} className="text-[11px] text-white/60 flex items-start gap-1.5">
                    <span className="text-amber-400/70 mt-0.5">·</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {feedback.rewrite && (
            <div className="p-2.5 rounded-lg bg-[#D4AF37]/5 border border-[#D4AF37]/20">
              <p className="text-[10px] text-[#D4AF37]/70 uppercase tracking-wide mb-1">Suggested rewrite</p>
              <p className="text-[11px] text-white/80 leading-relaxed mb-2">{feedback.rewrite}</p>
              <button
                onClick={applyRewrite}
                className="text-[10px] text-[#D4AF37] hover:text-[#D4AF37]/80 font-medium"
              >
                Use this rewrite →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
