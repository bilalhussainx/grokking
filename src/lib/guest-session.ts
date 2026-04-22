// Guest session helper — initializes a Supabase anonymous auth session on
// first visit so guests have a real auth.users row from minute one.
// Plan: docs/superpowers/plans/2026-04-22-guest-trial-funnel.md § 6.
"use client";

import { useEffect, useRef, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";

const GUEST_SESSIONS_ENABLED =
  process.env.NEXT_PUBLIC_GUEST_SESSIONS_ENABLED !== "false";

export interface GuestSessionState {
  userId: string | null;
  isAnonymous: boolean;
  isReady: boolean;
}

// One in-flight promise across all components that call the hook on a single
// page load — without it, a landing page with both HeroCoachChat and
// ExitIntentModal mounted would call signInAnonymously() twice, creating two
// anon users and losing data against one of them.
let inflight: Promise<void> | null = null;

export function useGuestSession(): GuestSessionState {
  const supabase = useRef(createBrowserSupabase());
  const [state, setState] = useState<GuestSessionState>({
    userId: null,
    isAnonymous: false,
    isReady: false,
  });

  useEffect(() => {
    if (!GUEST_SESSIONS_ENABLED) {
      setState({ userId: null, isAnonymous: false, isReady: true });
      return;
    }

    let cancelled = false;

    const run = async () => {
      const client = supabase.current;

      // Probe the existing session. If Supabase's refresh path fires and the
      // refresh token is stale ("Invalid Refresh Token: Refresh Token Not
      // Found"), getSession() returns { session: null } but the auth client is
      // left in a broken state — the next signInAnonymously() will race the
      // refresh and fail with a confusing 422. Explicit signOut() before the
      // anon sign-in clears the bad cookies deterministically.
      type ExistingUser = { id: string; is_anonymous?: boolean };
      let existing: ExistingUser | null = null;
      try {
        const { data, error } = await client.auth.getSession();
        if (error) {
          await client.auth.signOut().catch(() => {});
        } else {
          const u = data.session?.user;
          existing = u ? { id: u.id, is_anonymous: u.is_anonymous } : null;
        }
      } catch {
        await client.auth.signOut().catch(() => {});
      }

      if (existing) {
        if (!cancelled) {
          setState({
            userId: existing.id,
            isAnonymous: Boolean(existing.is_anonymous),
            isReady: true,
          });
        }
        // Fire-and-forget audit upsert so the funnel_events table records the
        // first-touch. Non-blocking on state update.
        if (existing.is_anonymous) {
          void recordLanded(existing.id).catch(() => {});
        }
        return;
      }

      if (!inflight) {
        inflight = (async () => {
          const { data: signInData, error } = await client.auth.signInAnonymously();
          if (error) {
            // 422 from Supabase usually means anonymous sign-ins aren't
            // enabled on the project. Surface that clearly in the console so
            // the fix (dashboard → Auth → Providers → enable Anonymous) is
            // discoverable instead of being hidden behind a generic fail.
            console.error(
              "[guest-session] signInAnonymously failed — check Supabase dashboard " +
                "(Authentication → Providers → Anonymous Sign-Ins). Error:",
              error.message
            );
            throw error;
          }
          const user = signInData.user;
          if (user) {
            void recordLanded(user.id).catch(() => {});
          }
        })().finally(() => {
          inflight = null;
        });
      }

      try {
        await inflight;
      } catch {
        if (!cancelled) {
          setState({ userId: null, isAnonymous: false, isReady: true });
        }
        return;
      }

      const { data: refreshed } = await client.auth.getSession();
      const user = refreshed.session?.user;
      if (!cancelled) {
        setState({
          userId: user?.id ?? null,
          isAnonymous: Boolean(user?.is_anonymous),
          isReady: true,
        });
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

async function recordLanded(userId: string): Promise<void> {
  try {
    await fetch("/api/cc/guest/landed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        landingPath: typeof window !== "undefined" ? window.location.pathname : null,
      }),
      keepalive: true,
    });
  } catch {
    // Swallow — audit is best-effort. Funnel metrics degrade gracefully.
  }
}
