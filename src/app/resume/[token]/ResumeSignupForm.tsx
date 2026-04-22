"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  email: string;
  token: string;
}

export default function ResumeSignupForm({ email, token }: Props) {
  const router = useRouter();
  const { signUpWithEmail, signInWithEmail } = useAuth();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setStatus("Creating account…");

    // Try signup first. If email already exists, fall back to sign-in so
    // returning users can still claim their resume link with an existing
    // account (e.g., they used a different password than what they just typed
    // — they'll see the sign-in error and can correct).
    const signupResult = await signUpWithEmail(email, password, name);
    let signedIn = !signupResult.error;

    if (signupResult.error && /already|exists|registered/i.test(signupResult.error)) {
      setStatus("Signing you in…");
      const signInResult = await signInWithEmail(email, password);
      if (signInResult.error) {
        setError(
          "An account exists for this email but the password didn't match. Sign in below."
        );
        setSubmitting(false);
        setStatus(null);
        return;
      }
      signedIn = true;
    } else if (signupResult.error) {
      setError(signupResult.error);
      setSubmitting(false);
      setStatus(null);
      return;
    }

    if (!signedIn) {
      // Signup created the account but requires email confirmation.
      // The migration endpoint needs a live session — we can't claim the
      // resume link until the user confirms via email + logs in.
      setError(
        "Check your email to confirm your account, then use the link in that email to sign in and claim your progress."
      );
      setSubmitting(false);
      setStatus(null);
      return;
    }

    // Now call migration endpoint to re-home the guest data.
    setStatus("Restoring your work…");
    try {
      const res = await fetch("/api/leads/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error("[resume] migration failed:", body);
        // Non-fatal — the account exists and the user can proceed; the
        // guest data stays attached to the anon user. Log and continue.
      }
    } catch (err) {
      console.error("[resume] migration threw:", err);
    }

    setStatus("Done.");
    router.push("/");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="block text-xs text-white/50 mb-1">Email</label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white/60 cursor-not-allowed"
        />
      </div>
      <div>
        <label className="block text-xs text-white/50 mb-1">First name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          required
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4AF37]/50"
        />
      </div>
      <div>
        <label className="block text-xs text-white/50 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          required
          minLength={8}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4AF37]/50"
        />
      </div>
      {error && <div className="text-xs text-red-400">{error}</div>}
      {!error && status && <div className="text-xs text-white/60">{status}</div>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#D4AF37] text-black py-2.5 rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-[#E0BC4C] transition-colors"
      >
        {submitting ? "Working…" : "Create account & restore my work"}
      </button>
    </form>
  );
}
