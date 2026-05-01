import type { Metadata } from "next";
import MarketingShell from "@/components/marketing/MarketingShell";
import { FeatureGrid, FinalCTA, type IconName } from "@/components/marketing/MarketingSections";

export const metadata: Metadata = {
  title: "Schools — list builder + chancing + deadlines",
  description:
    "Build a balanced school list with reach / match / safety classification, real chances of admission, and every deadline tracked. Replace the spreadsheet your family is using.",
};

const FEATURES: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "listChecks",
    title: "Balanced list builder",
    body: "Search 1,500+ U.S. schools, get reach / match / safety bands based on your actual profile, and stop applying to 15 reaches with zero safeties. Average list: 10-15 schools.",
  },
  {
    icon: "target",
    title: "Real chances, not gut feel",
    body: "Acceptance rates calibrated by GPA, test score, country of origin, and demographics. We tell you the number and explain the gap.",
  },
  {
    icon: "calendar",
    title: "Every deadline, auto-loaded",
    body: "EA / ED / EDII / REA / RD plus financial-aid + CSS Profile + FAFSA. The board flips red 14 days out and shows you which components are still incomplete.",
  },
  {
    icon: "dollar",
    title: "Net price per school",
    body: "Estimated aid you'd receive at every school on your list — based on your family's affordability profile, not the sticker price. ED warning fires when aid is at risk.",
  },
  {
    icon: "trend",
    title: "Demonstrated interest",
    body: "Some schools track every campus visit, info session, and rep meeting. Log them in one place and see the running touchpoint count per school.",
  },
  {
    icon: "globe",
    title: "International + first-gen aware",
    body: "We mark the schools that are need-aware vs need-blind for international applicants. Same for first-gen-friendly schools and 100%-of-need-met lists.",
  },
];

export default function SchoolsPage() {
  return (
    <MarketingShell>
      <section className="kl-mkt-hero">
        <div className="kl-mkt-eyebrow">
          <span className="rule" /> School list builder
        </div>
        <h1 className="kl-mkt-h1">
          Replace the <em>spreadsheet.</em>
        </h1>
        <p className="kl-mkt-lede">
          Every applicant family in America keeps a tab open: 10-15 schools, 6 columns of deadline
          and aid data, and a checklist of components per school. We replaced it. Add schools, get
          chancing bands, see deadlines, track components — all in one place.
        </p>
      </section>

      <section className="kl-mkt-section">
        <div className="kl-mkt-eyebrow">
          <span className="rule" /> What you can build
        </div>
        <h2 className="kl-mkt-h2">
          A list that <em>actually balances.</em>
        </h2>
        <p className="kl-mkt-lede">
          The biggest mistake first-gen and international applicants make is a top-heavy list.
          We push back. The chancing model uses your real profile — not gut feel.
        </p>
        <FeatureGrid features={FEATURES} />
      </section>

      <FinalCTA
        headline="Build your list in <em>15 minutes.</em>"
        body="Sign up, tell us your GPA + interests, and we'll surface 30 schools to consider. You pick the 10-15 that fit."
      />
    </MarketingShell>
  );
}
