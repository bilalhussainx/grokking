// src/components/auth/CreditBadge.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Coins } from "lucide-react";

// Per audit 2026-04-07: "Credits unclear: the signup credits shown but no
// indication of burn rate." Native title attribute gives users an
// instant tooltip on hover without adding any new dependency.
const CREDIT_TOOLTIP =
  "Credits power voice features. ~10/interview · ~3/min voice tutoring · text coach is free. Renews monthly.";

export default function CreditBadge() {
  const { credits, creditsLoaded, user } = useAuth();
  if (!user) return null;

  // AUD-X-004: show "—" while the credits fetch is in flight so brand-new
  // signups don't see "0" for a few hundred milliseconds before the real
  // 300-credit balance loads in.
  const display = !creditsLoaded
    ? "—"
    : typeof credits === "number" && credits > 9999
      ? `${Math.floor(credits / 1000)}k`
      : credits;

  return (
    <div
      className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium cursor-help"
      title={CREDIT_TOOLTIP}
    >
      <Coins className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      <span>{display}</span>
    </div>
  );
}
