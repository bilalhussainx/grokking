import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import LanguageGrid from "@/components/onboarding/LanguageGrid";

export const dynamic = "force-dynamic";

export default async function OnboardingLanguagePage() {
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
  let initialLanguage = "en";
  if (user) {
    const { data } = await supabase
      .from("cc_student_profiles")
      .select("home_language")
      .eq("user_id", user.id)
      .maybeSingle();
    if (data?.home_language) initialLanguage = data.home_language;
  }

  return <LanguageGrid initialLanguage={initialLanguage} />;
}
