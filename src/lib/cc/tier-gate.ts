// Tier gate — single source of truth for the § 5 tier matrix of
// docs/superpowers/plans/2026-04-22-guest-trial-funnel.md
//
// Every API route that touches a gated capability calls `assertCapacity` at the
// top of its handler. Client code does NOT replicate this logic — it gets the
// allowed caps via /api/cc/me/tier and displays them, then relies on the server
// returning 402 when a user actually crosses a line.
import { createAdminSupabase } from "@/lib/supabase-server";

export type Tier = "guest" | "free" | "pro";

export type Capability =
  | "schoolsMax"
  | "coachMessagesPerDay"
  | "coachVoiceMinutesPerDay"
  | "activityBulletsMax"
  | "resumeParsesMax"
  | "essaysMax"
  | "reviewsMax"
  | "supplementsAllowed"
  | "mockInterviewsMax"
  | "counselorShareLink"
  | "financialAidAppeal"
  | "fafsaWalkthrough"
  | "scholarshipMatching"
  | "crossDeviceSync";

export type ScholarshipMatchingLevel = "none" | "view" | "full";

export interface TierCaps {
  schoolsMax: number;
  coachMessagesPerDay: number;
  coachVoiceMinutesPerDay: number;
  activityBulletsMax: number;
  resumeParsesMax: number;
  essaysMax: number;
  reviewsMax: number;
  supplementsAllowed: boolean;
  mockInterviewsMax: number;
  counselorShareLink: boolean;
  financialAidAppeal: boolean;
  fafsaWalkthrough: boolean;
  scholarshipMatching: ScholarshipMatchingLevel;
  crossDeviceSync: boolean;
}

const UNLIMITED = Number.POSITIVE_INFINITY;

