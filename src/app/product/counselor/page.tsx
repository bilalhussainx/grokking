import type { Metadata } from "next";
import {
  Mic,
  GraduationCap,
  MessageSquare,
  Clock,
  Languages,
  ShieldCheck,
} from "lucide-react";
import MarketingShell from "@/components/marketing/MarketingShell";
import { FeatureGrid, FinalCTA } from "@/components/marketing/MarketingSections";

export const metadata: Metadata = {
  title: "Coach Kairos — your AI college counselor",
  description:
    "Voice-first AI counseling for college applicants in 18 languages. Trained on your profile, your grades, your school list. Available at 3 a.m. on a Saturday.",
};

const FEATURES = [
  {
    icon: Mic,
    title: "Voice-first, 18 languages",
    body: "Talk through your school list in Hindi, your essay in Punjabi, your aid forms in Spanish. Coach Kairos speaks back in the same language with sub-second latency.",
  },
  {
    icon: GraduationCap,
    title: "Trained on your profile",
    body: "Your GPA, your test scores, your activities, your school list — Coach Kairos has the full picture before you start typing. No re-explaining yourself every conversation.",
  },
  {
    icon: MessageSquare,
    title: "Family Mode for parents",
    body: "Hand the phone to a parent who doesn't speak English. Coach Kairos switches to their language, simplifies the jargon, and answers their financial-aid questions directly.",
  },
  {
    icon: Clock,
    title: "Available when humans aren't",
    body: "11 p.m. the night before a deadline. 6 a.m. before school. The hour your counselor isn't picking up. Coach Kairos is one tap away.",
  },
  {
    icon: Languages,
    title: "Mixed-script aware",
    body: "Type 'میں MIT جانا چاہتا ہوں' and Coach reads it correctly — Urdu RTL, MIT in English, no copy-paste. Same for every language we support.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy by default",
    body: "We never store raw audio. Conversations are scoped to your account. Family Mode runs in a separate transcript so handing the phone to a parent doesn't leak essay drafts.",
  },
];

export default function CounselorPage() {
  return (
    <MarketingShell>
      <section className="kl-mkt-hero">
        <div className="kl-mkt-eyebrow">
          <span className="rule" /> Coach Kairos
        </div>
        <h1 className="kl-mkt-h1">
          Your AI counselor — for <em>every</em> student.
        </h1>
        <p className="kl-mkt-lede">
          The average U.S. public-school counselor serves 415 students. For first-gen,
          international, and underprivileged applicants, that means almost no time, no translation,
          no institutional memory. Coach Kairos is one counselor per student — in your language,
          trained on your profile, available at 3 a.m. on a Saturday.
        </p>
      </section>

      <section className="kl-mkt-section">
        <div className="kl-mkt-eyebrow">
          <span className="rule" /> What it does
        </div>
        <h2 className="kl-mkt-h2">
          Built around your <em>actual</em> day.
        </h2>
        <p className="kl-mkt-lede">
          Coach Kairos isn&apos;t a generic chatbot wearing a counselor hat. It pulls from your
          profile, your school list, your essay drafts, your test plan — and adapts every reply
          to where you are in the cycle.
        </p>
        <FeatureGrid features={FEATURES} />
      </section>

      <FinalCTA
        headline="Talk to <em>Coach Kairos</em> in 90 seconds."
        body="Sign up, pick your language, and have the first real conversation about your college list."
      />
    </MarketingShell>
  );
}
