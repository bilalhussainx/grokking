"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Toggle } from "@/components/cc/Toggle";

const ACTIVITY_TYPES = [
  "Academic", "Art", "Athletics", "Career", "Community Service",
  "Computer/Technology", "Cultural", "Dance", "Debate/Speech",
  "Environmental", "Family Responsibilities", "Foreign Exchange",
  "Journalism/Publication", "Junior ROTC", "LGBTQ+", "Music",
  "Religious", "Research", "Robotics", "School Spirit", "Science/Math",
  "Social Justice", "Student Government", "Theater/Drama", "Volunteer",
  "Work (paid)", "Other",
];

interface Activity {
  id?: string;
  position: number;
  activity_type?: string | null;
  organization?: string | null;
  role?: string | null;
  description_150?: string | null;
  grades_participated?: number[] | null;
  hours_per_week?: number | null;
  weeks_per_year?: number | null;
  is_continuing?: boolean;
}

interface Props {
  activities: Activity[];
  onSave: (activity: Partial<Activity> & { position: number }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function CharCount({ current, max }: { current: number; max: number }) {
  const over = current > max;
  return <span className={`text-xs ${over ? "text-red-400" : "text-white/30"}`}>{current}/{max}</span>;
}

const inputClass = "w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50";

export default function ActivitiesForm({ activities, onSave, onDelete }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null);

  const nextPosition = activities.length > 0
    ? Math.max(...activities.map((a) => a.position)) + 1
    : 1;

  const addActivity = () => {
    if (nextPosition > 10) return;
    onSave({ position: nextPosition, activity_type: "", organization: "", role: "", description_150: "", grades_participated: [], hours_per_week: 0, weeks_per_year: 0, is_continuing: true });
    setExpanded(nextPosition);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-white/40">{activities.length}/10 activities</p>
        {activities.length < 10 && (
          <button onClick={addActivity} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] text-sm font-medium hover:bg-[#D4AF37]/20 transition-all">
            <Plus className="w-4 h-4" /> Add activity
          </button>
        )}
      </div>

      {activities.length === 0 && (
        <p className="text-xs text-[#D4AF37]/60">Colleges want to see what you do outside class — add your first activity</p>
      )}

      {activities.map((act) => (
        <div key={act.position} className="border border-white/10 rounded-xl overflow-hidden">
          <button
            onClick={() => setExpanded(expanded === act.position ? null : act.position)}
            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xs text-white/30 font-mono w-5">{act.position}</span>
              <span className="text-sm text-white truncate">{act.organization || act.activity_type || "New activity"}</span>
              {act.role && <span className="text-xs text-white/40 hidden sm:inline">— {act.role}</span>}
            </div>
            {expanded === act.position ? <ChevronUp className="w-4 h-4 text-white/30 shrink-0" /> : <ChevronDown className="w-4 h-4 text-white/30 shrink-0" />}
          </button>

          {expanded === act.position && (
            <div className="px-4 pb-4 space-y-3 border-t border-white/5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                <div>
                  <label className="block text-xs text-white/40 mb-1">Activity type *</label>
                  <select value={act.activity_type || ""} onChange={(e) => onSave({ position: act.position, activity_type: e.target.value })} className={inputClass}>
                    <option value="">Select...</option>
                    {ACTIVITY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">Organization (100 chars)</label>
                  <input type="text" maxLength={100} value={act.organization || ""} onChange={(e) => onSave({ position: act.position, organization: e.target.value })} className={inputClass} />
                  <CharCount current={(act.organization || "").length} max={100} />
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/40 mb-1">Your role (50 chars)</label>
                <input type="text" maxLength={50} value={act.role || ""} onChange={(e) => onSave({ position: act.position, role: e.target.value })} className={inputClass} />
                <CharCount current={(act.role || "").length} max={50} />
              </div>

              <div>
                <label className="block text-xs text-white/40 mb-1">Description (150 chars)</label>
                <textarea maxLength={150} rows={2} value={act.description_150 || ""} onChange={(e) => onSave({ position: act.position, description_150: e.target.value })} className={`${inputClass} resize-none`} />
                <CharCount current={(act.description_150 || "").length} max={150} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-white/40 mb-1">Grades *</label>
                  <div className="flex gap-1">
                    {[9, 10, 11, 12].map((g) => {
                      const selected = (act.grades_participated || []).includes(g);
                      return (
                        <button key={g} type="button" onClick={() => {
                          const current = act.grades_participated || [];
                          const next = selected ? current.filter((x) => x !== g) : [...current, g];
                          onSave({ position: act.position, grades_participated: next });
                        }} className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${selected ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]" : "bg-white/5 text-white/40 border border-white/10"}`}>
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">Hrs/week *</label>
                  <input type="number" min="0" max="168" value={act.hours_per_week ?? ""} onChange={(e) => onSave({ position: act.position, hours_per_week: Number(e.target.value) })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">Weeks/yr *</label>
                  <input type="number" min="0" max="52" value={act.weeks_per_year ?? ""} onChange={(e) => onSave({ position: act.position, weeks_per_year: Number(e.target.value) })} className={inputClass} />
                </div>
                <div className="flex items-end pb-1">
                  <Toggle
                    checked={act.is_continuing ?? true}
                    onChange={(v) => onSave({ position: act.position, is_continuing: v })}
                    label="Continuing"
                  />
                </div>
              </div>

              {act.id && (
                <button onClick={() => onDelete(act.id!)} className="flex items-center gap-1.5 text-xs text-red-400/60 hover:text-red-400 transition-colors mt-2">
                  <Trash2 className="w-3.5 h-3.5" /> Remove activity
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
