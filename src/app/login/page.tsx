// src/app/login/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { safeNextPath } from "@/lib/safe-next";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import KairosLogo from "@/components/ui/SamsaraLogo";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const { signInWithGoogle, signInWithEmail, user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const explicitNext = safeNextPath(searchParams.get("next"));
  const next = explicitNext ?? "/";
  // Invite links (/join/<code>) send logged-out students here; a brand-new
  // student then clicks "Sign up", which must keep the invite.
  const signupHref = explicitNext ? `/signup?next=${encodeURIComponent(explicitNext)}` : "/signup";
  const authError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(
    authError === "auth_failed" ? "Authentication failed. Please try again."
    : authError === "confirmation_failed" ? "Email confirmation link expired or invalid. Please sign up again."
    : ""
  );
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in — use hard navigation so cookies are guaranteed
  // to be sent to middleware on the next request (avoids client/server auth desync
  // that strands users on a blank page).
  useEffect(() => {
    if (!authLoading && user) {
      window.location.assign(next);
    }
  }, [user, authLoading, next]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signInWithEmail(email, password);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      // Hard navigation so the freshly-written auth cookie is included in the
      // middleware request for `next`.
      window.location.assign(next);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-16 bg-black relative overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-20
        bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)]
        bg-[size:4rem_4rem]
        [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_30%,transparent_100%)]"
      />
      <motion.form
        onSubmit={handleEmailLogin}
        className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#141414] p-8 shadow-2xl backdrop-blur-sm"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="flex flex-col items-center mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <KairosLogo size="lg" showText={false} className="mb-4" />
          <h1 className="text-2xl font-bold text-white">
            Kairos<span className="text-amber-400">Learn</span>
          </h1>
          <p className="text-sm text-white/50 mt-2">Sign in to continue learning</p>
        </motion.div>

        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-3 mb-4 h-11 border-white/20 bg-transparent text-white hover:bg-white/5"
          onClick={() => void signInWithGoogle(explicitNext ?? undefined)}
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
              autoFocus
              className="bg-transparent border-white/20 text-white placeholder:text-white/30 focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-white/70">Password</Label>
              <Link href="/forgot-password" className="text-xs text-[#D4AF37] hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                className="bg-transparent border-white/20 text-white placeholder:text-white/30 pr-10 focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 rounded-md p-2">{error}</p>
          )}

          <Button type="submit" className="w-full h-11 bg-[#D4AF37] text-black font-semibold rounded-lg hover:bg-[#C4A030]" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </div>

        <div className="text-center mt-6 space-y-3">
          <p className="text-sm text-white/40">
            Don&apos;t have an account?{" "}
            <Link href={signupHref} className="text-[#D4AF37] hover:underline font-medium">
              Sign up
            </Link>
          </p>
          <Link
            href={signupHref}
            className="block w-full py-2.5 rounded-lg border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] text-sm font-semibold hover:bg-[#D4AF37]/20 transition-all text-center"
          >
            Get Started Free — 300 Credits
          </Link>

          <div className="pt-3 mt-1 border-t border-white/10">
            <p className="text-xs text-white/40">
              Counselor or agency?{" "}
              <Link
                href="/login?next=%2Fcounselor%2Fonboard"
                className="text-[#D4AF37] hover:underline font-medium"
              >
                Sign in to your workspace →
              </Link>
            </p>
            <p className="text-[11px] text-white/30 mt-1">
              New here?{" "}
              <Link
                href="/signup?next=%2Fcounselor%2Fonboard"
                className="text-white/50 hover:text-[#D4AF37] hover:underline"
              >
                Set up a counselor account
              </Link>
            </p>
          </div>
        </div>
      </motion.form>
    </section>
  );
}
