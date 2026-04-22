"use client";

import { useState, useCallback, useRef } from "react";
import { AFFORDABILITY_OPTIONS, type AffordabilityValue } from "@/lib/cc/affordability";
import CSSProfileCallout from "./CSSProfileCallout";

interface FinancialData {
  household_income_bracket?: string | null;
  household_size?: number | null;
  dependents_in_college?: number | null;
  parents_marital_status?: string | null;
  free_reduced_lunch?: boolean | null;
  willing_to_take_loans?: boolean | null;
  max_loans_comfortable?: number | null;
  fafsa_submitted?: boolean | null;
  css_profile_submitted?: boolean | null;
}

interface Props {
  data: FinancialData | null;
  onSave: (fields: Partial<FinancialData>) => Promise<void>;
  affordabilityValue?: AffordabilityValue | null;
  isInternational?: boolean;
  onAffordabilityChange?: (value: AffordabilityValue) => Promise<void>;
}

const INCOME_BRACKETS = ["$0-30k", "$30-48k", "$48-75k", "$75-110k", "$110k+"];
const MARITAL_OPTIONS = ["Married/Partnered", "Single parent", "Divorced/Separated", "Widowed", "Prefer not to say"];

function Nudge({ show, text }: { show: boolean; text: string }) {
  if (!show) return null;
  return <p className="text-xs text-[#D4AF37]/60 mt-1">{text}</p>;
}

const inputClass = "w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50";

export default function FinancialForm({
  data,
  onSave,
  affordabilityValue,
  isInternational,
  onAffordabilityChange,
}: Props) {
  const [form, setForm] = useState<FinancialData>(data || {});
  const [localAffordability, setLocalAffordability] = useState<AffordabilityValue | null>(affordabilityValue ?? null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const save = useCallback((field: string, value: unknown) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSave({ [field]: value });
    }, 500);
  }, [onSave]);

  const update = (field: keyof FinancialData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    save(field, value);
  };

  const onPickAffordability = async (value: AffordabilityValue) => {
    setLocalAffordability(value);
    if (onAffordabilityChange) await onAffordabilityChange(value);
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-white/40 leading-relaxed">
        This information is private and never shared with colleges. It helps Coach Kairos estimate your net price at each school and find scholarships you qualify for.
      </p>

      <div>
        <label className="block text-sm text-white/60 mb-2">How much can your family contribute per year? *</label>
        <p className="text-xs text-white/40 mb-3">This is what you can realistically pay toward college — separate from income.</p>
        <div className="flex flex-col gap-2">
          {AFFORDABILITY_OPTIONS.map((opt) => {
            const active = localAffordability === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onPickAffordability(opt.value)}
                className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                  active
                    ? "border-[#D4AF37] bg-[#D4AF37]/10 text-white"
                    : "border-white/10 text-white/60 hover:border-white/20"
                }`}
              >
                <div className={`font-medium ${active ? "text-[#D4AF37]" : "text-white/80"}`}>{opt.label}</div>
                {"sublabel" in opt && opt.sublabel && <div className="text-xs text-white/40 mt-0.5">{opt.sublabel}</div>}
              </button>
            );
          })}
        </div>
        {localAffordability === "zero" && isInternational && <CSSProfileCallout />}
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-2">Household income bracket *</label>
        <div className="flex flex-wrap gap-2">
          {INCOME_BRACKETS.map((bracket) => (
            <button
              key={bracket}
              type="button"
              onClick={() => update("household_income_bracket", bracket)}
              className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                form.household_income_bracket === bracket
                  ? "border-[#D4AF37] bg-[#D4AF37]/20 text-[#D4AF37]"
                  : "border-white/10 text-white/50 hover:border-white/20"
              }`}
            >
              {bracket}
            </button>
          ))}
        </div>
        <Nudge show={!form.household_income_bracket} text="This helps Coach Kairos estimate your net price at each school" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-white/60 mb-1">Household size *</label>
          <input type="number" min="1" max="20" value={form.household_size ?? ""} onChange={(e) => update("household_size", e.target.value ? Number(e.target.value) : null)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">Family members in college</label>
          <input type="number" min="0" max="10" value={form.dependents_in_college ?? 1} onChange={(e) => update("dependents_in_college", Number(e.target.value))} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">Parents&apos; marital status</label>
          <select value={form.parents_marital_status || ""} onChange={(e) => update("parents_marital_status", e.target.value)} className={inputClass}>
            <option value="">Select...</option>
            {MARITAL_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.free_reduced_lunch || false} onChange={(e) => update("free_reduced_lunch", e.target.checked)} className="w-4 h-4 rounded accent-[#D4AF37]" />
          <span className="text-sm text-white/70">Qualifies for free/reduced lunch</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.willing_to_take_loans || false} onChange={(e) => update("willing_to_take_loans", e.target.checked)} className="w-4 h-4 rounded accent-[#D4AF37]" />
          <span className="text-sm text-white/70">Willing to take student loans</span>
        </label>
      </div>

      {form.willing_to_take_loans && (
        <div>
          <label className="block text-sm text-white/60 mb-1">Max comfortable loan amount ($)</label>
          <input type="number" min="0" step="1000" value={form.max_loans_comfortable ?? ""} onChange={(e) => update("max_loans_comfortable", e.target.value ? Number(e.target.value) : null)} className={`${inputClass} max-w-xs`} />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.fafsa_submitted || false} onChange={(e) => update("fafsa_submitted", e.target.checked)} className="w-4 h-4 rounded accent-[#D4AF37]" />
          <span className="text-sm text-white/70">FAFSA submitted</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.css_profile_submitted || false} onChange={(e) => update("css_profile_submitted", e.target.checked)} className="w-4 h-4 rounded accent-[#D4AF37]" />
          <span className="text-sm text-white/70">CSS Profile submitted</span>
        </label>
      </div>
    </div>
  );
}
