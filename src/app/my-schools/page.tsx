"use client";

import { useState, useEffect, useCallback } from "react";
import { Sparkles, ListChecks, AlertTriangle } from "lucide-react";
import Link from "next/link";
import SchoolCard from "@/components/cc/SchoolCard";

interface ListEntry {
  id: string;
  school_id: string;
  chancing_band: string;
  application_status: string;
  net_price_estimate: number | null;
  cc_schools: {
    id: string;
    name: string;
    city: string;
    state: string;
    school_type: string;
    acceptance_rate: number;
    avg_net_price: number;
    test_policy: string;
    regular_deadline: string;
    early_deadline: string | null;
    website: string;
  };
}

interface Suggestion {
  name: string;
  band: string;
  reason: string;
  school_id: string;
}

const BANDS = ["reach", "match", "safety", "unknown"] as const;
const BAND_LABELS: Record<string, string> = {
  reach: "Reach Schools",
  match: "Match Schools",
  safety: "Safety Schools",
  unknown: "Uncategorized",
};

export default function MySchoolsPage() {
  const [entries, setEntries] = useState<ListEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);
  const [suggestError, setSuggestError] = useState<string | null>(null);
  const [addingIds, setAddingIds] = useState<Set<string>>(new Set());

  const fetchList = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/cc/school-list");
    if (res.ok) {
      const data = await res.json();
      setEntries(data.schools || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleRemove = async (entryId: string) => {
    await fetch(`/api/cc/school-list/${entryId}`, { method: "DELETE" });
    fetchList();
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setSuggestions(null);
    setSuggestError(null);
    try {
      const res = await fetch("/api/cc/school-list/generate", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (res.ok && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
      } else {
        setSuggestError(
          data.error || "Couldn't generate suggestions right now. Try again in a moment.",
        );
      }
    } catch {
      setSuggestError("Couldn't reach the server. Check your connection and try again.");
    }
    setGenerating(false);
  };

  const handleAddSuggestion = async (sug: Suggestion) => {
    setAddingIds((prev) => new Set([...prev, sug.school_id]));
    await fetch("/api/cc/school-list/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ school_id: sug.school_id, chancing_band: sug.band }),
    });
    fetchList();
  };

  const grouped = BANDS.reduce<Record<string, ListEntry[]>>((acc, band) => {
    acc[band] = entries.filter((e) => e.chancing_band === band);
    return acc;
  }, {} as Record<string, ListEntry[]>);

  const safetyCount = grouped.safety?.length || 0;
  const reachCount = grouped.reach?.length || 0;
  const matchCount = grouped.match?.length || 0;
  const imbalanced = entries.length >= 3 && (safetyCount === 0 || (reachCount > matchCount + safetyCount));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ListChecks className="w-8 h-8 text-[#D4AF37]" />
          <div>
            <h1 className="text-xl font-bold text-white">My School List</h1>
            <p className="text-sm text-white/40">{entries.length} school{entries.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/schools"
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/50 hover:text-white/70 border border-white/10 hover:border-white/20 transition-all"
          >
            Browse Schools
          </Link>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-medium hover:bg-[#D4AF37]/20 disabled:opacity-50 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {generating ? "Generating..." : "AI Suggestions"}
          </button>
        </div>
      </div>

      {imbalanced && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="text-xs text-amber-300">
            {safetyCount === 0
              ? "Your list has no safety schools. Add at least 2 safety schools for a balanced list."
              : "Your list is reach-heavy. Consider adding more match and safety schools."}
          </p>
        </div>
      )}

      {suggestError && (
        <div className="mb-8 p-4 rounded-xl border border-red-500/25 bg-red-500/5 flex items-center justify-between gap-3">
          <p className="text-sm text-red-300">{suggestError}</p>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="shrink-0 text-xs px-3 py-1.5 rounded-lg border border-red-400/30 text-red-300 hover:bg-red-500/10 disabled:opacity-50"
          >
            Retry
          </button>
        </div>
      )}

      {suggestions && (
        <div className="mb-8 p-4 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/5">
          <h2 className="text-sm font-semibold text-[#D4AF37] mb-3">AI Suggestions</h2>
          <div className="grid gap-2">
            {suggestions.map((sug) => {
              const alreadyAdded = entries.some((e) => e.school_id === sug.school_id) || addingIds.has(sug.school_id);
              return (
                <div key={sug.school_id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-white/5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white font-medium truncate">{sug.name}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        sug.band === "reach" ? "bg-red-500/20 text-red-400" :
                        sug.band === "match" ? "bg-green-500/20 text-green-400" :
                        "bg-blue-500/20 text-blue-400"
                      }`}>
                        {sug.band}
                      </span>
                    </div>
                    <p className="text-xs text-white/40 mt-0.5">{sug.reason}</p>
                  </div>
                  <button
                    onClick={() => handleAddSuggestion(sug)}
                    disabled={alreadyAdded}
                    className={`shrink-0 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      alreadyAdded
                        ? "bg-white/5 text-white/30"
                        : "bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20"
                    }`}
                  >
                    {alreadyAdded ? "Added" : "+ Add"}
                  </button>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => setSuggestions(null)}
            className="mt-3 text-xs text-white/30 hover:text-white/50 transition-colors"
          >
            Dismiss suggestions
          </button>
        </div>
      )}

      {entries.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm text-white/30 mb-4">Your school list is empty.</p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/schools"
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/60 hover:border-white/20 transition-all"
            >
              Browse Schools
            </Link>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#C4A030] disabled:opacity-50 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Get AI Suggestions
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {BANDS.map((band) => {
            const group = grouped[band];
            if (!group || group.length === 0) return null;
            return (
              <div key={band}>
                <h2 className="text-sm font-semibold text-white/60 mb-3">{BAND_LABELS[band]} ({group.length})</h2>
                <div className="grid gap-2">
                  {group.map((entry) => (
                    <SchoolCard
                      key={entry.id}
                      school={entry.cc_schools}
                      listEntryId={entry.id}
                      chancingBand={entry.chancing_band}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
