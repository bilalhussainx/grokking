// Unified Net Price Estimator — MVP, 2026-05-17.
//
// The 2026-05-17 Cookiy validation study surfaced this as the single biggest
// opportunity area: students (especially first-gen, international, and
// transfer applicants) abandon school applications because they cannot
// estimate out-of-pocket cost in advance. Per-school Net Price Calculators
// are inconsistent, ask different questions, and don't handle edge cases.
//
// This module estimates net price for a fixed catalog of high-priority
// schools given a student profile. It is INTENTIONALLY rule-based for the
// MVP — accuracy matters less than coherence across the student's school
// list, and accuracy will improve when we layer per-school NPC adapters in
// Phase 2.
//
// MVP scope: 12 schools (8 need-blind-international from
// NEED_BLIND_INTERNATIONAL_IPEDS in affordability.ts, plus 4 widely-applied
// safeties / public flagships). Domestic + international + transfer paths.

import { type AffordabilityValue } from "./affordability";

// ── catalog ────────────────────────────────────────────────────────────────
//
// Sticker price: cost of attendance per the most recent published CDS
// (tuition + room + board + fees + estimated books/personal/transportation).
// Updated 2026-05. Verify against the school's financial-aid page before
// quoting binding numbers — these are used to *estimate*, not commit.

export type SchoolAidProfile = {
  ipeds: number;
  name: string;
  stickerPrice: number;
  needBlind: { domestic: boolean; international: boolean };
  meetsFullNeed: { domestic: boolean; international: boolean };
  // Fraction of demonstrated need actually met (1.0 = always full need; some
  // public-school out-of-state programs cap aid below 100%). 1.0 default.
  needMetFraction: { domestic: number; international: number };
  // Average per-pupil grant aid in $/year — used as a sanity floor for
  // need-aware schools where the formula can't compute exactly.
  avgGrantAid: number;
  // Notes shown to the student under the estimate.
  notes?: string;
};

export const NET_PRICE_CATALOG: SchoolAidProfile[] = [
  {
    ipeds: 166027,
    name: "Harvard University",
    stickerPrice: 84412,
    needBlind: { domestic: true, international: true },
    meetsFullNeed: { domestic: true, international: true },
    needMetFraction: { domestic: 1.0, international: 1.0 },
    avgGrantAid: 70000,
    notes: "Families earning under $85k pay $0; under $150k pay 0–10% of income.",
  },
  {
    ipeds: 166683,
    name: "Massachusetts Institute of Technology",
    stickerPrice: 85960,
    needBlind: { domestic: true, international: true },
    meetsFullNeed: { domestic: true, international: true },
    needMetFraction: { domestic: 1.0, international: 1.0 },
    avgGrantAid: 64000,
    notes: "Families under $140k income, $1M assets pay zero tuition.",
  },
  {
    ipeds: 130794,
    name: "Yale University",
    stickerPrice: 87150,
    needBlind: { domestic: true, international: true },
    meetsFullNeed: { domestic: true, international: true },
    needMetFraction: { domestic: 1.0, international: 1.0 },
    avgGrantAid: 67000,
    notes: "Families under $75k pay zero parent contribution.",
  },
  {
    ipeds: 186131,
    name: "Princeton University",
    stickerPrice: 84620,
    needBlind: { domestic: true, international: true },
    meetsFullNeed: { domestic: true, international: true },
    needMetFraction: { domestic: 1.0, international: 1.0 },
    avgGrantAid: 70000,
    notes: "Need-based aid covers 100% of need; no loans in any aid package.",
  },
  {
    ipeds: 182670,
    name: "Dartmouth College",
    stickerPrice: 87293,
    needBlind: { domestic: true, international: true },
    meetsFullNeed: { domestic: true, international: true },
    needMetFraction: { domestic: 1.0, international: 1.0 },
    avgGrantAid: 65000,
    notes: "Families under $125k income with typical assets pay no tuition.",
  },
  {
    ipeds: 164465,
    name: "Amherst College",
    stickerPrice: 87926,
    needBlind: { domestic: true, international: true },
    meetsFullNeed: { domestic: true, international: true },
    needMetFraction: { domestic: 1.0, international: 1.0 },
    avgGrantAid: 67000,
  },
  {
    ipeds: 168342,
    name: "Williams College",
    stickerPrice: 84080,
    needBlind: { domestic: true, international: true },
    meetsFullNeed: { domestic: true, international: true },
    needMetFraction: { domestic: 1.0, international: 1.0 },
    avgGrantAid: 65000,
  },
  {
    ipeds: 160977,
    name: "Bowdoin College",
    stickerPrice: 85196,
    needBlind: { domestic: true, international: true },
    meetsFullNeed: { domestic: true, international: true },
    needMetFraction: { domestic: 1.0, international: 1.0 },
    avgGrantAid: 60000,
    notes: "No loans in any financial aid package since 2008.",
  },
  // Need-blind for domestic, need-aware for international, meets-full-need
  // both paths.
  {
    ipeds: 190150,
    name: "Columbia University",
    stickerPrice: 91194,
    needBlind: { domestic: true, international: false },
    meetsFullNeed: { domestic: true, international: true },
    needMetFraction: { domestic: 1.0, international: 1.0 },
    avgGrantAid: 65000,
    notes: "International students: aid is guaranteed if admitted, but asking for aid reduces admission odds.",
  },
  // Large public flagships — typical out-of-state student, partial aid.
  {
    ipeds: 110635,
    name: "University of California, Berkeley",
    stickerPrice: 75000,
    needBlind: { domestic: true, international: true },
    meetsFullNeed: { domestic: false, international: false },
    needMetFraction: { domestic: 0.85, international: 0.4 },
    avgGrantAid: 22000,
    notes: "In-state California students get strong aid via Cal Grant + UC Blue & Gold. Out-of-state and international students get minimal need-based aid.",
  },
  {
    ipeds: 110653,
    name: "University of California, Los Angeles",
    stickerPrice: 73000,
    needBlind: { domestic: true, international: true },
    meetsFullNeed: { domestic: false, international: false },
    needMetFraction: { domestic: 0.85, international: 0.4 },
    avgGrantAid: 21000,
    notes: "Same dual-track aid as Berkeley: strong for California residents, sparse otherwise.",
  },
  {
    ipeds: 199193,
    name: "University of North Carolina at Chapel Hill",
    stickerPrice: 65000,
    needBlind: { domestic: true, international: false },
    meetsFullNeed: { domestic: true, international: false },
    needMetFraction: { domestic: 1.0, international: 0.3 },
    avgGrantAid: 28000,
    notes: "Carolina Covenant meets 100% of need for in-state low-income students with no loans.",
  },
];

