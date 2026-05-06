// /engagements/* layout — engagement detail is a shared surface where
// either the counselor or the student party can land. Wrap in AppShell
// so both roles get their respective sidebar (the Sidebar component
// branches on useCounselorRole).
//
// Grade prop is "unknown" — same reasoning as the counselor layout.
// When the viewer is a student, the Sidebar still derives the grade
// from /api/cc/me (the same lookup it does on /cc/* routes via the
// hook). For a counselor, grade is ignored.

import type { ReactNode } from "react";
import AppShell from "@/components/nav/AppShell";

export default function EngagementsLayout({ children }: { children: ReactNode }) {
  return <AppShell grade="unknown">{children}</AppShell>;
}
