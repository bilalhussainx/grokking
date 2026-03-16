// src/lib/credits.ts
import { createAdminSupabase } from "@/lib/supabase-auth";

export const CREDIT_COSTS = {
  coach_text: 1,
  coach_voice_per_min: 3,
  hint: 1,
  grade: 2,
  interview: 50,
  interview_score: 5,
  lesson_generation: 10,
  voice_session: 3,
} as const;

export type CreditAction = keyof typeof CREDIT_COSTS | "signup_bonus" | "referral" | "monthly_refresh" | "streak_bonus" | "course_complete";

/**
 * Deduct credits atomically. Returns true if sufficient balance, false if insufficient.
 */
export async function deductCredits(
  userId: string,
  amount: number,
  action: string,
  refId?: string
): Promise<boolean> {
  const db = createAdminSupabase();
  const { data, error } = await db.rpc("deduct_credits", {
    p_user_id: userId,
    p_amount: amount,
    p_action: action,
    p_ref_id: refId || null,
  });
  if (error) {
    console.error("[Credits] Deduction error:", error);
    return false;
  }
  return data === true;
}

/**
 * Add credits (capped at 5000). Returns new balance.
 */
export async function addCredits(
  userId: string,
  amount: number,
  action: string
): Promise<number> {
  const db = createAdminSupabase();
  const { data, error } = await db.rpc("add_credits", {
    p_user_id: userId,
    p_amount: amount,
    p_action: action,
  });
  if (error) {
    console.error("[Credits] Add error:", error);
    return 0;
  }
  return data as number;
}

/**
 * Get credit balance for a user.
 */
export async function getBalance(userId: string): Promise<number> {
  const db = createAdminSupabase();
  const { data, error } = await db.rpc("get_credit_balance", {
    p_user_id: userId,
  });
  if (error) {
    console.error("[Credits] Balance error:", error);
    return 0;
  }
  return (data as number) || 0;
}

/**
 * Check if user has had a free interview (first one is free).
 */
export async function hasUsedFreeInterview(userId: string): Promise<boolean> {
  const db = createAdminSupabase();
  const { count, error } = await db
    .from("credit_txns")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("action", "interview");
  if (error) return true; // Fail safe — charge credits
  return (count || 0) > 0;
}
