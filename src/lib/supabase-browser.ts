// src/lib/supabase-browser.ts
// Client-side only — safe to import from "use client" components.
//
// Returns NULL when the public Supabase env vars aren't set.
//
// Why null instead of throwing:
//   AuthProvider mounts during SSR for every page (it lives inside the root
//   layout), so any time AuthProvider's useMemo(createBrowserSupabase) runs
//   in a build environment that doesn't have NEXT_PUBLIC_SUPABASE_URL /
//   NEXT_PUBLIC_SUPABASE_ANON_KEY, the createBrowserClient call would
//   throw and crash the entire build (originally caught on a Vercel
//   preview deploy that didn't inherit env vars). Returning null lets
//   AuthProvider treat the user as logged-out and let the page render.
//
//   Real interactive callers (login form, signup form, etc.) check for
//   null and surface a clear "auth disabled" error rather than a stack
//   trace from inside @supabase/ssr.

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

export function createBrowserSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    if (typeof window !== "undefined") {
      // Surface once in the browser console so devs notice; SSR / build-time
      // we stay silent because the warning lands in build logs as noise.
      console.warn(
        "[supabase-browser] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set — auth is disabled. Set both env vars to enable login.",
      );
    }
    return null;
  }
  return createBrowserClient(url, anonKey);
}
