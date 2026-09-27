"use client";

// Shared layout wrapper for authenticated app surfaces. Mounts the
// variant-aware Sidebar (left) + main content column + CommandPalette
// overlay. Used by:
//   - src/app/cc/layout.tsx (wraps every /cc/* route)
//   - src/app/page.tsx (wraps the root home page when user is logged in)
//
// Centralizes the chrome so the wrapper isn't duplicated. The `grade`
// prop is computed by the caller (server-side in cc/layout, client-side
// in page.tsx) — keeps this component framework-agnostic.

import type { ReactNode } from "react";
import Sidebar, { type SidebarGrade } from "@/components/nav/Sidebar";

export default function AppShell({
  grade,
  children,
}: {
  grade: SidebarGrade;
  children: ReactNode;
}) {
  return (
    <div
      className="kl-surface-app flex min-h-screen"
      style={{ background: "var(--kl-app-bg, #000)" }}
    >
      <Sidebar grade={grade} />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
