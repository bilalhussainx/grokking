"use client";

// Common-App-style activities manager. Minimal, fast entry.
// Spec: CollegeVCareers.md SP-2.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Activity {
  id: string;
  title: string;
  role: string | null;
  category: string | null;
  description: string | null;
  hours_per_week: number | null;
  weeks_per_year: number | null;
  position: number;
}

const CATEGORIES = [
  "academic",
  "athletic",
  "service",
  "work",
  "arts",
  "leadership",
  "research",
  "other",
];

export default function ActivitiesClient() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login?next=/activities");
      return;
    }
    (async () => {
      try {
        const res = await fetch("/api/activities");
        if (!res.ok) throw new Error((await res.json()).error || "Failed to load");
        const data = await res.json();
        setItems(data.activities || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [user, authLoading, router]);

  const add = async () => {
    const res = await fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New activity" }),
    });
    if (res.ok) {
      const row = await res.json();
      setItems((s) => [...s, row]);
    }
  };

  const patch = (id: string, field: keyof Activity, value: unknown) => {
    setItems((s) => s.map((a) => (a.id === id ? { ...a, [field]: value } : a)));
  };

  const save = async (a: Activity) => {
    setSaving(a.id);
    try {
      const res = await fetch(`/api/activities/${a.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: a.title,
          role: a.role,
          category: a.category,
          description: a.description,
          hours_per_week: a.hours_per_week,
          weeks_per_year: a.weeks_per_year,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Save failed");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(null);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this activity?")) return;
    const res = await fetch(`/api/activities/${id}`, { method: "DELETE" });
    if (res.ok) setItems((s) => s.filter((a) => a.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-white/40 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Activities</h1>
          <p className="text-sm text-white/50">
            Your extracurriculars. Interviewers will ask about these — keep them specific.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/[0.06] border border-red-500/[0.2] text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3 mb-6">
          {items.length === 0 && (
            <p className="text-center text-sm text-white/40 py-8">
              No activities yet. Add one — even one real activity beats a vague list of ten.
            </p>
          )}

          {items.map((a) => (
            <div
              key={a.id}
              className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={a.title}
                  onChange={(e) => patch(a.id, "title", e.target.value)}
                  onBlur={() => save(a)}
                  placeholder="Activity name"
                  className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50"
                />
                <button
                  onClick={() => remove(a.id)}
                  className="p-2 rounded-lg text-white/40 hover:text-red-300 hover:bg-red-500/10 transition"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={a.role || ""}
                  onChange={(e) => patch(a.id, "role", e.target.value)}
                  onBlur={() => save(a)}
                  placeholder="Role (Captain, Editor…)"
                  className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50"
                />
                <select
                  value={a.category || ""}
                  onChange={(e) => {
                    patch(a.id, "category", e.target.value);
                    save({ ...a, category: e.target.value });
                  }}
                  className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50"
                >
                  <option value="">Category…</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={a.hours_per_week ?? ""}
                    onChange={(e) =>
                      patch(a.id, "hours_per_week", e.target.value ? Number(e.target.value) : null)
                    }
                    onBlur={() => save(a)}
                    placeholder="hrs/wk"
                    className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50"
                  />
                  <input
                    type="number"
                    value={a.weeks_per_year ?? ""}
                    onChange={(e) =>
                      patch(a.id, "weeks_per_year", e.target.value ? Number(e.target.value) : null)
                    }
                    onBlur={() => save(a)}
                    placeholder="wks/yr"
                    className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50"
                  />
                </div>
              </div>

              <textarea
                value={a.description || ""}
                onChange={(e) => patch(a.id, "description", e.target.value)}
                onBlur={() => save(a)}
                rows={2}
                placeholder="150-char description — lead with impact, not task"
                maxLength={600}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50 resize-y"
              />

              <div className="flex items-center justify-between text-xs text-white/40">
                <span>{(a.description || "").length}/600</span>
                {saving === a.id && (
                  <span className="flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> saving
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={add}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-white/10 text-white/60 hover:border-violet-500/40 hover:text-violet-200 transition"
        >
          <Plus className="w-4 h-4" /> Add an activity
        </button>

        <p className="mt-6 text-xs text-white/40 text-center flex items-center justify-center gap-1">
          <Save className="w-3 h-3" /> Edits save on blur. These feed your college interviewer's follow-ups.
        </p>
      </div>
    </div>
  );
}
