// /cc/* layout: every College Counselor surface renders inside the Daybreak
// app frame. The rail's stage comes from the student's profile (server-side).
import type { ReactNode } from "react";
import AppShell from "@/components/nav/AppShell";
import { loadShellStage } from "@/components/app-shell/load-shell-stage";

export const metadata = {
  title: "College Counselor — KairosLearn",
  description: "Your AI-powered college application toolkit",
};

export default async function CCLayout({ children }: { children: ReactNode }) {
  return <AppShell grade={await loadShellStage()}>{children}</AppShell>;
}
