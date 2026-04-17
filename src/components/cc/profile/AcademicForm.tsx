"use client";

import { useState, useCallback, useRef } from "react";

interface AcademicData {
  gpa_unweighted?: number | null;
  gpa_weighted?: number | null;
  gpa_scale?: string | null;
  class_rank?: number | null;
  class_size?: number | null;
  test_strategy?: string | null;
  sat_total?: number | null;
  sat_math?: number | null;
  sat_erw?: number | null;
  act_composite?: number | null;
  toefl_score?: number | null;
  ielts_score?: number | null;
  duolingo_english_score?: number | null;
}

interface Props {
  data: AcademicData | null;
  onSave: (fields: Partial<AcademicData>) => Promise<void>;
}

const TEST_STRATEGIES = ["SAT", "ACT", "Both", "Test-optional", "Undecided"];

function Nudge({ show, text }: { show: boolean; text: string }) {
  if (!show) return null;
  return <p className="text-xs text-[#D4AF37]/60 mt-1">{text}</p>;
}

const inputClass = "w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50";

export default function AcademicForm({ data, onSave }: Props) {
  const [form, setForm] = useState<AcademicData>(data || {});
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const save = useCallback((field: string, value: unknown) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSave({ [field]: value });
    }, 500);
  }, [onSave]);

  const update = (field: keyof AcademicData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    save(field, value);
  };

  const numUpdate = (field: keyof AcademicData, raw: string) => {
    const val = raw === "" ? null : Number(raw);
    update(field, val);
  };

  const showSAT = form.test_strategy === "SAT" || form.test_strategy === "Both";
  const showACT = form.test_strategy === "ACT" || form.test_strategy === "Both";

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-white/60 mb-1">GPA (unweighted) *</label>
          <input type="number" step="0.01" min="0" max="4" value={form.gpa_unweighted ?? ""} onChange={(e) => numUpdate("gpa_unweighted", e.target.value)} className={inputClass} />
          <Nudge show={!form.gpa_unweighted} text="Adding your GPA helps Coach Kairos recommend better-fit schools" />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">GPA (weighted)</label>
          <input type="number" step="0.01" min="0" max="5" value={form.gpa_weighted ?? ""} onChange={(e) => numUpdate("gpa_weighted", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">GPA scale</label>
          <select value={form.gpa_scale || "4.0"} onChange={(e) => update("gpa_scale", e.target.value)} className={inputClass}>
            <option value="4.0">4.0 scale</option>
            <option value="5.0">5.0 scale</option>
            <option value="100-point">100-point scale</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/60 mb-1">Class rank</label>
          <input type="number" min="1" value={form.class_rank ?? ""} onChange={(e) => numUpdate("class_rank", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">Class size</label>
          <input type="number" min="1" value={form.class_size ?? ""} onChange={(e) => numUpdate("class_size", e.target.value)} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-1">Testing strategy *</label>
        <div className="flex flex-wrap gap-2">
          {TEST_STRATEGIES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => update("test_strategy", s)}
              className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                form.test_strategy === s
                  ? "border-[#D4AF37] bg-[#D4AF37]/20 text-[#D4AF37]"
                  : "border-white/10 text-white/50 hover:border-white/20"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <Nudge show={!form.test_strategy} text="Even if you're going test-optional, entering scores helps estimate merit aid" />
      </div>

      {showSAT && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-1">SAT Total</label>
            <input type="number" min="400" max="1600" value={form.sat_total ?? ""} onChange={(e) => numUpdate("sat_total", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1">SAT Math</label>
            <input type="number" min="200" max="800" value={form.sat_math ?? ""} onChange={(e) => numUpdate("sat_math", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1">SAT ERW</label>
            <input type="number" min="200" max="800" value={form.sat_erw ?? ""} onChange={(e) => numUpdate("sat_erw", e.target.value)} className={inputClass} />
          </div>
        </div>
      )}

      {showACT && (
        <div>
          <label className="block text-sm text-white/60 mb-1">ACT Composite</label>
          <input type="number" min="1" max="36" value={form.act_composite ?? ""} onChange={(e) => numUpdate("act_composite", e.target.value)} className={inputClass} />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-white/60 mb-1">TOEFL</label>
          <input type="number" value={form.toefl_score ?? ""} onChange={(e) => numUpdate("toefl_score", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">IELTS</label>
          <input type="number" step="0.5" min="0" max="9" value={form.ielts_score ?? ""} onChange={(e) => numUpdate("ielts_score", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">Duolingo English</label>
          <input type="number" value={form.duolingo_english_score ?? ""} onChange={(e) => numUpdate("duolingo_english_score", e.target.value)} className={inputClass} />
        </div>
      </div>
    </div>
  );
}
