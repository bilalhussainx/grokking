"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, Languages } from "lucide-react";
import FamilyModeView from "@/components/family-mode/FamilyModeView";
import { FAMILY_MODE_LANGUAGES } from "@/lib/cc/family-mode-strings";

type AidContext = {
  schoolName: string;
  stickerPrice: number;
  estimatedNetPrice: number;
  estimatedGrantAid: number;
  estimatedFamilyContribution: number;
  aidRiskFlag: "none" | "need_aware_admission_risk" | "limited_intl_aid";
};

const LANGUAGE_LABEL: Record<string, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  nl: "Nederlands",
  ja: "日本語",
  hi: "हिन्दी",
  bn: "বাংলা",
  ta: "தமிழ்",
  te: "తెలుగు",
  gu: "ગુજરાતી",
  kn: "ಕನ್ನಡ",
  ml: "മലയാളം",
  mr: "मराठी",
  pa: "ਪੰਜਾਬੀ",
  od: "ଓଡିଆ",
  ur: "اردو",
  zh: "中文",
  ko: "한국어",
  ar: "العربية",
  vi: "Tiếng Việt",
  pt: "Português",
  ru: "Русский",
  tr: "Türkçe",
};

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function AidExplainerLauncher({ aidContext }: { aidContext: AidContext }) {
  const router = useRouter();
  const [language, setLanguage] = useState<string | null>(null);

  if (language) {
    return (
      <FamilyModeView
        language={language}
        onExit={() => router.push("/cc/net-price")}
        preset="aid_explainer"
        aidContext={aidContext}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <button
          type="button"
          onClick={() => router.push("/cc/net-price")}
          className="inline-flex items-center gap-1 text-xs text-white/50 hover:text-white/80 transition-colors mb-4"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Back to estimator
        </button>

        <header className="mb-6">
          <div className="inline-flex items-center gap-2 text-[#D4AF37] mb-2">
            <Languages className="w-4 h-4" aria-hidden />
            <span className="text-[11px] uppercase tracking-[0.18em] font-semibold font-mono">
              Aid Explainer for parents
            </span>
          </div>
          <h1 className="text-2xl font-semibold mb-2">
            Walk your parent through {aidContext.schoolName}
          </h1>
          <p className="text-sm text-white/60 leading-relaxed">
            Pick your parent&apos;s language. Coach Kairos will explain the cost breakdown below in
            simple terms — no jargon, no acronyms, with cultural context for first-gen and
            international families.
          </p>
        </header>

        <div className="mb-6 p-4 rounded-xl bg-white/[0.04] border border-white/10">
          <div className="text-[11px] uppercase tracking-wider text-white/45 mb-2 font-mono">
            What you&apos;ll be explaining
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div>
              <div className="text-white/45 text-xs mb-0.5">Sticker</div>
              <div className="text-white/85 font-semibold">{fmt(aidContext.stickerPrice)}</div>
            </div>
            <div>
              <div className="text-white/45 text-xs mb-0.5">Grant aid</div>
              <div className="text-green-300 font-semibold">−{fmt(aidContext.estimatedGrantAid)}</div>
            </div>
            <div>
              <div className="text-white/45 text-xs mb-0.5">Your share</div>
              <div className="text-white/85 font-semibold">{fmt(aidContext.estimatedFamilyContribution)}</div>
            </div>
            <div>
              <div className="text-white/45 text-xs mb-0.5">Net price</div>
              <div className="text-[#D4AF37] font-semibold">{fmt(aidContext.estimatedNetPrice)}</div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm uppercase tracking-wider text-white/55 font-mono mb-3">
            Language for the conversation
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {FAMILY_MODE_LANGUAGES.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLanguage(code)}
                className="px-3 py-2.5 rounded-lg border border-white/10 text-sm text-white/75 hover:border-[#D4AF37]/40 hover:text-white hover:bg-white/[0.03] transition-colors text-left"
              >
                {LANGUAGE_LABEL[code] ?? code}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
