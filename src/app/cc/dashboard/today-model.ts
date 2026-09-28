// Pure: (stage, TodayInput) → everything Today renders, as plain strings.
// Stage copy is authored (from the approved mock, GATE D4.2); every count,
// name, status and date comes from TodayInput. No Date, no locale, no clock:
// the server and the browser must produce identical text.
import type { VariantKey } from "./variants";
import type { TodayInput } from "./today-input";
import { formatIsoDate } from "@/lib/format-iso-date";

export type TodayRow = { id: string; label: string; detail: string; href: string };
export type TodayStep = { eyebrow: string; title: string; body: string; cta: { label: string; href: string }; basis: string };
export type TodayModel = {
  variantKey: VariantKey;
  stageLabel: string;
  headline: [string, string];
  intro: string;
  step: TodayStep | null;
  rowsTitle: string;
  rows: TodayRow[];
  askGrade: boolean;
  grade9: boolean;
  blockedNotice: boolean;
  suggestionsOn: boolean;
  observation: { eyebrow: string; text: string } | null;
  unavailable: boolean;
};

const UNAVAILABLE = "Couldn't load this right now. Your saved work is unchanged.";
const WRITING_PHASES = new Set(["brainstorm", "outline", "draft", "revise"]);

const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
const phaseLabel = (p: string) => p.charAt(0).toUpperCase() + p.slice(1).replace(/_/g, " ");

function schoolsRow(i: TodayInput, emptyText = "No schools saved yet. Start with possibilities, not rankings."): TodayRow {
  const detail = i.schoolCount === null ? UNAVAILABLE : i.schoolCount === 0 ? emptyText : `${count(i.schoolCount, "school", "schools")} saved.`;
  return { id: "schools", label: "School list", detail, href: "/schools" };
}

function deadlinesRow(i: TodayInput): TodayRow {
  let detail: string;
  if (i.schoolCount === null) detail = UNAVAILABLE;
  else if (i.nextDeadline) {
    detail = `Next saved date: ${i.nextDeadline.schoolName} ${i.nextDeadline.label}, ${formatIsoDate(i.nextDeadline.date)}. Confirm it on the school's official site.`;
  } else if (i.schoolCount > 0) detail = "No upcoming dates saved for your schools. Check each school's official requirements.";
  else detail = "Dates appear here after you save schools.";
  return { id: "applications", label: "Applications & deadlines", detail, href: "/applications" };
}

function essaysRow(i: TodayInput, label = "Essays"): TodayRow {
  let detail: string;
  if (i.essaysTotal === null) detail = UNAVAILABLE;
  else if (i.essaysTotal === 0) detail = "No essays started yet. Your notes, structure and student-written draft live here.";
  else {
    const ps = i.personalStatementPhase ? ` Personal statement: ${phaseLabel(i.personalStatementPhase)}.` : "";
    detail = `${count(i.essaysTotal, "essay", "essays")} in Essay Studio, ${i.essaysFinal ?? 0} marked final or submitted.${ps}`;
  }
  return { id: "essays", label, detail, href: "/cc/essays" };
}

function activitiesRow(i: TodayInput): TodayRow {
  const detail = i.activitiesCount === null
    ? UNAVAILABLE
    : i.activitiesCount === 0
      ? "Work, family responsibilities and interests count as experiences."
      : `${count(i.activitiesCount, "activity", "activities")} recorded.`;
  return { id: "activities", label: "Activities", detail, href: "/cc/activities-optimizer" };
}

function decisionsRow(i: TodayInput): TodayRow {
  let detail: string;
  if (!i.statusCounts) detail = UNAVAILABLE;
  else {
    const c = i.statusCounts;
    const parts = [
      c.accepted && `${c.accepted} accepted`,
      c.deposited && `${c.deposited} deposit recorded`,
      c.waitlisted && `${c.waitlisted} waitlisted`,
      c.deferred && `${c.deferred} deferred`,
      c.rejected && `${c.rejected} not admitted`,
      c.submitted && `${c.submitted} still waiting`,
    ].filter(Boolean);
    detail = parts.length ? `${parts.join(" · ")}.` : "No decisions recorded yet.";
  }
  return { id: "decisions", label: "Application decisions", detail, href: "/applications" };
}

