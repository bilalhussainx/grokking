"use client";

import { useMemo } from "react";
import { Sparkles, Info } from "lucide-react";
import { convertPercentageToGPA } from "@/lib/cc/gpa-converter";

interface Props {
  pct: number | null;
}

export default function GPAConversionCard({ pct }: Props) {
  const result = useMemo(() => {
    if (pct == null) return null;
    try {
      return convertPercentageToGPA(pct);
    } catch {
      return null;
    }
  }, [pct]);

  if (!result || pct == null) return null;

  return (
    <div className="rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-br from-[#D4AF37]/10 via-black/40 to-emerald-500/10 p-5 space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-[#D4AF37]" />
        </div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wider text-[#D4AF37]/80 font-semibold">
            US 4.0 Conversion
          </p>
          <p className="text-lg text-white mt-0.5">
            Your <span className="font-bold text-[#D4AF37]">{pct}%</span> is approximately{" "}
            <span className="font-bold text-emerald-400">{result.gpaPrecise.toFixed(2)}</span> on a 4.0 scale
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/10">
        <div>
          <p className="text-xs uppercase tracking-wider text-white/40 font-semibold mb-1">Band</p>
          <p className="text-sm text-white font-medium">{result.band}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-white/40 font-semibold mb-1">US equivalent</p>
          <p className="text-sm text-white">{result.usCourseContext}</p>
        </div>
      </div>

      <div className="pt-3 border-t border-white/10">
        <p className="text-xs uppercase tracking-wider text-white/40 font-semibold mb-2">
          How US colleges evaluate this
        </p>
        <p className="text-sm text-white/70 leading-relaxed">{result.howCollegesEvaluate}</p>
      </div>

      <div className="flex items-start gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="text-xs text-emerald-100/80">
          <span className="font-semibold">Tip:</span> Attach your official marksheet or transcript to your application so admissions officers see the grades in your school's original format.
        </p>
      </div>
    </div>
  );
}
