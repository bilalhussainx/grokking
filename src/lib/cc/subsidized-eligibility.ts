import { proMonthlyLabel } from "@/lib/pricing";
import { createServerSupabase } from "@/lib/supabase-server";

export interface EligibilityResult {
  eligible: boolean;
  reason: string;
  missingFields: string[];
}

const LOW_INCOME_BRACKETS = ["0-30000", "30001-48000", "48001-75000"];

export async function checkSubsidizedEligibility(
  userId: string,
): Promise<EligibilityResult> {
  const supabase = await createServerSupabase();

  const { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("id, is_first_gen")
    .eq("user_id", userId)
    .single();

  if (!profile) {
    return {
      eligible: false,
      reason: "Complete your profile first to check eligibility.",
      missingFields: ["profile"],
    };
  }

  const { data: financial } = await supabase
    .from("cc_financial")
    .select("pell_eligible_estimate, family_income_bracket")
    .eq("student_id", profile.id)
    .single();

  const missing: string[] = [];
  if (!financial) missing.push("financial information");
  if (financial && financial.pell_eligible_estimate == null) missing.push("Pell eligibility estimate");

  if (missing.length > 0 && !profile.is_first_gen) {
    return {
      eligible: false,
      reason: "Fill in your financial profile so we can check eligibility.",
      missingFields: missing,
    };
  }

  // Check criteria
  if (financial?.pell_eligible_estimate === true) {
    return { eligible: true, reason: "You're Pell-eligible — you qualify for free Pro access.", missingFields: [] };
  }

  if (profile.is_first_gen && financial?.family_income_bracket) {
    if (LOW_INCOME_BRACKETS.includes(financial.family_income_bracket)) {
      return {
        eligible: true,
        reason: "As a first-generation, low-income student, you qualify for free Pro access.",
        missingFields: [],
      };
    }
  }

  if (profile.is_first_gen) {
    return {
      eligible: false,
      reason: `You're first-gen, but your income bracket doesn't qualify. Pro is ${proMonthlyLabel()} with full access.`,
      missingFields: [],
    };
  }

  return {
    eligible: false,
    reason: `Based on your profile, you don't currently qualify for subsidized Pro. Pro is ${proMonthlyLabel()}.`,
    missingFields: [],
  };
}
