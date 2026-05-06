"use client";

// /counselor/profile — editable profile.
//
// Sidebar's "Public profile" link points here so counselors can edit the
// fields students see on /counselors/[slug]. That page is read-only; this
// is the editor with a "View public profile" CTA at the top.

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, ArrowUpRight, Check } from "lucide-react";

interface Profile {
  slug: string;
  display_name: string;
  headline: string | null;
  bio: string | null;
  photo_url: string | null;
  years_experience: number | null;
  specialties: string[];
  languages: string[];
  hourly_rate_usd: number | null;
  accepts_new_students: boolean;
  verified: boolean;
}

export default function CounselorProfileEditor() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/counselor/me")
      .then((r) => (r.ok ? r.json() : { counselor: null }))
      .then((d: { counselor: Profile | null }) => {
        if (!d.counselor) {
          setError("You're not registered as a counselor. Visit /counselor/onboard first.");
          return;
        }
        // Coerce in case some fields come back as null
        setProfile({
          ...d.counselor,
          specialties: d.counselor.specialties ?? [],
          languages: d.counselor.languages ?? ["en"],
        });
      })
      .catch((e) => setError(String(e)));
  }, []);

  function set<K extends keyof Profile>(key: K, value: Profile[K]) {
    setProfile((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!profile || saving) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/counselor/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: profile.display_name,
          headline: profile.headline,
          bio: profile.bio,
          photo_url: profile.photo_url,
          years_experience: profile.years_experience,
          languages: profile.languages,
          hourly_rate_usd: profile.hourly_rate_usd,
          accepts_new_students: profile.accepts_new_students,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed (${res.status})`);
      setSavedAt(Date.now());
    } catch (e2) {
      setError(e2 instanceof Error ? e2.message : String(e2));
    } finally {
      setSaving(false);
    }
  }

  if (error) return <p className="p-6 text-rose-300 text-sm">{error}</p>;
  if (!profile) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="text-xl font-bold text-white">Profile</h1>
        <Link
          href={`/counselors/${profile.slug}`}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[12px] text-white/75 hover:bg-white/10"
        >
          View public profile <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
      <p className="text-[13px] text-white/55 mb-6">
        These fields appear on your public marketplace profile. Students see them
        when they find you via search or a share link.
      </p>

      <form onSubmit={save} className="space-y-4">
        <Field label="Display name">
          <input
            type="text"
            required
            minLength={2}
            value={profile.display_name}
            onChange={(e) => set("display_name", e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
          />
        </Field>

        <Field label="Headline" hint="A one-line tagline shown beneath your name. e.g. 'Stanford / MIT specialist · 10 yrs'">
          <input
            type="text"
            value={profile.headline ?? ""}
            onChange={(e) => set("headline", e.target.value || null)}
            maxLength={140}
            className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
          />
        </Field>

        <Field label="Bio" hint="Longer description — your background, philosophy, who you work best with.">
          <textarea
            value={profile.bio ?? ""}
            onChange={(e) => set("bio", e.target.value || null)}
            rows={6}
            className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm resize-y"
          />
        </Field>

        <Field label="Photo URL" hint="Direct link to a square headshot. Image upload picker comes in Phase 2 follow-up.">
          <input
            type="url"
            value={profile.photo_url ?? ""}
            onChange={(e) => set("photo_url", e.target.value || null)}
            placeholder="https://…"
            className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
          />
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Years of experience">
            <input
              type="number"
              min={0}
              max={60}
              value={profile.years_experience ?? ""}
              onChange={(e) =>
                set("years_experience", e.target.value ? Number(e.target.value) : null)
              }
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
            />
          </Field>
          <Field label="Hourly rate (USD)" hint="Optional — only shown if you list hourly services.">
            <input
              type="number"
              min={0}
              step={1}
              value={profile.hourly_rate_usd ?? ""}
              onChange={(e) =>
                set("hourly_rate_usd", e.target.value ? Number(e.target.value) : null)
              }
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
            />
          </Field>
        </div>

        <Field label="Languages" hint="Comma-separated ISO codes, e.g. en, ur, hi, es">
          <input
            type="text"
            value={profile.languages.join(", ")}
            onChange={(e) =>
              set(
                "languages",
                e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
              )
            }
            className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
          />
        </Field>

        <label className="flex items-center gap-2 text-[13px] text-white/75 cursor-pointer">
          <input
            type="checkbox"
            checked={profile.accepts_new_students}
            onChange={(e) => set("accepts_new_students", e.target.checked)}
            className="w-4 h-4 rounded border border-white/20 bg-white/5 accent-[#D4AF37]"
          />
          Accepting new students — uncheck to hide your profile from search.
        </label>

        {error && (
          <div className="px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-[12px] text-rose-300">
            {error}
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#C4A030] disabled:opacity-50 inline-flex items-center gap-1.5"
          >
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Save changes
          </button>
          {savedAt && Date.now() - savedAt < 4000 && (
            <span className="inline-flex items-center gap-1 text-[12px] text-emerald-400">
              <Check className="w-3.5 h-3.5" /> Saved
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wider text-white/55 block mb-1">
        {label}
      </span>
      {children}
      {hint && <p className="text-[11px] text-white/40 mt-1">{hint}</p>}
    </label>
  );
}
