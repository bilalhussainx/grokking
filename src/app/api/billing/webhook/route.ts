// src/app/api/billing/webhook/route.ts
// Paddle webhook handler — verifies signature and updates user_subscriptions table.
// Env: PADDLE_WEBHOOK_SECRET
//
// Handled events:
//   subscription.created   — insert/upsert subscription row, upgrade user role
//   subscription.activated — mark active, upgrade role, grant credits
//   subscription.updated   — sync status, period, scheduled changes
//   subscription.canceled  — mark canceled (keep access until period end)
//   subscription.paused    — mark paused
//   subscription.past_due  — mark past_due
//   transaction.completed  — monthly credit refresh
import { NextRequest, NextResponse } from "next/server";
import { verifyPaddleWebhook } from "@/lib/paddle";
import { createAdminSupabase } from "@/lib/supabase-auth";
import { addCredits } from "@/lib/credits";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("Paddle-Signature") || "";

  if (!verifyPaddleWebhook(rawBody, signature)) {
    console.error("[Paddle Webhook] Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);
  const eventType: string = event.event_type;
  const data = event.data;
  const db = createAdminSupabase();

  console.log("[Paddle Webhook]", eventType, data?.id);

  try {
    switch (eventType) {
      // -----------------------------------------------------------------
      // New subscription created
      // -----------------------------------------------------------------
      case "subscription.created": {
        const userId = data.custom_data?.userId;
        if (!userId) {
          console.warn("[Paddle Webhook] subscription.created missing userId in custom_data");
          break;
        }

        await db.from("user_subscriptions").upsert(
          {
            user_id: userId,
            paddle_subscription_id: data.id,
            paddle_customer_id: data.customer_id,
            plan: data.custom_data?.plan || "pro",
            status: mapPaddleStatus(data.status),
            current_period_start: data.current_billing_period?.starts_at || null,
            current_period_end: data.current_billing_period?.ends_at || null,
            cancel_at_period_end: false,
          },
          { onConflict: "user_id" }
        );

        // Upgrade user role to pro
        await db
          .from("user_profiles")
          .update({ role: "pro" })
          .eq("id", userId);

        break;
      }

      // -----------------------------------------------------------------
      // Subscription activated (trial ended, payment succeeded)
      // -----------------------------------------------------------------
      case "subscription.activated": {
        const sub = await findSubByPaddleId(db, data.id);
        if (sub) {
          await db
            .from("user_subscriptions")
            .update({
              status: "active",
              current_period_start: data.current_billing_period?.starts_at || null,
              current_period_end: data.current_billing_period?.ends_at || null,
            })
            .eq("paddle_subscription_id", data.id);

          // Ensure role is pro
          await db
            .from("user_profiles")
            .update({ role: "pro" })
            .eq("id", sub.user_id);

          // Grant monthly credits
          await addCredits(sub.user_id, 500, "monthly_refresh");
        }
        break;
      }

      // -----------------------------------------------------------------
      // Subscription updated (plan change, period change, scheduled cancel)
      // -----------------------------------------------------------------
      case "subscription.updated": {
        const updates: Record<string, unknown> = {
          status: mapPaddleStatus(data.status),
          current_period_start: data.current_billing_period?.starts_at || null,
          current_period_end: data.current_billing_period?.ends_at || null,
          cancel_at_period_end: data.scheduled_change?.action === "cancel",
        };

        // If Paddle says the subscription is now truly canceled (past period end),
        // downgrade the user role.
        if (data.status === "canceled") {
          const sub = await findSubByPaddleId(db, data.id);
          if (sub) {
            await db
              .from("user_profiles")
              .update({ role: "student" })
              .eq("id", sub.user_id);
          }
        }

        await db
          .from("user_subscriptions")
          .update(updates)
          .eq("paddle_subscription_id", data.id);

        break;
      }

      // -----------------------------------------------------------------
      // Subscription canceled — user retains access until period end
      // -----------------------------------------------------------------
      case "subscription.canceled": {
        await db
          .from("user_subscriptions")
          .update({
            status: "canceled",
            cancel_at_period_end: true,
          })
          .eq("paddle_subscription_id", data.id);

        // Do NOT downgrade role here — user has paid through current_period_end.
        break;
      }

      // -----------------------------------------------------------------
      // Subscription paused
      // -----------------------------------------------------------------
      case "subscription.paused": {
        const sub = await findSubByPaddleId(db, data.id);
        await db
          .from("user_subscriptions")
          .update({ status: "paused" })
          .eq("paddle_subscription_id", data.id);

        if (sub) {
          await db
            .from("user_profiles")
            .update({ role: "student" })
            .eq("id", sub.user_id);
        }
        break;
      }

      // -----------------------------------------------------------------
      // Payment past due
      // -----------------------------------------------------------------
      case "subscription.past_due": {
        await db
          .from("user_subscriptions")
          .update({ status: "past_due" })
          .eq("paddle_subscription_id", data.id);
        break;
      }

      // -----------------------------------------------------------------
      // Transaction completed — credit refresh for recurring payments
      // -----------------------------------------------------------------
      case "transaction.completed": {
        if (data.subscription_id) {
          const sub = await findSubByPaddleId(db, data.subscription_id);
          if (sub) {
            await addCredits(sub.user_id, 500, "monthly_refresh");
          }
        }
        break;
      }

      default:
        console.log("[Paddle Webhook] Unhandled event:", eventType);
    }
  } catch (err) {
    console.error("[Paddle Webhook] Error processing:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mapPaddleStatus(
  paddleStatus: string
): "active" | "canceled" | "paused" | "past_due" | "trialing" {
  const map: Record<string, "active" | "canceled" | "paused" | "past_due" | "trialing"> = {
    active: "active",
    canceled: "canceled",
    paused: "paused",
    past_due: "past_due",
    trialing: "trialing",
  };
  return map[paddleStatus] || "active";
}

async function findSubByPaddleId(
  db: ReturnType<typeof createAdminSupabase>,
  paddleSubscriptionId: string
) {
  const { data } = await db
    .from("user_subscriptions")
    .select("user_id")
    .eq("paddle_subscription_id", paddleSubscriptionId)
    .single();
  return data;
}
