// Unified Net Price Estimator UI — one form, every school on the student's
// list scored in a single grid. Shipped 2026-05-17 per the Cookiy validation
// finding that students abandon individual school NPCs because they're
// inconsistent and edge-case-blind. Auth is enforced by middleware for /cc/*.

import Link from "next/link";
import { ChevronLeft, Info } from "lucide-react";
import NetPriceEstimator from "@/components/cc/net-price/NetPriceEstimator";

export const metadata = {
  title: "Net Price Estimator · KairosLearn",
  description:
    "Estimate your out-of-pocket cost at every school on your list — in one form, handling international, first-gen, and transfer edge cases.",
};

export default function NetPricePage() {
  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <Link
          href="/cc/dashboard"
          className="inline-flex items-center gap-1 text-xs text-white/50 hover:text-white/80 transition-colors mb-4"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Back to dashboard
        </Link>

        <header className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">Net price across your list</h1>
          <p className="text-sm text-white/60 leading-relaxed max-w-2xl">
            One estimate per school based on your saved affordability + household data. We never share
            this with colleges — it&apos;s your private planning view.
          </p>
        </header>

        <div className="mb-5 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-xs text-white/65 flex items-start gap-2 leading-relaxed">
          <Info className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0" aria-hidden />
          <span>
            These estimates are rule-based and meant for relative comparison across your list. Use each
            school&apos;s official Net Price Calculator before committing. International, first-gen, and
            transfer paths are handled in the formula automatically.
          </span>
        </div>

        <NetPriceEstimator />
      </div>
    </div>
  );
}
