"use client";

import { useState } from "react";
import { slugifyAgencyName } from "@/lib/cc/agency-slug";

// QA-04: counselors without an agency had no way to create one, and invite
// codes, the roster and essay review all hang off an agency.
export default function CreateWorkspaceCard({
  displayName,
  onCreated = (path) => window.location.assign(path),
}: {
  displayName: string;
  onCreated?: (path: string) => void;
}) {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const slug = slugifyAgencyName(name);

  async function create() {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/counselor/agency", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), slug, displayName }),
    }).catch(() => null);
    if (res?.ok) {
      onCreated("/counselor/team");
      return;
    }
    setError(
      res?.status === 409
        ? "That workspace name is already taken. Try adding your city or last name."
        : "Couldn't create the workspace. Please try again.",
    );
    setBusy(false);
  }

  return (
    <div className="mb-6 rounded-2xl border border-[#D4AF37]/30 bg-[#141414] p-6">
      <p className="text-[10px] uppercase tracking-[0.1em] text-[#D4AF37] mb-2">Workspace</p>
      <h2 className="text-white font-semibold mb-1">Set up your student workspace</h2>
      <p className="text-sm text-white/60 mb-4">
        A workspace lets you invite students with a code, see your roster, and review essays. Working solo? Use your own name.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Workspace name, e.g. Rivera College Counseling"
          className="flex-1 rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white placeholder:text-white/30"
        />
        <button
          onClick={create}
          disabled={busy || slug.length < 3}
          className="rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-black hover:bg-[#C4A030] disabled:opacity-40"
        >
          {busy ? "Creating…" : "Create workspace"}
        </button>
      </div>
      {error && <p role="alert" className="mt-2 text-xs text-[#fbbf24]">{error}</p>}
    </div>
  );
}
