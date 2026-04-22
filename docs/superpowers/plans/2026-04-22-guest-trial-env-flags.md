# Guest-Trial Funnel — Env Flags

**Date:** 2026-04-22
**Related:** `2026-04-22-guest-trial-funnel.md` § 13 (rollback)

Add these to `.env.local` (and Vercel Production/Preview) before rolling out the
guest-trial funnel. All default ON; set to `false` to disable a workstream
without redeploying code.

```bash
# Workstream A — guest anonymous sessions
# When false, useGuestSession() short-circuits and middleware reverts to the
# old signup-walled behavior. Rows already in guest_sessions_audit stay but
# become dormant.
NEXT_PUBLIC_GUEST_SESSIONS_ENABLED=true

# Workstream B — landing hero embedded chat
# When false, /landing renders the original HeroSection CTA instead of
# LandingHeroWithChat.
NEXT_PUBLIC_LANDING_HERO_CHAT=true

# Workstream C — server-side tier gates (§ 5 matrix)
# Emergency kill switch. When true, assertCapacity() returns ok=true for every
# call, disabling all 402 responses. Use to unblock a bad deploy; set back to
# false (or unset) once fixed.
NEXT_PUBLIC_TIER_GATES_DISABLED=false

# Workstream D — onboarding redirects to conversational intake
# When "wizard", /onboarding restores the legacy 6-step wizard (fallback only,
# the wizard source was removed — restoring requires reverting the commit).
# When "conversational" (default), /onboarding redirects to /?coach=open&focus=intake.
NEXT_PUBLIC_ONBOARDING_WIZARD_MODE=conversational

# Workstream E — exit-intent lead capture
# When false, <ExitIntentModal /> becomes a no-op. Use to kill the modal
# without a deploy if the email provider breaks or legal flags it.
NEXT_PUBLIC_EXIT_INTENT_ENABLED=true
```

## Rollback playbook

| Symptom | Flag to flip | Deploy needed |
|---|---|---|
| Anon-auth sign-ins spike on Supabase | `NEXT_PUBLIC_GUEST_SESSIONS_ENABLED=false` | No (env-only) |
| Chat spams a quota we didn't plan for | `NEXT_PUBLIC_TIER_GATES_DISABLED=false` + ensure gates are set | No |
| Hero chat breaks layout on a device class | `NEXT_PUBLIC_LANDING_HERO_CHAT=false` | No |
| Exit-intent email provider errors | `NEXT_PUBLIC_EXIT_INTENT_ENABLED=false` | No |
| Conversational intake loses data | Revert commit to restore wizard | Yes |

## Dependencies

- `NEXT_PUBLIC_LANDING_HERO_CHAT=true` requires `NEXT_PUBLIC_GUEST_SESSIONS_ENABLED=true`
  (otherwise HeroCoachChat cannot create an anon session and the input stays disabled).
- `NEXT_PUBLIC_EXIT_INTENT_ENABLED=true` works with or without guest sessions —
  it captures raw email only; the guest-state snapshot degrades gracefully.

## Runtime checks

Each flag is read in exactly one file:

| Flag | File |
|---|---|
| `NEXT_PUBLIC_GUEST_SESSIONS_ENABLED` | `src/lib/guest-session.ts` |
| `NEXT_PUBLIC_LANDING_HERO_CHAT` | `src/app/landing/page.tsx` |
| `NEXT_PUBLIC_TIER_GATES_DISABLED` | `src/lib/cc/tier-gate.ts` |
| `NEXT_PUBLIC_ONBOARDING_WIZARD_MODE` | `src/app/onboarding/page.tsx` (reserved — redirect is unconditional today) |
| `NEXT_PUBLIC_EXIT_INTENT_ENABLED` | `src/components/landing/ExitIntentModal.tsx` |

Keep the reads centralized so `grep -r NEXT_PUBLIC_TIER_GATES_DISABLED src/`
returns exactly one hit — if that ever grows, refactor into a single module
before shipping.
