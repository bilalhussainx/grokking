// POST /api/billing/stripe/webhook — Stripe webhook handler. Verifies the
// signature with STRIPE_WEBHOOK_SECRET, then mirrors subscription state into
// the user_subscriptions table so the rest of the app can gate Pro features
// off it.
//
// Subscribed events (configure in the Stripe dashboard):
//   - checkout.session.completed
//   - customer.subscription.created
//   - customer.subscription.updated
//   - customer.subscription.deleted
//   - invoice.payment_succeeded
//   - invoice.payment_failed
//
// Required env:
//   STRIPE_SECRET_KEY              — same secret used by /checkout route
//   STRIPE_WEBHOOK_SECRET          — copied from the dashboard (whsec_...)
//   SUPABASE_SERVICE_ROLE_KEY      — webhook needs to write across users
//   NEXT_PUBLIC_SUPABASE_URL       — already set everywhere
//
// IMPORTANT: this route reads the RAW body for signature verification.
// Next.js doesn't auto-parse JSON until we do — req.text() returns the raw
// string before parsing, and we hand that to Stripe along with the
// stripe-signature header.

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
// Disable caching — webhook calls are idempotent on Stripe's side but must
// always reach the handler.
export const dynamic = "force-dynamic";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

function admin() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

type SubUpdate = {
  user_id?: string;
  plan?: "free" | "pro";
  status?: "active" | "canceled" | "paused" | "past_due" | "trialing";
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  stripe_price_id?: string | null;
  current_period_start?: string | null;
  current_period_end?: string | null;
  cancel_at_period_end?: boolean;
};

// Map Stripe subscription.status → our enum.
function mapStatus(s: Stripe.Subscription.Status): SubUpdate["status"] {
  switch (s) {
    case "active":
      return "active";
    case "trialing":
      return "trialing";
    case "past_due":
    case "unpaid":
      return "past_due";
    case "canceled":
    case "incomplete_expired":
      return "canceled";
    case "paused":
      return "paused";
    case "incomplete":
    default:
      return "active"; // best-effort while Stripe still resolves the charge
  }
}

// Resolve which user_id this Stripe subscription belongs to. Order:
//   1) subscription.metadata.user_id (we set this at checkout time)
//   2) checkout session client_reference_id (only on the checkout event)
//   3) existing row matched by stripe_customer_id
async function resolveUserId(
  db: ReturnType<typeof admin>,
  options: {
    metadataUserId?: string | null;
    customerId?: string | null;
    clientReferenceId?: string | null;
  },
): Promise<string | null> {
  if (options.metadataUserId) return options.metadataUserId;
  if (options.clientReferenceId) return options.clientReferenceId;
  if (options.customerId) {
    const { data } = await db
      .from("user_subscriptions")
      .select("user_id")
      .eq("stripe_customer_id", options.customerId)
      .maybeSingle();
    if (data?.user_id) return data.user_id as string;
  }
  return null;
}

async function upsertSubscription(
  db: ReturnType<typeof admin>,
  userId: string,
  patch: SubUpdate,
) {
  const { data: existing } = await db
    .from("user_subscriptions")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    const { error } = await db.from("user_subscriptions").update(patch).eq("user_id", userId);
    if (error) throw error;
  } else {
    const { error } = await db.from("user_subscriptions").insert({ user_id: userId, ...patch });
    if (error) throw error;
  }

  // Mirror the access state onto user_profiles.role so the rest of the
  // app — trial banner, AIStateContext.isProUser, PricingCards.isPro —
  // sees a consistent view. isPro() (credentials-pro-gate) reads
  // user_subscriptions, but a lot of UI still gates on profile.role,
  // and without this sync the UI shows Pro after cancel until the next
  // page reload picks up the trial trigger expiring.
  if (patch.plan === "pro" && (patch.status === "active" || patch.status === "trialing")) {
    await db.from("user_profiles").update({ role: "pro" }).eq("id", userId);
  } else if (patch.plan === "free" || patch.status === "canceled") {
    await db.from("user_profiles").update({ role: "student" }).eq("id", userId);
  }
  // Note: past_due / paused intentionally don't flip role — we want to
  // keep showing Pro UI while Stripe retries failed payments, otherwise
  // a single declined invoice yanks access mid-cycle.
}

function tsToISO(unixSeconds: number | null | undefined): string | null {
  if (unixSeconds == null) return null;
  return new Date(unixSeconds * 1000).toISOString();
}

