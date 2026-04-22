"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import IdentityForm from "./IdentityForm";
import AcademicForm from "./AcademicForm";
import ActivitiesForm from "./ActivitiesForm";
import HonorsForm from "./HonorsForm";
import FinancialForm from "./FinancialForm";

const STEPS = [
  { key: "identity", label: "Identity", icon: "1" },
  { key: "academic", label: "Academic", icon: "2" },
  { key: "activities", label: "Activities", icon: "3" },
  { key: "honors", label: "Honors", icon: "4" },
  { key: "financial", label: "Financial", icon: "5" },
] as const;

interface Props {
  profileData: {
    profile: Record<string, unknown>;
    academic: Record<string, unknown> | null;
    activities: Array<Record<string, unknown>>;
    honors: Array<Record<string, unknown>>;
    financial: Record<string, unknown> | null;
  };
  onSaveIdentity: (fields: Record<string, unknown>) => Promise<void>;
  onSaveAcademic: (fields: Record<string, unknown>) => Promise<void>;
  onSaveActivity: (activity: Record<string, unknown>) => Promise<void>;
  onDeleteActivity: (id: string) => Promise<void>;
  onSaveHonor: (honor: Record<string, unknown>) => Promise<void>;
  onDeleteHonor: (id: string) => Promise<void>;
  onSaveFinancial: (fields: Record<string, unknown>) => Promise<void>;
  onSaveAffordability: (value: string) => Promise<void>;
  onComplete: () => void;
}

export default function ProfileWizard({
  profileData, onSaveIdentity, onSaveAcademic,
  onSaveActivity, onDeleteActivity, onSaveHonor, onDeleteHonor,
  onSaveFinancial, onSaveAffordability, onComplete,
}: Props) {
  const [step, setStep] = useState(0);

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else {
      localStorage.setItem("profile_wizard_done", "true");
      onComplete();
    }
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const skip = () => next();

  const currentStep = STEPS[step];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              i < step ? "bg-[#D4AF37] text-black" :
              i === step ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]" :
              "bg-white/5 text-white/30 border border-white/10"
            }`}>
              {i < step ? <Check className="w-4 h-4" /> : s.icon}
            </div>
            {i < STEPS.length - 1 && <div className={`w-8 h-0.5 ${i < step ? "bg-[#D4AF37]" : "bg-white/10"}`} />}
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-white mb-1">{currentStep.label}</h2>
      <p className="text-sm text-white/40 mb-6">Step {step + 1} of {STEPS.length}</p>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep.key}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {currentStep.key === "identity" && (
            <IdentityForm data={profileData.profile as never} onSave={onSaveIdentity as never} />
          )}
          {currentStep.key === "academic" && (
            <AcademicForm
              data={profileData.academic as never}
              onSave={onSaveAcademic as never}
              countryCode={(profileData.profile as { country?: string | null }).country ?? null}
            />
          )}
          {currentStep.key === "activities" && (
            <ActivitiesForm activities={profileData.activities as never} onSave={onSaveActivity as never} onDelete={onDeleteActivity} />
          )}
          {currentStep.key === "honors" && (
            <HonorsForm honors={profileData.honors as never} onSave={onSaveHonor as never} onDelete={onDeleteHonor} />
          )}
          {currentStep.key === "financial" && (
            <FinancialForm
              data={profileData.financial as never}
              onSave={onSaveFinancial as never}
              affordabilityValue={(profileData.profile as { affordability_value?: string | null }).affordability_value as never}
              isInternational={!!(profileData.profile as { is_international?: boolean | null }).is_international}
              onAffordabilityChange={onSaveAffordability as never}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
        <button
          onClick={back}
          disabled={step === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white/50 hover:text-white disabled:opacity-30 disabled:hover:text-white/50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={skip}
            className="px-4 py-2 rounded-lg text-sm text-white/30 hover:text-white/50 transition-colors"
          >
            Skip for now
          </button>
          <button
            onClick={next}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#C4A030] transition-all"
          >
            {step === STEPS.length - 1 ? "Finish" : "Save & Next"} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
