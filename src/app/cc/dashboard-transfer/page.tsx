// Transfer Student Dashboard — Feature 17. Different application process,
// different essay (Why Transfer), different deadlines.
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, ArrowRight, GraduationCap, BookOpen, FileText } from "lucide-react";

type TransferProfile = {
  is_transfer_student: boolean | null;
  transfer_current_school: string | null;
  transfer_credits_completed: number | null;
  transfer_target_term: string | null;
  transfer_reason: string | null;
};

export default function TransferDashboard() {
  const [profile, setProfile] = useState<TransferProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
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
        <h1 className="text-2xl font-semibold text-white">Transfer dashboard</h1>
        <p className="text-[13.5px] text-white/65 mt-1">
          Transfer admissions is a different game — different deadlines, different essays, different acceptance rates.
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
        </section>
      ) : (
        <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <h2 className="text-[13px] font-semibold text-white mb-3">Tell us about your transfer</h2>
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

      <section className="grid grid-cols-2 gap-3">
        <Link href="/cc/essays" className="rounded-xl border border-white/10 bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-colors">
          <FileText className="w-4 h-4 text-[#D4AF37] mb-1" />
          <p className="text-[12.5px] text-white">Why-transfer essay</p>
          <p className="text-[10px] text-white/45 mt-0.5">Use Essay Studio with prompt type &quot;why_transfer&quot;</p>
        </Link>
        <Link href="/applications" className="rounded-xl border border-white/10 bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-colors">
          <ArrowRight className="w-4 h-4 text-[#D4AF37] mb-1" />
          <p className="text-[12.5px] text-white">Transfer school list</p>
          <p className="text-[10px] text-white/45 mt-0.5">Add schools — transfer rates differ from first-year</p>
        </Link>
        <Link href="/cc/recommenders" className="rounded-xl border border-white/10 bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-colors">
          <GraduationCap className="w-4 h-4 text-[#D4AF37] mb-1" />
          <p className="text-[12.5px] text-white">Professor recs</p>
          <p className="text-[10px] text-white/45 mt-0.5">Transfers need college-prof recs, not high school</p>
        </Link>
        <Link href="/cc/courses" className="rounded-xl border border-white/10 bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-colors">
          <BookOpen className="w-4 h-4 text-[#D4AF37] mb-1" />
          <p className="text-[12.5px] text-white">Course evaluations</p>
        </Link>
      </section>
    </div>
  );
}
