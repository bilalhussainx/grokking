"use client";

import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";

export default function CSSProfileCallout() {
  return (
    <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-[#D4AF37]/10 to-emerald-500/5 border border-[#D4AF37]/30">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4 text-[#D4AF37]" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white">CSS Profile — you&apos;ll need this</h3>
          <p className="text-xs text-white/60 leading-relaxed mt-1.5">
            As an international student who needs full aid, you&apos;ll submit the CSS Profile at most schools (not FAFSA). It&apos;s longer, asks for family income/assets/expenses in more detail, and costs $25 per school.
          </p>
          <p className="text-xs text-white/50 leading-relaxed mt-2">
            Start gathering: parents&apos; tax returns or equivalent, 2 years of bank statements, and an estimate of monthly household expenses.
          </p>
          <Link
            href="/profile/css-guide"
            className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-[#D4AF37] hover:text-[#E5C158] transition-colors"
          >
            Open the CSS Profile guide <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
