// /cc/* layout — wraps every College Counselor surface (dashboard, essays,
// applications, recommenders, etc.) in:
//   - The persistent variant-aware Sidebar (left)
//   - The main content column (children)
//   - A globally mounted CommandPalette (Cmd+K, slash → coach)
//
// The Sidebar needs the dashboard variant key, which it gets from the user's
// profile (grade_level + is_transfer_student). The layout fetches once,
// server-side, so child pages don't have to duplicate the lookup.
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import Sidebar, { type SidebarGrade } from "@/components/nav/Sidebar";
import CommandPalette from "@/components/nav/CommandPalette";

export const metadata = {
  title: "College Counselor — KairosLearn",
  description: "Your AI-powered college application toolkit",
};

// Single source of truth for variant derivation. Mirrors selectVariant() in
// src/app/cc/dashboard/variants.ts but doesn't need the school list — the
// sidebar shape is identical across senior_writing / senior_post_submit /
// senior_decisions, and the waitlist-row pulse is driven separately by the
// dashboard from its own data.
function deriveVariant(profile: {
  is_transfer_student: boolean | null;
  grade_level: number | null;
} | null): SidebarGrade {
  if (!profile) return "unknown";
  if (profile.is_transfer_student) return "transfer";
  switch (profile.grade_level) {
    case 9: return "g9";
    case 10: return "g10";
    case 11: return "junior";
    case 12: return "senior_writing"; // sidebar shape ignores phase distinction
    default: return "unknown";
  }
}

export default async function CCLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    },
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let grade: SidebarGrade = "unknown";
  if (user) {
    const { data } = await supabase
      .from("cc_student_profiles")
      .select("grade_level, is_transfer_student")
      .eq("user_id", user.id)
      .maybeSingle<{ grade_level: number | null; is_transfer_student: boolean | null }>();
    grade = deriveVariant(data);
  }

  return (
    <div className="kl-surface-app flex min-h-screen" style={{ background: "var(--kl-app-bg, #000)" }}>
      <Sidebar grade={grade} />
      <main className="flex-1 min-w-0">{children}</main>
      <CommandPalette />
    </div>
  );
}
