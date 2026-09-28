import type { ReactNode } from "react";
import AppShell from "@/components/nav/AppShell";
import { loadShellStage } from "@/components/app-shell/load-shell-stage";

export default async function ApplicationsLayout({ children }: { children: ReactNode }) {
  return <AppShell grade={await loadShellStage()}>{children}</AppShell>;
}
