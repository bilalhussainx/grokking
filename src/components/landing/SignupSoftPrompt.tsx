"use client";

// Soft-prompt bar that slides up inside HeroCoachChat after the guest has had
// 3+ exchanges OR hit a tier gate. Offers email + password signup that upgrades
// the current anonymous user (same auth.users.id) so the chat history persists.
//
// Plan: docs/superpowers/plans/2026-04-22-guest-trial-funnel.md § 8.4
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  onDismiss: () => void;
}

export default function SignupSoftPrompt({ onDismiss }: Props) {
  const { upgradeToRealUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password || !name) return;
    setSubmitting(true);
    setError(null);
    const result = await upgradeToRealUser({ email, password, name });
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSuccess(true);
    setTimeout(onDismiss, 1500);
  }

  if (success) {
    return (
      <div className="px-5 py-3 border-t border-white/10 bg-[#D4AF37]/10 text-center text-sm text-[#E0BC4C]">
        Saved. You can now access your work from any device.
      </div>
    );
  }

  return (
    <div className="px-5 py-3 border-t border-white/10 bg-black/60">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="text-sm text-white font-medium">Save your progress</div>
          <div className="text-xs text-white/50">
            Unlock essay review + sync across devices.
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-white/40 hover:text-white/70 text-xs"
          aria-label="Dismiss"
        >
          Later
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="First name"
          className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4AF37]/50"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4AF37]/50"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4AF37]/50"
          required
          minLength={8}
        />
        {error && <div className="text-[11px] text-red-400">{error}</div>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#D4AF37] text-black py-1.5 rounded text-xs font-medium disabled:opacity-40 hover:bg-[#E0BC4C] transition-colors"
        >
          {submitting ? "Saving…" : "Save & continue"}
        </button>
      </form>
    </div>
  );
}
