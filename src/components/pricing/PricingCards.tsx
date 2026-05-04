// src/components/pricing/PricingCards.tsx
"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Check, Crown, Sparkles, Zap, X } from "lucide-react";
import ProCheckoutButton from "@/components/marketing/ProCheckoutButton";

interface Feature {
  text: string;
  included: boolean;
}

const FREE_FEATURES: Feature[] = [
  { text: "28 free courses", included: true },
  { text: "300 AI credits/month", included: true },
  { text: "Basic voice coaching", included: true },
  { text: "Code editor + auto-grading", included: true },
  { text: "Progress tracking & XP", included: true },
  { text: "All 69 courses", included: false },
  { text: "Unlimited AI credits", included: false },
  { text: "Mock interview practice", included: false },
];

const PRO_FEATURES: Feature[] = [
  { text: "All 69 courses unlocked", included: true },
  { text: "Unlimited AI credits", included: true },
  { text: "Full voice coaching (17 languages)", included: true },
  { text: "Mock interview practice", included: true },
  { text: "AI Coach voice sessions", included: true },
  { text: "Choose coach/interviewer voice", included: true },
  { text: "Certificates of completion", included: true },
  { text: "Priority support", included: true },
];

const TEAM_FEATURES: Feature[] = [
  { text: "Everything in Pro", included: true },
  { text: "Classroom management", included: true },
  { text: "Student progress dashboard", included: true },
  { text: "Homework assignment", included: true },
  { text: "Team analytics", included: true },
  { text: "Admin controls", included: true },
];

export default function PricingCards() {
  const { user, profile } = useAuth();
  const router = useRouter();

  const isPro =
    profile?.role === "pro" ||
    profile?.role === "teacher" ||
    profile?.role === "admin";

  const monthlyPrice = 12;

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* ---------------------------------------------------------------- */}
        {/* Free Plan */}
        {/* ---------------------------------------------------------------- */}
        <div className="rounded-2xl border border-white/10 bg-[#141414] p-8 flex flex-col">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-1">Free</h3>
            <p className="text-sm text-white/40">Start learning today</p>
          </div>

          <div className="mb-6">
            <span className="text-5xl font-bold text-white">$0</span>
            <span className="text-sm text-white/40 ml-1">forever</span>
          </div>

          <ul className="space-y-3 mb-8 flex-1">
            {FREE_FEATURES.map((f) => (
              <li
                key={f.text}
                className={`flex items-start gap-2.5 text-sm ${
                  f.included ? "text-white/70" : "text-white/25"
                }`}
              >
                {f.included ? (
                  <Check className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0" />
                ) : (
                  <X className="w-4 h-4 text-white/15 mt-0.5 shrink-0" />
                )}
                <span>{f.text}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => !user && router.push("/login")}
            disabled={!!user}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-all border border-white/10 bg-transparent text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {user ? "Current Plan" : "Get Started Free"}
          </button>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Pro Plan */}
        {/* ---------------------------------------------------------------- */}
        <div className="relative rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/[0.05] backdrop-blur-xl p-8 flex flex-col shadow-xl shadow-[#D4AF37]/5">
          {/* Badge */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#D4AF37] to-[#C4A030] text-black text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-[#D4AF37]/30">
              <Sparkles className="w-3 h-3" />
              MOST POPULAR
            </span>
          </div>

          <div className="mb-6 mt-2">
            <h3 className="text-xl font-bold text-white mb-1">Pro</h3>
            <p className="text-sm text-white/40">
              Unlimited learning + AI coaching
            </p>
          </div>

          <div className="mb-6">
            <span className="text-5xl font-bold text-white">${monthlyPrice}</span>
            <span className="text-sm text-white/40 ml-1">/mo</span>
            <div className="text-sm text-white/40 mt-1">billed monthly</div>
          </div>

          <ul className="space-y-3 mb-8 flex-1">
            {PRO_FEATURES.map((f) => (
              <li
                key={f.text}
                className="flex items-start gap-2.5 text-sm text-white/70"
              >
                <Check className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0" />
                <span>{f.text}</span>
              </li>
            ))}
          </ul>

          {isPro ? (
            <button
              type="button"
              disabled
              className="w-full py-3 rounded-xl text-sm font-semibold bg-[#D4AF37] text-black opacity-40 cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4" />
              Current Plan
            </button>
          ) : (
            <ProCheckoutButton className="w-full py-3 rounded-xl text-sm font-semibold transition-all bg-[#D4AF37] text-black hover:bg-[#C4A030] shadow-lg shadow-[#D4AF37]/25 flex items-center justify-center gap-2">
              <Crown className="w-4 h-4" />
              Upgrade to Pro
            </ProCheckoutButton>
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Teams Plan */}
        {/* ---------------------------------------------------------------- */}
        <div className="rounded-2xl border border-white/10 bg-[#141414] p-8 flex flex-col">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-1">Teams</h3>
            <p className="text-sm text-white/40">For classrooms & teams</p>
          </div>

          <div className="mb-6">
            <span className="text-5xl font-bold text-white">$10</span>
            <span className="text-sm text-white/40 ml-1">/seat/mo</span>
            <div className="text-sm text-white/40 mt-1">minimum 5 seats</div>
          </div>

          <ul className="space-y-3 mb-8 flex-1">
            {TEAM_FEATURES.map((f) => (
              <li
                key={f.text}
                className="flex items-start gap-2.5 text-sm text-white/70"
              >
                <Check className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0" />
                <span>{f.text}</span>
              </li>
            ))}
          </ul>

          <a
            href="mailto:team@kairoslearn.com?subject=Teams%20Plan%20Inquiry"
            className="block w-full py-3 rounded-xl text-sm font-semibold text-center transition-all border border-white/10 bg-transparent text-white/60 hover:bg-white/10 hover:text-white"
          >
            Contact Us
          </a>
        </div>
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-xs text-white/30">
        <span className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5" />
          Cancel anytime
        </span>
        <span className="flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5" />
          7-day money-back guarantee
        </span>
        <span className="flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5" />
          Secure payments via Stripe
        </span>
      </div>
    </div>
  );
}
