// /counselor/* layout — wraps the counselor's private workspace
// (onboard, dashboard, services, payouts, session room) in the same
// AppShell that /cc/* uses, so the persistent left sidebar mounts here
// too. The Sidebar component already has role-aware swap logic
// (useCounselorRole) — when the signed-in user has a cc_counselors row,
// it renders the counselor IA (Practice / Brand / Tools) instead of
// the student IA.
//
// Grade prop is "unknown" because counselor surfaces aren't routed by
// HS grade. The Sidebar ignores grade entirely when isCounselor=true.

import type { ReactNode } from "react";
import AppShell from "@/components/nav/AppShell";

export default function CounselorLayout({ children }: { children: ReactNode }) {
  return <AppShell grade="unknown">{children}</AppShell>;
}
