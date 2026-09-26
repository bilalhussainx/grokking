// src/app/signup/page.tsx
"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { safeNextPath } from "@/lib/safe-next";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import KairosLogo from "@/components/ui/SamsaraLogo";

function SignupForm() {
  const { signInWithGoogle, signUpWithEmail, user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  // Honor an internal ?next= so counselor sign-ups (and /join invite links)
  // route to the right place after account creation. Only same-origin paths
  // ("/foo", not "//evil.com" or "https://…") are allowed — open-redirect guard.
  const next = safeNextPath(searchParams.get("next"));
  const nameRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  // Redirect already-logged-in users. Use hard navigation so cookies are
  // guaranteed to be sent to middleware (avoids the blank-page trap when
  // client/server auth state is out of sync). Honors ?next= (e.g. a /join
  // invite link opened while already signed in). navigatedRef prevents this
  // effect from racing the post-signup navigation below: auth state flips
  // to "user" the moment signup succeeds, and without the guard this effect
  // fired assign("/") over the assign(next) — which is how invite links
  // lost their redemption redirect.
  const navigatedRef = useRef(false);
  useEffect(() => {
    if (!authLoading && user && !navigatedRef.current) {
      navigatedRef.current = true;
      window.location.assign(next ?? "/");
    }
  }, [user, authLoading, next]);

  const validateFields = (): boolean => {
    const errors: typeof fieldErrors = {};
    if (!name.trim()) {
      errors.name = "Name is required";
    }
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Enter a valid email address";
    }
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Must be at least 6 characters";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!validateFields()) return;

    setLoading(true);
    const result = await signUpWithEmail(email, password, name, next ?? undefined);
    if (result.error) {
      // Map common server errors to specific fields
      const msg = result.error.toLowerCase();
      if (msg.includes("email") || msg.includes("already registered")) {
        setFieldErrors({ email: result.error });
      } else if (msg.includes("password")) {
        setFieldErrors({ password: result.error });
      } else {
        setError(result.error);
      }
      setLoading(false);
    } else {
      if (result.confirmed) {
        // Use hard navigation so the freshly-set auth cookies are guaranteed
        // to reach middleware on the /onboarding request. (Earlier revision
        // preferred router.push to keep the client-side error boundary, but
        // that caused /onboarding and downstream redirects to hit middleware
        // without cookies, creating the /landing redirect loop.)
        navigatedRef.current = true;
        window.location.assign(next ?? "/onboarding?new=1");
      } else {
        setSuccess(true);
      }
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    const supabase = (await import("@/lib/supabase-browser")).createBrowserSupabase();
    if (!supabase) {
      setLoading(false);
      alert("Auth is not configured (Supabase env missing).");
      return;
    }
    await supabase.auth.resend({ type: "signup", email });
    setLoading(false);
    alert("Confirmation email resent. Check your inbox.");
  };

  if (success) {
    return (
      <section className="flex min-h-screen items-center justify-center px-4 bg-black">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#141414] p-8 text-center">
          <div className="mx-auto mb-4">
            <KairosLogo size="md" showText={false} />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Verify your email</h2>
          <p className="text-sm text-white/50">We sent a confirmation link to <strong className="text-white/80">{email}</strong>.</p>
          <p className="text-sm text-white/50 mt-2">Click the link to activate your account and start your <strong className="text-white/80">free 7-day Pro trial</strong> (300 AI credits included).</p>
          <div className="mt-6 space-y-3">
            <button
              onClick={handleResend}
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50"
            >
              {loading ? "Sending..." : "Resend confirmation email"}
            </button>
            <Link href="/login" className="text-[#D4AF37] text-sm hover:underline block">Back to login</Link>
          </div>
          <p className="text-[10px] text-white/20 mt-4">Check your spam folder if you don&#39;t see the email within a few minutes.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-16 bg-black relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-20
        bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)]
        bg-[size:4rem_4rem]
        [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_30%,transparent_100%)]"
      />
      <motion.div
        className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#141414] p-8 shadow-2xl backdrop-blur-sm"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="flex flex-col items-center mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <KairosLogo size="lg" showText={false} className="mb-4" />
          <h1 className="text-2xl font-bold text-white">
            Join Kairos<span className="text-amber-400">Learn</span>
          </h1>
          <p className="text-sm text-white/50 mt-2">Free 7-day Pro trial for students — 300 AI credits included</p>
        </motion.div>

        {/* Google OAuth — primary action */}
        <Button
          type="button"
          className="w-full flex items-center justify-center gap-3 h-12 border-2 border-[#D4AF37] bg-transparent text-white font-semibold rounded-lg hover:bg-[#D4AF37]/10 transition-colors"
          onClick={() => void signInWithGoogle(next ?? undefined)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 262" className="w-5 h-5">
            <path fill="#4285f4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" />
            <path fill="#34a853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" />
            <path fill="#fbbc05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z" />
            <path fill="#eb4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" />
          </svg>
          <span>Continue with Google</span>
        </Button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="h-px flex-1 bg-white/10" />
          <span className="px-3 text-xs text-white/30">or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Email signup form — 3 fields only */}
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-white/70">Full Name</Label>
            <Input
              ref={nameRef}
              id="name"
              value={name}
              onChange={(e) => { setName(e.target.value); setFieldErrors(prev => ({ ...prev, name: undefined })); }}
              placeholder="Your name"
              className={`bg-transparent border-white/20 text-white placeholder:text-white/30 focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 ${fieldErrors.name ? "border-red-500/60" : ""}`}
            />
            {fieldErrors.name && <p className="text-xs text-red-400 mt-0.5">{fieldErrors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-white/70">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setFieldErrors(prev => ({ ...prev, email: undefined })); }}
              placeholder="you@example.com"
              className={`bg-transparent border-white/20 text-white placeholder:text-white/30 focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 ${fieldErrors.email ? "border-red-500/60" : ""}`}
            />
            {fieldErrors.email && <p className="text-xs text-red-400 mt-0.5">{fieldErrors.email}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-white/70">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setFieldErrors(prev => ({ ...prev, password: undefined })); }}
                placeholder="Min 6 characters"
                className={`bg-transparent border-white/20 text-white placeholder:text-white/30 pr-10 focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 ${fieldErrors.password ? "border-red-500/60" : ""}`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldErrors.password && <p className="text-xs text-red-400 mt-0.5">{fieldErrors.password}</p>}
            {!fieldErrors.password && password.length > 0 && (
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4].map((level) => (
                  <div key={level} className={`h-1 flex-1 rounded-full transition-colors ${
                    password.length >= level * 3
                      ? level <= 1 ? "bg-red-500" : level <= 2 ? "bg-orange-500" : level <= 3 ? "bg-yellow-500" : "bg-emerald-500"
                      : "bg-white/10"
                  }`} />
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-xs text-red-400 bg-red-500/10 rounded-md p-2">{error}</p>}

          <Button type="submit" className="w-full h-11 bg-[#D4AF37] text-black font-semibold rounded-lg hover:bg-[#C4A030]" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-white/40 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#D4AF37] hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </section>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <SignupForm />
    </Suspense>
  );
}
