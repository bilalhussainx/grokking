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
            Essays · Activities · School List · Interviews
          </p>
          <h1 className="text-5xl lg:text-6xl font-serif text-white leading-[1.1] mb-6">
            Your college app,<br />
            <em className="text-[#D4AF37]">powered by AI.</em>
          </h1>
          <p className="text-lg text-white/70 font-light mb-6 max-w-lg">
            Try it right now — no signup. Ask about your schools, and I&apos;ll tell
            you honestly where you stand.
          </p>
          <p className="text-sm text-white/50">
            Free to try — no signup. Used by students across the 2025–26 cycle.
          </p>
        </div>

        <div className="w-full">
          <HeroCoachChat />
        </div>
      </div>
    </section>
  );
}
