// /counselor/payouts — Stripe Connect Express onboarding + payout status.
// Onboarding runs through POST /api/counselor/payouts/onboard (Stripe-hosted
// Express flow); status is refreshed client-side by StripeConnectCard.

import { redirect } from "next/navigation";
import Link from "next/link";
import { CreditCard, ArrowRight } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase-auth";
import { getCounselorForUser } from "@/lib/cc/counselor-helpers";
import StripeConnectCard from "@/components/counselor/StripeConnectCard";

export default async function PayoutsPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const counselor = await getCounselorForUser(user.id);
  if (!counselor) redirect("/counselor/onboard");

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="w-6 h-6 text-[#D4AF37]" />
        <h1 className="text-xl font-bold text-white">Payouts</h1>
      </div>

      <StripeConnectCard initialAccountId={counselor.stripe_account_id} />

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <p className="text-[11px] uppercase tracking-wider text-white/55 mb-2">
          Earnings (lifetime)
        </p>
        <p className="text-2xl font-bold text-[#D4AF37]">$0</p>
        <p className="text-[11.5px] text-white/45 mt-1">
          Earnings and payout history appear here after your first completed
          engagement settles.
        </p>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Link
          href="/counselor/dashboard"
          className="inline-flex items-center gap-1 text-[12px] text-white/55 hover:text-[#D4AF37]"
        >
          <ArrowRight className="w-3 h-3 rotate-180" /> Back to dashboard
        </Link>
      </div>
    </div>
  );
}
