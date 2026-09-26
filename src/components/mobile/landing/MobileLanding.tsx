"use client";
import { PRICING, proMonthlyLabel } from "@/lib/pricing";
// Mobile-native landing page (single-column, 393×852 reference). Source:
// docs/superpowers/designs/mobile/landing/landing.html. Per Plan T8, the
// 8 handoff sections are kept as internal components in a single file —
// they're mostly static markup and splitting into 8 files would dilute
// rather than help. The MobileLandingMenu overlay lives in its own file
// because it has independent open/close state.
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, ArrowRight, Sparkles, MessageSquare, Globe2, Heart, Compass } from "lucide-react";
import MobileLandingMenu from "./MobileLandingMenu";
import { COACH_LANGUAGES } from "@/lib/cc/coach-languages";

const PIPELINE = [
  { n: "01", title: "Intake in your language", body: `Choose from ${COACH_LANGUAGES.length} configured language options, including Urdu, Hindi, Spanish, and English. Coach Kairos carries your profile forward.` },
  { n: "02", title: "Build your school list", body: "Need-blind for internationals, need-aware that meets full need — surfaced by name." },
  { n: "03", title: "Draft essays with the coach", body: "Common App PS + supplements with prompt-aware feedback your counselor would give." },
  { n: "04", title: "Track every deadline", body: "EA, ED, REA, RD, FAFSA, CSS — one surface, multilingual reminders." },
  { n: "05", title: "Compare offers in May", body: "Side-by-side aid letters in USD or your home currency. Negotiation drafts for full-need families." },
];

// Testimonials intentionally empty until verified beta-user quotes are
// collected — previous placeholder entries claimed specific admissions
// (MIT, UMich) we cannot back with screenshots. See audit 2026-05-03.
// The Testimonials section below is gated so it only renders when this
// array has entries; once real quotes are added, the section comes back.
const TESTIMONIALS: { quote: string; author: string; location: string }[] = [];

