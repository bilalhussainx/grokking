"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const supabase = useMemo(() => createBrowserSupabase(), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-16 bg-[var(--background)]">
      <div className="w-full max-w-sm rounded-xl border border-white/[0.08] bg-white/[0.03] p-8 shadow-xl backdrop-blur-sm">
        {sent ? (
          <div className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-xl font-bold text-white mb-2">Check your email</h1>
            <p className="text-sm text-white/50 mb-6">
              We sent a password reset link to <strong className="text-white/70">{email}</strong>. Click the link in the email to reset your password.
            </p>
            <Link
              href="/login"
              className="text-sm text-violet-400 hover:underline"
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/60 transition-colors mb-4"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to sign in
              </Link>
              <h1 className="text-xl font-bold text-white">Reset your password</h1>
              <p className="text-sm text-white/50 mt-1">
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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

              {error && (
                <p className="text-xs text-red-400 bg-red-500/10 rounded-md p-2">{error}</p>
              )}

              <Button type="submit" className="w-full h-11" disabled={loading}>
                <Mail className="w-4 h-4 mr-2" />
                {loading ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