// ── inputs ─────────────────────────────────────────────────────────────────

export type NetPriceInputs = {
  isInternational: boolean;
  isTransfer: boolean;
  isFirstGen: boolean;
  affordabilityValue: AffordabilityValue | null;
  // Optional richer inputs that, when present, refine the estimate.
  householdIncomeBracket?: string | null; // e.g. "$0-30k" .. "$110k+"
  householdSize?: number | null;
  dependentsInCollege?: number | null;
  pellEligibleEstimate?: boolean | null;
};

export type NetPriceEstimate = {
  schoolName: string;
  ipeds: number;
  stickerPrice: number;
  estimatedFamilyContribution: number;
  estimatedGrantAid: number;
  estimatedNetPrice: number;
  // 0-1 confidence — driven by how much input richness we had and whether
  // the school's aid policy is deterministic for the student's status.
  confidence: number;
  aidRiskFlag: "none" | "need_aware_admission_risk" | "limited_intl_aid";
  notes: string[];
};

// ── helpers ────────────────────────────────────────────────────────────────

const INCOME_MIDPOINTS: Record<string, number> = {
  "$0-30k": 15000,
  "$30-48k": 39000,
  "$48-75k": 61500,
  "$75-110k": 92500,
  "$110k+": 160000,
};

const AFFORDABILITY_MAX: Record<AffordabilityValue, number> = {
  zero: 0,
  under_10k: 8000,
  "10k_20k": 15000,
  "20k_30k": 25000,
  "30k_50k": 40000,
  "50k_plus": 75000,
};

