"use client";

import { useState, useCallback, useRef } from "react";

interface IdentityData {
  legal_first_name?: string | null;
  preferred_name?: string | null;
  grade_level?: number | null;
  graduation_year?: number | null;
  high_school_name?: string | null;
  high_school_ceeb_code?: string | null;
  state_province?: string | null;
  country?: string | null;
  home_language?: string | null;
  is_first_gen?: boolean | null;
  is_international?: boolean | null;
  citizenship_status?: string | null;
  race_ethnicity?: string[] | null;
  gender?: string | null;
}

interface Props {
  data: IdentityData;
  onSave: (fields: Partial<IdentityData>) => Promise<void>;
}

const CITIZENSHIP_OPTIONS = ["US Citizen", "Permanent Resident", "International", "DACA", "Undocumented"];
const GENDER_OPTIONS = ["Male", "Female", "Non-binary", "Prefer not to say", "Other"];
const ETHNICITY_OPTIONS = ["American Indian/Alaska Native", "Asian", "Black/African American", "Hispanic/Latino", "Native Hawaiian/Pacific Islander", "White", "Two or more races", "Prefer not to say"];

function Nudge({ show, text }: { show: boolean; text: string }) {
  if (!show) return null;
  return <p className="text-xs text-[#D4AF37]/60 mt-1">{text}</p>;
}

export default function IdentityForm({ data, onSave }: Props) {
  const [form, setForm] = useState<IdentityData>({ ...data });
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const save = useCallback((field: string, value: unknown) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSave({ [field]: value });
    }, 500);
  }, [onSave]);

  const update = (field: keyof IdentityData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    save(field, value);
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/60 mb-1">Legal first name *</label>
          <input
            type="text"
            value={form.legal_first_name || ""}
            onChange={(e) => update("legal_first_name", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
          />
          <Nudge show={!form.legal_first_name} text="Required for your college applications" />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">Preferred name</label>
          <input
            type="text"
            value={form.preferred_name || ""}
            onChange={(e) => update("preferred_name", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/60 mb-1">Grade level *</label>
          <select
            value={form.grade_level || ""}
            onChange={(e) => {
              const grade = Number(e.target.value);
              update("grade_level", grade);
              const gradYear = currentYear + (12 - grade) + 1;
              update("graduation_year", gradYear);
            }}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
          >
            <option value="">Select...</option>
            <option value="9">9th (Freshman)</option>
            <option value="10">10th (Sophomore)</option>
            <option value="11">11th (Junior)</option>
            <option value="12">12th (Senior)</option>
            <option value="13">Gap year / Post-grad</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">Graduation year *</label>
          <input
            type="number"
            value={form.graduation_year || ""}
            onChange={(e) => update("graduation_year", Number(e.target.value))}
            min={currentYear}
            max={currentYear + 5}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/60 mb-1">High school name *</label>
          <input
            type="text"
            value={form.high_school_name || ""}
            onChange={(e) => update("high_school_name", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">CEEB code (optional)</label>
          <input
            type="text"
            value={form.high_school_ceeb_code || ""}
            onChange={(e) => update("high_school_ceeb_code", e.target.value)}
            placeholder="6-digit code"
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/60 mb-1">State/Province *</label>
          <input
            type="text"
            value={form.state_province || ""}
            onChange={(e) => update("state_province", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">Country</label>
          <select
            value={form.country || "US"}
            onChange={(e) => update("country", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/60 mb-1">Citizenship status</label>
          <select
            value={form.citizenship_status || ""}
            onChange={(e) => update("citizenship_status", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
          >
            <option value="">Select...</option>
            {CITIZENSHIP_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">Gender</label>
          <select
            value={form.gender || ""}
            onChange={(e) => update("gender", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
          >
            <option value="">Select...</option>
            {GENDER_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-2">Race/Ethnicity (select all that apply)</label>
        <div className="flex flex-wrap gap-2">
          {ETHNICITY_OPTIONS.map((eth) => {
            const selected = (form.race_ethnicity || []).includes(eth);
            return (
              <button
                key={eth}
                type="button"
                onClick={() => {
                  const current = form.race_ethnicity || [];
                  const next = selected ? current.filter((e) => e !== eth) : [...current, eth];
                  update("race_ethnicity", next);
                }}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  selected
                    ? "border-[#D4AF37] bg-[#D4AF37]/20 text-[#D4AF37]"
                    : "border-white/10 text-white/50 hover:border-white/20"
                }`}
              >
                {eth}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_first_gen || false}
              onChange={(e) => update("is_first_gen", e.target.checked)}
              className="w-4 h-4 rounded accent-[#D4AF37]"
            />
            <span className="text-sm text-white/70">First-generation college student</span>
          </label>
          {(form.is_first_gen === true || form.is_first_gen === null || form.is_first_gen === undefined) && (
            <div className="p-3 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs text-[#D4AF37]/90 leading-relaxed">
              First-gen applicants bring valuable perspectives to college campuses. Many top schools specifically seek first-gen students — and we&apos;ll help you tell that story in your application.
            </div>
          )}
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_international || false}
            onChange={(e) => update("is_international", e.target.checked)}
            className="w-4 h-4 rounded accent-[#D4AF37]"
          />
          <span className="text-sm text-white/70">International student</span>
        </label>
      </div>
    </div>
  );
}
