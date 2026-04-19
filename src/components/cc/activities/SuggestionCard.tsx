"use client";

import { useState } from "react";
import { Check, X, Star, ArrowRight } from "lucide-react";

interface SuggestionCardProps {
  position: number;
  type: "activity" | "honor";
  label: string;
  currentDescription: string;
  suggestedDescription: string;
  impactScore?: number;
  impactReason?: string;
  suggestions: string[];
  charLimit: number;
  onAccept: (position: number, description: string) => void;
}

export default function SuggestionCard({
  position,
  type,
  label,
  currentDescription,
  suggestedDescription,
  impactScore,
  impactReason,
  suggestions,
  charLimit,
  onAccept,
}: SuggestionCardProps) {
  const [accepted, setAccepted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className={`p-4 rounded-xl border ${accepted ? "border-green-500/20 bg-green-500/5" : "border-white/10 bg-[#141414]"}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/30 font-mono">#{position}</span>
          <span className="text-sm font-medium text-white">{label}</span>
          <span className="text-[10px] text-white/20 uppercase">{type}</span>
        </div>
        {impactScore && (
          <div className="flex items-center gap-1" title={impactReason}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < impactScore ? "text-[#D4AF37] fill-[#D4AF37]" : "text-white/10"}`}
              />
            ))}
          </div>
        )}
      </div>

      {impactReason && (
        <p className="text-[11px] text-white/40 mb-3">{impactReason}</p>
      )}

      {/* Before / After */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] gap-2 items-start mb-3">
        <div className="p-2 rounded-lg bg-white/5">
          <p className="text-[10px] text-white/30 uppercase mb-1">Current</p>
          <p className="text-xs text-white/60">{currentDescription || <span className="italic">Empty</span>}</p>
          <span className="text-[10px] text-white/20">{(currentDescription || "").length}/{charLimit}</span>
        </div>
        <ArrowRight className="w-4 h-4 text-white/20 hidden sm:block self-center" />
        <div className="p-2 rounded-lg bg-[#D4AF37]/5 border border-[#D4AF37]/10">
          <p className="text-[10px] text-[#D4AF37]/60 uppercase mb-1">Suggested</p>
          <p className="text-xs text-white/80">{suggestedDescription}</p>
          <span className={`text-[10px] ${suggestedDescription.length > charLimit ? "text-red-400" : "text-white/20"}`}>
            {suggestedDescription.length}/{charLimit}
          </span>
        </div>
      </div>

      {/* Additional tips */}
      {suggestions.length > 0 && (
        <ul className="mb-3 space-y-1">
          {suggestions.map((s, i) => (
            <li key={i} className="text-[11px] text-white/40 flex items-start gap-1.5">
              <span className="text-[#D4AF37] mt-0.5">-</span> {s}
            </li>
          ))}
        </ul>
      )}

      {/* Actions */}
      {!accepted && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onAccept(position, suggestedDescription);
              setAccepted(true);
            }}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-medium hover:bg-[#D4AF37]/20 transition-colors"
          >
            <Check className="w-3 h-3" /> Accept
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="flex items-center gap-1 px-3 py-1 rounded-lg text-white/30 text-xs hover:text-white/50 transition-colors"
          >
            <X className="w-3 h-3" /> Dismiss
          </button>
        </div>
      )}

      {accepted && (
        <p className="text-xs text-green-400/60 flex items-center gap-1">
          <Check className="w-3 h-3" /> Updated
        </p>
      )}
    </div>
  );
}
