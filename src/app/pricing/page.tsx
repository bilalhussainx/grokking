// src/app/pricing/page.tsx
import type { Metadata } from "next";
import PricingCards from "@/components/pricing/PricingCards";

export const metadata: Metadata = {
  title: "Pricing - Kairos.ai | Learn Smarter with AI",
  description:
    "Start free with 28 courses and 300 AI credits. Upgrade to Pro for $10/month to unlock all 69 courses, unlimited AI credits, and full voice coaching in 17 languages.",
  openGraph: {
    title: "Pricing - Kairos.ai",
    description:
      "AI-powered learning for $10/month. 69 courses, unlimited AI credits, voice coaching in 17 languages.",
    type: "website",
  },
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
            <span className="text-white">
              Simple Pricing
            </span>
          </h1>
          <p className="text-lg text-white/50 leading-relaxed">
            Start free with 28 courses and 300 AI credits.
            <br className="hidden sm:block" />
            Upgrade when you need full access to all 69 courses and unlimited AI.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-4 pb-20">
        <PricingCards />
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 pb-24">
        <h2 className="text-2xl font-bold text-white text-center mb-10">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {FAQ_ITEMS.map(({ q, a }) => (
            <details
              key={q}
              className="group rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl overflow-hidden"
            >
              <summary className="cursor-pointer px-6 py-4 text-sm font-medium text-white/80 hover:text-white transition-colors list-none flex items-center justify-between">
                {q}
                <span className="text-white/30 group-open:rotate-45 transition-transform text-lg">
                  +
                </span>
              </summary>
              <div className="px-6 pb-4 text-sm text-white/50 leading-relaxed">
                {a}
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

const FAQ_ITEMS = [
  {
    q: "What's included in the Free plan?",
    a: "You get access to 28 courses covering CS fundamentals, introductory finance, and language basics. You also receive 300 AI credits per month for the AI Coach, hints, and grading. Basic voice coaching is included.",
  },
  {
    q: "What does Pro unlock?",
    a: "Pro gives you access to all 69 courses (including advanced CS, system design, interview prep, and all religious studies/philosophy courses), unlimited AI credits, full voice coaching in 17 languages, mock interview practice, and priority support.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. You can cancel your Pro subscription at any time from your account settings. You'll retain access to Pro features until the end of your current billing period.",
  },
  {
    q: "Is there a free trial?",
    a: "New users get a 1-month free Pro trial on signup. After the trial ends, you can continue on the Free plan or upgrade to Pro.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards, PayPal, Apple Pay, and Google Pay through our payment partner Paddle. Paddle also handles VAT/sales tax automatically based on your location.",
  },
  {
    q: "Do you offer team or classroom pricing?",
    a: "Yes! Our Teams plan is $10/seat/month (minimum 5 seats) and includes classroom management, student progress dashboards, homework assignment, and admin controls. Contact us for details.",
  },
  {
    q: "What are AI credits?",
    a: "AI credits are used when you interact with the AI Coach (hints, code grading, voice sessions, mock interviews). Free users get 300/month. Pro users get unlimited credits.",
  },
];
