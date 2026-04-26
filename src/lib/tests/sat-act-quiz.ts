// Feature 9 — 6-question SAT-vs-ACT diagnostic. Each answer maps to SAT or
// ACT preference. Recommend the higher-scoring side; "BOTH" if a tie or
// student is strong across.

export type QuizQuestion = {
  id: string;
  question: string;
  options: { label: string; value: "SAT" | "ACT" | "NEUTRAL" }[];
};

export const SAT_ACT_QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "Which describes you better on math sections?",
    options: [
      { label: "I'm strong with algebra and would rather have a bit longer per question", value: "SAT" },
      { label: "I work fast and accurately under time pressure", value: "ACT" },
      { label: "Either", value: "NEUTRAL" },
    ],
  },
  {
    id: "q2",
    question: "On reading-heavy sections, you prefer:",
    options: [
      { label: "Fewer, longer passages with more analysis questions", value: "SAT" },
      { label: "More passages but quicker, more straightforward questions", value: "ACT" },
      { label: "Either", value: "NEUTRAL" },
    ],
  },
  {
    id: "q3",
    question: "Are you comfortable with a science-reasoning section (charts, data interpretation)?",
    options: [
      { label: "Yes, I'm strong at reading graphs and quick scientific reasoning", value: "ACT" },
      { label: "I'd rather skip a science section entirely", value: "SAT" },
      { label: "Either", value: "NEUTRAL" },
    ],
  },
  {
    id: "q4",
    question: "How do you handle timed pressure?",
    options: [
      { label: "Better with more time per question", value: "SAT" },
      { label: "Better with a faster pace and more questions", value: "ACT" },
      { label: "Either", value: "NEUTRAL" },
    ],
  },
  {
    id: "q5",
    question: "Do you prefer using a calculator?",
    options: [
      { label: "Yes, all the time on math (SAT allows calculator throughout)", value: "SAT" },
      { label: "I can do calculator-free math fluently", value: "ACT" },
      { label: "Either", value: "NEUTRAL" },
    ],
  },
  {
    id: "q6",
    question: "Geographic preference:",
    options: [
      { label: "U.S. East / coastal schools (SAT historically more common)", value: "SAT" },
      { label: "U.S. Midwest / South (ACT historically more common)", value: "ACT" },
      { label: "Both regions", value: "NEUTRAL" },
    ],
  },
];

export type SATACTRecommendation = {
  test: "SAT" | "ACT" | "BOTH";
  satCount: number;
  actCount: number;
  reasons: string[];
};

export function recommendSATorACT(answers: Array<"SAT" | "ACT" | "NEUTRAL">): SATACTRecommendation {
  let satCount = 0;
  let actCount = 0;
  for (const a of answers) {
    if (a === "SAT") satCount++;
    if (a === "ACT") actCount++;
  }

  let test: "SAT" | "ACT" | "BOTH";
  const reasons: string[] = [];

  if (satCount > actCount + 1) {
    test = "SAT";
    reasons.push("Your answers point clearly to SAT — calculator throughout, longer per-question time, no science section.");
  } else if (actCount > satCount + 1) {
    test = "ACT";
    reasons.push("Your answers point clearly to ACT — comfortable with the science section and faster pacing.");
  } else {
    test = "BOTH";
    reasons.push("Your answers don't strongly favor one. Take a free practice test of each (Khan Academy for SAT, ACT.org for ACT) and pick the one where you score higher.");
  }

  if (satCount + actCount < 3) {
    reasons.push("Only " + (satCount + actCount) + " of your answers indicated a clear preference — the recommendation is weak. Take both diagnostics if you're unsure.");
  }

  return { test, satCount, actCount, reasons };
}

// Fee waiver — SAT eligibility (US):
// - Family income at or below 185% of poverty / SNAP/TANF/free-reduced lunch.
// - Foster youth.
// - Family receives public assistance.
export type FeeWaiverInput = {
  isInternational: boolean;
  countryCode?: string | null;
  isFirstGen?: boolean;
  receivesFreeReducedLunch?: boolean;
  receivesPublicAssistance?: boolean;
};

export function feeWaiverEligibility(input: FeeWaiverInput): { eligible: boolean; reason: string } {
  if (input.isInternational) {
    return {
      eligible: false,
      reason: "SAT/ACT fee waivers are only available to U.S. domestic students. International students should ask their high school counselor whether the school can issue a fee waiver code, or contact College Board directly with proof of financial need.",
    };
  }
  if (input.receivesFreeReducedLunch || input.receivesPublicAssistance) {
    return {
      eligible: true,
      reason: "You qualify based on free/reduced-price lunch or public assistance. Ask your school counselor for a fee waiver code — it covers SAT registration AND 4 free score reports.",
    };
  }
  if (input.isFirstGen) {
    return {
      eligible: true,
      reason: "First-generation status alone doesn't guarantee a waiver, but you almost certainly qualify on income — bring your family's tax info (or SNAP letter) to your counselor.",
    };
  }
  return {
    eligible: false,
    reason: "You don't appear to meet the standard fee waiver criteria. Ask your school counselor anyway — schools have discretion.",
  };
}
