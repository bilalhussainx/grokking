// src/contexts/AuthContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react";
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
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  credits: number;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshCredits: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  // Stable Supabase client — never re-created on re-renders
  const supabase = useMemo(() => createBrowserSupabase(), []);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("user_profiles")
      .select("id, email, full_name, role, referral_code, login_streak, avatar_url")
      .eq("id", userId)
      .single();
    if (data) setProfile(data as UserProfile);
  }, [supabase]);

  const refreshCredits = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.rpc("get_credit_balance", { p_user_id: user.id });
    setCredits((data as number) || 0);
  }, [user, supabase]);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
        const { data } = await supabase.rpc("get_credit_balance", { p_user_id: session.user.id });
        setCredits((data as number) || 0);
        // Update login streak (debounced to once per day by the RPC)
        await supabase.rpc("update_login_streak", { p_user_id: session.user.id });
      }
      setLoading(false);
    };

    initAuth();

    // Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
          const { data } = await supabase.rpc("get_credit_balance", { p_user_id: session.user.id });
          setCredits((data as number) || 0);
        } else {
          setUser(null);
          setProfile(null);
          setCredits(0);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase, fetchProfile]);

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
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, referral_code: refCode } },
    });
    if (error) return { error: error.message };
    // Clear referral cookie after use
    if (refCode) document.cookie = "referral_code=; max-age=0; path=/";
    return {};
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setCredits(0);
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, credits, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut, refreshCredits }}
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
