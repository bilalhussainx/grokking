// Legacy onboarding wizard — replaced 2026-04-22 by the conversational intake
// flow. Bounce rate on the 6-step wizard was ~55%; we now route users to the
// dashboard with the coach opened in intake mode. The old wizard source lives
// in git history if we ever need to restore it.
//
// Plan: docs/superpowers/plans/2026-04-22-guest-trial-funnel.md § 8.4
import { redirect } from "next/navigation";

export default function OnboardingRedirect() {
  redirect("/?coach=open&focus=intake");
}
