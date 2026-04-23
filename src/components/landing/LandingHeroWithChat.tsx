"use client";

// Hero variant for the guest-trial funnel: keeps the cinematic headline on the
// left and drops HeroCoachChat on the right. Falls back to a stacked layout
// on mobile.
//
// Plan: docs/superpowers/plans/2026-04-22-guest-trial-funnel.md § 8.2
import HeroCoachChat from "@/components/landing/HeroCoachChat";

export default function LandingHeroWithChat() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "#05080d" }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 20%, rgba(212, 175, 55, 0.08) 0%, transparent 50%)",
          }}
        />
      </div>
      <div className="relative z-10 container mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-left">
          <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] mb-4">
            Free to start · No credit card · Used across the 2025–26 cycle
          </p>
          <h1 className="text-5xl lg:text-6xl font-serif text-white leading-[1.1] mb-6">
            Every student deserves a counselor who{" "}
            <em className="text-[#D4AF37]">actually knows them.</em>
          </h1>
          <p className="text-lg text-white/70 font-light mb-6 max-w-xl leading-relaxed">
            Your school counselor has 400 students and 30 minutes for you.
            KairosLearn is the AI counselor who has read every essay, knows
            your GPA, understands your finances, and will take your call at
            11pm the night before a deadline.
          </p>
          <div className="flex flex-wrap gap-3 mb-5">
            <a
              href="/signup"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-[#D4AF37] text-black font-medium text-sm tracking-wide hover:bg-[#e3bf4c] transition-colors"
              style={{ boxShadow: "0 0 0 0 rgba(212,175,55,0.6)", animation: "kairos-pulse 2.4s ease-in-out infinite" }}
            >
              Start for free — no credit card
            </a>
            <a
              href="#features"
              className="inline-flex items-center px-6 py-3 rounded-lg border border-white/20 text-white/80 font-medium text-sm tracking-wide hover:border-white/40 hover:text-white transition-colors"
            >
              See how it works
            </a>
          </div>
          <p className="text-xs text-white/50 leading-relaxed">
            Trusted by students in 15+ countries including Pakistan, India,
            Nigeria, and the United States.
          </p>
        </div>

        <div className="w-full">
          <HeroCoachChat />
        </div>
      </div>
      <style jsx global>{`
        @keyframes kairos-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.55); }
          50% { box-shadow: 0 0 0 12px rgba(212, 175, 55, 0); }
        }
      `}</style>
    </section>
  );
}
