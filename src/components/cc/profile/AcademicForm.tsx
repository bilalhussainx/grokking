"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import {
  convertToUS4,
  convertPercentageToGPA,
  detectGradingSystem,
  formatRawGPADisplay,
  type GradingSystem,
} from "@/lib/cc/gpa-converter";
import GPAConversionCard from "./GPAConversionCard";

interface AcademicData {
  gpa_unweighted?: number | null;
  gpa_weighted?: number | null;
  gpa_scale?: string | null;
  gpa_raw_value?: number | null;
  gpa_raw_display?: string | null;
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
  countryCode?: string | null;
}

const TEST_STRATEGIES = ["SAT", "ACT", "Both", "Test-optional", "Undecided"];

type GradingChoice = "us-4.0" | GradingSystem;

const SYSTEM_OPTIONS: { value: GradingChoice; label: string }[] = [
  { value: "us-4.0", label: "US 4.0 GPA" },
  { value: "percentage", label: "Percentage (0–100)" },
  { value: "cgpa10", label: "CGPA / 10" },
  { value: "a-levels", label: "A-Levels" },
  { value: "ib", label: "IB" },
];

const RAW_INPUT_CONFIG: Record<GradingSystem, { step: number; min: number; max: number; placeholder: string }> = {
  percentage: { step: 1, min: 0, max: 100, placeholder: "e.g. 87" },
  cgpa10: { step: 0.1, min: 0, max: 10, placeholder: "e.g. 8.5" },
  "a-levels": { step: 1, min: 1, max: 6, placeholder: "6 = A*, 5 = A, 4 = B" },
  ib: { step: 1, min: 1, max: 7, placeholder: "1–7" },
};

function inferSystem(data: AcademicData | null, countryCode?: string | null): GradingChoice {
  if (data?.gpa_raw_display) {
    const d = data.gpa_raw_display;
    if (d.includes("%")) return "percentage";
    if (d.includes("CGPA")) return "cgpa10";
    if (d.includes("A-Level")) return "a-levels";
    if (d.startsWith("IB")) return "ib";
  }
  if (countryCode) {
    const detected = detectGradingSystem(countryCode);
    if (detected) return detected;
  }
  return "us-4.0";
}

function Nudge({ show, text }: { show: boolean; text: string }) {
  if (!show) return null;
  return <p className="text-xs text-[#D4AF37]/60 mt-1">{text}</p>;
}

const inputClass = "w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50";

export default function AcademicForm({ data, onSave, countryCode }: Props) {
  const [form, setForm] = useState<AcademicData>(data || {});
  const [system, setSystem] = useState<GradingChoice>(() => inferSystem(data, countryCode));
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const save = useCallback((fields: Partial<AcademicData>) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSave(fields);
    }, 500);
  }, [onSave]);

  const updateField = (field: keyof AcademicData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    save({ [field]: value });
  };

  const numUpdate = (field: keyof AcademicData, raw: string) => {
    const val = raw === "" ? null : Number(raw);
    updateField(field, val);
  };

  const onSystemChange = (next: GradingChoice) => {
    setSystem(next);
    if (next === "us-4.0") {
      setForm((prev) => ({ ...prev, gpa_raw_value: null, gpa_raw_display: null }));
      save({ gpa_raw_value: null, gpa_raw_display: null });
    }
  };

  const onRawGPAChange = (raw: string) => {
    if (system === "us-4.0") {
      numUpdate("gpa_unweighted", raw);
      return;
    }
    const gradingSystem = system as GradingSystem;
    if (raw === "") {
      setForm((prev) => ({ ...prev, gpa_raw_value: null, gpa_raw_display: null, gpa_unweighted: null }));
      save({ gpa_raw_value: null, gpa_raw_display: null, gpa_unweighted: null });
      return;
    }
    const rawNum = Number(raw);
    if (!Number.isFinite(rawNum)) return;

    const conv = convertToUS4(gradingSystem, rawNum);
    const midpoint = Math.round(((conv.gpaLow + conv.gpaHigh) / 2) * 100) / 100;
    const display = formatRawGPADisplay(gradingSystem, rawNum, countryCode ?? undefined);
    setForm((prev) => ({
      ...prev,
      gpa_raw_value: rawNum,
      gpa_raw_display: display,
      gpa_unweighted: midpoint,
    }));
    save({ gpa_raw_value: rawNum, gpa_raw_display: display, gpa_unweighted: midpoint });
  };

  const percentageResult = useMemo(() => {
    if (system !== "percentage" || form.gpa_raw_value == null) return null;
    try {
      return convertPercentageToGPA(form.gpa_raw_value);
    } catch {
      return null;
    }
  }, [system, form.gpa_raw_value]);

  const showSAT = form.test_strategy === "SAT" || form.test_strategy === "Both";
  const showACT = form.test_strategy === "ACT" || form.test_strategy === "Both";
  const isUS = system === "us-4.0";
  const rawCfg = !isUS ? RAW_INPUT_CONFIG[system as GradingSystem] : null;
  const rawValue = isUS ? form.gpa_unweighted : form.gpa_raw_value;

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm text-white/60 mb-1">Grading system</label>
        <select
          value={system}
          onChange={(e) => onSystemChange(e.target.value as GradingChoice)}
          className={inputClass}
        >
          {SYSTEM_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <p className="text-xs text-white/40 mt-1">
          {isUS
            ? "US high schools commonly use 0.0–4.0."
            : "Enter your grade in your country's system. We'll convert to a US 4.0 equivalent automatically."}
        </p>
      </div>

      <div className={`grid grid-cols-1 ${isUS ? "sm:grid-cols-3" : "sm:grid-cols-1"} gap-4`}>
        <div>
          <label className="block text-sm text-white/60 mb-1">
            {isUS ? "GPA (unweighted) *" : "Your grade *"}
          </label>
          <input
            type="number"
            step={isUS ? 0.01 : rawCfg?.step}
            min={isUS ? 0 : rawCfg?.min}
            max={isUS ? 4 : rawCfg?.max}
            value={rawValue ?? ""}
            onChange={(e) => onRawGPAChange(e.target.value)}
            placeholder={isUS ? undefined : rawCfg?.placeholder}
            className={inputClass}
          />
          <Nudge show={rawValue == null} text="Adding your GPA helps Coach Kairos recommend better-fit schools" />
          {!isUS && form.gpa_unweighted != null && (
            <p className="text-xs text-emerald-400/80 mt-1">
              ≈ {form.gpa_unweighted.toFixed(2)} on the US 4.0 scale
            </p>
          )}
        </div>
        {isUS && (
          <>
            <div>
              <label className="block text-sm text-white/60 mb-1">GPA (weighted)</label>
              <input type="number" step="0.01" min="0" max="5" value={form.gpa_weighted ?? ""} onChange={(e) => numUpdate("gpa_weighted", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">GPA scale</label>
              <select value={form.gpa_scale || "4.0"} onChange={(e) => updateField("gpa_scale", e.target.value)} className={inputClass}>
                <option value="4.0">4.0 scale</option>
                <option value="5.0">5.0 scale</option>
                <option value="100-point">100-point scale</option>
              </select>
            </div>
          </>
        )}
      </div>

      {system === "percentage" && percentageResult && (
        <GPAConversionCard pct={form.gpa_raw_value ?? null} />
      )}

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
              onClick={() => updateField("test_strategy", s)}
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
