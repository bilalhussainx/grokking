// Server-only: the signed-in student's stage for the frame's rail. Duplicate
// cc_student_profiles rows exist (no unique user_id), so read one row
// deterministically instead of maybeSingle(), which errors on duplicates.
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { shellStageFor, type ShellStage } from "./app-nav";

export async function loadShellStage(): Promise<ShellStage> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } },
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "unknown";
  const { data } = await supabase
    .from("cc_student_profiles")
    .select("id, grade_level, is_transfer_student")
    .eq("user_id", user.id)
    .order("id")
    .limit(1);
  const row = (data?.[0] ?? null) as { grade_level: number | null; is_transfer_student: boolean | null } | null;
  return shellStageFor(row);
}
