"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

const HONOR_LEVELS = ["School", "State/Regional", "National", "International"];

interface Honor {
  id?: string;
  position: number;
  title?: string | null;
  level?: string | null;
  grade?: number | null;
  description_100?: string | null;
}

interface Props {
  honors: Honor[];
  onSave: (honor: Partial<Honor> & { position: number }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function CharCount({ current, max }: { current: number; max: number }) {
  const over = current > max;
  return <span className={`text-xs ${over ? "text-red-400" : "text-white/30"}`}>{current}/{max}</span>;
}

const inputClass = "w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50";

export default function HonorsForm({ honors, onSave, onDelete }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null);

  const nextPosition = honors.length > 0
    ? Math.max(...honors.map((h) => h.position)) + 1
    : 1;

  const addHonor = () => {
    if (nextPosition > 5) return;
    onSave({ position: nextPosition, title: "", level: "", grade: null, description_100: "" });
    setExpanded(nextPosition);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-white/40">{honors.length}/5 honors</p>
        {honors.length < 5 && (
          <button onClick={addHonor} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] text-sm font-medium hover:bg-[#D4AF37]/20 transition-all">
            <Plus className="w-4 h-4" /> Add honor
          </button>
        )}
      </div>

      {honors.map((hon) => (
        <div key={hon.position} className="border border-white/10 rounded-xl overflow-hidden">
          <button
            onClick={() => setExpanded(expanded === hon.position ? null : hon.position)}
            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xs text-white/30 font-mono w-5">{hon.position}</span>
              <span className="text-sm text-white truncate">{hon.title || "New honor"}</span>
              {hon.level && <span className="text-xs text-white/40 hidden sm:inline">— {hon.level}</span>}
            </div>
            {expanded === hon.position ? <ChevronUp className="w-4 h-4 text-white/30 shrink-0" /> : <ChevronDown className="w-4 h-4 text-white/30 shrink-0" />}
          </button>

          {expanded === hon.position && (
            <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/40 mb-1">Title (100 chars) *</label>
                  <input type="text" maxLength={100} value={hon.title || ""} onChange={(e) => onSave({ position: hon.position, title: e.target.value })} className={inputClass} />
                  <CharCount current={(hon.title || "").length} max={100} />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">Level *</label>
                  <select value={hon.level || ""} onChange={(e) => onSave({ position: hon.position, level: e.target.value })} className={inputClass}>
                    <option value="">Select...</option>
                    {HONOR_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/40 mb-1">Grade received *</label>
                <div className="flex gap-2">
                  {[9, 10, 11, 12].map((g) => (
                    <button key={g} type="button" onClick={() => onSave({ position: hon.position, grade: g })} className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${hon.grade === g ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]" : "bg-white/5 text-white/40 border border-white/10"}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/40 mb-1">Description (100 chars)</label>
                <textarea maxLength={100} rows={2} value={hon.description_100 || ""} onChange={(e) => onSave({ position: hon.position, description_100: e.target.value })} className={`${inputClass} resize-none`} />
                <CharCount current={(hon.description_100 || "").length} max={100} />
              </div>

              {hon.id && (
                <button onClick={() => onDelete(hon.id!)} className="flex items-center gap-1.5 text-xs text-red-400/60 hover:text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" /> Remove honor
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
