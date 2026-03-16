"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Lock, CheckCircle } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = useMemo(() => createBrowserSupabase(), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => router.push("/"), 2000);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-16 bg-[var(--background)]">
      <div className="w-full max-w-sm rounded-xl border border-white/[0.08] bg-white/[0.03] p-8 shadow-xl backdrop-blur-sm">
        {success ? (
          <div className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-xl font-bold text-white mb-2">Password updated</h1>
            <p className="text-sm text-white/50">
              Redirecting you to the homepage...
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-xl font-bold text-white">Set new password</h1>
              <p className="text-sm text-white/50 mt-1">
                Choose a new password for your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/70">New password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm" className="text-white/70">Confirm password</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>

              {error && (
                <p className="text-xs text-red-400 bg-red-500/10 rounded-md p-2">{error}</p>
              )}

              <Button type="submit" className="w-full h-11" disabled={loading}>
                <Lock className="w-4 h-4 mr-2" />
                {loading ? "Updating..." : "Update password"}
              </Button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
