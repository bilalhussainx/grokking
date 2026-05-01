// Per-variant walkthrough copy for Coach Kairos. When the user clicks "Talk
// to Coach Kairos" from a specific dashboard variant, we open the drawer
// in-place and seed an opening assistant message that names the right
// step-by-step path for *their* grade and phase — not the generic senior
// flow.
//
// Keep these messages short. The first turn sets the scaffold; the
// conversation itself fills in the specifics. The seed uses Coach Kairos's
// voice — second-person, warm, specific.

import type { VariantKey } from "@/app/cc/dashboard/variants";

export type WalkthroughSeed = {
  // Mode the coach should switch into. Used downstream by the
  // coach-mode-detector so the system prompt matches.
  mode: string;
  // One assistant message rendered as the opening turn. Markdown allowed.
  greeting: string;
};

const G9: WalkthroughSeed = {
  mode: "general",
  greeting:
    "Hey — welcome to grade 9. You're four years out, and the truth is, what you do _now_ matters less than what you build _consistently_. Here's the path I'd walk you through:\n\n" +
    "1. **Pick one harder course** for next semester (honors-level if your school has it).\n" +
    "2. **Commit to one or two clubs** you actually like — not five you don't.\n" +
    "3. **Try a low-stakes major-interest quiz** — just to start a thread we can pull on later.\n" +
    "4. **Plan one real summer thing** — a job, a project, a free online course you finish.\n\n" +
    "The Application Tracker, Essay Studio, SAT prep — all of that unlocks junior year. For now, we focus on building you. Where do you want to start: course rigor, clubs, or summer?",
};

const G10: WalkthroughSeed = {
  mode: "general",
  greeting:
    "You're in grade 10 — the year we add depth. Here's the runway:\n\n" +
    "1. **Take the PSAT 10 in October** — your school registers you, but if it's not on the calendar, ask your counselor today. It's the diagnostic that tells us SAT vs ACT.\n" +
    "2. **Pick one 'show, don't tell' summer experience** — research, a real job, a published project, a structured program. One real thing beats three filler things.\n" +
    "3. **Add depth in one area** of your activities. If robotics is your thing, double down. If music is, don't dilute it with three other clubs.\n" +
    "4. **Start the major-exploration quiz** — still low-stakes, but the answer guides next year's course choices.\n\n" +
    "Essays and applications come next year. Want to start with the test plan, the summer plan, or your activity list?",
};

const JUNIOR: WalkthroughSeed = {
  mode: "school-builder",
  greeting:
    "Junior year is where the real machine starts. Here's the order I'll walk you through:\n\n" +
    "1. **Build the school list draft** — 10 to 15 schools, balanced reach / match / safety.\n" +
    "2. **Take a real diagnostic SAT or ACT this fall.** Knowing your test fit by November means you have spring + summer to lift the score.\n" +
    "3. **Lock the activity list** — what's on it now, what to add, what to deepen for the spike.\n" +
    "4. **Spring: brainstorm the personal statement** — no draft yet, just raw material.\n" +
    "5. **Summer: pre-draft supplements** for your top 3 schools so senior fall isn't a fire drill.\n\n" +
    "Where are you right now — do you have a school list yet, or should we start there?",
};

const SENIOR_WRITING: WalkthroughSeed = {
  mode: "intake",
  greeting:
    "We're in writing season. The order is bottlenecked by deadlines, so let's be ruthless:\n\n" +
    "1. **Confirm intake basics** — grade, GPA, test plan, financial aid posture. This calibrates everything downstream.\n" +
    "2. **Lock the school list** — every supplement we write later assumes this list is final.\n" +
    "3. **Personal statement** — outline → first draft → revise. The PS is upstream of every supplement.\n" +
    "4. **Activities list** — Common App's 10 slots, narrative-checked.\n" +
    "5. **Supplements by school**, sorted by deadline. EA/ED schools first.\n\n" +
    "What's the most pressing thing — is the PS drafted yet, or are we still building the list?",
};

const SENIOR_POST_SUBMIT: WalkthroughSeed = {
  mode: "general",
  greeting:
    "Submitted. Now the waiting game. While decisions roll in, here's what's still actionable:\n\n" +
    "1. **Log every demonstrated-interest touchpoint** — campus visits, info sessions, rep emails. Some schools track this right up to decision day.\n" +
    "2. **Prep for any alumni interviews** that come in — they're invitation-only at most schools and matter.\n" +
    "3. **Have a Plan B framework ready** for the schools where you applied EA/ED — if deferred, what's your move?\n" +
    "4. **Stay on top of mid-year reports** — your senior grades go in. Don't let them drop.\n\n" +
    "Anything specific weighing on you — a school you're nervous about, an interview to prep, a deferral to handle?",
};

const SENIOR_DECISIONS: WalkthroughSeed = {
  mode: "general",
  greeting:
    "Decisions are coming in. This is where money and gut both matter. Here's the order:\n\n" +
    "1. **Collect every aid letter** — net price, not sticker price, is the only number that matters.\n" +
    "2. **Run the affordability comparator** — side-by-side net cost, four years out.\n" +
    "3. **Visit (or virtual-tour) your top 2** if you haven't yet. Fit is real.\n" +
    "4. **Negotiate aid where there's room** — competing offer, change in family circumstances. I can draft the letter.\n" +
    "5. **Deposit by May 1.** If waitlisted, we open the LOCI flow.\n\n" +
    "What landed — and what's the school you're most torn about?",
};

const TRANSFER: WalkthroughSeed = {
  mode: "intake",
  greeting:
    "Transfer admissions is a different game — different deadlines, different essays, different odds. Here's the path:\n\n" +
    "1. **Confirm your transfer profile** — current school, credits, target term, why you're transferring. Five honest lines beats a vague paragraph.\n" +
    "2. **The why-transfer essay is the file.** Transfers don't get to lean on activities; the essay carries the inflection point.\n" +
    "3. **Build the transfer school list** — note that transfer acceptance rates differ from first-year, sometimes a lot.\n" +
    "4. **Professor recommendations** — at least one from a college instructor, not a high-school teacher.\n" +
    "5. **Track each school's transfer-specific deadlines** — they're often earlier than you'd expect.\n\n" +
    "Have you filled out the transfer profile yet? If not, that's our first move.",
};

const UNKNOWN: WalkthroughSeed = {
  mode: "intake",
  greeting:
    "Hey — I'm Coach Kairos. To calibrate the dashboard around you, I need a few quick things:\n\n" +
    "1. What grade are you in? (or are you a transfer applicant?)\n" +
    "2. Where are you applying from?\n" +
    "3. What's the biggest thing weighing on you right now?\n\n" +
    "Quick answers, no essay. Then we'll set the right path.",
};

export function getWalkthroughSeed(variant: VariantKey): WalkthroughSeed {
  switch (variant) {
    case "g9":
      return G9;
    case "g10":
      return G10;
    case "junior":
      return JUNIOR;
    case "senior_writing":
      return SENIOR_WRITING;
    case "senior_post_submit":
      return SENIOR_POST_SUBMIT;
    case "senior_decisions":
      return SENIOR_DECISIONS;
    case "transfer":
      return TRANSFER;
    case "unknown":
    default:
      return UNKNOWN;
  }
}