function submittedRow(i: TodayInput): TodayRow {
  const detail = !i.statusCounts
    ? UNAVAILABLE
    : i.statusCounts.submitted > 0
      ? `${count(i.statusCounts.submitted, "application", "applications")} marked submitted. Check receipt in each school's official portal.`
      : "Mark an application submitted to keep track of it here.";
  return { id: "submitted", label: "Submitted applications", detail, href: "/applications" };
}

const COURSEWORK = (detail: string): TodayRow => ({ id: "coursework", label: "High-school coursework", detail, href: "/cc/courses" });
const COST: TodayRow = { id: "cost", label: "Cost questions", detail: "Collect confirmed awards; leave missing amounts unknown.", href: "/cc/net-price" };

type Stage = Omit<TodayModel, "variantKey" | "askGrade" | "grade9" | "blockedNotice" | "suggestionsOn" | "observation" | "unavailable">;

function stage(v: VariantKey, i: TodayInput): Stage {
  switch (v) {
    case "g9":
      return {
        stageLabel: "Grade 9 · Explore",
        headline: ["Start with what", "makes you curious."],
        intro: "There is room to explore. You don't need an application plan today.",
        step: {
          eyebrow: "A small place to start",
          title: "Notice what holds your attention.",
          body: "An interest, a class, something you do outside school. Start with what feels like you.",
          cta: { label: "Explore my interests", href: "/cc/majors" },
          basis: "Based on your grade. Nothing about your activities is assumed.",
        },
        rowsTitle: "Keep things in view",
        rows: [
          { id: "interests", label: "Your interests", detail: "Explore majors and what studying them involves.", href: "/cc/majors" },
          COURSEWORK("Choose a manageable path with your school counselor."),
          activitiesRow(i),
        ],
      };
    case "g10":
      return {
        stageLabel: "Grade 10 · Explore possibilities",
        headline: ["Let your interests", "lead somewhere."],
        intro: "Keep exploring. Give the things you care about a little more shape.",
        step: {
          eyebrow: "One useful next step",
          title: "Put an interest into words.",
          body: "What do you enjoy doing, and what would you like to understand better? You can start without a career picked out.",
          cta: { label: "Explore possible majors", href: "/cc/majors" },
          basis: "Based on your grade. Not a prediction of fit.",
        },
        rowsTitle: "Keep things in view",
        rows: [schoolsRow(i, "Add possibilities when you're ready."), COURSEWORK("Plan in the context of your school and region."), activitiesRow(i)],
      };
    case "junior": {
      const has = (i.schoolCount ?? 0) > 0;
      return {
        stageLabel: "Grade 11 · Make a plan",
        headline: ["A little clarity.", "A good next step."],
        intro: "You don't have to solve the whole application today.",
        step: has
          ? {
              eyebrow: "Pick up where you are",
              title: "Keep shaping your school list.",
              body: "Look at the place, the learning and the cost for each school. Add or remove options as your answers change.",
              cta: { label: "Open my school list", href: "/schools" },
              basis: `Based on the ${count(i.schoolCount ?? 0, "school", "schools")} on your list.`,
            }
          : {
              eyebrow: "A place to begin",
              title: "What matters to you in a college?",
              body: "Start with the place, the learning and the cost. Then build a school list around your answers.",
              cta: { label: "Start my school list", href: "/schools" },
              basis: i.schoolCount === null
                ? "Starting-point suggestion. We couldn't load your saved schools just now."
                : "Starting-point suggestion. You haven't saved any schools yet.",
            },
        rowsTitle: "Keep things in view",
        rows: [schoolsRow(i), deadlinesRow(i), activitiesRow(i)],
      };
    }
    case "senior_writing": {
      const phase = i.personalStatementPhase && WRITING_PHASES.has(i.personalStatementPhase) ? phaseLabel(i.personalStatementPhase) : null;
      return {
        stageLabel: "Grade 12 · Preparing",
        headline: phase ? ["Welcome back.", "Pick up your thread."] : ["Your application.", "Your own voice."],
        intro: phase ? "Your next step can begin with work you've already done." : "Choose one piece to work on. Leave the rest for its own moment.",
        step: phase
          ? {
              eyebrow: `Continue your work · ${phase}`,
              title: "Return to your personal statement.",
              body: "Read your notes and the structure you chose. Keep what still fits, and write the draft in your own words.",
              cta: { label: "Continue in Essay Studio", href: "/cc/essays" },
              basis: `Based on your personal statement's saved phase: ${phase}.`,
            }
          : {
              eyebrow: "One useful next step",
              title: "Find the experience you want to understand.",
              body: "Talk it through, collect your notes and choose a structure. Every sentence of the essay stays yours to write.",
              cta: { label: "Open Essay Studio", href: "/cc/essays" },
              basis: "Based on the preparing stage. No personal statement in progress yet.",
            },
        rowsTitle: "Keep things in view",
        rows: [essaysRow(i), deadlinesRow(i), schoolsRow(i)],
      };
    }
    case "senior_post_submit":
      return {
        stageLabel: "Grade 12 · Submitted",
        headline: ["Take a breath.", "Keep the details in view."],
        intro: "Submitting one application doesn't finish every application.",
        step: {
          eyebrow: "For the applications you sent",
          title: "Check what each school has received.",
          body: "Use each school's own portal to check required documents and messages. Decision dates stay unknown until the school confirms them.",
          cta: { label: "Review my applications", href: "/applications" },
          basis: "Based on applications marked submitted. No decision date is assumed.",
        },
        rowsTitle: "Keep things in view",
        rows: [submittedRow(i), essaysRow(i, "Still preparing another application?"), COST],
      };
    case "senior_decisions":
      return {
        stageLabel: "Grade 12 · Decisions",
        headline: ["Make sense of", "what comes next."],
        intro: "Your options depend on the decisions you actually have.",
        step: {
          eyebrow: "Start with the record",
          title: "Review each decision before making a plan.",
          body: "An offer, a waitlist, a deferral and a rejection need different next steps. Look at each one on its own.",
          cta: { label: "Review my decisions", href: "/applications" },
          basis: "Based on decisions recorded on your list. No offer or deposit is assumed.",
        },
        rowsTitle: "Keep things in view",
        rows: [
          decisionsRow(i),
          { id: "aid", label: "Aid & net price", detail: "Compare an offer only when amounts are confirmed.", href: "/cc/net-price" },
          essaysRow(i, "Other applications"),
        ],
      };
    case "transfer": {
      const t = i.transfer;
      return {
        stageLabel: "Transfer · Your next chapter",
        headline: ["Build on where", "you've already been."],
        intro: "Your current college, your credits and your reasons for moving belong at the center.",
        step: t.currentSchool
          ? {
              eyebrow: "One useful next step",
              title: "Explain why you're transferring, in your own words.",
              body: "Talk your reasons through with Coach, then write the essay yourself. Coach asks questions and gives feedback on what you write.",
              cta: { label: "Open Essay Studio", href: "/cc/essays?type=transfer" },
              basis: `Based on your transfer profile: ${t.currentSchool}.`,
            }
          : {
              eyebrow: "One useful next step",
              title: "Start with your transfer details.",
              body: "Add your current college and intended entry term. Credit decisions come from the receiving college, not this dashboard.",
              cta: { label: "Review my transfer profile", href: "/cc/transfer-profile" },
              basis: "Based on your transfer status. No credit equivalency is assumed.",
            },
        rowsTitle: "Your transfer details",
        rows: [
          { id: "current-college", label: "Current college", detail: t.currentSchool ?? "Not added yet.", href: "/cc/transfer-profile" },
          { id: "target-term", label: "Target entry term", detail: t.targetTerm ?? "Not added yet.", href: "/cc/transfer-profile" },
          {
            id: "credits", label: "Credits & coursework", href: "/cc/transfer-profile",
            detail: t.creditsCompleted != null
              ? `${count(t.creditsCompleted, "credit", "credits")} completed, as you recorded them. Each college decides what transfers.`
              : "Record what you've taken. Each college decides what transfers.",
          },
        ],
      };
    }
    case "unknown":
    default:
      return {
        stageLabel: "Let's find your starting point",
        headline: ["Start where", "you are."],
        intro: "One answer will help us make this space useful for you.",
        step: null,
        rowsTitle: "Your saved work",
        rows: [schoolsRow(i), essaysRow(i), activitiesRow(i)],
      };
  }
}

export function buildTodayModel(variant: VariantKey, input: TodayInput): TodayModel {
  return {
    variantKey: variant,
    ...stage(variant, input),
    askGrade: variant === "unknown",
    grade9: variant === "g9",
    blockedNotice: input.blockedNotice,
    suggestionsOn: input.observationsEnabled,
    observation: input.observationsEnabled ? input.observation : null,
    unavailable: input.schoolCount === null && input.essaysTotal === null && input.activitiesCount === null,
  };
}
