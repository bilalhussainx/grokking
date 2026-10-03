import { COACH_LANGUAGE_COUNT } from "@/lib/coach-language-claim";
import { PRICING, PRO_FAIR_USE, TRIAL_TERMS, proMonthlyLabel, proYearlyLabel, yearlySavingsPct, yearlyCheckoutConfigured } from "@/lib/pricing";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowRight, Check, Minus } from "lucide-react";
import MarketingShell from "@/components/marketing/MarketingShell";
import { FinalCTA } from "@/components/marketing/MarketingSections";
import ProCheckoutButton from "@/components/marketing/ProCheckoutButton";

export const metadata = pageMetadata({
  title: "Pricing",
  description: `Free gives you ${PRICING.free.signupCredits} AI credits, once, to try Coach Kairos. Pro is ${proMonthlyLabel()} or ${proYearlyLabel()}, with fair use of ${PRO_FAIR_USE.coachMessagesPerDay} coach messages and ${PRO_FAIR_USE.voiceMinutesPerDay} voice minutes a day. Every new account starts with a ${PRICING.pro.trialDays}-day Pro trial, no card.`,
  path: "/pricing",
});

type Row = {
  feature: string;
  free: string | true | false;
  pro: string | true | false;
};

const COMPARE: Row[] = [
  { feature: "AI credits", free: `${PRICING.free.signupCredits}, once (no renewal)`, pro: "Not spent on Pro" },
  {
    feature: "Coach messages and voice",
    free: "Paid for with credits",
    pro: `Fair use: ${PRO_FAIR_USE.coachMessagesPerDay} messages and ${PRO_FAIR_USE.voiceMinutesPerDay} voice min a day`,
  },
  { feature: "Languages", free: `${COACH_LANGUAGE_COUNT} languages`, pro: `${COACH_LANGUAGE_COUNT} languages` },
  { feature: "Financial aid", free: "Basic", pro: "Full FAFSA + aid comparator" },
  { feature: "Application tracker", free: true, pro: true },
  { feature: "Activities optimizer", free: true, pro: true },
  { feature: "Coach Kairos chat", free: true, pro: true },
  { feature: "Family Mode (parent voice)", free: false, pro: true },
  { feature: "Reuse detector across supplements", free: false, pro: true },
  { feature: "Translate-for-parent (any document)", free: false, pro: true },
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
          Every new account starts with a {PRICING.pro.trialDays}-day Pro trial, no card. After
          that, Free keeps {PRICING.free.signupCredits} AI credits to try the coach, and Pro is{" "}
          {proMonthlyLabel()} or {proYearlyLabel()} when you want the full cycle.
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
                {PRICING.free.signupCredits}{" "}
                <span style={{ fontSize: 14, color: "rgba(242,237,227,.45)" }}>AI credits, once</span>
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
                For students testing whether the product fits. Credits are a one-time grant and
                do not renew.
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
                `${PRICING.free.signupCredits} AI credits, once. They do not renew.`,
                "Coach Kairos chat and voice, paid for with credits",
                "Application tracker and activities optimizer",
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
            <p style={{ fontSize: 11.5, color: "rgba(242,237,227,.45)", margin: 0, textAlign: "center", fontFamily: "'DM Sans', sans-serif" }}>
              Your {PRICING.pro.trialDays}-day Pro trial starts when you sign up. No card.
            </p>
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
              <div style={{ marginTop: 6, fontSize: 13, color: "rgba(242,237,227,.7)", fontFamily: "'DM Sans', sans-serif" }}>
                or {proYearlyLabel()} — save {yearlySavingsPct()}%
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
                `Fair use: ${PRO_FAIR_USE.coachMessagesPerDay} coach messages and ${PRO_FAIR_USE.voiceMinutesPerDay} voice minutes a day`,
                "Pro usage does not spend credits",
                "Unlimited schools and essay drafts + supplements",
                `${COACH_LANGUAGE_COUNT} languages incl. Hindi, Punjabi, French, Spanish`,
                "Mock interviews",
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
              Subscribe monthly — {proMonthlyLabel()} <ArrowRight size={14} />
            </ProCheckoutButton>
            {yearlyCheckoutConfigured() && (
              <ProCheckoutButton interval="year" className="kl-mkt-cta-gold">
                Subscribe yearly — {proYearlyLabel()} <ArrowRight size={14} />
              </ProCheckoutButton>
            )}
            <p
              style={{
                fontSize: 11.5,
                color: "rgba(242,237,227,.45)",
                margin: 0,
                textAlign: "center",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {TRIAL_TERMS} Subscribing during your trial keeps the rest of it; your first
              charge comes when the trial ends.
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
        headline={`Start with a <em>${PRICING.pro.trialDays}-day Pro trial</em>, no card.`}
        body="Paying only starts if you choose to subscribe, and you can cancel from settings. We don't email-trap you to keep the subscription."
        primaryLabel="Create free account"
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
    a: `Yes. ${TRIAL_TERMS} It starts when you sign up. After day 7, subscribe at ${proMonthlyLabel()} (or ${proYearlyLabel()}) to keep Pro access; if you don't, your account stays on Free. If you subscribe with at least two days of trial left, your first charge waits until the trial ends. Otherwise you are charged when you subscribe.`,
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
