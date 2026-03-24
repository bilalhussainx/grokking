import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Lazy singleton — only create when actually called at runtime
// During Vercel build, env vars may not be available
let _supabase: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      // Return a no-op client during build phase
      return new Proxy({} as SupabaseClient, {
        get() { return () => ({ data: null, error: { message: "Not initialized" } }); },
      });
    }
    _supabase = createClient(url, key);
  }
  return _supabase;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getClient();
    const value = (client as unknown as Record<string, unknown>)[prop as string];
    if (typeof value === "function") return value.bind(client);
    return value;
  },
});
