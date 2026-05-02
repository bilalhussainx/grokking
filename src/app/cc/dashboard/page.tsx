// src/app/cc/dashboard/page.tsx
// Thin server-component shell — auth + onboarding gate, then defer to the
// client orchestrator. All data fetching moves into AdaptiveDashboard via
// /api/cc/dashboard/summary.
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import AdaptiveDashboard from "./AdaptiveDashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/cc/dashboard");
  const { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("language_picker_seen_at")
    .eq("user_id", user.id)
    .maybeSingle<{ language_picker_seen_at: string | null }>();
  if (!profile || profile.language_picker_seen_at == null) {
    redirect("/onboarding");
  }
  return <AdaptiveDashboard />;
}
