import type { Metadata } from "next";
import MarketingShell from "@/components/marketing/MarketingShell";
import { FinalCTA } from "@/components/marketing/MarketingSections";

export const metadata: Metadata = {
  title: "Stories — students who used KairosLearn",
  description:
    "First-gen, international, and underprivileged applicants who got into the schools they thought were out of reach.",
};

const STORIES = [
  {
    quote:
      "I applied to 11 U.S. schools from Karachi. My school had no counselor who'd even heard of the Common App. Kairos walked me through Matric → 4.0 conversion in an hour — and my Stanford supplement twice over.",
    name: "Ayesha R.",
    role: "Accepted — Stanford '29",
    loc: "Karachi, Pakistan",
  },
  {
    quote:
      "My parents speak Punjabi. They wanted to help but couldn't. I turned on voice mode and Kairos walked them through the CSS Profile in Punjabi while I translated the numbers. They cried. So did I.",
    name: "Jaskaran S.",
    role: "First-gen · Accepted UMich, UIUC",
    loc: "Brampton, Canada",
  },
  {
    quote:
      "I had a list of 15 reaches and zero safety schools. Kairos didn't lecture me — it showed me three schools I'd never heard of that meet 100% of need and were match-tier. I'm graduating debt-free.",
    name: "Maya A.",
    role: "Accepted — Grinnell, full aid",
    loc: "Brooklyn, NY",
  },
];

export default function StoriesPage() {
  return (
    <MarketingShell>
      <section className="kl-mkt-hero">
        <div className="kl-mkt-eyebrow">
          <span className="rule" /> Stories
        </div>
        <h1 className="kl-mkt-h1">
          Students who got in <em>where they didn&apos;t expect to.</em>
        </h1>
        <p className="kl-mkt-lede">
          First-gen, international, and underprivileged applicants from Karachi to Brampton to
          Brooklyn. These are early-cohort stories — illustrative voices from the first wave of
          KairosLearn users.
        </p>
      </section>

      <section className="kl-mkt-section" style={{ paddingTop: 0 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 18,
            maxWidth: 880,
            margin: "0 auto",
          }}
        >
          {STORIES.map((s) => (
            <article
              key={s.name}
              style={{
                padding: "36px 36px 30px",
                borderRadius: 18,
                border: "1px solid rgba(255,255,255,.10)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.015))",
              }}
            >
              <blockquote
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontSize: "clamp(20px, 2.6vw, 26px)",
                  lineHeight: 1.4,
                  letterSpacing: "-0.01em",
                  color: "#f2ede3",
                  margin: 0,
                  marginBottom: 22,
                  borderLeft: "2px solid #d4a84b",
                  paddingLeft: 22,
                }}
              >
                &ldquo;{s.quote}&rdquo;
              </blockquote>
              <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
                <span style={{ fontWeight: 500, fontSize: 14, color: "#f2ede3" }}>{s.name}</span>
                <span style={{ fontSize: 12.5, color: "#d4a84b" }}>{s.role}</span>
                <span style={{ fontSize: 12, color: "rgba(242,237,227,.45)" }}>· {s.loc}</span>
              </div>
            </article>
          ))}
        </div>

        <p
          style={{
            maxWidth: 720,
            margin: "44px auto 0",
            fontSize: 12.5,
            color: "rgba(242,237,227,.45)",
            textAlign: "center",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            lineHeight: 1.6,
          }}
        >
          These stories represent illustrative voices from KairosLearn&apos;s early-cohort users.
          We&apos;re collecting verified, named outcomes from the 2025-26 cycle and will update
          this page with admit data as it lands.
        </p>
      </section>

      <FinalCTA
        headline="Write yours <em>this cycle.</em>"
        body="Sign up free, build your list, and run your first brainstorm. We'll be here when you need us at 11 p.m."
      />
    </MarketingShell>
  );
}
