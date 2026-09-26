import { PRICING, proMonthlyLabel, proYearlyLabel } from "@/lib/pricing";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Minus } from "lucide-react";
import MarketingShell from "@/components/marketing/MarketingShell";
import { FinalCTA } from "@/components/marketing/MarketingSections";
import ProCheckoutButton from "@/components/marketing/ProCheckoutButton";

export const metadata: Metadata = {
  title: "Pricing — KairosLearn",
  description:
    `Free forever for the first three schools. Upgrade to Pro at ${proMonthlyLabel()} (or ${proYearlyLabel()}) for unlimited everything — schools, essays, voice sessions, languages, mock interviews, and the full FAFSA + aid comparator.`,
};

type Row = {
  feature: string;
  free: string | true | false;
  pro: string | true | false;
};

const COMPARE: Row[] = [
  { feature: "School list", free: "3 schools", pro: "Unlimited" },
  { feature: "Essay drafts", free: "1", pro: "Unlimited" },
  { feature: "Voice sessions", free: "3 / month", pro: "Unlimited" },
  { feature: "Languages", free: "English only", pro: "Hindi, Punjabi, French, Spanish + 14 more" },
  { feature: "Interview prep", free: "1 mock", pro: "Unlimited" },
  { feature: "Financial aid", free: "Basic", pro: "Full FAFSA + aid comparator" },
  { feature: "Application tracker", free: true, pro: true },
  { feature: "Activities optimizer", free: true, pro: true },
  { feature: "Coach Kairos chat", free: true, pro: true },
  { feature: "Family Mode (parent voice)", free: false, pro: true },
  { feature: "Reuse detector across supplements", free: false, pro: true },
  { feature: "Translate-for-parent (any document)", free: false, pro: true },
  { feature: "Priority support", free: false, pro: true },
];

function Cell({ value }: { value: string | true | false }) {
  if (value === true) {
    return (
      <span style={{ color: "#d4a84b", display: "inline-flex", alignItems: "center" }}>
        <Check size={16} strokeWidth={2.2} />
      </span>
    );
  }
  if (value === false) {
    return (
      <span style={{ color: "rgba(242,237,227,.30)", display: "inline-flex", alignItems: "center" }}>
        <Minus size={16} strokeWidth={2} />
      </span>
    );
  }
  return <span style={{ color: "#f2ede3", fontSize: 13 }}>{value}</span>;
}

