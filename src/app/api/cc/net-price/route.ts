// POST /api/cc/net-price — estimate net price for every school on the
// student's list (and any extra school names the client passes in). Pulls
// the student's profile + financial profile from Supabase so the estimator
// can use household income / size / dependents when available.
//
// Shipped 2026-05-17 per the Cookiy validation finding that "unified net
// price for edge cases" is the top opportunity area (6/6 interviews).

import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../helpers";
import { estimateNetPricesForList, type NetPriceInputs } from "@/lib/cc/net-price";
import type { AffordabilityValue } from "@/lib/cc/affordability";

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as {
    extraSchoolNames?: string[];
  };
  const extra = Array.isArray(body.extraSchoolNames) ? body.extraSchoolNames.filter((x) => typeof x === "string") : [];

  const db = createAdminSupabase();
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id, is_international, is_transfer_student, is_first_gen, affordability_value")
    .eq("user_id", auth.user.id)
    .maybeSingle();
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const [{ data: financial }, { data: schools }] = await Promise.all([
    db
      .from("cc_financial_profiles")
      .select("household_income_bracket, household_size, dependents_in_college, pell_eligible_estimate")
      .eq("student_id", profile.id)
      .maybeSingle(),
    db
      .from("cc_student_schools")
      .select("cc_schools(name)")
      .eq("student_id", profile.id),
  ]);

  // cc_student_schools has no name column; the name lives on the joined school.
  const listNames = (schools ?? [])
    .map((s) => {
      const rel = (s as { cc_schools?: { name?: string | null } | { name?: string | null }[] | null }).cc_schools;
      return Array.isArray(rel) ? rel[0]?.name : rel?.name;
    })
    .filter((s): s is string => typeof s === "string");
  const allNames = Array.from(new Set([...listNames, ...extra]));

  const inputs: NetPriceInputs = {
    isInternational: Boolean(profile.is_international),
    isTransfer: Boolean(profile.is_transfer_student),
    isFirstGen: Boolean(profile.is_first_gen),
    affordabilityValue: (profile.affordability_value as AffordabilityValue | null) ?? null,
    householdIncomeBracket: financial?.household_income_bracket ?? null,
    householdSize: financial?.household_size ?? null,
    dependentsInCollege: financial?.dependents_in_college ?? null,
    pellEligibleEstimate: financial?.pell_eligible_estimate ?? null,
  };

  const { estimates, uncovered } = estimateNetPricesForList(allNames, inputs);

  return NextResponse.json({
    inputs: {
      isInternational: inputs.isInternational,
      isTransfer: inputs.isTransfer,
      isFirstGen: inputs.isFirstGen,
      affordabilityValue: inputs.affordabilityValue,
      hasIncomeBracket: Boolean(inputs.householdIncomeBracket),
    },
    estimates,
    uncovered,
    catalogSize: 12,
    generatedAt: new Date().toISOString(),
  });
}
