// POST /api/counselor/students/[studentId]/grant-pro
//
// Head-only. Comps Pro access for a student on the agency roster — the
// "up to 20 pilot students get Pro free, no questions asked" promise from
// the AdAstra partnership write-up. Distinct from /api/billing/subsidized,
// which is student self-service gated on Pell/first-gen eligibility; this is
// a counselor-authorized grant for ANY background.
//
// Mirrors the subsidized marker pattern: user_subscriptions row with
// stripe_subscription_id = "pilot-grant" so the status route + Stripe webhook
// can tell a comped account from a paid one (real Stripe ids are `sub_`-prefixed).
//
// Status codes: 200 granted/already · 401 unauth · 403 not head / student not
// on roster · 500 db failure.
import { NextResponse } from "next/server";
import { getAuthUser, createAdminSupabase } from "@/lib/supabase-auth";
import { getStudentVisibility } from "@/lib/cc/student-roster";

export const runtime = "nodejs";

export async function POST(_req: Request, { params }: { params: Promise<{ studentId: string }> }) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const { studentId } = await params;
  const vis = await getStudentVisibility(user.id, studentId);
  if (!vis) {
    return NextResponse.json({ error: "student not on your roster" }, { status: 403 });
  }
  // Pilot comps are a head decision (billing/seat owner), not a per-counselor one.
  if (vis.viewerRole !== "head") {
    return NextResponse.json({ error: "only the agency head can grant pilot Pro" }, { status: 403 });
  }

  const db = createAdminSupabase();

  const { data: existing } = await db
    .from("user_subscriptions")
    .select("plan, status, stripe_subscription_id")
    .eq("user_id", studentId)
    .maybeSingle();

  if (existing?.plan === "pro" && (existing.status === "active" || existing.status === "trialing")) {
    return NextResponse.json({ already: true, message: "Student already has Pro access." });
  }

  const { error } = await db
    .from("user_subscriptions")
    .upsert(
      {
        user_id: studentId,
        stripe_subscription_id: "pilot-grant",
        stripe_customer_id: null,
        plan: "pro",
        status: "active",
        current_period_start: new Date().toISOString(),
        current_period_end: null,
        cancel_at_period_end: false,
      },
      { onConflict: "user_id" },
    );

  if (error) {
    console.error("[counselor grant-pro] upsert failed:", error);
    return NextResponse.json({ error: "could not grant Pro; please retry" }, { status: 500 });
  }

  return NextResponse.json({ granted: true, message: "Pilot Pro access granted." });
}
