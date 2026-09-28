// /counselor/* layout: the counselor workspace in the Daybreak app frame.
// audience="staff" renders counselor navigation from the first paint; Team &
// invites appears once useCounselorRole confirms a head.
import type { ReactNode } from "react";
import AppShell from "@/components/nav/AppShell";

export default function CounselorLayout({ children }: { children: ReactNode }) {
  return <AppShell grade="unknown" audience="staff">{children}</AppShell>;
}