export default function MobileLanding() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="relative overflow-x-hidden"
      style={{
        background: "#05080d",
        color: "#f2ede3",
        fontFamily: "'DM Sans', sans-serif",
        minHeight: "100vh",
      }}
    >
      {/* ============== Hero ============== */}
      <section className="relative px-5 pt-6 pb-12 mobile-safe-top">
        {/* Top nav row */}
        <div className="flex items-center justify-between mb-12">
          <span className="text-[15px] tracking-tight font-semibold">
            <span style={{ color: "#f2ede3" }}>Kairos</span>
            <span
              style={{
                color: "#d4a84b",
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 400,
              }}
            >
              Learn
            </span>
          </span>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            style={{ width: 36, height: 36 }}
            className="flex items-center justify-center"
          >
            <Menu className="w-5 h-5 text-white/80" />
          </button>
        </div>

        {/* Faint gold radial backdrop */}
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            top: 40,
            right: -100,
            width: 320,
            height: 320,
            background:
              "radial-gradient(circle, rgba(212,175,55,.08) 0%, transparent 60%)",
            filter: "blur(40px)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <p
            className="uppercase mb-4"
            style={{
              fontSize: 10.5,
              letterSpacing: "0.28em",
              color: "#d4a84b",
            }}
          >
            AI-Powered College Admissions Counseling
          </p>
          <p
            className="mb-3 leading-snug"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: 22,
              color: "#d4a84b",
              letterSpacing: "-0.005em",
            }}
          >
            Your shot at college shouldn&apos;t depend on your zip code.
          </p>
          <h1
            className="mb-5 leading-[1.08]"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: 38,
              color: "#f2ede3",
              letterSpacing: "-0.01em",
            }}
          >
            College guidance that starts{" "}
            <em style={{ color: "#d4a84b", fontStyle: "italic" }}>free</em>{" "}
            and stays with you through every deadline.
          </h1>
          <p
            className="mb-8 leading-relaxed"
            style={{
              fontSize: 14,
              color: "rgba(242,237,227,.65)",
              maxWidth: 340,
            }}
          >
            KairosLearn keeps your essays, school list, and financial-aid context
            in one place, with guidance available beyond counselor office hours.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/signup"
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl text-[14px] font-semibold"
              style={{
                background: "#d4af37",
                color: "#05080d",
                boxShadow: "0 8px 22px -8px rgba(212,175,55,.5)",
              }}
            >
              Start for free — no credit card
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/?coach=open"
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl text-[14px] font-semibold border"
              style={{
                color: "rgba(242,237,227,.85)",
                borderColor: "rgba(255,255,255,.15)",
              }}
            >
              <MessageSquare className="w-4 h-4" />
              Talk to Coach Kairos
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ============== Forgotten Student ============== */}
      <section className="px-5 py-12">
        <p
          className="uppercase mb-4"
          style={{
            fontSize: 10.5,
            letterSpacing: "0.28em",
            color: "#d4a84b",
          }}
        >
          Built for the student you forgot
        </p>
        <h2
          className="mb-8 leading-[1.15]"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 400,
            fontSize: 32,
            color: "#f2ede3",
          }}
        >
          Three students every other platform under-serves.
        </h2>
        <div className="space-y-3">
          {[
            {
              icon: <Globe2 className="w-5 h-5" style={{ color: "#d4a84b" }} />,
              title: "International students",
              body: "Home transcripts converted to US GPA (e.g. FSc 87% → 3.48). CSS Profile asset reporting for international families (property, gold, agricultural income). Need-blind canonical 8 surfaced by name.",
            },
            {
              icon: <Heart className="w-5 h-5" style={{ color: "#d4a84b" }} />,
              title: "First-gen students",
              body: "QuestBridge, Posse, College Advising Corps named proactively. Fee waivers explained. FAFSA priority deadlines tracked. Never assume your parents read English.",
            },
            {
              icon: <Compass className="w-5 h-5" style={{ color: "#d4a84b" }} />,
              title: "Under-resourced students",
              body: "Your 1:400 public-school counselor stays in the loop via weekly digest emails — no logins required. Free Pro for Pell-eligible students.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl p-5"
              style={{
                background: "rgba(255,255,255,.025)",
                border: "1px solid rgba(255,255,255,.06)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                {card.icon}
                <h3
                  className="text-[16px] font-semibold"
                  style={{ color: "#f2ede3" }}
                >
                  {card.title}
                </h3>
              </div>
              <p
                className="text-[13px] leading-relaxed"
                style={{ color: "rgba(242,237,227,.65)" }}
              >
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============== Pipeline ============== */}
      <section className="px-5 py-12">
        <p
          className="uppercase mb-4"
          style={{
            fontSize: 10.5,
            letterSpacing: "0.28em",
            color: "#d4a84b",
          }}
        >
          From day one to deposit
        </p>
        <h2
          className="mb-3 leading-[1.15]"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 400,
            fontSize: 32,
            color: "#f2ede3",
          }}
        >
          Everything you need. From first search to final submission.
        </h2>
        <p
          className="mb-10 leading-relaxed"
          style={{
            fontSize: 14,
            color: "rgba(242,237,227,.65)",
          }}
        >
          One counselor. Every step of the application.
        </p>
        <div className="relative">
          {/* Vertical connector */}
          <div
            aria-hidden
            className="absolute"
            style={{
              left: 27,
              top: 28,
              bottom: 28,
              width: 1,
              background: "rgba(212,175,55,.25)",
            }}
          />
          {PIPELINE.map((step) => (
            <div key={step.n} className="relative flex gap-5 pb-8 last:pb-0">
              <div
                className="relative shrink-0 flex items-center justify-center rounded-full"
                style={{
                  width: 56,
                  height: 56,
                  border: "1px solid rgba(212,175,55,.40)",
                  background: "rgba(212,175,55,.08)",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 14,
                  color: "#d4a84b",
                  fontWeight: 500,
                }}
              >
                {step.n}
              </div>
              <div className="flex-1 pt-1.5 min-w-0">
                <h3
                  className="text-[16px] font-semibold mb-1"
                  style={{ color: "#f2ede3" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-[13px] leading-relaxed"
                  style={{ color: "rgba(242,237,227,.6)" }}
                >
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============== Testimonials ============== */}
      {/* Gated on TESTIMONIALS having entries — empty until verified beta
          quotes are added. See array declaration above for context. */}
      {TESTIMONIALS.length > 0 && (
      <section className="py-12 px-5" style={{ background: "#0c1120" }}>
        <p
          className="uppercase mb-4"
          style={{
            fontSize: 10.5,
            letterSpacing: "0.28em",
            color: "#d4a84b",
          }}
        >
          From the families
        </p>
        <h2
          className="mb-8 leading-[1.15]"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 400,
            fontSize: 30,
            color: "#f2ede3",
          }}
        >
          The coach who shows up at 11pm.
        </h2>
        <div className="space-y-4">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="rounded-2xl p-6"
              style={{
                background: "rgba(255,255,255,.04)",
                border: "1px solid rgba(255,255,255,.08)",
              }}
            >
              <Sparkles className="w-4 h-4 mb-3" style={{ color: "#d4a84b" }} />
              <p
                className="text-[15px] leading-relaxed mb-4 italic"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "#f2ede3",
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <p
                className="text-[12px]"
                style={{ color: "rgba(242,237,227,.55)" }}
              >
                <span style={{ color: "#f2ede3", fontWeight: 500 }}>{t.author}</span>
                {" — "}
                {t.location}
              </p>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* ============== Pricing ============== */}
      <section className="px-5 py-12">
        <p
          className="uppercase mb-4 text-center"
          style={{
            fontSize: 10.5,
            letterSpacing: "0.28em",
            color: "#d4a84b",
          }}
        >
          Pricing
        </p>
        <h2
          className="mb-10 text-center leading-[1.15]"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 400,
            fontSize: 32,
            color: "#f2ede3",
          }}
        >
          {proMonthlyLabel()}, or zero if you qualify.
        </h2>
        <div className="space-y-4">
          {/* KairosLearn — recommended */}
          <div className="relative">
            <span
              className="absolute uppercase px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider z-10"
              style={{
                top: -12,
                left: "50%",
                transform: "translateX(-50%)",
                background: "#d4af37",
                color: "#05080d",
              }}
            >
              Recommended
            </span>
            <div
              className="rounded-2xl p-6"
              style={{
                border: "1px solid rgba(212,175,55,.40)",
                background:
                  "linear-gradient(180deg, rgba(212,175,55,.06), rgba(255,255,255,.01))",
              }}
            >
              <h3
                className="text-[20px] font-semibold mb-1"
                style={{ color: "#f2ede3" }}
              >
                KairosLearn Pro
              </h3>
              <p
                className="text-[12px] mb-4"
                style={{ color: "rgba(242,237,227,.55)" }}
              >
                Free for Pell-eligible students.
              </p>
              <p className="mb-5">
                <span
                  className="text-[36px] font-semibold"
                  style={{
                    color: "#d4af37",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  ${PRICING.pro.monthlyUsd}
                </span>
                <span
                  className="text-[13px] ml-1"
                  style={{ color: "rgba(242,237,227,.55)" }}
                >
                  /month
                </span>
              </p>
              <ul
                className="text-[13px] leading-relaxed mb-5 space-y-1.5"
                style={{ color: "rgba(242,237,227,.75)" }}
              >
                <li>· {COACH_LANGUAGES.length} configured language options — Urdu, Hindi, Spanish, English…</li>
                <li>· Family Mode for non-English-speaking parents</li>
                <li>· Need-blind and meets-need school filters</li>
                <li>· Common App essay studio with prompt-aware feedback</li>
                <li>· Multilingual deadline reminders</li>
              </ul>
              <Link
                href="/signup"
                className="block text-center py-3 rounded-xl text-[14px] font-semibold"
                style={{ background: "#d4af37", color: "#05080d" }}
              >
                Start free
              </Link>
            </div>
          </div>

          {/* Private counselor — anti-comparison */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,.025)",
              border: "1px solid rgba(255,255,255,.06)",
            }}
          >
            <h3
              className="text-[20px] font-semibold mb-1"
              style={{ color: "rgba(242,237,227,.55)" }}
            >
              Private counselor
            </h3>
            <p
              className="text-[12px] mb-4"
              style={{ color: "rgba(242,237,227,.4)" }}
            >
              Crimson, Empowerly, IvyWise…
            </p>
            <p className="mb-5">
              <span
                className="text-[28px] font-semibold line-through"
                style={{
                  color: "rgba(242,237,227,.4)",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                $8,000+
              </span>
              <span
                className="text-[12px] ml-2"
                style={{ color: "rgba(242,237,227,.4)" }}
              >
                /year
              </span>
            </p>
            <ul
              className="text-[13px] leading-relaxed space-y-1.5"
              style={{ color: "rgba(242,237,227,.5)" }}
            >
              <li>· English only</li>
              <li>· Counselor on Christmas vacation</li>
              <li>· Aspirational-Ivy framing only</li>
              <li>· No parent surface in your language</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ============== Final CTA ============== */}
      <section className="px-5 py-16 text-center">
        <h2
          className="mb-6 leading-[1.15]"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 400,
            fontSize: 36,
            color: "#f2ede3",
          }}
        >
          Your family deserves a counselor that{" "}
          <em style={{ color: "#d4a84b", fontStyle: "italic" }}>shows up</em>.
        </h2>
        <Link
          href="/signup"
          className="inline-flex items-center justify-center gap-2 py-4 px-8 rounded-xl text-[14px] font-semibold"
          style={{
            background: "#d4af37",
            color: "#05080d",
            boxShadow: "0 8px 22px -8px rgba(212,175,55,.5)",
          }}
        >
          Start your application
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* ============== Footer ============== */}
      <footer
        className="px-5 py-10 mobile-safe-bottom"
        style={{ borderTop: "1px solid rgba(255,255,255,.05)" }}
      >
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <p
              className="uppercase mb-3"
              style={{
                fontSize: 10,
                letterSpacing: "0.18em",
                color: "rgba(242,237,227,.45)",
              }}
            >
              Product
            </p>
            <ul
              className="space-y-2 text-[13px]"
              style={{ color: "rgba(242,237,227,.7)" }}
            >
              <li>
                <Link href="/?coach=open">Coach Kairos</Link>
              </li>
              <li>
                <Link href="/cc/essays">Essay studio</Link>
              </li>
              <li>
                <Link href="/schools">School list</Link>
              </li>
              <li>
                <Link href="/pricing">Pricing</Link>
              </li>
            </ul>
          </div>
          <div>
            <p
              className="uppercase mb-3"
              style={{
                fontSize: 10,
                letterSpacing: "0.18em",
                color: "rgba(242,237,227,.45)",
              }}
            >
              Company
            </p>
            <ul
              className="space-y-2 text-[13px]"
              style={{ color: "rgba(242,237,227,.7)" }}
            >
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/stories">Stories</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy</Link>
              </li>
              <li>
                <Link href="/terms">Terms</Link>
              </li>
            </ul>
          </div>
        </div>
        <p
          className="text-[11px]"
          style={{ color: "rgba(242,237,227,.35)" }}
        >
          © 2026 KairosLearn · For families everywhere.
        </p>
      </footer>

      <MobileLandingMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
