// src/app/api/billing/subscription/route.ts
// GET  — Returns current user's subscription status
// POST — Cancel, pause, or resume subscription via Paddle API
// Env: PADDLE_API_KEY
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-auth";
import { createAdminSupabase } from "@/lib/supabase-auth";
import {
  cancelSubscription,
  pauseSubscription,
  resumeSubscription,
} from "@/lib/paddle";
import { rowToSubscription } from "@/types/billing";
import type { SubscriptionRow, SubscriptionAction } from "@/types/billing";

// ---------------------------------------------------------------------------
// GET /api/billing/subscription — current user's subscription
// ---------------------------------------------------------------------------
export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createAdminSupabase();
  const { data, error } = await db
    .from("user_subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("[Billing] Subscription fetch error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  // No subscription row means the user is on the free plan
  if (!data) {
    return NextResponse.json({
      subscription: {
        id: "",
        userId: user.id,
        paddleSubscriptionId: null,
        paddleCustomerId: null,
        plan: "free",
        status: "active",
        currentPeriodStart: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        createdAt: "",
        updatedAt: "",
      },
    });
  }

  return NextResponse.json({
    subscription: rowToSubscription(data as SubscriptionRow),
  });
}

// ---------------------------------------------------------------------------
// POST /api/billing/subscription — cancel, pause, or resume
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: SubscriptionAction;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { action } = body;
  if (!["cancel", "pause", "resume"].includes(action)) {
    return NextResponse.json(
      { error: "Invalid action. Use 'cancel', 'pause', or 'resume'." },
      { status: 400 }
    );
  }

  // Look up user's Paddle subscription ID
  const db = createAdminSupabase();
  const { data: sub } = await db
    .from("user_subscriptions")
    .select("paddle_subscription_id, status")
    .eq("user_id", user.id)
    .single();

  if (!sub?.paddle_subscription_id) {
    return NextResponse.json(
      { error: "No active subscription found" },
      { status: 404 }
    );
  }

  const paddleSubId = sub.paddle_subscription_id;
  let result: { data: unknown; error: string | null };

  switch (action) {
    case "cancel":
      result = await cancelSubscription(paddleSubId);
      break;
    case "pause":
      result = await pauseSubscription(paddleSubId);
      break;
    case "resume":
      result = await resumeSubscription(paddleSubId);
      break;
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  return NextResponse.json({ success: true, action });
}
