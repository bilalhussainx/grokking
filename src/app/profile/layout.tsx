import type { ReactNode } from "react";
import AppShell from "@/components/nav/AppShell";
import { loadShellStage } from "@/components/app-shell/load-shell-stage";

export const metadata = {
  title: "Your Profile — Coach Kairos",
  description: "Build your college application profile",
};

export default async function ProfileLayout({ children }: { children: ReactNode }) {
  return <AppShell grade={await loadShellStage()}>{children}</AppShell>;
}
