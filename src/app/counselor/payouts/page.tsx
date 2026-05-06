// /counselor/payouts — placeholder. Real Stripe Connect Express
// onboarding endpoint is the last piece of Phase 2; lands when the
// `POST /api/counselor/payouts/onboard` route ships. Until then this
// page documents the model so a counselor knows what's coming and a
// Stripe-account-id can be manually populated for testing.

import { redirect } from "next/navigation";
import Link from "next/link";
import {
  CreditCard,
  ExternalLink,
  Construction,
  ArrowRight,
} from "lucide-react";
import { createServerSupabase } from "@/lib/supabase-auth";
import { getCounselorForUser } from "@/lib/cc/counselor-helpers";

export default async function PayoutsPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const counselor = await getCounselorForUser(user.id);
  if (!counselor) redirect("/counselor/onboard");

  const hasStripeAccount = Boolean(counselor.stripe_account_id);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="w-6 h-6 text-[#D4AF37]" />
        <h1 className="text-xl font-bold text-white">Payouts</h1>
      </div>

      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 mb-5 flex items-start gap-3">
        <Construction className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-white mb-1">
            Stripe Connect onboarding — coming next
          </p>
          <p className="text-[12.5px] text-white/65 leading-relaxed">
            The button that takes you through Stripe-hosted Express onboarding
            and stores your <code className="text-amber-200">acct_…</code> id
            on your counselor row hasn&apos;t shipped yet. Until it does,
            students who try to book any service get a 409 with{" "}
            &quot;counselor hasn&apos;t completed Stripe Connect onboarding&quot;.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 mb-4">
        <p className="text-[11px] uppercase tracking-wider text-white/55 mb-2">
          Connected account
        </p>
        {hasStripeAccount ? (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-emerald-400 text-sm font-medium">Connected</span>
            <span className="text-[11px] text-white/45">
              · acct_{counselor.stripe_account_id?.slice(-8)}
            </span>
          </div>
        ) : (
          <p className="text-[13px] text-white/55 mb-3 italic">
            Not yet connected.
          </p>
        )}
        <p className="text-[12.5px] text-white/55 leading-relaxed">
          Bookings flow as <strong className="text-white/80">destination charges</strong>:
          students pay the full price; Stripe deducts a 10% platform fee and
          deposits the rest into your Connect account on the standard payout
          schedule (2 days for new accounts, 1 day after history is established).
          Refunds, chargebacks, and dispute logic ride the same rails.
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <p className="text-[11px] uppercase tracking-wider text-white/55 mb-2">
          Earnings (lifetime)
        </p>
        <p className="text-2xl font-bold text-[#D4AF37]">$0</p>
        <p className="text-[11.5px] text-white/45 mt-1">
          Real earnings + payout history land on this page once the first
          completed engagement settles. The Phase 2 follow-up wires the Stripe
          balance API and shows pending vs available funds.
        </p>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Link
          href="/counselor/dashboard"
          className="inline-flex items-center gap-1 text-[12px] text-white/55 hover:text-[#D4AF37]"
        >
          <ArrowRight className="w-3 h-3 rotate-180" /> Back to dashboard
        </Link>
        <a
          href="https://stripe.com/connect"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto inline-flex items-center gap-1 text-[12px] text-white/55 hover:text-[#D4AF37]"
        >
          Stripe Connect docs <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
