"use client";

// /counselor/onboard
//
// Phase 1 onboarding — minimal. Display name + optional agency slug.
// Phase 2 will extend this into a multi-step flow with bio, photo, services,
// Stripe Connect, language picker, etc. Today: claim a counselor row so
// the role-aware nav swaps and downstream routes can gate on counselor-id.

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, GraduationCap, ArrowRight } from "lucide-react";

export default function CounselorOnboardPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [agencySlug, setAgencySlug] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/counselor/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName.trim(),
          agencySlug: agencySlug.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed (${res.status})`);
      router.push(`/counselors/${data.counselor.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Onboarding failed");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-3">
        <GraduationCap className="w-8 h-8 text-[#D4AF37]" />
        <h1 className="text-xl font-bold text-white">Become a Counselor on KairosLearn</h1>
      </div>
      <p className="text-sm text-white/60 leading-relaxed mb-6">
        Claim your counselor profile in two minutes. Once you&apos;re live, students
        can find you on <Link href="/find-counselor" className="text-[#D4AF37] underline">Find a counselor</Link>,
        book paid essay reviews, supplements, and chancing consultations, and
        review your past admissions track record.
      </p>
      <p className="text-[13px] text-white/55 leading-relaxed mb-8">
        Phase 1 is a minimal claim. Stripe Connect onboarding, your service catalog,
        and admit-history submission unlock once your profile is verified.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="display-name" className="block text-[12px] uppercase tracking-wider text-white/55 mb-1.5">
            Display name <span className="text-rose-400">*</span>
          </label>
          <input
            id="display-name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            minLength={2}
            placeholder="e.g. Aisha Rahman"
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50"
          />
          <p className="text-[11px] text-white/40 mt-1">
            How your name appears on your public profile + search results.
          </p>
        </div>

        <div>
          <label htmlFor="agency-slug" className="block text-[12px] uppercase tracking-wider text-white/55 mb-1.5">
            Agency slug <span className="text-white/40">(optional)</span>
          </label>
          <input
            id="agency-slug"
            type="text"
            value={agencySlug}
            onChange={(e) => setAgencySlug(e.target.value)}
            placeholder="e.g. ivy-edge-consulting"
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50"
          />
          <p className="text-[11px] text-white/40 mt-1">
            If you work with an existing agency, enter its slug. Solo counselors
            leave this blank — you can join an agency later.
          </p>
        </div>

        {error && (
          <div className="px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-[12px] text-rose-300">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || displayName.trim().length < 2}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#C4A030] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Claim my profile <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