export default function PricingPage() {
  return (
    <MarketingShell>
      <section className="kl-mkt-hero">
        <div className="kl-mkt-eyebrow">
          <span className="rule" /> Pricing
        </div>
        <h1 className="kl-mkt-h1">
          Free where it counts. <em>Pro</em> where it pays for itself.
        </h1>
        <p className="kl-mkt-lede">
          Three schools and one essay are enough to feel the product. The full cycle —
          unlimited schools, voice in your language, family mode, the aid comparator —
          is one upgrade away.
        </p>
      </section>

      {/* Subsidized banner — keep the route, restyle */}
      <section
        className="kl-mkt-section"
        style={{ paddingTop: 0, paddingBottom: 28 }}
      >
        <Link
          href="/pricing/subsidized"
          style={{
            display: "block",
            padding: "16px 22px",
            borderRadius: 12,
            border: "1px solid rgba(212,175,55,.32)",
            background: "rgba(212,175,55,.05)",
            color: "#d4a84b",
            textDecoration: "none",
            fontSize: 13.5,
            textAlign: "center",
            transition: "background .15s ease",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          First-generation or low-income student?{" "}
          <strong style={{ textDecoration: "underline", textUnderlineOffset: 2 }}>
            You may qualify for free Pro access →
          </strong>
        </Link>
      </section>

      {/* Tier cards */}
      <section className="kl-mkt-section" style={{ paddingTop: 0 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 18,
            maxWidth: 880,
            margin: "0 auto",
          }}
        >
          {/* Free */}
          <div
            style={{
              padding: "32px 30px",
              borderRadius: 18,
              border: "1px solid rgba(255,255,255,.10)",
              background: "rgba(255,255,255,.02)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: ".22em",
                  textTransform: "uppercase",
                  color: "rgba(242,237,227,.55)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                }}
              >
                Free
              </div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontSize: 44,
                  lineHeight: 1,
                  color: "#f2ede3",
                  marginTop: 12,
                  letterSpacing: "-.02em",
                }}
              >
                $0{" "}
                <span style={{ fontSize: 14, color: "rgba(242,237,227,.45)" }}>forever</span>
              </div>
              <p
                style={{
                  marginTop: 12,
                  fontSize: 13.5,
                  color: "rgba(242,237,227,.62)",
                  lineHeight: 1.6,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                For students testing whether the product fits before committing. Real
                feature access — just capped.
              </p>
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 10,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13.5,
                color: "rgba(242,237,227,.78)",
              }}
            >
              {[
                "3 schools",
                "1 essay draft",
                "3 voice sessions / month",
                "English only",
                "1 mock interview",
                "Basic financial-aid view",
              ].map((f) => (
                <li
                  key={f}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <Check size={14} style={{ color: "rgba(242,237,227,.55)", flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/intake"
              className="kl-mkt-cta-ghost"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "13px 20px",
                border: "1px solid rgba(255,255,255,.18)",
                borderRadius: 10,
                marginTop: "auto",
              }}
            >
              Start free
            </Link>
          </div>

          {/* Pro */}
          <div
            style={{
              padding: "32px 30px",
              borderRadius: 18,
              border: "1px solid rgba(212,175,55,.45)",
              background:
                "linear-gradient(180deg, rgba(212,175,55,.10), rgba(212,175,55,.02)), rgba(5,8,13,.6)",
              boxShadow: "0 24px 60px -22px rgba(212,175,55,.30)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              position: "relative",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: 16,
                right: 18,
                fontSize: 9,
                letterSpacing: ".22em",
                textTransform: "uppercase",
                color: "#05080d",
                background: "#d4af37",
                padding: "4px 10px",
                borderRadius: 999,
                fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Recommended
            </span>
            <div>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: ".22em",
                  textTransform: "uppercase",
                  color: "#d4a84b",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                }}
              >
                Pro
              </div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontSize: 44,
                  lineHeight: 1,
                  color: "#f2ede3",
                  marginTop: 12,
                  letterSpacing: "-.02em",
                }}
              >
                ${PRICING.pro.monthlyUsd}{" "}
                <span style={{ fontSize: 14, color: "rgba(242,237,227,.55)" }}>/ month</span>
              </div>
              <p
                style={{
                  marginTop: 12,
                  fontSize: 13.5,
                  color: "rgba(242,237,227,.7)",
                  lineHeight: 1.6,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                For the full cycle. Less than one hour with a private counselor — for the
                whole senior year.
              </p>
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 10,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13.5,
                color: "#f2ede3",
              }}
            >
              {[
                "Unlimited schools",
                "Unlimited essay drafts + supplements",
                "Unlimited voice sessions",
                "18 languages incl. Hindi, Punjabi, French, Spanish",
                "Unlimited mock interviews",
                "Full FAFSA + aid comparator",
                "Family Mode (parent voice)",
                "Translate-for-parent docs",
              ].map((f) => (
                <li
                  key={f}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <Check size={14} style={{ color: "#d4a84b", flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>
            <ProCheckoutButton
              className="kl-mkt-cta-gold"
              // Override layout to fill the card width.
            >
              Start Pro <ArrowRight size={14} />
            </ProCheckoutButton>
            <p
              style={{
                fontSize: 11.5,
                color: "rgba(242,237,227,.45)",
                margin: 0,
                textAlign: "center",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Free 7-day trial. No card required.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="kl-mkt-section" style={{ paddingTop: 36 }}>
        <div className="kl-mkt-eyebrow">
          <span className="rule" /> Side-by-side
        </div>
        <h2 className="kl-mkt-h2">
          What you get on <em>each tier.</em>
        </h2>
        <div
          style={{
            marginTop: 28,
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: 14,
            overflow: "hidden",
            background: "rgba(255,255,255,.02)",
          }}
        >
          {/* Header row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(200px, 1.5fr) 1fr 1fr",
              alignItems: "center",
              padding: "14px 22px",
              borderBottom: "1px solid rgba(255,255,255,.06)",
              fontSize: 10.5,
              letterSpacing: ".22em",
              textTransform: "uppercase",
              color: "rgba(242,237,227,.45)",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
            }}
          >
            <span>Feature</span>
            <span>Free</span>
            <span style={{ color: "#d4a84b" }}>Pro</span>
          </div>
          {COMPARE.map((row, i) => (
            <div
              key={row.feature}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(200px, 1.5fr) 1fr 1fr",
                alignItems: "center",
                padding: "14px 22px",
                borderBottom: i === COMPARE.length - 1 ? "none" : "1px solid rgba(255,255,255,.04)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13.5,
                color: "rgba(242,237,227,.78)",
              }}
            >
              <span>{row.feature}</span>
              <Cell value={row.free} />
              <Cell value={row.pro} />
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="kl-mkt-section" style={{ paddingTop: 0 }}>
        <div className="kl-mkt-eyebrow">
          <span className="rule" /> Frequently asked
        </div>
        <h2 className="kl-mkt-h2">Quick answers.</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24 }}>
          {FAQ_ITEMS.map(({ q, a }) => (
            <details
              key={q}
              style={{
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,.08)",
                background: "rgba(255,255,255,.02)",
                overflow: "hidden",
              }}
            >
              <summary
                style={{
                  cursor: "pointer",
                  listStyle: "none",
                  padding: "16px 22px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#f2ede3",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {q}
                <span style={{ color: "rgba(242,237,227,.40)", fontSize: 18 }}>+</span>
              </summary>
              <div
                style={{
                  padding: "0 22px 18px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13.5,
                  color: "rgba(242,237,227,.62)",
                  lineHeight: 1.65,
                }}
              >
                {a}
              </div>
            </details>
          ))}
        </div>
      </section>

      <FinalCTA
        headline={`Try Pro for <em>${PRICING.pro.trialDays} days</em>, free.`}
        body="If it's not pulling its weight, cancel from settings. We don't email-trap you to keep the subscription."
        primaryLabel="Start Pro free"
      />
    </MarketingShell>
  );
}

const FAQ_ITEMS = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from your account settings — you keep Pro access until the end of the billing period. No phone calls, no retention emails.",
  },
  {
    q: "Is there really a free trial?",
    a: `Yes. New users get a free 7-day Pro trial — no card required. After day 7, you'll be asked to subscribe at ${proMonthlyLabel()} (or ${proYearlyLabel()}) to keep Pro access. If you don't subscribe, your account stays usable on the free tier.`,
  },
  {
    q: `Why $${PRICING.pro.monthlyUsd} instead of free?`,
    a: `Voice sessions cost real money to run (Deepgram + Sarvam STT/TTS, OpenRouter LLM tokens). ${proMonthlyLabel()} covers infrastructure plus the team building this. We keep a meaningful free tier so cost isn't the barrier — but the model is built around the Pro flow.`,
  },
  {
    q: "Do you offer free Pro for low-income or first-gen students?",
    a: "Yes. See the subsidized-access link near the top of the page — if you qualify, Pro is free for the full senior year.",
  },
  {
    q: "What payment methods?",
    a: "All major credit + debit cards, Apple Pay, Google Pay, and Link through Stripe. Stripe handles VAT/sales tax automatically.",
  },
  {
    q: "Refund policy?",
    a: "Cancel within 14 days of a charge for a full refund — no questions. After that, the standard rule is no mid-cycle refund, but write us if something is wrong and we'll figure it out.",
  },
];