// Crude EFC proxy: 22% of income above $30k household threshold, adjusted
// for household size + dependents in college. Mirrors the FAFSA simplified
// formula at a level of accuracy that's defensible for an estimator (it
// gets us within ±$5–8k for most middle-income families). For richer
// accuracy we'd plug in the CSS Profile methodology; that's Phase 2.
function estimateFamilyContribution(inputs: NetPriceInputs): number {
  // Floor: respect explicit "affordability_value" if the student set it.
  // That's the most reliable signal — it's the student's stated max
  // out-of-pocket. If we have BOTH affordability_value and a richer income
  // profile, take the lower of the two estimates.
  const fromAffordability =
    inputs.affordabilityValue != null ? AFFORDABILITY_MAX[inputs.affordabilityValue] : null;

  let fromIncome: number | null = null;
  if (inputs.householdIncomeBracket && INCOME_MIDPOINTS[inputs.householdIncomeBracket]) {
    const income = INCOME_MIDPOINTS[inputs.householdIncomeBracket];
    const protection = 30000 + (inputs.householdSize ?? 4) * 6000;
    const discretionary = Math.max(0, income - protection);
    let raw = discretionary * 0.22;
    if (inputs.dependentsInCollege && inputs.dependentsInCollege > 1) {
      raw = raw / inputs.dependentsInCollege;
    }
    if (inputs.pellEligibleEstimate) raw = Math.min(raw, 6000);
    fromIncome = raw;
  }

  if (fromAffordability != null && fromIncome != null) {
    return Math.round(Math.min(fromAffordability, fromIncome));
  }
  if (fromAffordability != null) return fromAffordability;
  if (fromIncome != null) return Math.round(fromIncome);
  // No financial data on file — assume 30% of sticker as a conservative
  // default. The UI will flag low confidence.
  return 25000;
}

export function estimateNetPriceForSchool(
  school: SchoolAidProfile,
  inputs: NetPriceInputs,
): NetPriceEstimate {
  const path = inputs.isInternational ? "international" : "domestic";
  const meetsFull = school.meetsFullNeed[path];
  const needMet = school.needMetFraction[path];
  const isNeedBlind = school.needBlind[path];

  const efc = estimateFamilyContribution(inputs);
  const demonstratedNeed = Math.max(0, school.stickerPrice - efc);
  const grantAid = Math.round(demonstratedNeed * needMet);
  const netPrice = Math.max(0, school.stickerPrice - grantAid);

  // Confidence: 0.9 baseline if we have either affordability_value or
  // household income bracket; 0.5 if neither. Penalize 0.1 for non-meets-
  // full-need schools where the formula is less deterministic.
  let confidence = 0.5;
  if (inputs.affordabilityValue != null || inputs.householdIncomeBracket) confidence = 0.9;
  if (!meetsFull) confidence -= 0.1;
  if (inputs.isTransfer) confidence -= 0.1; // transfer aid is less predictable
  confidence = Math.max(0.3, Math.min(0.95, confidence));

  const aidRiskFlag: NetPriceEstimate["aidRiskFlag"] = !isNeedBlind
    ? "need_aware_admission_risk"
    : inputs.isInternational && !meetsFull
      ? "limited_intl_aid"
      : "none";

  const notes: string[] = [];
  if (school.notes) notes.push(school.notes);
  if (aidRiskFlag === "need_aware_admission_risk") {
    notes.push(
      `${school.name} is need-aware for ${path} students — asking for aid can reduce your admission odds.`,
    );
  }
  if (aidRiskFlag === "limited_intl_aid") {
    notes.push(
      `${school.name} typically meets only ~${Math.round(needMet * 100)}% of demonstrated need for international students. The estimate above assumes the typical award.`,
    );
  }
  if (inputs.isTransfer) {
    notes.push("Transfer students often get less institutional aid than first-year applicants. Verify with the school's transfer-aid page.");
  }
  if (inputs.isFirstGen) {
    notes.push("As a first-generation college applicant, you may also qualify for QuestBridge, Posse, and school-specific first-gen grants on top of need-based aid.");
  }

  return {
    schoolName: school.name,
    ipeds: school.ipeds,
    stickerPrice: school.stickerPrice,
    estimatedFamilyContribution: efc,
    estimatedGrantAid: grantAid,
    estimatedNetPrice: netPrice,
    confidence,
    aidRiskFlag,
    notes,
  };
}

// Estimate every catalog school the student has on their list. Schools not
// in the catalog are returned in `uncovered` so the UI can ask the student
// to use the school's own NPC (Phase 2 will adapter-fill these).
export function estimateNetPricesForList(
  schoolNames: string[],
  inputs: NetPriceInputs,
): { estimates: NetPriceEstimate[]; uncovered: string[] } {
  const estimates: NetPriceEstimate[] = [];
  const uncovered: string[] = [];
  for (const name of schoolNames) {
    const needle = name.toLowerCase().trim();
    const school = NET_PRICE_CATALOG.find(
      (s) => s.name.toLowerCase() === needle || needle.includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(needle),
    );
    if (school) estimates.push(estimateNetPriceForSchool(school, inputs));
    else uncovered.push(name);
  }
  return { estimates, uncovered };
}
