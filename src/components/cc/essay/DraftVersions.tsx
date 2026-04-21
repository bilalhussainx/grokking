"use client";

import { useCallback, useEffect, useState } from "react";
import { History, Loader2, Save, GitCompare, X, CheckSquare, Square } from "lucide-react";

interface DraftVersion {
  id: string;
  version_number: number;
  label: string | null;
  word_count: number | null;
  notes: string | null;
  created_at: string;
}

interface ComparePoint {
  label: string;
  points: string[];
}

interface Comparison {
  worksWellByDraft: ComparePoint[];
  weakByDraft: ComparePoint[];
  mergeSuggestions: string[];
  editPriorities: string[];
  overallNotes: string;
}

interface DraftVersionsProps {
  essayId: string;
  currentDraft: string;
  onRestore: (content: string) => void;
}

export default function DraftVersions({
  essayId,
  currentDraft,
  onRestore,
}: DraftVersionsProps) {
  const [versions, setVersions] = useState<DraftVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [includeCurrent, setIncludeCurrent] = useState(true);
  const [comparing, setComparing] = useState(false);
  const [comparison, setComparison] = useState<Comparison | null>(null);
  const [compareError, setCompareError] = useState<string | null>(null);

  const loadVersions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cc/essays/${essayId}/drafts`);
      const data = await res.json();
      if (res.ok) setVersions(data.drafts || []);
    } finally {
      setLoading(false);
    }
  }, [essayId]);

  useEffect(() => {
    loadVersions();
  }, [loadVersions]);

  const saveSnapshot = async () => {
    setSaving(true);
    setErr(null);
    try {
      const res = await fetch(`/api/cc/essays/${essayId}/drafts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: currentDraft }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error || `Save failed (${res.status})`);
        return;
      }
      await loadVersions();
    } catch {
      setErr("Network error");
    } finally {
      setSaving(false);
    }
  };

  const restoreVersion = async (versionId: string) => {
    try {
      const res = await fetch(`/api/cc/essays/${essayId}/drafts/${versionId}`);
      const data = await res.json();
      if (res.ok && data.draft) {
        onRestore(data.draft.content);
      }
    } catch {
      // noop
    }
  };

  const toggleSelected = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const pickedCount = selected.size + (includeCurrent && currentDraft.trim() ? 1 : 0);
  const canCompare = pickedCount >= 2;

  const runCompare = async () => {
    setComparing(true);
    setCompareError(null);
    setComparison(null);
    try {
      const res = await fetch(`/api/cc/essays/${essayId}/drafts/compare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          versionIds: Array.from(selected),
          includeCurrent,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCompareError(data.error || `Compare failed (${res.status})`);
        return;
      }
      setComparison(data.comparison);
    } catch {
      setCompareError("Network error");
    } finally {
      setComparing(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-xs font-medium text-white/70">Versions</span>
        </div>
        <button
          onClick={saveSnapshot}
          disabled={saving || !currentDraft.trim()}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#D4AF37]/15 text-[#D4AF37] text-[11px] font-medium border border-[#D4AF37]/30 hover:bg-[#D4AF37]/25 disabled:opacity-40"
        >
          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
          {saving ? "Saving" : "Save version"}
        </button>
      </div>

      {err && (
        <div className="px-3 py-1.5 text-[11px] text-red-300 bg-red-500/10 border-b border-red-500/20">
          {err}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {loading && (
          <p className="text-[11px] text-white/30">Loading versions...</p>
        )}
        {!loading && versions.length === 0 && (
          <p className="text-[11px] text-white/30">
            No saved versions yet. Click &quot;Save version&quot; to snapshot the current draft.
          </p>
        )}

        <label className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-white/[0.02] border border-white/10">
          <button
            type="button"
            onClick={() => setIncludeCurrent((v) => !v)}
            className="flex items-center gap-1.5 text-[11px] text-white/70"
          >
            {includeCurrent ? (
              <CheckSquare className="w-3 h-3 text-[#D4AF37]" />
            ) : (
              <Square className="w-3 h-3 text-white/30" />
            )}
            <span>Current working draft</span>
          </button>
        </label>

        {versions.map((v) => {
          const isSelected = selected.has(v.id);
          return (
            <div
              key={v.id}
              className={`px-2 py-1.5 rounded-md border ${
                isSelected ? "border-[#D4AF37]/30 bg-[#D4AF37]/5" : "border-white/10 bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => toggleSelected(v.id)}
                  className="flex items-center gap-1.5 text-[11px] text-white/80 min-w-0"
                >
                  {isSelected ? (
                    <CheckSquare className="w-3 h-3 shrink-0 text-[#D4AF37]" />
                  ) : (
                    <Square className="w-3 h-3 shrink-0 text-white/30" />
                  )}
                  <span className="truncate">{v.label || `Draft v${v.version_number}`}</span>
                </button>
                <button
                  type="button"
                  onClick={() => restoreVersion(v.id)}
                  className="text-[10px] text-white/40 hover:text-[#D4AF37]"
                >
                  Load
                </button>
              </div>
              <p className="text-[10px] text-white/30 mt-0.5 ml-[18px]">
                {v.word_count ?? 0} words · {new Date(v.created_at).toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>

      <div className="px-3 py-2 border-t border-white/10 bg-white/[0.02]">
        <button
          onClick={runCompare}
          disabled={!canCompare || comparing}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[11px] text-[#D4AF37] font-medium hover:bg-[#D4AF37]/25 disabled:opacity-40"
        >
          {comparing ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <GitCompare className="w-3 h-3" />
          )}
          {comparing
            ? "Comparing..."
            : canCompare
              ? `Compare ${pickedCount} drafts`
              : "Pick 2+ drafts to compare"}
        </button>
        {compareError && (
          <p className="text-[11px] text-red-300 mt-1.5">{compareError}</p>
        )}
      </div>

      {comparison && (
        <CompareModal comparison={comparison} onClose={() => setComparison(null)} />
      )}
    </div>
  );
}

function CompareModal({
  comparison,
  onClose,
}: {
  comparison: Comparison;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0b0b0b] border border-white/15 rounded-xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="text-sm font-semibold text-white">Draft comparison</h3>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white/80">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs text-white/75 leading-relaxed">
          {comparison.overallNotes && (
            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10">
              <p>{comparison.overallNotes}</p>
            </div>
          )}

          <section>
            <h4 className="text-[11px] font-semibold text-[#D4AF37] uppercase tracking-wide mb-2">
              What works in each draft
            </h4>
            <div className="grid gap-2">
              {comparison.worksWellByDraft.map((d, i) => (
                <div key={i} className="p-2.5 rounded-md bg-green-500/5 border border-green-500/15">
                  <p className="text-[11px] font-medium text-green-300 mb-1">{d.label}</p>
                  <ul className="list-disc ml-4 space-y-1">
                    {d.points.map((p, j) => (
                      <li key={j}>{p}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h4 className="text-[11px] font-semibold text-[#D4AF37] uppercase tracking-wide mb-2">
              What's weak in each draft
            </h4>
            <div className="grid gap-2">
              {comparison.weakByDraft.map((d, i) => (
                <div key={i} className="p-2.5 rounded-md bg-amber-500/5 border border-amber-500/15">
                  <p className="text-[11px] font-medium text-amber-300 mb-1">{d.label}</p>
                  <ul className="list-disc ml-4 space-y-1">
                    {d.points.map((p, j) => (
                      <li key={j}>{p}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h4 className="text-[11px] font-semibold text-[#D4AF37] uppercase tracking-wide mb-2">
              Merge suggestions for the next draft
            </h4>
            <ul className="list-disc ml-5 space-y-1.5">
              {comparison.mergeSuggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </section>

          <section>
            <h4 className="text-[11px] font-semibold text-[#D4AF37] uppercase tracking-wide mb-2">
              Edit priorities
            </h4>
            <ol className="list-decimal ml-5 space-y-1.5">
              {comparison.editPriorities.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
