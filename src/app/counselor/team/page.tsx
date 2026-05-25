"use client";

// /counselor/team — head counselor's control panel.
//
// Two surfaces:
//   1. Members — the agency roster. Heads can toggle each counselor's
//      "drafts need review" supervision flag and add new members by email.
//   2. Invite codes — mint single-use codes a head hands to a student to
//      bypass cold marketplace search; copy a shareable /join/<code> link.
//
// Head-only: while the role lookup is loading we show a minimal state, and
// non-heads are bounced to /counselor/dashboard. This page renders only the
// inner content — CounselorLayout → AppShell already mounts the sidebar.

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCounselorRole } from "@/hooks/useCounselorRole";

interface Member {
  userId: string;
  role: "head" | "counselor";
  requiresReview: boolean;
  joinedAt: string;
}
interface Code {
  id: string;
  code: string;
  label: string | null;
  maxUses: number;
  usedCount: number;
  revokedAt: string | null;
  createdAt: string;
}

export default function TeamPage() {
  const role = useCounselorRole();
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [codes, setCodes] = useState<Code[]>([]);
  const [addEmail, setAddEmail] = useState("");
  const [addName, setAddName] = useState("");
  const [addReview, setAddReview] = useState(false);
  const [codeLabel, setCodeLabel] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      const [mRes, cRes] = await Promise.all([
        fetch("/api/counselor/members"),
        fetch("/api/counselor/invite-codes"),
      ]);
      if (mRes.ok) setMembers((await mRes.json()).members ?? []);
      if (cRes.ok) setCodes((await cRes.json()).codes ?? []);
    } catch {
      setError("Could not load team data — please refresh.");
    }
  }, []);

  useEffect(() => {
    if (role.loading) return;
    if (!role.isHead) {
      router.replace("/counselor/dashboard");
      return;
    }
    void reload();
  }, [role.loading, role.isHead, router, reload]);

  async function addMember(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const r = await fetch("/api/counselor/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: addEmail, displayName: addName, requiresReview: addReview }),
      });
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        setError(body.error ?? "Failed to add member.");
      } else {
        setAddEmail("");
        setAddName("");
        setAddReview(false);
        await reload();
      }
    } catch {
      setError("Failed to add member — please retry.");
    } finally {
      setBusy(false);
    }
  }

  async function mintCode(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const r = await fetch("/api/counselor/invite-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: codeLabel || undefined, maxUses: 1 }),
      });
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        setError(body.error ?? "Failed to mint code.");
      } else {
        setCodeLabel("");
        await reload();
      }
    } catch {
      setError("Failed to mint code — please retry.");
    } finally {
      setBusy(false);
    }
  }

  async function toggleReview(userId: string, current: boolean) {
    setError(null);
    try {
      const r = await fetch(`/api/counselor/members/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requiresReview: !current }),
      });
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        setError(body.error ?? "Failed to update member.");
      }
      await reload();
    } catch {
      setError("Failed to update member — please retry.");
    }
  }

  async function revokeCode(id: string) {
    setError(null);
    try {
      const r = await fetch(`/api/counselor/invite-codes/${id}`, { method: "DELETE" });
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        setError(body.error ?? "Failed to revoke code.");
      }
      await reload();
    } catch {
      setError("Failed to revoke code — please retry.");
    }
  }

  function copyLink(code: string) {
    const link = `${window.location.origin}/join/${code}`;
    void navigator.clipboard.writeText(link);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  }

  if (role.loading) {
    return <div className="max-w-5xl mx-auto px-4 py-8 text-sm text-white/55">Loading…</div>;
  }
  if (!role.isHead) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <header>
        <h1 className="text-xl font-bold text-white">Team &amp; Invites</h1>
        <p className="text-[13px] text-white/55 mt-1">
          Add counselors to your agency and mint invite codes for students.
        </p>
      </header>

      {error && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-[13px] text-rose-300">
          {error}
        </div>
      )}

      {/* ── Members ──────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-white">Counselors</h2>
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
          <table className="w-full text-[13px]">
            <thead className="bg-white/5 text-left text-[11px] uppercase tracking-wider text-white/55">
              <tr>
                <th className="px-4 py-2.5 font-medium">Member</th>
                <th className="px-4 py-2.5 font-medium">Role</th>
                <th className="px-4 py-2.5 font-medium">Drafts need review</th>
                <th className="px-4 py-2.5 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.userId} className="border-t border-white/10 text-white/80">
                  <td className="px-4 py-2.5 font-mono text-[12px]">{m.userId.slice(0, 8)}…</td>
                  <td className="px-4 py-2.5 capitalize">{m.role}</td>
                  <td className="px-4 py-2.5">
                    {m.role === "head" ? (
                      <span className="text-white/35">—</span>
                    ) : (
                      <button
                        onClick={() => toggleReview(m.userId, m.requiresReview)}
                        className="underline decoration-dotted underline-offset-2 hover:text-white"
                      >
                        {m.requiresReview ? "yes" : "no"}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-white/50">
                    {new Date(m.joinedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-[13px] text-white/40">
                    No members yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <form onSubmit={addMember} className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-[11px] uppercase tracking-wider text-white/55">
            Email
            <input
              type="email"
              value={addEmail}
              onChange={(e) => setAddEmail(e.target.value)}
              required
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[13px] text-white normal-case tracking-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-[11px] uppercase tracking-wider text-white/55">
            Display name
            <input
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              required
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[13px] text-white normal-case tracking-normal"
            />
          </label>
          <label className="flex items-center gap-2 pb-2 text-[12px] text-white/65">
            <input
              type="checkbox"
              checked={addReview}
              onChange={(e) => setAddReview(e.target.checked)}
              className="w-4 h-4 rounded border border-white/20 bg-white/5 accent-[#D4AF37]"
            />
            drafts need review
          </label>
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-[#D4AF37] px-4 py-2 text-[13px] font-semibold text-black hover:bg-[#C4A030] disabled:opacity-50"
          >
            Add counselor
          </button>
        </form>
        <p className="text-[11px] text-white/40">
          The person must already have a Samsara account — add them by the email they signed up with.
        </p>
      </section>

      {/* ── Invite codes ─────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-white">Invite codes</h2>
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
          <table className="w-full text-[13px]">
            <thead className="bg-white/5 text-left text-[11px] uppercase tracking-wider text-white/55">
              <tr>
                <th className="px-4 py-2.5 font-medium">Code</th>
                <th className="px-4 py-2.5 font-medium">Label</th>
                <th className="px-4 py-2.5 font-medium">Uses</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Share</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {codes.map((c) => (
                <tr key={c.id} className="border-t border-white/10 text-white/80">
                  <td className="px-4 py-2.5 font-mono text-[12px] text-white">{c.code}</td>
                  <td className="px-4 py-2.5">{c.label ?? <span className="text-white/35">—</span>}</td>
                  <td className="px-4 py-2.5">
                    {c.usedCount}/{c.maxUses}
                  </td>
                  <td className="px-4 py-2.5">
                    {c.revokedAt ? (
                      <span className="text-white/45">revoked</span>
                    ) : (
                      <span className="text-emerald-400">active</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    {!c.revokedAt && (
                      <button
                        onClick={() => copyLink(c.code)}
                        className="text-[12px] text-[#D4AF37] hover:text-[#E4C04A]"
                      >
                        {copied === c.code ? "copied!" : "copy link"}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {!c.revokedAt && (
                      <button
                        onClick={() => revokeCode(c.id)}
                        className="text-[12px] text-rose-400 hover:text-rose-300"
                      >
                        revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {codes.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-[13px] text-white/40">
                    No codes yet. Mint one to invite a student.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <form onSubmit={mintCode} className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-[11px] uppercase tracking-wider text-white/55">
            Label (optional — e.g. student name or cohort)
            <input
              value={codeLabel}
              onChange={(e) => setCodeLabel(e.target.value)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[13px] text-white normal-case tracking-normal min-w-[18rem]"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-[#D4AF37] px-4 py-2 text-[13px] font-semibold text-black hover:bg-[#C4A030] disabled:opacity-50"
          >
            Mint invite code
          </button>
        </form>
      </section>
    </div>
  );
}
