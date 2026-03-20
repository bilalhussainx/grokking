// src/app/auth/confirm/route.ts
// Handles the email confirmation link from Supabase
// URL format: /auth/confirm?token_hash=xxx&type=signup (or type=email)
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as "signup" | "email" | "recovery" | null;

  if (tokenHash && type) {
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type === "email" ? "email" : type === "recovery" ? "recovery" : "signup",
    });

    if (!error) {
      // Email confirmed — redirect to onboarding for new signups
      if (type === "signup" || type === "email") {
        return NextResponse.redirect(`${origin}/onboarding`);
      }
      // Password recovery
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}/reset-password`);
      }
      return NextResponse.redirect(`${origin}/`);
    }

    console.error("[Auth Confirm] Verification failed:", error.message);
  }

  // Fallback: redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=confirmation_failed`);
}
