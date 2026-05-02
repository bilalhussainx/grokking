// src/contexts/AuthContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef, type ReactNode } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: "student" | "pro" | "teacher" | "admin";
  referral_code: string | null;
  login_streak: number;
  avatar_url: string | null;
  trial_ends_at: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  credits: number;
  // True once credits have been fetched at least once. Lets UI consumers
  // show "—" instead of "0" during the brief loading window after signup
  // (AUD-X-004 OpenClaw 2026-05-02).
  creditsLoaded: boolean;
  loading: boolean;
  isAnonymous: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<{ error?: string; confirmed?: boolean }>;
  // Convert an existing anonymous user to a real account without losing data.
  // Flips is_anonymous=false on the same user_id so every cc_* row stays put.
  upgradeToRealUser: (params: { email: string; password: string; name: string }) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshCredits: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [credits, setCredits] = useState(0);
  const [creditsLoaded, setCreditsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const signingOutRef = useRef(false);
  const ensureProfilePromiseRef = useRef<Promise<void> | null>(null);

  // Stable Supabase client — never re-created on re-renders
  const supabase = useMemo(() => createBrowserSupabase(), []);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("user_profiles")
      .select("id, email, full_name, role, referral_code, login_streak, avatar_url, trial_ends_at")
      .eq("id", userId)
      .single();
    if (data) {
      setProfile(data as UserProfile);
    }
    // If profile not found, ensureProfile (called elsewhere) will create it
    // via the server-side admin endpoint
  }, [supabase]);

  // Ensure profile + credits exist after signup (trigger may have failed silently)
  // Uses server-side admin client to bypass RLS — most reliable path
  // Deduped: concurrent calls share the same promise
  const ensureProfile = useCallback(async (_authUser: User, _name?: string) => {
    if (ensureProfilePromiseRef.current) {
      return ensureProfilePromiseRef.current;
    }

    const doEnsure = async () => {
      try {
        const res = await fetch("/api/auth/ensure-profile", { method: "POST" });
        if (res.ok) {
          const { profile: serverProfile, credits: serverCredits } = await res.json();
          if (serverProfile) setProfile(serverProfile as UserProfile);
          if (typeof serverCredits === "number") {
            setCredits(serverCredits);
            setCreditsLoaded(true);
          }
          return;
        }
      } catch {
        console.warn("[Auth] Server ensure-profile failed, falling back to client-side");
      }

      // Fallback: client-side (may fail due to RLS but better than nothing)
      await fetchProfile(_authUser.id);
      const { data: bal } = await supabase.rpc("get_credit_balance", { p_user_id: _authUser.id });
      setCredits((bal as number) || 0);
      setCreditsLoaded(true);
    };

    ensureProfilePromiseRef.current = doEnsure().finally(() => {
      ensureProfilePromiseRef.current = null;
    });

    return ensureProfilePromiseRef.current;
  }, [supabase, fetchProfile]);

  const refreshCredits = useCallback(async () => {
    if (!user) return;
    // Use server endpoint for reliable credit fetch (bypasses RLS)
    try {
      const res = await fetch("/api/auth/ensure-profile", { method: "POST" });
      if (res.ok) {
        const { credits: serverCredits } = await res.json();
        if (typeof serverCredits === "number") {
          setCredits(serverCredits);
          setCreditsLoaded(true);
          return;
        }
      }
    } catch {}
    // Fallback to browser RPC
    const { data } = await supabase.rpc("get_credit_balance", { p_user_id: user.id });
    setCredits((data as number) || 0);
    setCreditsLoaded(true);
  }, [user, supabase]);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);

        // 1. Ensure profile + credits exist (trigger may have failed)
        await ensureProfile(session.user);

        // 2. Redeem pending invite code if saved from signup
        const pendingCode = localStorage.getItem("pending-invite-code");
        if (pendingCode) {
          try {
            const res = await fetch("/api/invite/redeem", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ code: pendingCode }),
            });
            if (res.ok) {
              localStorage.removeItem("pending-invite-code");
              // Re-fetch profile and credits after redeem changed them
              await fetchProfile(session.user.id);
              const { data } = await supabase.rpc("get_credit_balance", { p_user_id: session.user.id });
              setCredits((data as number) || 0);
              setCreditsLoaded(true);
            }
          } catch {
            // Will retry next page load
          }
        }

        // 3. Check trial expiry — downgrade if pro trial has ended
        try {
          const { data: trialResult } = await supabase.rpc("check_trial_expiry", { p_user_id: session.user.id });
          if (trialResult && typeof trialResult === "object" && (trialResult as Record<string, unknown>).expired) {
            // Re-fetch profile to pick up the downgraded role
            await fetchProfile(session.user.id);
          }
        } catch {
          // RPC may not exist yet — non-critical
        }

        // 4. Update login streak
        try { await supabase.rpc("update_login_streak", { p_user_id: session.user.id }); } catch {}
      }
      setLoading(false);
    };

    initAuth();

    // Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Don't re-authenticate during signout
        if (event === "SIGNED_OUT" || signingOutRef.current) {
          setUser(null);
          setProfile(null);
          setCredits(0);
          setCreditsLoaded(false);
          setLoading(false);
          return;
        }
        if (session?.user) {
          setUser(session.user);
          // Use ensureProfile (not just fetchProfile) so credits are created
          // for Google OAuth users where the trigger may have failed
          await ensureProfile(session.user);
        } else {
          setUser(null);
          setProfile(null);
          setCredits(0);
          setCreditsLoaded(false);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase, fetchProfile, ensureProfile]);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return {};
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    // Read referral cookie if present (set by /ref/[code] page)
    const refCode = document.cookie.match(/referral_code=([^;]+)/)?.[1] || undefined;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, referral_code: refCode } },
    });

    if (error) {
      // "Database error saving new user" = trigger failed but user may be created
      // Try signing in — if user was created despite trigger failure, login works
      if (error.message.includes("Database error")) {
        console.warn("[Auth] Trigger failed, trying sign-in recovery...");
        const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
        if (!signInErr) {
          const { data: { user: recoveredUser } } = await supabase.auth.getUser();
          if (recoveredUser) {
            await ensureProfile(recoveredUser, name);
          }
          if (refCode) document.cookie = "referral_code=; max-age=0; path=/";
          return { confirmed: true };
        }
      }
      return { error: error.message };
    }

    // Check if user was auto-confirmed (no email verification needed)
    const signedUpUser = data?.user;
    if (signedUpUser?.email_confirmed_at) {
      // Auto-confirmed — ensure profile exists and set user state
      setUser(signedUpUser);
      await ensureProfile(signedUpUser, name);
      if (refCode) document.cookie = "referral_code=; max-age=0; path=/";
      return { confirmed: true };
    }

    // Email confirmation required — show "check your email" screen
    if (refCode) document.cookie = "referral_code=; max-age=0; path=/";
    return {};
  };

  const upgradeToRealUser = async ({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }) => {
    // Anonymous user → real user. Supabase keeps the same auth.users.id, so
    // every cc_* row owned by the anon stays intact. RLS continues to match
    // on auth.uid(). No data migration required.
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser?.is_anonymous) {
      return { error: "Not an anonymous user." };
    }

    // Step 1: set email + password on the anon user. Note: updateUser({email})
    // on an anon session requires email confirmation to be disabled, OR the
    // user verifies the email link before is_anonymous flips.
    const { error: updateErr } = await supabase.auth.updateUser({
      email,
      password,
      data: { full_name: name },
    });
    if (updateErr) return { error: updateErr.message };

    // Step 2: mark guest_sessions_audit row as upgraded_to_free_at.
    // Best-effort — don't block signup UX on analytics.
    try {
      await fetch("/api/cc/guest/upgraded", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: "free" }),
      });
    } catch {}

    // Step 3: ensure user_profiles + credits row exist (normally made by the
    // signup trigger; anon users skipped it). Same endpoint real signup uses.
    await ensureProfile(currentUser, name);

    return {};
  };

  const signOut = async () => {
    // Prevent onAuthStateChange from re-authenticating
    signingOutRef.current = true;
    // Clear state first to prevent UI flicker
    setUser(null);
    setProfile(null);
    setCredits(0);
    setCreditsLoaded(false);
    // Sign out from Supabase (global = revoke all sessions server-side)
    await supabase.auth.signOut({ scope: "global" });
    // Manually clear all Supabase auth cookies and localStorage
    document.cookie.split(";").forEach((c) => {
      const name = c.trim().split("=")[0];
      if (name.startsWith("sb-")) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      }
    });
    // Clear Supabase localStorage entries
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("sb-") || key.includes("supabase")) {
        localStorage.removeItem(key);
      }
    });
    // Route: default to the cinematic /landing so the logged-out student
    // falls back into the marketing funnel. Security-sensitive callers
    // (password change, account-switch flow, etc.) can opt into /login by
    // setting ?post_logout=login on the page that triggered signOut.
    // ?loggedOut=1 renders a discreet toast in the landing page.
    const params = typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;
    const dest = params?.get("post_logout") === "login"
      ? "/login"
      : "/landing?loggedOut=1";
    window.location.replace(dest);
  };

  const isAnonymous = Boolean(user?.is_anonymous);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        credits,
        creditsLoaded,
        loading,
        isAnonymous,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        upgradeToRealUser,
        signOut,
        refreshCredits,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// Backward compatibility — old code imports useAuth, new interface is superset
export type { UserProfile, AuthContextType };
