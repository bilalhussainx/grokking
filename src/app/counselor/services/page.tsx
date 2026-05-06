"use client";

// /counselor/services — counselor-side service catalog editor.
// CRUD for cc_counselor_services. Rows are inline-editable; deactivation is
// soft (flips active=false) so historical engagements still resolve to a row.

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";

interface Service {
  id: string;
  service_type: string;
  title: string;
  description: string | null;
  price_usd: number;
  turnaround_hours: number | null;
  active: boolean;
  sort_order: number;
}

const SERVICE_TYPES = [
  { value: "essay_review_single",     label: "Single essay review" },
  { value: "essay_review_package",    label: "Essay package (multi-essay)" },
  { value: "common_app_full",         label: "Common App — full review" },
  { value: "supplement_full_school",  label: "Supplements — single school" },
  { value: "interview_prep_session",  label: "Interview prep session" },
  { value: "application_audit",       label: "Application audit" },
  { value: "chancing_consultation",   label: "Chancing consultation" },
  { value: "activity_strategy_g10",   label: "Activity strategy — Grade 10" },
  { value: "activity_strategy_g11",   label: "Activity strategy — Grade 11" },
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({
    service_type: "essay_review_single",
    title: "",
    description: "",
    price_usd: 150,
    turnaround_hours: 72,
  });
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/counselor/services");
    if (res.ok) {
      const data = await res.json();
      setServices(data.services);
    } else if (res.status === 403) {
      setError("You're not registered as a counselor. Visit /counselor/onboard first.");
    }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function createService(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/counselor/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || `Failed (${res.status})`);
      return;
    }
    setAdding(false);
    setDraft({ ...draft, title: "", description: "" });
    await load();
  }

  async function patchService(id: string, patch: Partial<Service> & { scope?: Record<string, unknown> }) {
    const res = await fetch(`/api/counselor/services/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || `Failed (${res.status})`);
      return;
    }
    await load();
  }

  async function deleteService(id: string) {
    if (!confirm("Deactivate this service? Existing bookings stay valid.")) return;
    const res = await fetch(`/api/counselor/services/${id}`, { method: "DELETE" });
    if (res.ok) await load();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/counselor/dashboard"
        className="inline-flex items-center gap-1.5 text-[12px] text-white/55 hover:text-[#D4AF37] mb-3"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to dashboard
      </Link>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Service catalog</h1>
          <p className="text-sm text-white/55 mt-1">
            What students can book from your profile. Hide a service to stop
            new bookings without breaking historical engagements.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#D4AF37] text-black text-xs font-semibold hover:bg-[#C4A030]"
        >
          <Plus className="w-3.5 h-3.5" /> {adding ? "Cancel" : "New service"}
        </button>
      </div>

      {error && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-[12px] text-rose-300">
          {error}
        </div>
      )}

      {adding && (
        <form onSubmit={createService} className="mb-6 rounded-xl border border-[#D4AF37]/30 bg-[#1a1610] p-4 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[11px] uppercase tracking-wider text-white/55 block mb-1">Type</span>
              <select
                value={draft.service_type}
                onChange={(e) => setDraft({ ...draft, service_type: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
              >
                {SERVICE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[11px] uppercase tracking-wider text-white/55 block mb-1">Price (USD)</span>
              <input
                type="number"
                min={1}
                step={1}
                value={draft.price_usd}
                onChange={(e) => setDraft({ ...draft, price_usd: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
              />
            </label>
          </div>
          <label className="block">
            <span className="text-[11px] uppercase tracking-wider text-white/55 block mb-1">Title</span>
            <input
              type="text"
              required
              minLength={3}
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="e.g. Common App PS — full review with two passes"
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
            />
          </label>
          <label className="block">
            <span className="text-[11px] uppercase tracking-wider text-white/55 block mb-1">Description</span>
            <textarea
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              rows={3}
              placeholder="What's included? Two written passes + a 30-min voice debrief…"
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm resize-y"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[11px] uppercase tracking-wider text-white/55 block mb-1">Turnaround (hours)</span>
              <input
                type="number"
                min={1}
                step={1}
                value={draft.turnaround_hours}
                onChange={(e) => setDraft({ ...draft, turnaround_hours: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-full px-3 py-2.5 rounded-lg bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#C4A030]"
          >
            Publish service
          </button>
        </form>
      )}

      {services.length === 0 ? (
        <p className="text-[13px] text-white/40 italic text-center py-12 border border-white/10 rounded-xl">
          No services yet. Add your first one to start accepting bookings.
        </p>
      ) : (
        <div className="space-y-3">
          {services.map((s) => (
            <div
              key={s.id}
              className={`rounded-xl border p-4 ${s.active ? "border-white/10 bg-white/[0.02]" : "border-white/5 bg-white/[0.01] opacity-60"}`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0 flex-1">
                  <p className="text-[10.5px] uppercase tracking-wider text-white/45 mb-0.5">
                    {SERVICE_TYPES.find((t) => t.value === s.service_type)?.label ?? s.service_type}
                  </p>
                  <p className="text-sm font-semibold text-white">{s.title}</p>
                  {s.description && (
                    <p className="text-[12px] text-white/55 mt-1 leading-relaxed">{s.description}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-base font-semibold text-[#D4AF37]">
                    ${Number(s.price_usd).toLocaleString()}
                  </p>
                  {s.turnaround_hours && (
                    <p className="text-[10.5px] text-white/45">{s.turnaround_hours}h turnaround</p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => patchService(s.id, { active: !s.active })}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] text-white/55 hover:text-white/85 hover:bg-white/5"
                  title={s.active ? "Hide from public profile" : "Restore on public profile"}
                >
                  {s.active ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {s.active ? "Hide" : "Restore"}
                </button>
                <button
                  type="button"
                  onClick={() => deleteService(s.id)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/10"
                >
                  <Trash2 className="w-3 h-3" /> Deactivate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
