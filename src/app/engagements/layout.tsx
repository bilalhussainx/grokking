// /engagements/* layout: shared by the counselor and the student party. The
// frame switches to counselor navigation when useCounselorRole finds one.
import type { ReactNode } from "react";
import AppShell from "@/components/nav/AppShell";
import { loadShellStage } from "@/components/app-shell/load-shell-stage";

export default async function EngagementsLayout({ children }: { children: ReactNode }) {
  return <AppShell grade={await loadShellStage()}>{children}</AppShell>;
}
