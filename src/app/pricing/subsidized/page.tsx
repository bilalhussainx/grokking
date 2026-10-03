"use client";
import { COACH_LANGUAGE_COUNT } from "@/lib/coach-language-claim";
import { proMonthlyLabel } from "@/lib/pricing";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, Check, AlertTriangle, ArrowLeft, Sparkles } from "lucide-react";

interface EligibilityResult {
  eligible: boolean;
  reason: string;
  missingFields: string[];
}

export default function SubsidizedPage() {
  const router = useRouter();
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    fetch("/api/billing/subsidized")
      .then((r) => r.json())
      .then(setResult)
      .finally(() => setLoading(false));
  }, []);

  const handleClaim = async () => {
    setClaiming(true);
    const res = await fetch("/api/billing/subsidized", { method: "POST" });
    const data = await res.json();
    if (data.granted || data.already) {
      setClaimed(true);
      setTimeout(() => router.push("/pricing"), 2000);
    }
    setClaiming(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <Link
        href="/pricing"
        className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/60 mb-8 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to pricing
      </Link>

      <div className="text-center mb-8">
        <Heart className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Free Pro Access</h1>
        <p className="text-white/50 text-sm">
          We believe every student deserves full access to college guidance, regardless of ability to pay.
        </p>
      </div>

      {claimed ? (
        <div className="p-6 rounded-2xl border border-green-500/30 bg-green-500/10 text-center">
          <Check className="w-10 h-10 text-green-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white mb-1">Pro activated</h2>
          <p className="text-sm text-white/60">Redirecting to pricing page...</p>
        </div>
      ) : result?.eligible ? (
        <div className="p-6 rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/5">
          <div className="flex items-start gap-3 mb-6">
            <Sparkles className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">You qualify.</h2>
              <p className="text-sm text-white/60">{result.reason}</p>
            </div>
          </div>

          <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
            <h3 className="text-sm font-semibold text-white mb-3">What you get with Pro:</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#D4AF37]" /> Every admissions tool: school list, essay feedback, aid and net price</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#D4AF37]" /> Unlimited Coach Kairos, under fair use</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#D4AF37]" /> Voice practice in {COACH_LANGUAGE_COUNT} languages</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#D4AF37]" /> Priority support</li>
            </ul>
          </div>

          <button
            onClick={handleClaim}
            disabled={claiming}
            className="w-full py-3 rounded-xl bg-[#D4AF37] text-black font-semibold hover:bg-[#C4A030] disabled:opacity-50 transition-all"
          >
            {claiming ? "Activating..." : "Claim Free Pro Access"}
          </button>

          <p className="text-[11px] text-white/30 text-center mt-3">
            No credit card needed. No strings attached.
          </p>
        </div>
      ) : (
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">
                {result?.missingFields && result.missingFields.length > 0 ? "More info needed" : "Not eligible right now"}
              </h2>
              <p className="text-sm text-white/60">{result?.reason}</p>
            </div>
          </div>

          {result?.missingFields && result.missingFields.length > 0 && (
            <Link
              href="/profile?wizard=1"
              className="inline-flex items-center gap-1.5 mt-2 px-4 py-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] text-sm font-medium hover:bg-[#D4AF37]/20 transition-all"
            >
              Complete your profile
            </Link>
          )}

          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-xs text-white/40">
              Pro is {proMonthlyLabel()} for students who don&apos;t qualify for subsidized access.
              Every dollar helps us keep the platform free for those who need it most.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
