// src/app/api/webhooks/paddle/route.ts
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
  const eventType = event.event_type;
  const data = event.data;
  const db = createAdminSupabase();

  console.log("[Paddle Webhook]", eventType, data?.id);

  try {
    switch (eventType) {
      case "subscription.created": {
        const userId = data.custom_data?.userId;
        if (!userId) break;
        await db.from("subscriptions").upsert({
          user_id: userId,
          paddle_subscription_id: data.id,
          paddle_customer_id: data.customer_id,
          plan: data.custom_data?.plan || "pro",
          status: data.status,
          current_period_end: data.current_billing_period?.ends_at,
        }, { onConflict: "paddle_subscription_id" });
        break;
      }

      case "subscription.activated": {
        const sub = await db
          .from("subscriptions")
          .select("user_id")
          .eq("paddle_subscription_id", data.id)
          .single();
        if (sub.data) {
          await db.from("subscriptions").update({ status: "active", updated_at: new Date().toISOString() }).eq("paddle_subscription_id", data.id);
          await db.from("user_profiles").update({ role: "pro" }).eq("id", sub.data.user_id);
          await addCredits(sub.data.user_id, 500, "monthly_refresh");
        }
        break;
      }

      case "subscription.updated": {
        await db.from("subscriptions").update({
          status: data.status,
          current_period_end: data.current_billing_period?.ends_at,
          cancel_at_period_end: data.scheduled_change?.action === "cancel",
          updated_at: new Date().toISOString(),
        }).eq("paddle_subscription_id", data.id);
        break;
      }

      case "subscription.canceled": {
        // Mark cancel_at_period_end — user keeps access until current_period_end
        // Role downgrade happens when Paddle sends subscription.updated with status=canceled
        // after the billing period actually ends
        await db.from("subscriptions").update({
          status: "canceled",
          cancel_at_period_end: true,
          updated_at: new Date().toISOString(),
        }).eq("paddle_subscription_id", data.id);
        // Note: Do NOT downgrade role here — user has paid through current_period_end.
        // The middleware checks current_period_end to enforce access expiry.
        break;
      }

      case "subscription.past_due": {
        await db.from("subscriptions").update({ status: "past_due", updated_at: new Date().toISOString() }).eq("paddle_subscription_id", data.id);
        break;
      }

      case "transaction.completed": {
        // Monthly credit refresh for monthly subscribers
        if (data.subscription_id) {
          const sub = await db
            .from("subscriptions")
            .select("user_id, plan")
            .eq("paddle_subscription_id", data.subscription_id)
            .single();
          if (sub.data) {
            // Refresh credits on every successful transaction (works for both monthly and annual)
            // Paddle sends transaction.completed on each billing cycle
            await addCredits(sub.data.user_id, 500, "monthly_refresh");
          }
        }
        break;
      }
    }
  } catch (err) {
    console.error("[Paddle Webhook] Error processing:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
