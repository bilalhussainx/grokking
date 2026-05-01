// Transfer applicant profile-completion form. The /cc/dashboard hero CTA
// points students here when is_transfer_student && !transfer_current_school.
// Once filled, the adaptive dashboard's transfer variant takes over the
// "main" surface — this page is only for collecting the four fields the
// dashboard needs to switch into transfer mode meaningfully.
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

type TransferProfile = {
  is_transfer_student: boolean | null;
  transfer_current_school: string | null;
  transfer_credits_completed: number | null;
  transfer_target_term: string | null;
  transfer_reason: string | null;
};

export default function TransferProfilePage() {
  const [profile, setProfile] = useState<TransferProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [currentSchool, setCurrentSchool] = useState("");
  const [credits, setCredits] = useState<number | "">("");
  const [targetTerm, setTargetTerm] = useState("");
  const [reason, setReason] = useState("");

  const refresh = async () => {
    const r = await fetch("/api/cc/me");
    if (!r.ok) return;
    const d = await r.json();
    const p = d.profile ?? {};
    setProfile(p);
    setCurrentSchool(p.transfer_current_school ?? "");
    setCredits(p.transfer_credits_completed ?? "");
    setTargetTerm(p.transfer_target_term ?? "");
    setReason(p.transfer_reason ?? "");
  };
  useEffect(() => { refresh().finally(() => setLoading(false)); }, []);

  const save = async () => {
    setSaving(true);
    try {
      await fetch("/api/cc/transfer-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isTransferStudent: true,
          transferCurrentSchool: currentSchool,
          transferCreditsCompleted: credits === "" ? null : Number(credits),
          transferTargetTerm: targetTerm,
          transferReason: reason,
        }),
      });
      await refresh();
      setEditing(false);
    } finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center p-12"><Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" /></div>;

  return (
    <div className="px-6 py-6 max-w-3xl mx-auto space-y-6">
      <div>
        <p className="text-[12px] text-white/55 uppercase tracking-wider">Transfer applicant</p>
        <h1 className="text-2xl font-semibold text-white">Tell us about your transfer</h1>
        <p className="text-[13.5px] text-white/65 mt-1">
          Five lines on the why now means a sharper coach later. Once you save, the dashboard recalibrates.
        </p>
      </div>

      {(profile?.is_transfer_student && !editing) ? (
        <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[13px] font-semibold text-white">Your transfer profile</h2>
            <button onClick={() => setEditing(true)} className="text-[12px] text-[#D4AF37] hover:underline">Edit</button>
          </div>
          <ul className="space-y-1.5 text-[12.5px] text-white/80">
            <li><strong className="text-white/55">Current school:</strong> {profile?.transfer_current_school ?? "—"}</li>
            <li><strong className="text-white/55">Credits completed:</strong> {profile?.transfer_credits_completed ?? "—"}</li>
            <li><strong className="text-white/55">Target term:</strong> {profile?.transfer_target_term ?? "—"}</li>
            <li><strong className="text-white/55">Why transfer:</strong> <span className="italic">{profile?.transfer_reason ?? "—"}</span></li>
          </ul>
          <div className="mt-4">
            <Link href="/cc/dashboard" className="text-[12.5px] text-[#D4AF37] hover:underline">← Back to dashboard</Link>
          </div>
        </section>
      ) : (
        <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <h2 className="text-[13px] font-semibold text-white mb-3">Your transfer details</h2>
          <div className="space-y-2">
            <input placeholder="Current school" value={currentSchool} onChange={(e) => setCurrentSchool(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/85" />
            <input type="number" placeholder="Credits completed" value={credits} onChange={(e) => setCredits(e.target.value === "" ? "" : Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/85" />
            <input placeholder="Target term (e.g. Fall 2026)" value={targetTerm} onChange={(e) => setTargetTerm(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/85" />
            <textarea placeholder="Why are you transferring? (be specific)" value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/85" />
            <button onClick={save} disabled={saving} className="px-3 py-2 rounded-lg bg-[#D4AF37] text-black text-[13px] font-medium hover:bg-[#C4A030] disabled:opacity-40 inline-flex items-center gap-1.5">
              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </section>
      )}

      <section className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-4">
        <h2 className="text-[13px] font-semibold text-amber-200 mb-2">Reframe your GPA story</h2>
        <p className="text-[12.5px] text-white/85">
          A weaker first-year GPA followed by an upward trajectory is one of the most common transfer narratives — and it works. Use the &quot;Why transfer&quot; essay to name the inflection point honestly. Don&apos;t blame; describe what changed and what you learned.
        </p>
      </section>
    </div>
  );
}
