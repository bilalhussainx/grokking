"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

interface OutlineSection {
  label: string;
  bullets: string[];
  wordBudget: number;
}

interface OutlineOption {
  title: string;
  sections: OutlineSection[];
}

interface OutlinePickerProps {
  essayId: string;
  selectedThemes: string[];
  onOutlineSaved: (outline: OutlineOption) => void;
}

export default function OutlinePicker({
  essayId,
  selectedThemes,
  onOutlineSaved,
}: OutlinePickerProps) {
  const [outlines, setOutlines] = useState<OutlineOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generateOutlines = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cc/essays/${essayId}/outline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", selectedThemes }),
      });
      const data = await res.json();
      if (data.outlines) {
        setOutlines(data.outlines);
        setGenerated(true);
      }
    } catch {
      // error handled silently
    } finally {
      setLoading(false);
    }
  };

  const saveOutline = async () => {
    if (selected === null) return;
    setSaving(true);
    const outline = outlines[selected];
    const res = await fetch(`/api/cc/essays/${essayId}/outline`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save", outline }),
    });
    const data = await res.json();
    if (data.saved) {
      onOutlineSaved(outline);
    }
    setSaving(false);
  };

  if (!generated) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sm text-white/50 mb-2">
          Themes: {selectedThemes.join(", ")}
        </p>
        <button
          onClick={generateOutlines}
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#C4A030] disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Generating outlines..." : "Generate 3 Outline Options"}
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <p className="text-xs text-white/40">Pick an outline structure for your essay:</p>

      <div className="grid gap-4">
        {outlines.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`text-left p-4 rounded-xl border transition-all ${
              selected === i
                ? "border-[#D4AF37]/40 bg-[#D4AF37]/5"
                : "border-white/10 bg-white/5 hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">{opt.title}</h3>
              {selected === i && <Check className="w-4 h-4 text-[#D4AF37]" />}
            </div>
            <div className="space-y-2">
              {opt.sections.map((sec, j) => (
                <div key={j}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-white/60">{sec.label}</span>
                    <span className="text-[10px] text-white/30">~{sec.wordBudget} words</span>
                  </div>
                  <ul className="ml-3 mt-1 space-y-0.5">
                    {sec.bullets.map((b, k) => (
                      <li key={k} className="text-xs text-white/50">
                        - {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>

      {selected !== null && (
        <div className="flex justify-end">
          <button
            onClick={saveOutline}
            disabled={saving}
            className="px-6 py-2 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#C4A030] disabled:opacity-50"
          >
            {saving ? "Saving..." : "Use This Outline"}
          </button>
        </div>
      )}
    </div>
  );
}
