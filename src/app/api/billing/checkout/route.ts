// src/app/api/billing/checkout/route.ts
// Creates a Paddle checkout transaction (server-side).
// Env: PADDLE_API_KEY, NEXT_PUBLIC_PADDLE_PRICE_ID_PRO_MONTHLY, NEXT_PUBLIC_PADDLE_PRICE_ID_PRO_ANNUAL
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-auth";
import { createCheckoutTransaction } from "@/lib/paddle";
import type { CheckoutRequest } from "@/types/billing";

const PRO_MONTHLY_PRICE = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PRO_MONTHLY || "";
const PRO_ANNUAL_PRICE = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PRO_ANNUAL || "";

export async function POST(req: NextRequest) {
  // Authenticate the user
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: CheckoutRequest & { billing?: "monthly" | "annual" };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { planId, billing = "monthly" } = body;

  if (planId !== "pro") {
    return NextResponse.json(
      { error: "Invalid plan. Only 'pro' is available for checkout." },
      { status: 400 }
    );
  }

  const priceId = billing === "annual" ? PRO_ANNUAL_PRICE : PRO_MONTHLY_PRICE;
  if (!priceId) {
    return NextResponse.json(
      { error: "Price ID not configured. Set NEXT_PUBLIC_PADDLE_PRICE_ID_PRO_MONTHLY or PRO_ANNUAL in env." },
      { status: 500 }
    );
  }

  const result = await createCheckoutTransaction({
    priceId,
    userId: user.id,
    userEmail: user.email,
    plan: "pro",
  });

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  return NextResponse.json({
    transactionId: result.transactionId,
    checkoutUrl: result.checkoutUrl,
  });
}
