import { pageMetadata } from "@/lib/seo";
import MarketingShell from "@/components/marketing/MarketingShell";
import { FeatureGrid, FinalCTA, type IconName } from "@/components/marketing/MarketingSections";

export const metadata = pageMetadata({
  title: "Essay Studio — brainstorm, outline, draft, revise",
  description:
    "A 4-phase essay flow built around the way real students write. Voice brainstorm in your home language, English fragments lift to the canvas, and the coach pushes you through outline → draft → revise.",
  path: "/product/essays",
});

const FEATURES: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "sparkles",
    title: "Brainstorm in your language",
    body: "Tell stories in Urdu, Punjabi, or Tagalog. Coach Kairos draws out the moments and lifts English fragments to the Story Canvas — material you can use directly when drafting.",
  },
  {
    icon: "layers",
    title: "Outline that earns the draft",
    body: "Pick a direction from the canvas. Coach Kairos co-builds an outline with you — scenes, throughline, what's load-bearing. No drafting until the outline holds.",
  },
  {
    icon: "penLine",
    title: "Draft with a real editor",
    body: "Word count live, voice consistent, no LLM-cliches. The coach pushes back when sentences sound generic. The draft stays yours.",
  },
  {
    icon: "check",
    title: "Revise like a counselor would",
    body: "Targeted line edits, structural notes, the 'cut this paragraph' nudge a $200/hr counselor would give. Plus 20-40 supplements per school, organized.",
  },
  {
    icon: "fileText",
    title: "Supplements + reuse detection",
    body: "Tackle 30+ supplements across 9 schools without copying yourself. The reuse detector catches school-name leakage and high token overlap before you submit.",
  },
  {
    icon: "languages",
    title: "Translate for parents",
    body: "Brag sheet, financial-aid summary, scholarship list — translate any document into the parent's language with one click. Parent-comprehension only; not for formal submission.",
  },
];

export default function EssaysPage() {
  return (
    <MarketingShell>
      <section className="kl-mkt-hero">
        <div className="kl-mkt-eyebrow">
          <span className="rule" /> Essay Studio
        </div>
        <h1 className="kl-mkt-h1">
          The essay is where applications <em>are won and lost.</em>
        </h1>
        <p className="kl-mkt-lede">
          Most students applying to 10 schools write 20-40 supplemental essays. The personal
          statement is one. Essay Studio is built around the way real students write — brainstorm,
          outline, draft, revise — with a coach that pushes you when it matters.
        </p>
      </section>

      <section className="kl-mkt-section">
        <div className="kl-mkt-eyebrow">
          <span className="rule" /> The 4-phase flow
        </div>
        <h2 className="kl-mkt-h2">
          One flow, <em>every</em> essay.
        </h2>
        <p className="kl-mkt-lede">
          Same shape across the personal statement and every supplement. The coach calibrates by
          school, prompt type, and word limit — but the rhythm stays the same.
        </p>
        <FeatureGrid features={FEATURES} />
      </section>

      <FinalCTA
        headline="Start with one <em>brainstorm</em>."
        body="Pick a school, pick a prompt, pick the language you think in. Coach Kairos will lift the rest."
      />
    </MarketingShell>
  );
}
