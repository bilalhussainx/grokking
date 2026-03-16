// src/lib/supabase-auth.ts
// Server-side only — DO NOT import from "use client" components
// For client-side, use: import { createBrowserSupabase } from "@/lib/supabase-browser"
import { createServerClient as createSSRServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client (use in API routes and Server Components)
export async function createServerSupabase() {
  const cookieStore = await cookies();
  return createSSRServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Can't set cookies in Server Components — only works in Route Handlers
          }
        },
      },
    }
  );
}

// Admin client (service role — bypasses RLS, use for webhook handlers)
export function createAdminSupabase() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey);
}

// Helper: get authenticated user from request, return null if not authenticated
export async function getAuthUser() {
  const supabase = await createServerSupabase();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}
