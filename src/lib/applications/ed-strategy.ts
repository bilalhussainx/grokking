// Feature 5 — ED financial-aid warning state machine + REA conflict checker.
import plansData from "@/data/school-application-plans.json";

type SchoolPlanInfo = {
  plans: string[];
  is_public: boolean;
  need_aware_for_internationals: boolean;
};

const PLANS = plansData as Record<string, SchoolPlanInfo>;

const REA_SCHOOLS = ["Harvard", "Yale", "Princeton", "Georgetown", "Stanford"];

export function getSchoolPlanInfo(schoolName: string): SchoolPlanInfo | null {
  if (PLANS[schoolName]) return PLANS[schoolName];
  const lower = schoolName.toLowerCase();
  for (const k of Object.keys(PLANS)) {
    if (k.toLowerCase() === lower) return PLANS[k];
  }
  return null;
}

export function schoolAcceptsPlan(schoolName: string, plan: string): boolean {
  const info = getSchoolPlanInfo(schoolName);
  if (!info) return true; // unknown — don't block
  return info.plans.includes(plan);
}

// Three-state ED financial warning (R-W-G).
// affordabilityValue is the existing cc_student_profiles.affordability_value
// field — null/zero/etc means "needs aid"; >40000 means "not aid-dependent".
export type EDWarningState = "safe" | "warning" | "block";

export function edWarningState(input: {
  schoolName: string;
  affordabilityValue: number | null;
  needsFullAid: boolean;
  isInternational: boolean;
}): { state: EDWarningState; headline: string; explanation: string; alternatives: string[] } {
  const info = getSchoolPlanInfo(input.schoolName);
  const aidDependent = input.needsFullAid || (input.affordabilityValue !== null && input.affordabilityValue < 30000);
  const needAware = info?.need_aware_for_internationals ?? false;

  if (input.isInternational && needAware) {
    return {
      state: "block",
      headline: "ED is high-risk for international students at this school",
      explanation: `${input.schoolName} is need-aware for international applicants. Applying ED binds you to attend even if the aid package falls short — and international applicants often see weaker offers than domestic peers.`,
      alternatives: [
        info?.plans.includes("RD") ? "Apply RD instead so you can compare aid packages" : "",
        "Talk to your counselor about scholarship-based alternatives",
        "Consider universities with stronger international aid (MIT, Harvard, Yale, Princeton, Amherst)",
      ].filter(Boolean) as string[],
    };
  }

  if (aidDependent) {
    return {
      state: "warning",
      headline: "ED is binding — and aid you receive could fall short",
      explanation: `Early Decision is binding. If accepted, you must withdraw all other applications, even if the financial aid package leaves you with a gap your family can't cover. Release from ED for financial reasons is at the school's discretion.`,
      alternatives: [
        info?.plans.includes("EA") ? "Apply EA — same early signal without the binding commitment" : "",
        info?.plans.includes("RD") ? "Apply RD so you can compare aid offers from multiple schools" : "",
        "Run the school's Net Price Calculator before deciding",
      ].filter(Boolean) as string[],
    };
  }

  return {
    state: "safe",
    headline: "ED is a strong choice if this is your #1",
    explanation: `Your affordability profile suggests aid won't be the deciding factor. ED at ${input.schoolName} can boost your acceptance odds by 15-25% at selective schools. You're ready to commit.`,
    alternatives: [],
  };
}

// REA conflict — Harvard/Yale/Princeton/Georgetown/Stanford restrict EA/ED to
// other private schools in the same cycle. Public-school EA is allowed.
export type REAConflict = {
  conflict: boolean;
  reaSchool: string | null;
  conflictingSchools: string[];
  message: string;
};

export function checkREAConflict(
  schools: { schoolName: string; plan: string | null }[],
): REAConflict {
  const reaSchool = schools.find((s) => s.plan === "REA" && REA_SCHOOLS.includes(s.schoolName));
  if (!reaSchool) {
    return { conflict: false, reaSchool: null, conflictingSchools: [], message: "" };
  }

  const conflicting: string[] = [];
  for (const s of schools) {
    if (s.schoolName === reaSchool.schoolName) continue;
    if (s.plan !== "EA" && s.plan !== "ED" && s.plan !== "EDII") continue;
    const info = getSchoolPlanInfo(s.schoolName);
    if (!info) continue;
    if (!info.is_public) conflicting.push(s.schoolName);
  }

  if (conflicting.length === 0) {
    return { conflict: false, reaSchool: reaSchool.schoolName, conflictingSchools: [], message: "" };
  }

  return {
    conflict: true,
    reaSchool: reaSchool.schoolName,
    conflictingSchools: conflicting,
    message: `You selected REA for ${reaSchool.schoolName}. REA restricts EA/ED to other private schools — change ${conflicting.join(", ")} to RD, or drop your ${reaSchool.schoolName} REA application.`,
  };
}

export const APPLICATION_PLAN_EXPLAINER_TABLE = [
  { plan: "ED", binding: true, benefit: "+15-25% acceptance boost at selective schools", restriction: "Must withdraw all other applications if accepted", best: "Students whose #1 choice is clear AND financial aid is not the deciding factor" },
  { plan: "EDII", binding: true, benefit: "Same boost as ED, January deadline", restriction: "Same binding commitment", best: "Students who didn't match in ED, have a clear second choice" },
  { plan: "EA", binding: false, benefit: "Early answer, slight boost, keep options open", restriction: "None", best: "Most students — best default" },
  { plan: "REA", binding: false, benefit: "Slight boost (Harvard/Yale/Princeton/Georgetown/Stanford only)", restriction: "Cannot apply EA/ED to other private schools", best: "Applying to one of those 5 specifically" },
  { plan: "RD", binding: false, benefit: "Full flexibility to compare aid packages", restriction: "None", best: "Financial-aid-dependent students who need to compare offers" },
  { plan: "QuestBridge", binding: true, benefit: "Full scholarship to top schools if matched", restriction: "Separate application + binding match", best: "Low-income students with strong academics" },
];
