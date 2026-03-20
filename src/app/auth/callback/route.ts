// src/app/auth/callback/route.ts
// Handles OAuth callbacks AND email confirmation token hashes
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as "signup" | "email" | "recovery" | null;
  const next = searchParams.get("next") || "/";

  const supabase = await createServerSupabase();

  // Handle email confirmation via token_hash (Supabase PKCE flow)
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type === "email" ? "email" : type === "recovery" ? "recovery" : "signup",
    });
    if (!error) {
      // New signup confirmed — send to onboarding
      if (type === "signup" || type === "email") {
        return NextResponse.redirect(`${origin}/onboarding`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
    return NextResponse.redirect(`${origin}/login?error=confirmation_failed`);
  }

  // Handle OAuth code exchange (Google sign-in)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth error — redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