export async function POST(req: NextRequest) {
  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured (missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET)" },
      { status: 500 },
    );
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const rawBody = await req.text();
  // Let the SDK pick its default API version (see checkout route note).
  const stripe = new Stripe(STRIPE_SECRET_KEY);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[stripe/webhook] signature verification failed", err);
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  const db = admin();

  try {
    switch (event.type) {
      // ──────────────────────────────────────────────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Marketplace branch — counselor engagement bookings.
        // The booking endpoint sets metadata.marketplace="engagement" so we
        // can dispatch without inspecting line items. Flip the engagement
        // from "proposed" → "paid_pending_start" and stamp paid_at +
        // payment-intent ids for the payouts dashboard.
        if (session.metadata?.marketplace === "engagement") {
          const engagementId = session.metadata.engagement_id as string | undefined;
          if (!engagementId) {
            console.warn("[stripe/webhook] engagement checkout missing engagement_id", session.id);
            break;
          }
          const paymentIntentId =
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id ?? null;
          const amountTotal = (session.amount_total ?? 0) / 100;
          const { error: engErr } = await db
            .from("cc_counselor_engagements")
            .update({
              status: "paid_pending_start",
              paid_at: new Date().toISOString(),
              price_usd_paid: amountTotal,
              stripe_payment_intent_id: paymentIntentId,
            })
            .eq("id", engagementId)
            .eq("status", "proposed"); // idempotency — only first webhook flips
          if (engErr) {
            console.error("[stripe/webhook] engagement update failed", engagementId, engErr);
          } else {
            console.log("[stripe/webhook] engagement paid", engagementId, `$${amountTotal}`);
          }
          break;
        }

        if (session.mode !== "subscription") break;

        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id ?? null;
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id ?? null;

        const userId = await resolveUserId(db, {
          metadataUserId: (session.metadata?.user_id as string | undefined) ?? null,
          clientReferenceId: session.client_reference_id ?? null,
          customerId,
        });
        if (!userId) {
          console.warn("[stripe/webhook] checkout.session.completed: no user_id", session.id);
          break;
        }

        // Pull the freshly-created subscription so we have all fields.
        let sub: Stripe.Subscription | null = null;
        if (subscriptionId) {
          sub = await stripe.subscriptions.retrieve(subscriptionId);
        }

        await upsertSubscription(db, userId, {
          plan: "pro",
          status: sub ? mapStatus(sub.status) : "active",
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          stripe_price_id: sub?.items?.data?.[0]?.price?.id ?? null,
          current_period_start: tsToISO(
            (sub as unknown as { current_period_start?: number } | null)?.current_period_start,
          ),
          current_period_end: tsToISO(
            (sub as unknown as { current_period_end?: number } | null)?.current_period_end,
          ),
          cancel_at_period_end: sub?.cancel_at_period_end ?? false,
        });
        break;
      }

      // ──────────────────────────────────────────────────────────────────
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId =
          typeof sub.customer === "string" ? sub.customer : sub.customer.id;

        const userId = await resolveUserId(db, {
          metadataUserId: (sub.metadata?.user_id as string | undefined) ?? null,
          customerId,
        });
        if (!userId) {
          console.warn("[stripe/webhook] subscription event: no user_id", sub.id);
          break;
        }

        await upsertSubscription(db, userId, {
          plan: "pro",
          status: mapStatus(sub.status),
          stripe_customer_id: customerId,
          stripe_subscription_id: sub.id,
          stripe_price_id: sub.items.data[0]?.price.id ?? null,
          current_period_start: tsToISO(
            (sub as unknown as { current_period_start?: number }).current_period_start,
          ),
          current_period_end: tsToISO(
            (sub as unknown as { current_period_end?: number }).current_period_end,
          ),
          cancel_at_period_end: sub.cancel_at_period_end ?? false,
        });
        break;
      }

      // ──────────────────────────────────────────────────────────────────
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId =
          typeof sub.customer === "string" ? sub.customer : sub.customer.id;
        const userId = await resolveUserId(db, {
          metadataUserId: (sub.metadata?.user_id as string | undefined) ?? null,
          customerId,
        });
        if (!userId) break;

        await upsertSubscription(db, userId, {
          plan: "free",
          status: "canceled",
          cancel_at_period_end: false,
          // Keep stripe_* identifiers so we can recover history; they don't
          // gate Pro access (status + plan do).
        });
        break;
      }

      // ──────────────────────────────────────────────────────────────────
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId =
          typeof invoice.customer === "string"
            ? invoice.customer
            : invoice.customer?.id ?? null;
        // Newer Stripe API versions removed `subscription` from the top-level
        // Invoice; it now lives on a parent record. Read it defensively.
        const invoiceWithSub = invoice as unknown as {
          subscription?: string | { id?: string } | null;
          parent?: { subscription_details?: { subscription?: string | { id?: string } } } | null;
        };
        const subRef =
          invoiceWithSub.subscription ??
          invoiceWithSub.parent?.subscription_details?.subscription ??
          null;
        const subscriptionId =
          typeof subRef === "string" ? subRef : (subRef?.id ?? null);
        if (!subscriptionId) break;

        const userId = await resolveUserId(db, { customerId });
        if (!userId) break;

        // Refresh full subscription state from the latest paid invoice.
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        await upsertSubscription(db, userId, {
          plan: "pro",
          status: mapStatus(sub.status),
          stripe_customer_id: customerId,
          stripe_subscription_id: sub.id,
          current_period_start: tsToISO(
            (sub as unknown as { current_period_start?: number }).current_period_start,
          ),
          current_period_end: tsToISO(
            (sub as unknown as { current_period_end?: number }).current_period_end,
          ),
          cancel_at_period_end: sub.cancel_at_period_end ?? false,
        });
        break;
      }

      // ──────────────────────────────────────────────────────────────────
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId =
          typeof invoice.customer === "string"
            ? invoice.customer
            : invoice.customer?.id ?? null;
        if (!customerId) break;

        const userId = await resolveUserId(db, { customerId });
        if (!userId) break;
        await upsertSubscription(db, userId, { status: "past_due" });
        break;
      }

      // ──────────────────────────────────────────────────────────────────
      default:
        // Stripe sends a lot of event types — ignore the ones we don't act on.
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(`[stripe/webhook] handler error for ${event.type}`, err);
    // 500 lets Stripe retry. If the error is permanent (e.g. missing user),
    // we already logged it above and returned earlier.
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }
}
