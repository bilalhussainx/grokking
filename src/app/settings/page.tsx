// src/app/settings/page.tsx
"use client";

// Settings (GATE D4.2): account role, plan and billing, Coach preferences and
// session, each stated separately. The trial is not presented as a paid
// subscription, an unknown date stays unknown, and billing opens only on a click.
import "./settings.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCounselorRole } from "@/hooks/useCounselorRole";
import ManageBillingButton from "@/components/settings/ManageBillingButton";
import AiBadge from "@/components/app-shell/AiBadge";
import { derivePlanState, type PlanKind, type SubscriptionLike } from "@/lib/billing/plan-state";
import { formatIsoDate } from "@/lib/format-iso-date";

type Me = { grade_level: number | null; is_transfer_student: boolean | null; dashboard_observations_enabled?: boolean | null };
type Load<T> = { status: "loading" } | { status: "ready"; value: T } | { status: "error" };

const PLAN_CHIP: Record<PlanKind, string> = {
  free: "Free", trial: "Pro trial", pro: "Pro", pro_unconfirmed: "Pro", ended: "Free · Trial ended",
};

export default function SettingsPage() {
  const { user, profile, credits, creditsLoaded, loading, signOut } = useAuth();
  const role = useCounselorRole();
  const [me, setMe] = useState<Load<Me | null>>({ status: "loading" });
  const [subscription, setSubscription] = useState<Load<SubscriptionLike | null>>({ status: "loading" });
  const [todayIso, setTodayIso] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<boolean | null>(null);
  const [prefError, setPrefError] = useState(false);
  const [profileTimedOut, setProfileTimedOut] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    setTodayIso(new Date().toISOString().slice(0, 10)); // client-only, after mount
    fetch("/api/cc/me")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: { profile: Me | null }) => {
        setMe({ status: "ready", value: d.profile ?? null });
        setSuggestions(d.profile ? d.profile.dashboard_observations_enabled !== false : null);
      })
      .catch(() => setMe({ status: "error" }));
    fetch("/api/billing/subscription")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: { subscription?: SubscriptionLike | null }) => setSubscription({ status: "ready", value: d.subscription ?? null }))
      .catch(() => setSubscription({ status: "error" }));
  }, [user]);

  // If the profile hasn't loaded after 5 seconds, stop waiting.
  useEffect(() => {
    if (profile || !user) return;
    const timer = setTimeout(() => setProfileTimedOut(true), 5000);
    return () => clearTimeout(timer);
  }, [profile, user]);

  if (loading) return <p role="status" className="st-wait">Loading settings…</p>;
  if (!user) return <p className="st-wait">Please sign in to view settings.</p>;
  if (!profile) {
    return profileTimedOut ? (
      <section className="st-card st-wait">
        <h2>We couldn&apos;t load your profile.</h2>
        <p>There may be a connection issue.</p>
        <button type="button" onClick={() => window.location.reload()}>Try again</button>
      </section>
    ) : (
      <p role="status" className="st-wait">Loading settings…</p>
    );
  }

  const p = profile;
  const staff = role.isCounselor;
  const roleName = role.isHead ? "Head counselor" : staff ? "Counselor" : "Student";
  const access = role.isHead ? "Team lead" : role.isMember ? (role.requiresReview ? "Supervised" : "Team member") : "Not connected";
  const student = me.status === "ready" ? me.value : null;
  const isTransfer = Boolean(student?.is_transfer_student);
  const gradeText = me.status === "loading" ? "Loading…" : me.status === "error" ? "Couldn't load" : isTransfer ? "Transfer" : student?.grade_level ? `Grade ${student.grade_level}` : "Not provided";

  const plan = subscription.status === "loading" || !todayIso
    ? null
    : derivePlanState({
        role: p.role,
        trialEndsAt: p.trial_ends_at,
        subscription: subscription.status === "error" ? "unavailable" : subscription.value,
        todayIso,
      });

  async function toggleSuggestions(next: boolean) {
    setSuggestions(next);
    setPrefError(false);
    try {
      const res = await fetch("/api/cc/profile/identity", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dashboard_observations_enabled: next }),
      });
      if (!res.ok) throw new Error(String(res.status));
    } catch {
      setSuggestions(!next);
      setPrefError(true);
    }
  }

  const referralLink = `${typeof window !== "undefined" ? window.location.origin : ""}/ref/${p.referral_code}`;

  return (
    <div className="st">
      <header className="st-head">
        <span className="af-chip">Settings</span>
        <h1>Your space.<br />Your choices.</h1>
        <p className="st-intro">Your account role and your plan are different things.</p>
      </header>

      <div className="st-grid">
        <section className="st-card" aria-labelledby="st-account">
          <h2 id="st-account">Account &amp; profile</h2>
          <div className="st-def"><span>Name</span><strong>{p.full_name || "Not set"}</strong></div>
          <div className="st-def"><span>Email</span><strong>{user.email}</strong></div>
          <div className="st-def"><span>Account role</span><strong>{roleName}</strong></div>
          {staff ? (
            <div className="st-def"><span>Workspace access</span><strong>{access}</strong></div>
          ) : (
            <div className="st-def"><span>{isTransfer ? "Study stage" : "Grade"}</span><strong>{gradeText}</strong></div>
          )}
          {staff ? (
            <Link className="af-quiet" href="/counselor/profile">Edit public profile</Link>
          ) : isTransfer ? (
            <Link className="af-quiet" href="/cc/transfer-profile">Edit transfer details</Link>
          ) : (
            <Link className="af-quiet" href="/profile">Edit my profile</Link>
          )}
        </section>

        <section className="st-card" aria-labelledby="st-plan">
          <h2 id="st-plan">Plan &amp; billing</h2>
          {!plan ? (
            <p role="status">Checking your plan…</p>
          ) : (
            <>
              <span className="af-chip">{PLAN_CHIP[plan.kind]}</span>
              {plan.kind === "free" && <p className="st-lead">You&apos;re on the free plan.</p>}
              {plan.kind === "trial" && <p className="st-lead">You&apos;re trying Pro. A signup trial is not a paid subscription.</p>}
              {plan.kind === "pro" && <p className="st-lead">Your plan is Pro.</p>}
              {plan.kind === "pro_unconfirmed" && <p className="st-lead">Your plan is Pro. We couldn&apos;t check your billing details just now.</p>}
              {plan.kind === "ended" && <p className="st-lead">Your trial is over. Your work is still here.</p>}
              {plan.kind === "trial" && (
                <p className="af-notice">
                  {plan.trialEndsOn
                    ? `Your trial ends ${formatIsoDate(plan.trialEndsOn)}. Confirm the date and any charge before checkout.`
                    : "Your trial end date isn't available. Confirm the date and any charge before checkout."}
                </p>
              )}
              <div className="st-def"><span>Credits balance</span><strong>{creditsLoaded ? credits : "—"}</strong></div>
              {plan.kind === "pro" || plan.kind === "pro_unconfirmed" ? (
                <ManageBillingButton />
              ) : (
                <>
                  <Link className="af-primary" href="/pricing">
                    {plan.kind === "trial" ? "See options after my trial" : "View plans"}
                    <span aria-hidden="true">↗</span>
                  </Link>
                  <p className="af-caption">No charge or billing change happens here.</p>
                </>
              )}
            </>
          )}
        </section>

        {!staff && (
          <section className="st-card" aria-labelledby="st-coach">
            <h2 id="st-coach">Coach &amp; preferences{" "}<AiBadge /></h2>
            <label className="st-check">
              <input
                type="checkbox"
                checked={suggestions ?? true}
                disabled={suggestions === null}
                onChange={(e) => void toggleSuggestions(e.target.checked)}
              />
              Show dashboard suggestions
            </label>
            <p>Choose whether Coach&apos;s AI observations and invitation appear on Today. Your next step and Coach stay available either way.</p>
            {prefError && <p role="alert" className="st-error">We couldn&apos;t save that preference. Try again.</p>}
            <p>Coach&apos;s language is set from the language menu inside Coach.</p>
          </section>
        )}

        {p.referral_code && (
          <section className="st-card" aria-labelledby="st-referral">
            <h2 id="st-referral">Refer a friend</h2>
            <p>Share your link. You both get 25 credits when they sign up.</p>
            <code className="st-code">{referralLink}</code>
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText(referralLink);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? "Copied" : "Copy link"}
            </button>
          </section>
        )}

        <section className="st-card" aria-labelledby="st-session">
          <h2 id="st-session">Session</h2>
          <p>Signing out ends this session. It does not delete your account or your work.</p>
          <button type="button" onClick={() => void signOut()}>Sign out</button>
        </section>
      </div>
    </div>
  );
}
