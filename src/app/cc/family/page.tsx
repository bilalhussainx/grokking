"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Mail, MessageSquare, Languages } from "lucide-react";

type Invite = {
  id: string;
  parent_email: string;
  parent_name: string | null;
  preferred_language: string;
  accepted_at: string | null;
  expires_at: string;
  invite_token: string;
};

export default function FamilyPage() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [lang, setLang] = useState("en");
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const refresh = async () => {
    const r = await fetch("/api/cc/family/invites");
    if (!r.ok) return;
    setInvites((await r.json()).invites ?? []);
  };
  useEffect(() => { refresh().finally(() => setLoading(false)); }, []);

  const submit = async () => {
    setErr(null);
    setSending(true);
    try {
      const r = await fetch("/api/cc/family/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parentEmail: email, parentName: name || null, preferredLanguage: lang }),
      });
      if (!r.ok) throw new Error((await r.json()).error ?? `HTTP ${r.status}`);
      setEmail(""); setName("");
      await refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally { setSending(false); }
  };

  if (loading) return <div className="flex items-center justify-center p-12"><Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" /></div>;

  return (
    <div className="px-6 py-6 max-w-3xl mx-auto space-y-6">
      <div>
        <p className="text-[12px] text-white/55 uppercase tracking-wider">Family</p>
        <h1 className="text-2xl font-semibold text-white">Bring a parent into the loop</h1>
        <p className="text-[13.5px] text-white/65 mt-1">
          Invite a parent and they get a read-only dashboard in their language. They can also rate your school list — you&apos;ll see where you agree and disagree.
        </p>
      </div>

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
        <h2 className="text-[13px] font-semibold text-white">Invite a parent</h2>
        <input type="email" placeholder="parent@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/85" />
        <input type="text" placeholder="Parent's first name (optional)" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/85" />
        <select value={lang} onChange={(e) => setLang(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/85">
          <option value="en">English</option>
          <option value="ur">Urdu (اردو)</option>
          <option value="hi">Hindi (हिन्दी)</option>
          <option value="pa">Punjabi (ਪੰਜਾਬੀ)</option>
        </select>
        {err && <p className="text-[12px] text-rose-300">{err}</p>}
        <button onClick={submit} disabled={!email || sending} className="px-3 py-2 rounded-lg bg-[#D4AF37] text-black text-[13px] font-medium hover:bg-[#C4A030] disabled:opacity-40 inline-flex items-center gap-1.5">
          {sending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
          {sending ? "Sending…" : "Send invite"}
        </button>
      </section>

      {invites.length > 0 && (
        <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <h2 className="text-[13px] font-semibold text-white mb-3">Pending and accepted invites</h2>
          <ul className="space-y-2">
            {invites.map((i) => (
              <li key={i.id} className="text-[12.5px] text-white/80 flex items-center gap-2">
                <Languages className="w-3.5 h-3.5 text-white/45" />
                <span>{i.parent_name ? `${i.parent_name} <${i.parent_email}>` : i.parent_email}</span>
                <span className="text-white/45">·</span>
                <span className="text-white/55">{i.accepted_at ? "Accepted" : "Pending"}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Link href="/cc/family/alignment" className="rounded-xl border border-white/10 bg-white/[0.02] p-3 hover:bg-white/[0.04]">
          <MessageSquare className="w-4 h-4 text-[#D4AF37] mb-1" />
          <p className="text-[12.5px] text-white">Family alignment</p>
          <p className="text-[10px] text-white/45 mt-0.5">Rate your top schools — your parent rates them too. See where you align.</p>
        </Link>
        <Link href="/cc/dashboard" className="rounded-xl border border-white/10 bg-white/[0.02] p-3 hover:bg-white/[0.04]">
          <p className="text-[12.5px] text-white">Back to dashboard</p>
        </Link>
      </section>
    </div>
  );
}
