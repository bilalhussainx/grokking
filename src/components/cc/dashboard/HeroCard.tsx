// Hero card — gold-edged "next step" block at the top of the dashboard.
// Ports docs/superpowers/designs/handoff/src/dashboard.jsx <HeroCard>.
//
// `tone="rose"` for urgent overrides (deadline within 14 days). The
// urgency pill on the right shows the day countdown when present.
"use client";

import { ArrowRight, Sparkles, AlertTriangle } from "lucide-react";
import Link from "next/link";
import type { Hero } from "@/app/cc/dashboard/variants";

export default function HeroCard({
  hero,
  onPrimaryClick,
  onCoachClick,
}: {
  hero: Hero;
  // Optional click handler for the primary CTA. If omitted, falls through
  // to a Next.js Link with hero.ctaHref. Used for the "open coach in place"
  // path so we can intercept coach=open hrefs.
  onPrimaryClick?: () => void;
  // Optional click handler for the secondary "Talk to Coach Kairos" button.
  // When omitted, the button is hidden — keeps the hero clean for variants
  // where the coach handoff isn't appropriate.
  onCoachClick?: () => void;
}) {
  const isRose = hero.ctaTone === "rose";
  const primaryStyle: React.CSSProperties = {
    border: "none", cursor: "pointer",
    padding: "11px 18px", borderRadius: 10,
    background: isRose ? "#f87171" : "#d4af37",
    color: "#05080d", fontWeight: 600, fontSize: 13, letterSpacing: ".02em",
    fontFamily: "'DM Sans', sans-serif",
    display: "inline-flex", alignItems: "center", gap: 8,
    boxShadow: isRose
      ? "0 8px 22px -8px rgba(239,68,68,.5)"
      : "0 8px 22px -8px rgba(212,175,55,.5)",
    textDecoration: "none",
  };
  return (
    <section
      aria-labelledby="hero-headline"
      className="relative overflow-hidden"
      style={{
        padding: "24px 28px 22px",
        borderRadius: 18,
        border: "1px solid " + (isRose ? "rgba(239,68,68,.40)" : "rgba(212,175,55,.40)"),
        background:
          "linear-gradient(180deg, " +
          (isRose ? "rgba(239,68,68,.08)" : "rgba(212,175,55,.08)") +
          ", rgba(255,255,255,.01))",
        boxShadow: isRose
          ? "0 0 0 1px rgba(239,68,68,.12), 0 18px 40px -16px rgba(239,68,68,.30), inset 0 1px 0 rgba(255,255,255,.05)"
          : "0 0 0 1px rgba(212,175,55,.12), 0 18px 40px -16px rgba(212,175,55,.40), inset 0 1px 0 rgba(255,255,255,.05)",
      }}
    >
      {/* Faint diagonal grain — pure CSS, no images. */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(800px 200px at 80% 0%, " +
            (isRose ? "rgba(239,68,68,.08)" : "rgba(212,175,55,.08)") +
            ", transparent 60%)",
        }}
      />
      <div
        className="relative flex justify-between items-start"
        style={{ gap: 16 }}
      >
        <div className="flex-1 min-w-0">
          <div
            className="inline-flex items-center uppercase"
            style={{
              gap: 8, fontSize: 10.5,
              color: isRose ? "#fca5a5" : "#d4a84b",
              letterSpacing: ".28em",
              fontFamily: "'DM Sans', sans-serif",
              marginBottom: 14,
            }}
          >
            {isRose ? <AlertTriangle size={11} /> : <Sparkles size={11} />}
            {hero.eyebrow}
          </div>
          <h2
            id="hero-headline"
            className="m-0"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 400, fontSize: 30, lineHeight: 1.18,
              letterSpacing: "-.01em",
              color: "#f2ede3", maxWidth: 680,
            }}
            // Headline contains <em> tags from variants.ts (no user input,
            // hard-coded). We render as HTML to keep the gold italic.
            dangerouslySetInnerHTML={{ __html: hero.headline }}
          />
          {hero.body && (
            <p
              style={{
                marginTop: 14, fontSize: 13, lineHeight: 1.6,
                color: "rgba(255,255,255,.65)",
                fontFamily: "'DM Sans', sans-serif",
                maxWidth: 620,
              }}
            >
              {hero.body}
            </p>
          )}
          <div
            className="flex items-center flex-wrap"
            style={{ marginTop: 18, gap: 14 }}
          >
            {onPrimaryClick ? (
              <button type="button" onClick={onPrimaryClick} style={primaryStyle}>
                {hero.ctaLabel} <ArrowRight size={14} />
              </button>
            ) : (
              <Link href={hero.ctaHref} style={primaryStyle}>
                {hero.ctaLabel} <ArrowRight size={14} />
              </Link>
            )}
            {onCoachClick && (
              <button
                type="button"
                onClick={onCoachClick}
                style={{
                  border: "1px solid rgba(255,255,255,.15)",
                  background: "transparent",
                  color: "rgba(255,255,255,.65)",
                  cursor: "pointer",
                  padding: "11px 14px", borderRadius: 10, fontSize: 12.5,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Talk to Coach Kairos
              </button>
            )}
          </div>
        </div>
        {hero.urgency && (
          <div
            className="text-center shrink-0"
            style={{
              padding: "14px 18px", borderRadius: 14,
              background: "rgba(239,68,68,.12)",
              border: "1px solid rgba(239,68,68,.35)",
              minWidth: 108,
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 34, fontWeight: 500, color: "#fca5a5",
                lineHeight: 1, letterSpacing: "-.02em",
              }}
            >
              {hero.urgency.value}
            </div>
            <div
              className="uppercase"
              style={{
                fontSize: 9.5, letterSpacing: ".18em",
                color: "#fca5a5", marginTop: 6,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {hero.urgency.label}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
