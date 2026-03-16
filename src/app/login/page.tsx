// src/app/login/page.tsx
"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--background)]" />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const { signInWithGoogle, signInWithEmail, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const authError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(authError === "auth_failed" ? "Authentication failed. Please try again." : "");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (user) {
    router.replace(next);
    return null;
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signInWithEmail(email, password);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.replace(next);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-16 bg-[var(--background)]">
      <form
        onSubmit={handleEmailLogin}
        className="w-full max-w-sm rounded-xl border border-white/[0.08] bg-white/[0.03] p-8 shadow-xl backdrop-blur-sm"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Samsara<span className="text-cyan-400">.ai</span>
          </h1>
          <p className="text-sm text-white/50 mt-2">Sign in to continue learning</p>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-3 mb-4 h-11 border-white/10 hover:bg-white/5"
          onClick={signInWithGoogle}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 262" className="w-5 h-5">
            <path fill="#4285f4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" />
            <path fill="#34a853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" />
            <path fill="#fbbc05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z" />
            <path fill="#eb4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" />
          </svg>
          <span>Continue with Google</span>
        </Button>

        <div className="flex items-center my-6">
          <div className="h-px flex-1 bg-white/10" />
          <span className="px-3 text-xs text-white/30">or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/70">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-white/70">Password</Label>
              <Link href="/forgot-password" className="text-xs text-violet-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 rounded-md p-2">{error}</p>
          )}

          <Button type="submit" className="w-full h-11" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </div>

        <p className="text-center text-sm text-white/40 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-violet-400 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </section>
  );
}