// Pro is "unlimited" under fair use (founder, 2026-09-25): generous daily
// caps that stop runaway or automated use, tunable without a deploy.
function proFairUse(envName: string, fallback: number): number {
  const n = Number(process.env[envName]);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export const TIER_CAPS: Record<Tier, TierCaps> = {
  guest: {
    schoolsMax: 3,
    coachMessagesPerDay: 20, // total for guest — not per day, but we key on "today" since guests are ephemeral
    coachVoiceMinutesPerDay: 0,
    activityBulletsMax: 3,
    resumeParsesMax: 0,
    essaysMax: 1,
    reviewsMax: 0,
    supplementsAllowed: false,
    mockInterviewsMax: 0,
    counselorShareLink: false,
    financialAidAppeal: false,
    fafsaWalkthrough: false,
    scholarshipMatching: "none",
    crossDeviceSync: false,
  },
  free: {
    schoolsMax: 5,
    coachMessagesPerDay: 200,
    coachVoiceMinutesPerDay: 10,
    activityBulletsMax: 10,
    resumeParsesMax: 1,
    essaysMax: 1,
    reviewsMax: 1,
    supplementsAllowed: false,
    mockInterviewsMax: 1,
    counselorShareLink: false,
    financialAidAppeal: false,
    fafsaWalkthrough: false,
    scholarshipMatching: "view",
    crossDeviceSync: true,
  },
  pro: {
    schoolsMax: UNLIMITED,
    coachMessagesPerDay: proFairUse("PRO_FAIR_USE_COACH_MESSAGES_PER_DAY", 300),
    coachVoiceMinutesPerDay: proFairUse("PRO_FAIR_USE_VOICE_MINUTES_PER_DAY", 120),
    activityBulletsMax: 10, // Common App only has 10 slots — this is a hard cap regardless
    resumeParsesMax: UNLIMITED,
    essaysMax: UNLIMITED,
    reviewsMax: UNLIMITED,
    supplementsAllowed: true,
    mockInterviewsMax: UNLIMITED,
    counselorShareLink: true,
    financialAidAppeal: true,
    fafsaWalkthrough: true,
    scholarshipMatching: "full",
    crossDeviceSync: true,
  },
};

const GATES_DISABLED = process.env.NEXT_PUBLIC_TIER_GATES_DISABLED === "true";

// Resolve a user's tier using v_user_tier. Admin client so we bypass RLS —
// this runs inside API handlers that have already authenticated the caller.
export async function getTier(userId: string): Promise<Tier> {
  if (!userId) return "guest";

  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from("v_user_tier")
    .select("tier")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return "free";
  const tier = (data as { tier: Tier }).tier;
  return tier === "guest" || tier === "free" || tier === "pro" ? tier : "free";
}

export function getCaps(tier: Tier): TierCaps {
  return TIER_CAPS[tier];
}

export interface AssertOk {
  ok: true;
  tier: Tier;
  remaining: number | null;
  limit: number | null;
}

export interface AssertBlocked {
  ok: false;
  tier: Tier;
  capability: Capability;
  reason: string;
  upgradeTo: "free" | "pro";
  limit: number | null;
}

export type AssertResult = AssertOk | AssertBlocked;

// Check whether a user can perform `capability`. For counted capabilities,
// pass the current usage (e.g., current school-list count). For boolean
// capabilities, pass null.
//
// Returns AssertOk on pass, or AssertBlocked with enough context for the
// caller to render an upgrade modal (UpgradeModal keys off capability).
export async function assertCapacity(
  userId: string,
  capability: Capability,
  currentUsage: number | null
): Promise<AssertResult> {
  const tier = await getTier(userId);

  // Emergency kill switch — env flag disables all gating.
  // Useful for staging incidents / to unblock if a bad deploy breaks gating.
  if (GATES_DISABLED) {
    return { ok: true, tier, remaining: null, limit: null };
  }

  const caps = TIER_CAPS[tier];
  const capValue = caps[capability] as number | boolean | ScholarshipMatchingLevel;

  // Boolean capabilities: pro-only features. No usage count needed.
  if (typeof capValue === "boolean") {
    if (capValue) return { ok: true, tier, remaining: null, limit: null };
    return {
      ok: false,
      tier,
      capability,
      reason: reasonFor(capability, tier),
      upgradeTo: "pro",
      limit: null,
    };
  }

  // Scholarship matching is an enum, not a count.
  if (capability === "scholarshipMatching") {
    const level = capValue as ScholarshipMatchingLevel;
    if (level === "full") return { ok: true, tier, remaining: null, limit: null };
    return {
      ok: false,
      tier,
      capability,
      reason: reasonFor(capability, tier),
      upgradeTo: "pro",
      limit: null,
    };
  }

  // Numeric cap. Unlimited = Infinity passes every check.
  const limit = capValue as number;
  if (!isFinite(limit)) return { ok: true, tier, remaining: null, limit: null };

  const usage = currentUsage ?? 0;
  if (usage < limit) {
    return { ok: true, tier, remaining: limit - usage, limit };
  }

  // Blocked. Route guests to free tier first (lower friction), free → pro.
  const upgradeTo: "free" | "pro" = tier === "guest" ? "free" : "pro";
  return {
    ok: false,
    tier,
    capability,
    reason: reasonFor(capability, tier),
    upgradeTo,
    limit,
  };
}

function reasonFor(capability: Capability, tier: Tier): string {
  if (tier === "pro") {
    return "You've reached today's fair-use limit for this feature. It resets at midnight UTC.";
  }
  const caps = TIER_CAPS[tier];
  const v = caps[capability];
  switch (capability) {
    case "schoolsMax":
      return `Your ${tier} plan allows ${v} schools on your list.`;
    case "coachMessagesPerDay":
      return tier === "guest"
        ? `Guests get ${v} Coach Kairos messages — sign up free to keep going.`
        : `You've hit today's ${v}-message limit on the free plan.`;
    case "coachVoiceMinutesPerDay":
      return tier === "guest"
        ? "Voice mode unlocks after you sign up."
        : `Free plan gets ${v} minutes of voice coaching per day.`;
    case "activityBulletsMax":
      return `${tier === "guest" ? "Guests" : "Free users"} get ${v} activity bullets optimized — upgrade for all 10.`;
    case "resumeParsesMax":
      return tier === "guest"
        ? "Resume parsing requires a free account."
        : "You've used your resume parse — Pro gets unlimited.";
    case "essaysMax":
      return tier === "guest"
        ? "Guests can draft 1 essay — sign up free to draft more."
        : "Free plan allows 1 essay draft. Pro gets unlimited.";
    case "reviewsMax":
      return tier === "guest"
        ? "Essay review requires a free account."
        : "You've used your free essay review. Pro unlocks unlimited reviews + supplements.";
    case "supplementsAllowed":
      return "Supplemental essays (Why-This-School etc.) are a Pro feature.";
    case "mockInterviewsMax":
      return tier === "guest"
        ? "Mock interview requires a free account."
        : "You've used your free mock interview. Pro gets unlimited.";
    case "counselorShareLink":
      return "Counselor share link is a Pro feature.";
    case "financialAidAppeal":
      return "Financial-aid appeal letter generation is a Pro feature.";
    case "fafsaWalkthrough":
      return "FAFSA walkthrough is a Pro feature.";
    case "scholarshipMatching":
      return "Full scholarship matching + alerts require Pro.";
    case "crossDeviceSync":
      return "Signing up saves your work across devices.";
    default:
      return "Upgrade required.";
  }
}

// Lightweight helper for route handlers: run an assert and, on block, return
// a Response with 402 + JSON payload the client can pass to UpgradeModal.
export function blockedResponse(blocked: AssertBlocked): Response {
  // A Pro user can't upgrade further: a fair-use limit is a 429, not a paywall.
  if (blocked.tier === "pro") {
    return new Response(
      JSON.stringify({
        error: blocked.reason,
        fairUse: true,
        capability: blocked.capability,
        tier: blocked.tier,
        limit: blocked.limit,
      }),
      { status: 429, headers: { "Content-Type": "application/json" } },
    );
  }
  return new Response(
    JSON.stringify({
      error: blocked.reason,
      upgradeTo: blocked.upgradeTo,
      capability: blocked.capability,
      tier: blocked.tier,
      limit: blocked.limit,
    }),
    {
      status: 402,
      headers: { "Content-Type": "application/json" },
    }
  );
}
