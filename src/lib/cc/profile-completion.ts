export interface ProfileData {
  legal_first_name?: string | null;
  grade_level?: number | null;
  graduation_year?: number | null;
  high_school_name?: string | null;
  state_province?: string | null;
}

export interface AcademicData {
  gpa_unweighted?: number | null;
  sat_total?: number | null;
  act_composite?: number | null;
  test_strategy?: string | null;
}

export interface ActivityData {
  id: string;
  position: number;
  activity_type?: string | null;
}

export interface HonorData {
  id: string;
  position: number;
  title?: string | null;
}

export interface FinancialData {
  household_income_bracket?: string | null;
  household_size?: number | null;
}

export function calculateCompletion(
  profile: ProfileData | null,
  academic: AcademicData | null,
  activities: ActivityData[],
  honors: HonorData[],
  financial: FinancialData | null,
): number {
  const identityRequired: (keyof ProfileData)[] = [
    "legal_first_name",
    "grade_level",
    "graduation_year",
    "high_school_name",
    "state_province",
  ];
  const identityFilled = profile
    ? identityRequired.filter((f) => profile[f] != null && profile[f] !== "").length
    : 0;
  const identityPct = (identityFilled / identityRequired.length) * 20;

  const hasGPA = !!academic?.gpa_unweighted;
  const hasTest =
    !!academic?.sat_total ||
    !!academic?.act_composite ||
    academic?.test_strategy === "Test-optional";
  const academicPct = (((hasGPA ? 1 : 0) + (hasTest ? 1 : 0)) / 2) * 25;

  const activityPct = activities.length >= 1 ? 25 : 0;

  const honorsPct = honors.length >= 1 ? 10 : 0;

  const financialRequired: (keyof FinancialData)[] = [
    "household_income_bracket",
    "household_size",
  ];
  const financialFilled = financial
    ? financialRequired.filter((f) => financial[f] != null && financial[f] !== "").length
    : 0;
  const financialPct = (financialFilled / financialRequired.length) * 20;

  return Math.round(identityPct + academicPct + activityPct + honorsPct + financialPct);
}
