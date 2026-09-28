// Shared wrapper for signed-in app routes (GATE D4.2). Renders the Daybreak
// AppFrame. Layouts pass the student's stage (loadShellStage) or
// audience="staff" for counselor routes. CommandPalette stays mounted once,
// globally, in providers.tsx.
import type { ReactNode } from "react";
import AppFrame from "@/components/app-shell/AppFrame";
import type { ShellStage } from "@/components/app-shell/app-nav";

export default function AppShell({
  grade,
  audience = "student",
  children,
}: {
  grade: ShellStage;
  audience?: "student" | "staff";
  children: ReactNode;
}) {
  return <AppFrame stage={grade} audience={audience}>{children}</AppFrame>;
}
