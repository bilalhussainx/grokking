"use client";

// Essay workbench — list of drafts with status pills and quick actions.
// Spec: CollegeVCareers.md SP-10.

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, Plus, Loader2, Clock, CheckCircle2, PenSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Draft {
  id: string;
  title: string;
  prompt: string;
  school_id: string | null;
  word_target: number | null;
  status: "ideation" | "drafting" | "review" | "done";
  current_version: number;
  updated_at: string;
}

const STATUS_META: Record<Draft["status"], { label: string; icon: React.ElementType; color: string }> = {
  ideation: { label: "Ideation", icon: Clock, color: "text-amber-300 bg-amber-500/10 border-amber-500/20" },
  drafting: { label: "Drafting", icon: PenSquare, color: "text-violet-300 bg-violet-500/10 border-violet-500/20" },
  review: { label: "Review", icon: FileText, color: "text-cyan-300 bg-cyan-500/10 border-cyan-500/20" },
  done: { label: "Done", icon: CheckCircle2, color: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20" },
};

export default function EssaysListClient() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login?next=/essays");
      return;
    }
    (async () => {
      try {
        const res = await fetch("/api/essays");
        if (!res.ok) throw new Error((await res.json()).error || "Failed to load");
        const data = await res.json();
        setDrafts(data.drafts || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [user, authLoading, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Essays</h1>
            <p className="text-sm text-white/50">Ideate, draft, and get honest feedback.</p>
          </div>
          <Link
            href="/essays/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white text-sm font-semibold transition-all"
          >
            <Plus className="w-4 h-4" />
            New essay
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-red-500/[0.04] border border-red-500/[0.15] text-red-300 text-sm">
            {error}
          </div>
        ) : drafts.length === 0 ? (
          <div className="p-12 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center">
            <FileText className="w-10 h-10 text-white/20 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-white/80 mb-2">No essays yet</h2>
            <p className="text-sm text-white/50 mb-6 max-w-md mx-auto">
              Start with a Common App prompt or a supplemental. We&apos;ll help you find an angle, then give you real feedback on every draft.
            </p>
            <Link
              href="/essays/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white text-sm font-semibold transition-all"
            >
              <Plus className="w-4 h-4" />
              Start your first essay
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {drafts.map((d) => {
              const meta = STATUS_META[d.status];
              const Icon = meta.icon;
              return (
                <Link
                  key={d.id}
                  href={`/essays/${d.id}`}
                  className="block p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12] transition"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-base font-semibold text-white/90 truncate">{d.title}</h3>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${meta.color} shrink-0`}>
                      <Icon className="w-3 h-3" />
                      {meta.label}
                    </span>
                  </div>
                  <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">{d.prompt}</p>
                  <div className="mt-3 flex items-center gap-3 text-[11px] text-white/30">
                    <span>v{d.current_version}</span>
                    {d.word_target && <span>· target {d.word_target}w</span>}
                    <span>· updated {new Date(d.updated_at).toLocaleDateString()}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
